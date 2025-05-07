"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Terminal } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "motion/react"; // Import remains "motion/react"
import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link";
import HeaderLinks from "./HeaderLinks";

const Logo = ({
  isScrolled,
  animationDuration,
  formationDelayDuration,
}: {
  isScrolled: boolean;
  animationDuration: number;
  formationDelayDuration: number;
}) => {
  return (
    <div className="flex items-center gap-x-1 pl-5">
      <motion.div
        // Initial styles set via Tailwind using CSS variables for consistency before/without JS
        // and for the non-scrolled state.
        className="h-[var(--logo-icon-height-not-scrolled)] w-[var(--logo-icon-width-not-scrolled)]"
        initial={false} // No animation on initial render; adopts animate state directly
        animate={{
          width: isScrolled
            ? "var(--logo-icon-width-scrolled)"
            : "var(--logo-icon-width-not-scrolled)",
          height: isScrolled
            ? "var(--logo-icon-height-scrolled)"
            : "var(--logo-icon-height-not-scrolled)",
        }}
        transition={{
          duration: animationDuration,
          delay: formationDelayDuration,
        }}
      >
        <Link href="/">
          <Terminal className="w-full h-full" />
        </Link>
      </motion.div>

      <motion.h1
        // Initial font size set via Tailwind using CSS variable.
        className="font-bold text-[var(--logo-text-size-not-scrolled)] select-none"
        initial={false}
        animate={{
          fontSize: isScrolled
            ? "var(--logo-text-size-scrolled)"
            : "var(--logo-text-size-not-scrolled)",
        }}
        transition={{
          duration: animationDuration,
          delay: formationDelayDuration,
        }}
      >
        DDD
      </motion.h1>
    </div>
  );
};

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    updateSize(); // Call on mount
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const handleScroll = useCallback((latest: number) => {
    setIsScrolled(latest > 40);
  }, []);

  useMotionValueEvent(scrollY, "change", handleScroll);

  const animationDuration = 0.2;
  const effectDelayDuration = isScrolled ? 0.2 : 0;
  const formationDelayDuration = isScrolled ? 0 : 0.2;

  const transition = useMemo(
    () => ({
      type: "tween",
      ease: "easeInOut",
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
    <div className="relative w-full">
      {/* Placeholder to maintain layout space */}
      {/* <div className="h-20" /> */}

      <motion.header
        className="fixed top-0 left-0 right-0 z-50 mx-auto py-1 sm:py-1.5 translate-y-[8px] sm:translate-y-[10px]"
        initial={false}
        animate={{
          width: isScrolled ? (isMobile ? "95%" : "80%") : "100%",
          borderRadius: isScrolled ? "70px" : "0px",
          boxShadow: isScrolled
            ? "0px 5px 15px var(--shadow)"
            : "0px 0px 0px var(--shadow)",
          backgroundColor: isScrolled
            ? "var(--pill)"
            : "var(--fully-transparent)",
          backdropFilter: isScrolled ? "blur(.7rem)" : "blur(0rem)",
        }}
        transition={transition}
        style={{
          left: "50%",
          x: "-50%",
          willChange:
            "padding, width, borderRadius, boxShadow, backgroundColor, backdropFilter",
        }}
      >
        {/* Background Border */}
        <motion.div
          className="absolute inset-0 ring-[1px] ring-border rounded-[inherit]"
          initial={false}
          animate={{
            opacity: isScrolled ? 0.95 : 0,
          }}
          transition={{
            duration: animationDuration,
            delay: effectDelayDuration,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center">
          {/* Left region */}
          <div className="flex basis-0 flex-1 items-center gap-x-[.1rem]">
            <Logo
              isScrolled={isScrolled}
              animationDuration={animationDuration}
              formationDelayDuration={formationDelayDuration}
            />
          </div>

          {/* Center region */}
          <div className="flex basis-0 flex-1 justify-center">
            <HeaderLinks />
          </div>

          {/* Right region */}
          <div className="flex basis-0 flex-1 justify-end">
            <ThemeSwitcher
              isScrolled={isScrolled}
              isMobile={isMobile}
              animationDuration={animationDuration}
              formationDelayDuration={formationDelayDuration}
            />
          </div>
        </div>
      </motion.header>
    </div>
  );
}
