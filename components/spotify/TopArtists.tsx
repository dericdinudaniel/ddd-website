/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTopArtists } from "@/lib/hooks/useSpotify";
import ArtistDisplay from "@/components/spotify/ArtistDisplay";
import { SkeletonArtistDisplay } from "./Skeletons";
import { memo, useEffect, useState } from "react";
import { SlideFadeIn } from "../SlideFadeIn";
import { useResponsiveMaxWidth } from "@/lib/hooks/useResponsiveWidth";

const breakpoints = [0.5, 0.39, 0.35, 0.345, 0.65];
const MemoizedArtistDisplay = memo(ArtistDisplay);

export default function TopArtists({ className = "" }: { className?: string }) {
  const { data, isLoading } = useTopArtists();

  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const updateDirection = () => {
      setDirection(window.innerWidth >= 640 ? "right" : "left");
    };

    updateDirection(); // initial check
    window.addEventListener("resize", updateDirection);
    return () => window.removeEventListener("resize", updateDirection);
  }, []);

  const maxWidth = useResponsiveMaxWidth(breakpoints);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonArtistDisplay key={index} />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`${className} flex flex-col items-center space-y-3`}>
        <h2 className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-header">
          Top Artists
        </h2>
        <p className="text-lg text-gray-500">Spotify API not accessible.</p>
      </div>
    );
  }

  return (
    <div className={`${className} flex flex-col items-center space-y-3`}>
      <h2
        className="text-4xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-header"
        data-text-cursor
      >
        Top Artists
      </h2>
      <div className="mt-1 sm:mt-3 grid grid-cols-1 gap-y-1 sm:gap-y-2">
        {data.map((artist: any) => (
          <SlideFadeIn key={artist.name} direction={direction}>
            <MemoizedArtistDisplay
              name={artist.name}
              url={artist.artistUrl}
              imageUrl={artist.imageUrl}
              maxWidth={maxWidth}
            />
          </SlideFadeIn>
        ))}
      </div>
    </div>
  );
}
