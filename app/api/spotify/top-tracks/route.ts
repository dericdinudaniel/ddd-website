/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getTopTracks } from "@/lib/spotify";

export async function GET() {
  const response = await getTopTracks();
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
}
