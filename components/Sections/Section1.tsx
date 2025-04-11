"use client";

import Section from "./Section";
import SocialLinks from "../SocialLinks";
import { SlideFadeIn } from "../SlideFadeIn";

type SectionProps = {
  className?: string;
};

const Section1 = ({ className = "" }: SectionProps) => {
  return (
    <Section className={className}>
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-9xl font-bold font-header tracking-[.1rem] flex gap-x-2 md:gap-x-3 xl:gap-x-4">
        <SlideFadeIn delay={0.12}>Deric</SlideFadeIn>
        <SlideFadeIn delay={0.06}>Dinu</SlideFadeIn>
        <SlideFadeIn delay={0}>Daniel</SlideFadeIn>
      </h1>

      <div className="text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl flex gap-x-3">
        <SlideFadeIn slideOffset={20}>Software Engineer.</SlideFadeIn>
        <SlideFadeIn slideOffset={20}>Music Producer.</SlideFadeIn>
      </div>
      <SocialLinks />
    </Section>
  );
};

export default Section1;
