"use client";

import { SlideFadeIn } from "./SlideFadeIn";
import React, { useEffect, useState } from "react";

const AboutMe = () => {
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
    <div className="flex flex-col items-center">
      <h2
        className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-header"
        data-text-cursor
      >
        About Me
      </h2>

      <div className="mt-0 sm:mt-1 px-2 w-95 sm:w-120 md:w-83 lg:w-100 xl:w-120 text-sm sm:text-base md:text-base lg:text-lg 2xl:text-xl">
        <SlideFadeIn direction={direction} inMargin="-100px" outMargin="-80px">
          <p data-text-cursor>
            I&apos;m a software engineer & music producer based in Ann Arbor,
            MI.
          </p>
        </SlideFadeIn>
        <SlideFadeIn direction={direction} inMargin="-100px" outMargin="-80px">
          <p data-text-cursor>
            I&apos;m interested in almost everything in computing:
            microarchitecure/chip design, OS/kernel, embedded systems, and
            distributed systems.
          </p>
        </SlideFadeIn>
        <SlideFadeIn direction={direction} inMargin="-100px" outMargin="-80px">
          <p data-text-cursor>I&apos;m also into audio SW & ML.</p>
        </SlideFadeIn>
        <SlideFadeIn direction={direction} inMargin="-100px" outMargin="-80px">
          <p data-text-cursor>I am not a frontend dev.</p>
        </SlideFadeIn>
      </div>
    </div>
  );
};

export default AboutMe;
