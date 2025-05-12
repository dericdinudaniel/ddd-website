"use client";

import { useState } from "react";
import Section from "./Section";
import SocialLinks from "../SocialLinks";
import { SlideFadeIn } from "../SlideFadeIn";
import Background from "../Background";

type SectionProps = {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
};

const SubText = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center justify-center z-1"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      data-text-cursor
    >
      <div
        key={hovered ? "hovered" : "default"}
        className="whitespace-nowrap text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl"
      >
        {hovered ? (
          <div className="flex gap-x-3">
            <SlideFadeIn slideOffset={20} delay={0.06}>
              Vibe Curator.
            </SlideFadeIn>
            <SlideFadeIn slideOffset={20}>Signal Processor.</SlideFadeIn>
          </div>
        ) : (
          <div className="flex gap-x-3">
            <SlideFadeIn slideOffset={20} delay={0.06}>
              Software Engineer.
            </SlideFadeIn>
            <SlideFadeIn slideOffset={20}>Music Producer.</SlideFadeIn>
          </div>
        )}
      </div>
    </div>
  );
};

const Section1 = ({ className = "", ref }: SectionProps) => {
  return (
    <Section className={`${className}`} ref={ref}>
      <div>
        <Background className="flex flex-col justify-center items-center align-middle">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-9xl font-bold font-header tracking-[.1rem] flex gap-x-2 md:gap-x-3 xl:gap-x-4"
            data-text-cursor
          >
            <SlideFadeIn delay={0.12}>Deric</SlideFadeIn>
            <SlideFadeIn delay={0.06}>Dinu</SlideFadeIn>
            <SlideFadeIn delay={0}>Daniel</SlideFadeIn>
          </h1>

          <SubText />

          <SocialLinks />
        </Background>
      </div>
    </Section>
  );
};

export default Section1;
