/* eslint-disable @typescript-eslint/no-explicit-any */
// components/DisplaySectionName.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { DropdownMenu } from "radix-ui";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp } from "lucide-react";

// Simple debounce utility
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeoutId: number;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), wait);
  }) as T;
}

type SectionEntry = { name: string; el: HTMLElement };
const chevronTransition = { duration: 0.2 };

export default function DisplaySectionName({
  className = "",
  isScrolled,
  isMobile,
  animationDuration,
  formationDelayDuration,
}: {
  className?: string;
  isScrolled: boolean;
  isMobile: boolean;
  animationDuration: number;
  formationDelayDuration: number;
}) {
  const [sections, setSections] = useState<SectionEntry[]>([]);
  const [current, setCurrent] = useState<string>("");
  const midpointsRef = useRef<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Gather all sections and compute vertical midpoints
  const discoverSections = useCallback(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section-name]")
    );
    const found: SectionEntry[] = els.map((el) => ({
      name: el.getAttribute("data-section-name") || "",
      el,
    }));
    setSections(found);

    const scrollTop = window.scrollY || window.pageYOffset;
    midpointsRef.current = found.map(({ el }) => {
      const rect = el.getBoundingClientRect();
      return scrollTop + rect.top + rect.height / 2;
    });
  }, []);

  // Re-discover on mount, resize, or DOM changes
  useEffect(() => {
    discoverSections();

    // Debounced resize
    const onResize = debounce(discoverSections, 200);
    window.addEventListener("resize", onResize, { passive: true });

    // MutationObserver for added/removed sections
    const mo = new MutationObserver(debounce(discoverSections, 100));
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", onResize);
      mo.disconnect();
    };
  }, [discoverSections]);

  // Compute which section is closest to viewport center
  const updateCurrent = useCallback(() => {
    if (sections.length === 0) return;
    const viewportMid =
      (window.scrollY || window.pageYOffset) + window.innerHeight / 2;
    let bestIdx = 0;
    let minDist = Math.abs(midpointsRef.current[0] - viewportMid);

    for (let i = 1; i < midpointsRef.current.length; i++) {
      const dist = Math.abs(midpointsRef.current[i] - viewportMid);
      if (dist < minDist) {
        bestIdx = i;
        minDist = dist;
      }
    }

    const bestName = sections[bestIdx].name;
    if (bestName !== current) {
      setCurrent(bestName);
    }
  }, [sections, current]);

  // Listen to scroll, throttled via requestAnimationFrame
  useEffect(() => {
    if (sections.length === 0) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateCurrent();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateCurrent();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [sections, updateCurrent]);

  if (sections.length === 0) return null;

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <div
          className={`cursor-pointer flex items-center text-foreground rounded ml-[-2px] transition-colors duration-200 hover:bg-muted/20 active:bg-muted/30 focus-visible:outline-none ${className}`}
        >
          <motion.div className="flex items-center" whileTap={{ scale: 0.9 }}>
            <motion.span
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
              {"/"}
            </motion.span>
            <motion.span
              className="mt-[1px] sm:mt-0"
              animate={{
                fontSize: isScrolled
                  ? isMobile // scroll
                    ? ".9rem" // mobile
                    : "1.1rem" // desktop
                  : isMobile // not scroll
                  ? "1rem" // mobile
                  : "1.3rem", // desktop
              }}
              transition={{
                duration: animationDuration,
                delay: formationDelayDuration,
              }}
              initial={false}
            >
              {current}
            </motion.span>
          </motion.div>

          <AnimatePresence mode="sync" initial={false}>
            <div className="relative size-4 min-w-[1rem] flex items-center justify-center overflow-visible">
              {isOpen ? (
                <>
                  {/* ChevronUp enters from top */}
                  <motion.span
                    key="chevron-up"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={chevronTransition}
                    className="absolute"
                  >
                    <ChevronUp className="size-4" />
                  </motion.span>

                  {/* ChevronDown exits downward */}
                  <motion.span
                    key="chevron-down-out"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: 16 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={chevronTransition}
                    className="absolute"
                  >
                    <ChevronDown className="size-4" />
                  </motion.span>
                </>
              ) : (
                <>
                  {/* ChevronDown enters from below */}
                  <motion.span
                    key="chevron-down"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={chevronTransition}
                    className="absolute"
                  >
                    <ChevronDown className="size-4" />
                  </motion.span>

                  {/* ChevronUp exits upward */}
                  <motion.span
                    key="chevron-up-out"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -16 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={chevronTransition}
                    className="absolute"
                  >
                    <ChevronUp className="size-4" />
                  </motion.span>
                </>
              )}
            </div>
          </AnimatePresence>
        </div>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              sideOffset={5}
              side="bottom"
              align="center"
              className=""
              asChild
            >
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="rounded-lg bg-background border border-border shadow-md p-1 z-50"
              >
                {sections.map((s, i) => (
                  <DropdownMenu.Item
                    key={`${s.name}-${i}`}
                    onSelect={() => s.el.scrollIntoView({ behavior: "smooth" })}
                    className={`flex cursor-pointer select-none items-center p-2 rounded-md text-sm transition-all duration-200 hover:bg-muted/20 active:bg-muted/30 focus-visible:outline-none ${
                      current === s.name
                        ? "font-semibold text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {"/" + s.name}
                  </DropdownMenu.Item>
                ))}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}
