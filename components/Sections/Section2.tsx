"use client";

import Section from "./Section";
import Experience from "../Experience";
import AboutMe from "../AboutMe";
import Education from "../Education";
import { DisplayLanguages, DisplayTechnologies } from "../Skills";
import { SlideFadeIn } from "../SlideFadeIn";
import { useEffect, useState } from "react";

type SectionProps = {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
};

const Section2 = ({ className = "", ref }: SectionProps) => {
  const [direction, setDirection] = useState<"left" | "right">("left");
  useEffect(() => {
    const updateDirection = () => {
      setDirection(window.innerWidth >= 768 ? "right" : "left");
    };

    updateDirection(); // initial check
    window.addEventListener("resize", updateDirection);
    return () => window.removeEventListener("resize", updateDirection);
  }, []);

  return (
    <Section className={`${className} border-t`} ref={ref} sectionName="About">
      <div className="flex flex-col w-full md:flex-row justify-center gap-x-10 gap-y-3 px-4 overflow-hidden">
        <div className="flex flex-col items-center">
          <Experience />
          {direction == "right" && (
            <SlideFadeIn>
              <DisplayLanguages />
            </SlideFadeIn>
          )}
        </div>
        <div className="flex flex-col items-center gap-y-3">
          <Education />
          <AboutMe />
          {direction == "left" && (
            <SlideFadeIn>
              <DisplayLanguages />
            </SlideFadeIn>
          )}
          <SlideFadeIn direction={direction}>
            <DisplayTechnologies />
          </SlideFadeIn>
        </div>
      </div>
    </Section>
  );
};

export default Section2;
