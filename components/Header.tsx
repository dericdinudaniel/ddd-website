"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Terminal } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link";
import HeaderLinks from "./HeaderLinks";

const Logo = () => {
  return (
    <Link
      data-cursor-generic
      href="/"
      className="flex items-center gap-x-0 sm:gap-x-1 ml-3 rounded-xl px-2"
    >
      <div
        // Initial styles set via Tailwind using CSS variables for consistency before/without JS
        // and for the non-scrolled state.
        className="h-[45px] w-[28px]"
        style={{
          width: "33px",
          height: "35px",
        }}
      >
        <Terminal className="w-full h-full" />
      </div>

      <h2
        data-text-cursor
        className="font-bold text-xl md:text-2xl select-none"
      >
        DDD
      </h2>
    </Link>
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
      type: "tween" as const,
      ease: "easeInOut" as const,
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
    [formationDelayDuration, effectDelayDuration, animationDuration]
  );

  return (
    <div className="relative w-full">
      {/* Placeholder to maintain layout space */}
      {/* <div className="h-20" /> */}

      <motion.header
        className="fixed top-0 left-0 right-0 z-50 mx-auto py-1 sm:py-1.5 translate-y-[8px] sm:translate-y-[10px]"
        initial={false}
        animate={{
          width: isMobile ? "95%" : "60%",
          borderRadius: "70px",
          boxShadow: "0px 5px 15px var(--shadow)",
          backgroundColor: "var(--pill)",
          backdropFilter: "blur(.7rem)",
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
            opacity: 0.95,
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
            <Logo />
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
