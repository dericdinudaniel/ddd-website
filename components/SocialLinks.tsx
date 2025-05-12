"use client";

import React, { useState } from "react";
import { FileUser, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { SlideFadeIn } from "./SlideFadeIn";
import Link from "next/link";

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

type Social = (typeof socials)[number];

const SocialLinkItem = ({ name, icon: Icon, link }: Social) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover={hovered}
      data-name={name}
    >
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={name}
      >
        <Icon className="size-5 md:size-6 xl:size-8 hover:scale-115 hover:rotate-1 transition-transform duration-290" />
      </Link>
    </div>
  );
};

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
