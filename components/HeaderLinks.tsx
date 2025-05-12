import { motion } from "motion/react";
import Link from "next/link";
import React from "react";
import { useCustomCursor } from "./providers/CustomCursorProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/writings", label: "Writings" },
];

const HeaderLinks = ({
  isScrolled,
  animationDuration,
  formationDelayDuration,
}: {
  isScrolled: boolean;
  animationDuration: number;
  formationDelayDuration: number;
}) => {
  const { customCursorNoneTW } = useCustomCursor();

  return (
    <div className="flex items-center gap-x-2 sm:gap-x-3">
      {links.map((link) => (
        <motion.span
          key={link.href}
          className="font-semibold text-[var(--headerlinks-text-size-scrolled)] select-none"
          initial={false}
          animate={{
            fontSize: isScrolled
              ? "var(--headerlinks-text-size-scrolled)"
              : "var(--headerlinks-text-size-not-scrolled)",
          }}
          transition={{
            duration: animationDuration,
            delay: formationDelayDuration,
          }}
        >
          <Link
            href={link.href}
            className={`underline-fade ${customCursorNoneTW}`}
          >
            {link.label}
          </Link>
        </motion.span>
      ))}
    </div>
  );
};

export default HeaderLinks;
