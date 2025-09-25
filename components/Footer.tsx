"use client";

import React from "react";
import SpotifyNowPlaying from "./spotify/NowPlaying";

export default function Footer() {
  return (
    <div className="relative flex justify-center">
      <div
        className="fixed bottom-2 sm:bottom-3 z-50"
        style={{
          boxShadow: "0px 2px 12px var(--shadow)",
          backgroundColor: "var(--pill)",
          backdropFilter: "blur(.7rem)",
          borderRadius: "50px",
          willChange:
            "padding, borderRadius, boxShadow, backgroundColor, transform",
          pointerEvents: "auto",
        }}
      >
        {/* Background Border */}
        <div
          className="absolute inset-0 ring-[1px] ring-border rounded-[inherit]"
          style={{ opacity: 0.95 }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center pointer-events-auto">
          <SpotifyNowPlaying />
        </div>
      </div>
    </div>
  );
}
