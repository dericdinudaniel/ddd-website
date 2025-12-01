/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
// import { getPlaylistTracks } from "@/lib/spotify";
import { loadPlaylistBackup } from "@/lib/playlist-backup";

// const PLAYLIST_ID = "3Fpf3LeKFu8mrPR0XeBuM4";
// const PLAYLIST_ID = "5p1igBiEnqxgH8oZQQHhXU";

// Mark as dynamic since we use request.url
export const dynamic = "force-dynamic";

// Cache the response for 5 minutes (playlist data doesn't change frequently)
export const revalidate = 300; // 5 minutes in seconds

export async function GET(request: Request) {
  const startTime = performance.now();
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";

    // Fetch all tracks from the playlist
    let tracks;
    try {
      // test backup
      throw new Error("test backup");
      // tracks = await getPlaylistTracks(PLAYLIST_ID);
    } catch (error: any) {
      console.error(
        "[Playlist API] Error fetching playlist tracks from Spotify:",
        {
          message: error.message,
          stack: error.stack,
          error: error,
        }
      );

      // Try to load from backup if API fails (e.g., rate limiting)
      console.log("[Playlist API] Attempting to load from backup...");
      const backup = await loadPlaylistBackup();

      if (backup && backup.tracks && backup.tracks.length > 0) {
        console.log(
          `[Playlist API] Using backup with ${backup.tracks.length} tracks (saved at ${backup.metadata.savedAt})`
        );
        tracks = backup.tracks;
      } else {
        // No backup available, return error
        return NextResponse.json(
          {
            error:
              error.message || "Failed to fetch playlist tracks from Spotify",
            message: "API request failed and no backup available",
            tracks: [],
            total: 0,
            originalTotal: 0,
          },
          { status: 500 }
        );
      }
    }

    // Ensure tracks is an array
    if (!Array.isArray(tracks)) {
      console.error("Invalid tracks data received:", tracks);
      return NextResponse.json(
        {
          error: "Invalid playlist data received",
          tracks: [],
          total: 0,
          originalTotal: 0,
        },
        { status: 500 }
      );
    }

    // Format tracks and filter out any invalid tracks
    const formattedTracks = tracks
      .map((item: any) => {
        const track = item.track;

        // Skip if track is null or missing required fields
        if (!track || !track.name || !track.external_urls?.spotify) {
          return null;
        }

        return {
          id: track.id || "",
          uri: track.uri || "",
          title: track.name || "Unknown Title",
          songUrl: track.external_urls?.spotify || "",
          albumImageUrl:
            track.album?.images?.[1]?.url ||
            track.album?.images?.[0]?.url ||
            "",
          album: track.album?.name || "",
          artists:
            track.artists?.map((artist: any) => ({
              name: artist.name || "Unknown Artist",
              url: artist.external_urls?.spotify || "",
            })) || [],
          duration: track.duration_ms || 0,
          addedAt: item.added_at || "",
        };
      })
      .filter((track: any) => track !== null);

    // Filter tracks if search query is provided
    let filteredTracks = formattedTracks;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredTracks = formattedTracks.filter((track: any) => {
        const titleMatch = track.title.toLowerCase().includes(query);
        const artistMatch = track.artists.some((artist: any) =>
          artist.name.toLowerCase().includes(query)
        );
        const albumMatch = track.album?.toLowerCase().includes(query);
        return titleMatch || artistMatch || albumMatch;
      });
    }

    // Ensure we return a valid response structure
    const response = {
      tracks: Array.isArray(filteredTracks) ? filteredTracks : [],
      total:
        typeof filteredTracks.length === "number" ? filteredTracks.length : 0,
      originalTotal:
        typeof formattedTracks.length === "number" ? formattedTracks.length : 0,
    };

    const endTime = performance.now();
    console.log(
      `[playlist API route] Total request time: ${(endTime - startTime).toFixed(
        2
      )}ms`
    );

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: any) {
    console.error("[Playlist API] Unexpected error:", {
      message: error.message,
      stack: error.stack,
      error: error,
    });
    // Always return a valid response structure, even on error
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch playlist tracks",
        tracks: [],
        total: 0,
        originalTotal: 0,
      },
      { status: 500 }
    );
  }
}
