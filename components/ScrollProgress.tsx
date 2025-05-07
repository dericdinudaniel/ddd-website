"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      const docHeight = document.documentElement.scrollHeight;
      const viewH = window.innerHeight;
      setScrollable(docHeight > viewH);
    };
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  useEffect(() => {
    if (!scrollable) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewH = window.innerHeight;
      const raw = scrollY / (docHeight - viewH);
      setProgress(Math.min(Math.max(raw, 0), 1));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollable]);

  if (!scrollable) return null;

  return (
    <div className="fixed right-2 sm:right-3 md:right-5 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div
        className="w-2 h-32 rounded-full overflow-hidden"
        style={{ backgroundColor: "var(--border)" }}
      >
        <motion.div
          className="w-full bg-accent"
          style={{ height: `${progress * 100}%` }}
          transition={{ ease: "linear", duration: 0 }}
        />
      </div>
    </div>
  );
}
