"use client";

import React, { useEffect, useState } from "react";
import SpotifyNowPlaying from "./spotify/NowPlaying";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import LiquidGlass from "./LiquidGlass";

export default function Footer() {
  const pathname = usePathname();
  const isIndex = pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative flex justify-center">
      {isIndex && (
        <div
          className={`fixed bottom-[70px] flex justify-center w-full transition-opacity duration-300 ${
            isScrolled ? "opacity-0" : "opacity-100"
          }`}
        >
          <ChevronDown
            className="flex items-center text-muted animate-bounce mb-2"
            size={24}
          />
        </div>
      )}
      <div className="fixed bottom-2 sm:bottom-3 z-50 pointer-events-auto">
        <LiquidGlass className="rounded-[24px]">
          {/* Background Border */}
          <div
            className="absolute inset-0 ring-[1px] ring-border rounded-[24px]"
            style={{ opacity: 0.95 }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-center">
            <SpotifyNowPlaying />
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
}
