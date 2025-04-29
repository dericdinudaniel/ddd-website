"use client";

import { useEffect, useState } from "react";
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

  if (!isMobile) {
    sectionRefs = sectionRefs.slice(0, -1);
  }

  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollMiddle = window.scrollY + window.innerHeight / 2;

      const newActiveSection = sectionRefs.findIndex((ref) => {
        if (!ref.current) return false;
        const rect = ref.current.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;
        return scrollMiddle >= top && scrollMiddle < bottom;
      });

      if (newActiveSection !== -1) {
        setActiveSection(newActiveSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run on mount too
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionRefs]);

  const scrollToSection = (index: number) => {
    const section = sectionRefs[index]?.current;
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-2 sm:right-5 top-1/2 -translate-y-1/2 flex flex-col items-center z-50 pointer-events-none">
      {sectionRefs.map((_, index) => (
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
            scale: 0.8,
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
