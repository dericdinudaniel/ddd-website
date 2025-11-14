/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getTopTracks } from "@/lib/spotify";

export async function GET() {
  try {
    const response = await getTopTracks();

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to parse error response" }));
      const retryAfter = response.headers.get("Retry-After");
      console.error("[Top Tracks API] Error response:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        ...(retryAfter && { retryAfter }),
      });
      return NextResponse.json(
        {
          error: errorData.message || "Failed to fetch top tracks",
          tracks: [],
        },
        { status: response.status }
      );
    }

    const tracks = await response.json();

    const formattedTracks = tracks.items.map((track: any) => ({
      title: track.name,
      songUrl: track.external_urls.spotify,
      albumImageUrl: track.album.images[1].url,
      artists: track.artists.map((artist: any) => ({
        name: artist.name,
        url: artist.external_urls.spotify,
      })),
    }));

    return NextResponse.json(formattedTracks);
  } catch (error: any) {
    console.error("[Top Tracks API] Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch top tracks", tracks: [] },
      { status: 500 }
    );
  }
}
