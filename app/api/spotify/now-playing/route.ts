/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export async function GET() {
  const response = await getNowPlaying();

  if (!response.ok || response.status === 204) {
    // If no content (204) or response not ok, return not playing
    if (response.status !== 204) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to parse error response" }));
      const retryAfter = response.headers.get("Retry-After");
      console.error("[Now Playing API] Error response:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        ...(retryAfter && { retryAfter }),
      });
    }
    return NextResponse.json({ isPlaying: false }, { status: 200 });
  }

  // Check if the response body is empty
  const text = await response.text();
  if (!text) {
    return NextResponse.json({ isPlaying: false }, { status: 200 });
  }

  const song = JSON.parse(text);

  return NextResponse.json({
    isPlaying: song.is_playing,
    title: song.item?.name,
    songUrl: song.item?.external_urls?.spotify,
    album: song.item?.album?.name,
    albumImageUrl: song.item?.album?.images?.[1]?.url,
    artists: song.item?.artists?.map((artist: any) => ({
      name: artist.name,
      url: artist.external_urls.spotify,
    })),
  });
}
