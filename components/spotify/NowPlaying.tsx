/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useNowPlaying } from "@/lib/hooks/useSpotify";
import SongDisplay from "@/components/spotify/SongDisplay";
import { BsSpotify } from "react-icons/bs";
import { SkeletonSongDisplay } from "./Skeletons";
import { useResponsiveMaxWidth } from "@/lib/hooks/useResponsiveWidth";

const breakpoints = [0.6, 0.5, 0.45, 0.6, 0.65];

const NowPlayingContent = ({
  isLoading,
  isPlaying,
  data,
  maxWidth,
}: {
  isLoading: boolean;
  isPlaying: boolean;
  data: any;
  maxWidth?: number;
}) => {
  if (isLoading) {
    return (
      <div className="px-4 py-1">
        <SkeletonSongDisplay />
      </div>
    );
  }

  if (!isPlaying) {
    return (
      <div className="flex items-center space-x-4 py-1.5 px-3 md:py-2 md:px-4">
        <BsSpotify className="text-2xl sm:text-3xl" />
        <p className="text-sm sm:text-base" data-text-cursor>
          Not currently playing
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center space-x-4 py-1.5 px-3 md:py-2 md:px-4">
        <BsSpotify className="text-2xl sm:text-3xl" />
        <p className="text-sm sm:text-base" data-text-cursor>
          Spotify API not accessible
        </p>
      </div>
    );
  }

  return (
    <div className="py-1 md:py-2 px-4 md:px-6">
      <SongDisplay
        title={data.title}
        songUrl={data.songUrl}
        albumImageUrl={data.albumImageUrl}
        artists={data.artists}
        size="small"
        maxWidth={maxWidth}
      />
    </div>
  );
};

export default function NowPlaying() {
  const { data, isLoading } = useNowPlaying();

  const maxWidth = useResponsiveMaxWidth(breakpoints);

  return (
    <NowPlayingContent
      isLoading={isLoading}
      isPlaying={!!data?.isPlaying}
      data={data}
      maxWidth={maxWidth}
    />
  );
}
