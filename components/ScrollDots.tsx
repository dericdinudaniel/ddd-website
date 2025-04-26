"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function ScrollDots() {
  const [activeSection, setActiveSection] = useState(0);
  const [numberOfSections, setNumberOfSections] = useState(3);

  useEffect(() => {
    const updateNumberOfSections = () => {
      if (window.innerWidth < 640) {
        setNumberOfSections(4);
      } else {
        setNumberOfSections(3);
      }
    };

    updateNumberOfSections();
    window.addEventListener("resize", updateNumberOfSections);
    return () => window.removeEventListener("resize", updateNumberOfSections);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      const sectionHeight = windowHeight;
      const currentSection = Math.floor(
        (scrollTop + windowHeight / 2) / sectionHeight
      );

      const clampedSection = Math.min(currentSection, numberOfSections - 1);

      setActiveSection(clampedSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [numberOfSections]);

  return (
    <div className="fixed right-1 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5 z-50 pointer-events-none">
      {Array.from({ length: numberOfSections }).map((_, index) => (
        <motion.div
          key={index}
          className="rounded-full bg-primary mx-auto size-2" // <-- fixed base size
          initial={false}
          animate={{
            scale: activeSection === index ? 2 : 1, // <-- scale instead of width/height
            opacity: activeSection === index ? 1 : 0.6,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        />
      ))}
    </div>
  );
}
