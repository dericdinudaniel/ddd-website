"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Terminal } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
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
    <div className="relative w-full">
      {/* Placeholder to maintain layout space */}
      {/* <div className="h-20" /> */}

      <motion.header
        className="fixed top-0 left-0 right-0 z-50 mx-auto backdrop-blur-lg"
        initial={false}
        animate={{
          paddingLeft: isScrolled ? "1rem" : "1.5rem",
          paddingRight: isScrolled ? "1rem" : "1.5rem",
          width: isScrolled ? "80%" : "100%",
          borderRadius: isScrolled ? "70px" : "0px",
          boxShadow: isScrolled
            ? "0px 5px 15px var(--shadow)"
            : "0px 0px 0px var(--shadow)",
          backgroundColor: isScrolled ? "var(--pill)" : "var(--header)",
        }}
        transition={transition}
        style={{
          y: 10,
          paddingTop: ".5rem",
          paddingBottom: ".5rem",
          left: "50%",
          x: "-50%",
          willChange:
            "padding, width, borderRadius, boxShadow, backgroundColor",
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
          <div className="flex items-center gap-x-1">
            <motion.div
              initial={false}
              animate={{
                width: isScrolled ? 35 : 45,
                height: isScrolled ? 35 : 45,
              }}
              transition={{
                duration: animationDuration,
                delay: formationDelayDuration,
              }}
            >
              <Terminal className="w-full h-full" />
            </motion.div>
            <motion.h1
              className="font-bold"
              initial={false}
              animate={{
                fontSize: isScrolled ? "1.5rem" : "2rem",
              }}
              transition={{
                duration: animationDuration,
                delay: formationDelayDuration,
              }}
              style={{
                lineHeight: 1.2,
              }}
            >
              DDD
            </motion.h1>
          </div>

          <ThemeSwitcher />
        </div>
      </motion.header>
    </div>
  );
}
