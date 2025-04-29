"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

type ScrollDotsProps = {
  sectionRefs: React.RefObject<HTMLDivElement | null>[];
};

export default function ScrollDots({ sectionRefs }: ScrollDotsProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    updateSize(); // Call on mount
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const refs = isMobile ? sectionRefs : sectionRefs.slice(0, -1);

  const [activeSection, setActiveSection] = useState<number>(0);
  const [activeProgress, setActiveProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewH = window.innerHeight;

      refs.forEach((ref, idx) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollY;
        const height = rect.height;

        const isFirst = idx === 0;
        const isLast = idx === refs.length - 1;

        let start: number, end: number;

        if (isFirst) {
          start = top;
          end = top + height - viewH / 2;
        } else if (isLast) {
          start = top - viewH / 2;
          end = top + height - viewH;
        } else {
          start = top - viewH / 2;
          end = top + height - viewH / 2;
        }

        const raw = (scrollY - start) / (end - start);
        const prog = Math.min(Math.max(raw, 0), 1);

        if (prog > 0 && prog < 1) {
          setActiveSection(idx);
          setActiveProgress(prog);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // init on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [refs]);

  const scrollTo = (i: number) => {
    refs[i].current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed right-2 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center z-50 pointer-events-none">
      {refs.map((_, idx) => {
        const isActive = idx === activeSection;
        return (
          <motion.div
            key={idx}
            className="w-2 my-2 mx-auto overflow-hidden pointer-events-auto cursor-pointer"
            style={{
              backgroundColor: isActive ? "var(--border)" : "var(--muted)",
              borderRadius: 9999,
            }}
            animate={{ height: isActive ? 32 : 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => scrollTo(idx)}
          >
            {isActive && (
              <motion.div
                className="w-full bg-accent"
                style={{ height: `${activeProgress * 100}%` }}
                transition={{ ease: "linear", duration: 0 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
