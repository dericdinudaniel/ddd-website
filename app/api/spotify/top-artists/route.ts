/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getTopArtists } from "@/lib/spotify";

export async function GET() {
  const response = await getTopArtists();
  const artists = await response.json();

  const formattedArtists = artists.items.map((artist: any) => ({
    name: artist.name,
    imageUrl: artist.images[1]?.url,
    artistUrl: artist.external_urls.spotify,
  }));

  return NextResponse.json(formattedArtists);
}
