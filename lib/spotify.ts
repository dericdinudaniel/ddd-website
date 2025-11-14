import querystring from "querystring";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10`;
const TOP_ARTISTS_ENDPOINT = `https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10`;

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to parse error response" }));
    const retryAfter = response.headers.get("Retry-After");
    console.error("[Spotify API] Token endpoint error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
      ...(retryAfter && { retryAfter }),
    });
    throw new Error(
      `Failed to get access token: ${response.status} ${
        response.statusText
      } - ${JSON.stringify(errorData)}${
        retryAfter ? ` (Retry-After: ${retryAfter})` : ""
      }`
    );
  }

  return response.json();
};

export const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to parse error response" }));
    const retryAfter = response.headers.get("Retry-After");
    console.error("[Spotify API] Now playing endpoint error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
      ...(retryAfter && { retryAfter }),
    });
  }

  return response;
};

export const getTopTracks = async () => {
  const { access_token } = await getAccessToken();

  const response = await fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to parse error response" }));
    const retryAfter = response.headers.get("Retry-After");
    console.error("[Spotify API] Top tracks endpoint error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
      ...(retryAfter && { retryAfter }),
    });
  }

  return response;
};

export const getTopArtists = async () => {
  const { access_token } = await getAccessToken();

  const response = await fetch(TOP_ARTISTS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to parse error response" }));
    const retryAfter = response.headers.get("Retry-After");
    console.error("[Spotify API] Top artists endpoint error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorData,
      ...(retryAfter && { retryAfter }),
    });
  }

  return response;
};

export const getPlaylistTracks = async (playlistId: string) => {
  const startTime = performance.now();
  const { access_token } = await getAccessToken();

  // Only request the fields we actually need to reduce payload size
  // Fields: track id, name, uri, external_urls, duration_ms, album (images, name), artists (name, external_urls)
  const fields =
    "items(added_at, track(id,name,uri,external_urls,duration_ms,album(images,name),artists(name,external_urls))),total";

  // First request to get total count and first page
  const firstPageUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=${encodeURIComponent(
    fields
  )}`;
  const firstResponse = await fetch(firstPageUrl, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!firstResponse.ok) {
    const errorData = await firstResponse
      .json()
      .catch(() => ({ message: "Failed to parse error response" }));
    const retryAfter = firstResponse.headers.get("Retry-After");
    console.error(
      "[Spotify API] Playlist tracks endpoint error (first page):",
      {
        status: firstResponse.status,
        statusText: firstResponse.statusText,
        error: errorData,
        ...(retryAfter && { retryAfter }),
      }
    );
    throw new Error(
      `Failed to fetch playlist tracks: ${firstResponse.status} ${
        firstResponse.statusText
      } - ${JSON.stringify(errorData)}${
        retryAfter ? ` (Retry-After: ${retryAfter})` : ""
      }`
    );
  }

  const firstData = await firstResponse.json();
  const total = firstData.total || 0;
  const limit = 50;
  const totalPages = Math.ceil(total / limit);

  // If only one page, return immediately
  if (totalPages <= 1) {
    const endTime = performance.now();
    console.log(
      `[getPlaylistTracks] Fetched ${total} tracks in ${(
        endTime - startTime
      ).toFixed(2)}ms`
    );
    return (firstData.items || []).filter((item: any) => item.track !== null);
  }

  // Fetch remaining pages in parallel
  const pagePromises: Promise<any>[] = [];
  for (let offset = 100; offset < total; offset += limit) {
    const pageUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}&fields=${encodeURIComponent(
      fields
    )}`;
    pagePromises.push(
      fetch(pageUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res
            .json()
            .catch(() => ({ message: "Failed to parse error response" }));
          const retryAfter = res.headers.get("Retry-After");
          console.error(
            `[Spotify API] Playlist tracks endpoint error (page at offset ${offset}):`,
            {
              status: res.status,
              statusText: res.statusText,
              error: errorData,
              ...(retryAfter && { retryAfter }),
            }
          );
          throw new Error(
            `Failed to fetch page at offset ${offset}: ${res.status} ${
              res.statusText
            } - ${JSON.stringify(errorData)}${
              retryAfter ? ` (Retry-After: ${retryAfter})` : ""
            }`
          );
        }
        return res.json();
      })
    );
  }

  // Wait for all pages to complete
  const pageResults = await Promise.all(pagePromises);

  // Combine all tracks
  const allTracks: any[] = [];

  // Add first page tracks
  if (firstData.items) {
    allTracks.push(
      ...firstData.items.filter((item: any) => item.track !== null)
    );
  }

  // Add remaining page tracks
  for (const pageData of pageResults) {
    if (pageData.items) {
      allTracks.push(
        ...pageData.items.filter((item: any) => item.track !== null)
      );
    }
  }

  const endTime = performance.now();
  console.log(
    `[getPlaylistTracks] Fetched ${allTracks.length} tracks in ${(
      endTime - startTime
    ).toFixed(2)}ms (${totalPages} pages in parallel)`
  );

  return allTracks;
};
