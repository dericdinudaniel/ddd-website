import { type NextRequest } from "next/server";
import { getNowPlaying } from "../../lib/spotify";

export const config = {
  runtime: "experimental-edge",
};

export default async function handler(req: NextRequest) {
  const response = await getNowPlaying();

  if (response.status === 204 || response.status > 400) {
    return new Response(JSON.stringify({ isPlaying: false }), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const song = await response.json();

  if (song.item === null) {
    return new Response(JSON.stringify({ isPlaying: false }), {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const isPlaying = song.is_playing;
  const title = song.item.name;
  //map artist to {name, url} where name is the name of the artist and url is the url to the artist's spotify page
  const artists = song.item.artists.map((_artist: any) => {
    return {
      name: _artist.name,
      url: _artist.external_urls.spotify,
    };
  });

  const album = song.item.album.name;
  const albumImageUrl = song.item.album.images[0].url;
  const songUrl = song.item.external_urls.spotify;

  return new Response(
    JSON.stringify({
      album,
      albumImageUrl,
      artists,
      isPlaying,
      songUrl,
      title,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "cache-control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    }
  );
}
