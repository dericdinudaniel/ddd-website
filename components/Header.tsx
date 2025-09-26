"use client";

import React, { useEffect, useState } from "react";
import { Terminal } from "lucide-react";
import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link";
import HeaderLinks from "./HeaderLinks";
import LiquidGlass from "./LiquidGlass";

const Logo = () => {
  return (
    <Link
      data-cursor-generic
      href="/"
      className="flex items-center gap-x-0 sm:gap-x-1 ml-3 rounded-xl px-2"
    >
      <div className="size-6 sm:size-8">
        <Terminal className="w-full h-full" />
      </div>

      <h2
        data-text-cursor
        className="font-bold select-none text-base sm:text-2xl pb-[1px]"
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

  return (
    <div className="relative w-full">
      {/* Placeholder to maintain layout space */}
      {/* <div className="h-20" /> */}

      <header
        className="fixed top-0 left-0 right-0 z-50 mx-auto translate-y-[8px] sm:translate-y-[10px]"
        style={{
          // left: "50%",
          // transform: "translateX(-50%)",
          width: isMobile ? "95%" : "60%",
        }}
      >
        <LiquidGlass
          className="rounded-[70px]"
          vars={{ baseStrength: 20, extraBlur: 4, softness: 16 }}
        >
          {/* Background Border */}
          <div className="absolute inset-0 ring-[1px] ring-border rounded-[inherit] opacity-95" />

          {/* Content */}
          <div className="relative z-10 flex items-center py-1 sm:py-1.5">
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
                isScrolled={true}
                isMobile={isMobile}
                animationDuration={0.2}
                formationDelayDuration={0}
              />
            </div>
          </div>
        </LiquidGlass>
      </header>
    </div>
  );
}
