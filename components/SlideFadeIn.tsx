"use client";

import { useRef, useEffect, ReactNode } from "react";
import { motion, useAnimation, useInView } from "motion/react";

type MarginValue = `${number}${"px" | "%"}`;
type SlideDirection = "left" | "right";

export function SlideFadeIn({
  className = "",
  children,
  duration = 0.5,
  delay = 0,
  inMargin = "-50px",
  outMargin = "-120px",
  direction = "left",
  slideOffset = 50,
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
  inMargin?: string;
  outMargin?: string;
  direction?: SlideDirection;
  slideOffset?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin:
      `${inMargin} 0px ${outMargin} 0px` as `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`,
    once: false,
  });

  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const offsetX = direction === "right" ? slideOffset : -slideOffset;

  const animationVariants = {
    hidden: { opacity: 0, x: offsetX, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  };

  return (
    <motion.div
      className={className}
      ref={ref}
      initial="hidden"
      animate={controls}
      transition={{ duration, delay }}
      variants={animationVariants}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
}
