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

  const scrollToSection = (sectionIndex: number) => {
    const windowHeight = window.innerHeight;
    const targetPosition = sectionIndex * windowHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed right-2 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center z-50 pointer-events-none">
      {Array.from({ length: numberOfSections }).map((_, index) => (
        <motion.button
          key={index}
          className="rounded-full bg-foreground mx-auto size-2 my-2 pointer-events-auto cursor-pointer"
          initial={false}
          animate={{
            scale: activeSection === index ? 1.7 : 1,
            opacity: activeSection === index ? 1 : 0.6,
          }}
          whileHover={{
            scale: activeSection === index ? 2 : 1.3,
            opacity: 0.8,
          }}
          whileTap={{
            scale: 1, // <-- shrink a little on click
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
          onClick={() => scrollToSection(index)}
        />
      ))}
    </div>
  );
}
