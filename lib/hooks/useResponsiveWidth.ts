"use client";

import { useEffect, useState } from "react";

/**
 * Responsive max width hook.
 *
 * @param values - [2XL, XL, LG, SM, XS] multipliers based on screen width
 * @param throttleMs - optional throttle delay for resize listener
 * @returns maxWidth value calculated based on screen width and breakpoints
 */
export function useResponsiveMaxWidth(values: number[], throttleMs = 200) {
  const [maxWidth, setMaxWidth] = useState(
    () => (typeof window !== "undefined" ? getResponsiveWidth(values) : 400) // fallback default
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateMaxWidth = () => {
      setMaxWidth(getResponsiveWidth(values));
    };

    const throttledResize = throttle(updateMaxWidth, throttleMs);

    const timeoutId = setTimeout(throttledResize, 0);

    window.addEventListener("resize", throttledResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", throttledResize);
    };
  }, [values, throttleMs]);

  return maxWidth;
}

function getResponsiveWidth(values: number[]) {
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1400) {
    return screenWidth * values[0]; // 2XL
  } else if (screenWidth >= 1280) {
    return screenWidth * values[1]; // XL
  } else if (screenWidth >= 1024) {
    return screenWidth * values[2]; // LG
  } else if (screenWidth >= 640) {
    return screenWidth * values[3]; // SM
  } else {
    return screenWidth * values[4]; // XS
  }
}

function throttle(fn: () => void, delay: number) {
  let lastCall = 0;
  let rafId: number | null = null;

  return () => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(fn);
    }
  };
}
