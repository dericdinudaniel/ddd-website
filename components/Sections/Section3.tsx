"use client";

import Section from "./Section";
import TopArtists from "../spotify/TopArtists";
import TopTracks from "../spotify/TopTracks";
import { useEffect, useState } from "react";
import LiquidGlass from "../LiquidGlass";

type SectionProps = {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  ref2?: React.Ref<HTMLDivElement>;
};

const Section3 = ({ className = "", ref, ref2 }: SectionProps) => {
  const [layout, setLayout] = useState<"together" | "separate">("together");
  useEffect(() => {
    const updateLayout = () => {
      setLayout(window.innerWidth >= 640 ? "together" : "separate");
    };
    updateLayout(); // initial check
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  if (layout === "together") {
    return (
      <Section className={`${className}`} ref={ref} sectionName="Spotify">
        <div className="flex flex-row justify-center gap-x-6 px-10">
          <LiquidGlass className="min-h-fit max-w-[600px] w-full p-2">
            <TopTracks />
          </LiquidGlass>
          <LiquidGlass className="min-h-fit max-w-[600px] w-1/2 p-2">
            <TopArtists />
          </LiquidGlass>
        </div>
      </Section>
    );
  } else {
    return (
      <>
        <Section className={`${className}`} ref={ref} sectionName="Tracks">
          <LiquidGlass className="p-2">
            <TopTracks />
          </LiquidGlass>
        </Section>
        <Section className={`${className}`} ref={ref2} sectionName="Artists">
          <LiquidGlass className="p-2">
            <TopArtists />
          </LiquidGlass>
        </Section>
      </>
    );
  }
};

export default Section3;
