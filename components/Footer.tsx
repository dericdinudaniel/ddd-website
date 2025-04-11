"use client";

import React, { useCallback, useMemo, useState } from "react";
import SpotifyNowPlaying from "./spotify/NowPlaying";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { ChevronDown } from "lucide-react";

export default function Footer() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  const handleScroll = useCallback((latest: number) => {
    setIsScrolled(latest > 10);
  }, []);

  useMotionValueEvent(scrollY, "change", handleScroll);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setIsBottom(progress >= 1);
  });

  const animationDuration = 0.2;
  const effectDelayDuration = isScrolled && !isBottom ? 0.2 : 0;
  const formationDelayDuration = isScrolled && !isBottom ? 0 : 0.2;

  const transition = useMemo(
    () => ({
      type: "spring",
      stiffness: 300,
      damping: 30,
      delay: formationDelayDuration,
      boxShadow: {
        duration: animationDuration,
        delay: effectDelayDuration,
      },
      backgroundColor: {
        delay: effectDelayDuration,
        duration: animationDuration,
      },
    }),
    [formationDelayDuration, effectDelayDuration]
  );

  return (
    <div className="relative flex justify-center">
      <div
        className={`fixed bottom-[70px] flex justify-center w-full transition-opacity duration-300 ${
          isScrolled ? "opacity-0" : "opacity-100"
        }`}
      >
        <ChevronDown
          className="flex items-center text-muted animate-bounce"
          size={24}
        />
      </div>
      <motion.footer
        className="fixed bottom-3 z-50 backdrop-blur-lg"
        initial={false}
        animate={{
          boxShadow:
            isScrolled && !isBottom
              ? "0px 2px 12px var(--shadow)"
              : "0px 0px 0px var(--shadow)",
          backgroundColor:
            isScrolled && !isBottom ? "var(--pill)" : "var(--header)",
        }}
        transition={transition}
        style={{
          borderRadius: "50px",
          willChange:
            "padding, borderRadius, boxShadow, backgroundColor, transform",
        }}
      >
        {/* Background Border */}
        <motion.div
          className="absolute inset-0 ring-[1px] ring-border rounded-[inherit]"
          initial={false}
          animate={{
            opacity: isScrolled && !isBottom ? 0.95 : 0,
          }}
          transition={{
            duration: animationDuration,
            delay: effectDelayDuration,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center">
          <SpotifyNowPlaying />
        </div>
      </motion.footer>
    </div>
  );
}
