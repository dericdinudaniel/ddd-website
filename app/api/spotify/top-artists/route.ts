/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getTopArtists } from "@/lib/spotify";

export async function GET() {
  try {
    const response = await getTopArtists();

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Failed to parse error response" }));
      const retryAfter = response.headers.get("Retry-After");
      console.error("[Top Artists API] Error response:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        ...(retryAfter && { retryAfter }),
      });
      return NextResponse.json(
        {
          error: errorData.message || "Failed to fetch top artists",
          artists: [],
        },
        { status: response.status }
      );
    }

    const artists = await response.json();

    const formattedArtists = artists.items.map((artist: any) => ({
      name: artist.name,
      imageUrl: artist.images[1]?.url,
      artistUrl: artist.external_urls.spotify,
    }));

    return NextResponse.json(formattedArtists);
  } catch (error: any) {
    console.error("[Top Artists API] Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch top artists", artists: [] },
      { status: 500 }
    );
  }
}
