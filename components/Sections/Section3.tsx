"use client";

import Section from "./Section";
import TopArtists from "../spotify/TopArtists";
import TopTracks from "../spotify/TopTracks";
import { useEffect, useState } from "react";

type SectionProps = {
  className?: string;
};

const Section3 = ({ className = "" }: SectionProps) => {
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
      <Section className={`${className} border-t`}>
        <div className="flex flex-row justify-center gap-x-6 w-full px-10">
          <div className="min-h-fit max-w-[600px] w-1/2">
            <TopTracks />
          </div>
          <div className="min-h-fit max-w-[600px] w-1/2">
            <TopArtists />
          </div>
        </div>
      </Section>
    );
  } else {
    return (
      <>
        <Section className={`${className} border-t`}>
          <TopTracks />
        </Section>
        <Section className={`${className} border-t`}>
          <TopArtists />
        </Section>
      </>
    );
  }
};

export default Section3;
