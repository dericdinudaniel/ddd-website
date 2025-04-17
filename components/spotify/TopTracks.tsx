/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTopTracks } from "@/lib/hooks/useSpotify";
import SongDisplay from "@/components/spotify/SongDisplay";
import { SkeletonSongDisplay } from "./Skeletons";
import { memo } from "react";
import { SlideFadeIn } from "../SlideFadeIn";
import { useResponsiveMaxWidth } from "@/lib/hooks/useResponsiveWidth";

const breakpoints = [0.5, 0.39, 0.35, 0.345, 0.65];
const MemoizedSongDisplay = memo(SongDisplay);

export default function TopTracks({ className = "" }: { className?: string }) {
  const { data, isLoading } = useTopTracks();

  const maxWidth = useResponsiveMaxWidth(breakpoints);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonSongDisplay key={index} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`${className} flex flex-col items-center space-y-3`}>
        <h2 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-header">
          Top Tracks
        </h2>
        <p className="text-lg text-gray-500">Spotify API not accessible.</p>
      </div>
    );
  }

  return (
    <div className={`${className} flex flex-col items-center space-y-3`}>
      <h2 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-header">
        Top Tracks
      </h2>
      <div className="mt-1 sm:mt-3 grid grid-cols-1 gap-y-1 sm:gap-y-2">
        {data.map((track: any) => (
          <SlideFadeIn key={track.songUrl}>
            <MemoizedSongDisplay
              title={track.title}
              songUrl={track.songUrl}
              albumImageUrl={track.albumImageUrl}
              artists={track.artists}
              maxWidth={maxWidth}
            />
          </SlideFadeIn>
        ))}
      </div>
    </div>
  );
}
