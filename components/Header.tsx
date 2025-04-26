"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Terminal } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link";

const Logo = ({
  isScrolled,
  isMobile,
  animationDuration,
  formationDelayDuration,
}: {
  isScrolled: boolean;
  isMobile: boolean;
  animationDuration: number;
  formationDelayDuration: number;
}) => {
  return (
    <div className="flex items-center gap-x-1">
      <motion.div
        initial={false}
        animate={{
          width: isScrolled
            ? isMobile // scroll
              ? 25 // mobile
              : 33 // desktop
            : isMobile // not scroll
            ? 40 // mobile
            : 45, // desktop,
          height: isScrolled ? 35 : 45,
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
        className="font-bold"
        initial={false}
        animate={{
          fontSize: isScrolled
            ? isMobile // scroll
              ? "1.2rem" // mobile
              : "1.5rem" // desktop
            : isMobile // not scroll
            ? "1.5rem" // mobile
            : "2rem", // desktop
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
          paddingLeft: isScrolled ? "1rem" : "1.5rem",
          paddingRight: isScrolled ? ".2rem" : "1rem",
          width: isScrolled ? (isMobile ? "95%" : "80%") : "100%",
          borderRadius: isScrolled ? "70px" : "0px",
          boxShadow: isScrolled
            ? "0px 5px 15px var(--shadow)"
            : "0px 0px 0px var(--shadow)",
          backgroundColor: isScrolled
            ? "var(--pill)"
            : "var(--fully-transparent)",
          backdropFilter: isScrolled ? "blur(1rem)" : "blur(0rem)",
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
        <div className="relative z-10 flex justify-between items-center">
          <Logo
            isScrolled={isScrolled}
            isMobile={isMobile}
            animationDuration={animationDuration}
            formationDelayDuration={formationDelayDuration}
          />
          <ThemeSwitcher
            isScrolled={isScrolled}
            isMobile={isMobile}
            animationDuration={animationDuration}
            formationDelayDuration={formationDelayDuration}
          />
        </div>
      </motion.header>
    </div>
  );
}
