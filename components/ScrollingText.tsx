"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type ScrollingTextProps = {
  children: React.ReactNode;
  maxWidth?: number;
  pauseDuration?: number;
  scrollSpeed?: number;
  className?: string;
  enableUnderlineFade?: boolean;
};

export default function ScrollingText({
  children,
  maxWidth = 200,
  pauseDuration = 1,
  scrollSpeed = 20,
  className = "",
  enableUnderlineFade = false,
}: ScrollingTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [textWidth, setTextWidth] = useState(0);

  useEffect(() => {
    const checkScrollNecessity = () => {
      if (textRef.current) {
        const currentWidth = textRef.current.scrollWidth;
        setTextWidth(currentWidth);
        setShouldScroll(currentWidth > maxWidth);
      }
    };

    const timeoutId = setTimeout(checkScrollNecessity, 0);
    const resizeObserver = new ResizeObserver(checkScrollNecessity);

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [children, maxWidth]);

  const scrollDistance = Math.max(0, textWidth - maxWidth);
  const scrollDuration = (scrollDistance / scrollSpeed) * 2 + 2 * pauseDuration;

  const content = shouldScroll ? (
    <motion.div
      className="inline-block"
      ref={textRef}
      animate={{
        x: [0, -scrollDistance, -scrollDistance, 0, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: scrollDuration,
        ease: "linear",
        times: [0, 0.4, 0.6, 1],
      }}
    >
      <span className={`${enableUnderlineFade ? "underline-fade" : ""}`}>
        {children}
      </span>
    </motion.div>
  ) : (
    <div className="inline-block" ref={textRef}>
      <span className={`${enableUnderlineFade ? "underline-fade" : ""}`}>
        {children}
      </span>
    </div>
  );

  return (
    <div
      className={`overflow-hidden whitespace-nowrap relative ${className}`}
      style={{ maxWidth }}
    >
      {content}
    </div>
  );
}
