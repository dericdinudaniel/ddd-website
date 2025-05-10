"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { FileUser, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { SlideFadeIn } from "./SlideFadeIn";
import Link from "next/link";

// --- Socials Data ---
const socials = [
  {
    name: "GitHub",
    icon: Github,
    link: "https://github.com/dericdinudaniel",
  },
  {
    name: "Email",
    icon: Mail,
    link: "mailto:dericdd@umich.edu",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    link: "https://www.linkedin.com/in/dericdinudaniel/",
  },
  {
    name: "Twitter",
    icon: Twitter,
    link: "https://x.com/dericdinudaniel",
  },
  {
    name: "Resume",
    icon: FileUser,
    link: "/resume/Deric_Dinu_Daniel_Resume.pdf",
  },
] as const;

// --- Tooltip Animation Variants ---
const tooltipVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
} as const;

// --- Types ---
type Social = (typeof socials)[number];

// --- Tooltip Link Item ---
const SocialLinkItem = ({ name, icon: Icon, link }: Social) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={name}
      >
        <Icon className="size-5 md:size-6 xl:size-8 hover:scale-115 hover:rotate-1 transition-transform duration-290" />
      </Link>

      <motion.div
        variants={tooltipVariants}
        initial="hidden"
        animate={hovered ? "visible" : "hidden"}
        className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md bg-foreground/40 text-background text-xs px-2 py-1 whitespace-nowrap pointer-events-none select-none"
        style={{
          boxShadow: "0 2px 15px 3px var(--shadow)",
        }}
      >
        {name}
      </motion.div>
    </div>
  );
};

// --- Main Component ---
const SocialLinks = () => {
  return (
    <div className="mt-2 lg:mt-3 xl:mt-4 flex gap-x-6 sm:gap-x-8">
      {socials.map((social, index) => (
        <SlideFadeIn
          key={social.name}
          slideOffset={20}
          delay={(socials.length - index) * 0.06}
        >
          <SocialLinkItem {...social} />
        </SlideFadeIn>
      ))}
    </div>
  );
};

export default SocialLinks;
