"use client";

import React, { useEffect, useMemo, useState } from "react";
import SpotifyNowPlaying from "./spotify/NowPlaying";
import { motion, useScroll } from "motion/react";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isIndex = pathname === "/";

  const { scrollY } = useScroll();
  const [isScrollable, setIsScrollable] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1) Re–compute "scrollable" on mount, on resize, AND on every pathname change
  useEffect(() => {
    const checkScrollable = () => {
      const docHeight = document.documentElement.scrollHeight;
      const viewH = window.innerHeight;
      setIsScrollable(docHeight > viewH);
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [pathname]);

  // 2) Subscribe to scrollY, _or_ override `isScrolled` immediately
  useEffect(() => {
    // if page isn't tall enough, never scrolled
    if (!isScrollable) {
      setIsScrolled(false);
      return;
    }

    // if you're off "/" _and_ the page _is_ scrollable → force scrolled
    if (!isIndex) {
      setIsScrolled(true);
      return;
    }

    // otherwise (on index & scrollable) do your 10px threshold
    setIsScrolled(false);
    const unsubscribe = scrollY.onChange((y) => {
      setIsScrolled(y > 10);
    });
    return unsubscribe;
  }, [isIndex, isScrollable, scrollY]);

  const animationDuration = 0.2;
  const effectDelayDuration = isScrolled ? 0.2 : 0;
  const formationDelayDuration = isScrolled ? 0 : 0.2;

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
      {isIndex && (
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
      )}
      <motion.footer
        className="fixed bottom-2 sm:bottom-3 z-50"
        initial={false}
        animate={{
          boxShadow: isScrolled
            ? "0px 2px 12px var(--shadow)"
            : "0px 0px 0px var(--shadow)",
          backgroundColor: isScrolled
            ? "var(--pill)"
            : "var(--fully-transparent)",
          backdropFilter: isScrolled ? "blur(.7rem)" : "blur(0rem)",
        }}
        transition={transition}
        style={{
          borderRadius: "50px",
          willChange:
            "padding, borderRadius, boxShadow, backgroundColor, transform",
          pointerEvents: "auto",
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
        <div className="relative z-10 flex items-center justify-center pointer-events-auto">
          <SpotifyNowPlaying />
        </div>
      </motion.footer>
    </div>
  );
}
