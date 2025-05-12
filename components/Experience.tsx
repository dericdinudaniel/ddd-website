/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React from "react";
import Image from "next/image";
import { SlideFadeIn } from "./SlideFadeIn";
import { useIsDarkTheme } from "@/lib/hooks/useIsDarkTheme";
import Link from "next/link";

const CompanyLogo = ({
  url,
  logoPath,
  size,
  invertOnDark = false,
}: {
  url: string;
  logoPath: string;
  size: string;
  invertOnDark?: boolean;
}) => {
  const isDark = invertOnDark && useIsDarkTheme();
  return (
    <a href={url} target="_blank">
      <div
        className={`${size} flex items-center justify-center hover:scale-95 transition-transform duration-200`}
      >
        <Image
          src={logoPath}
          alt="Company Logo"
          height={80}
          width={80}
          className={`${isDark ? "invert" : ""} select-none`}
        />
      </div>
    </a>
  );
};

// Company Data
const companies = [
  {
    name: "Apple – Silicon Engineering Group",
    site: "https://www.apple.com",
    logoPath: "/company-logos/apple-logo.svg",
    position: "Incoming SoC Embedded Software Engineer",
    size: "size-6 sm:size-8 md:size-10",
    invertOnDark: true,
  },
  {
    name: "Microsoft – Data Security & Privacy",
    site: "https://www.microsoft.com",
    logoPath: "/company-logos/microsoft-logo.svg",
    position: "Software Engineering Intern",
    size: "size-6 sm:size-8 md:size-12",
  },
  {
    name: "Bose – Research",
    site: "https://www.bose.com",
    logoPath: "/company-logos/bose-logo.svg",
    position: "Systems Software Engineering Intern",
    size: "size-14 sm:size-18 md:size-24",
    invertOnDark: true,
  },
  {
    name: "Shade",
    site: "https://www.shade.inc",
    logoPath: "/company-logos/shade-logo.svg",
    position: "Audio/Music Production Consultant",
    size: "size-12 sm:size-16 md:size-20",
  },
  {
    name: "Siemens – DISW",
    site: "https://www.sw.siemens.com/en-US/",
    logoPath: "/company-logos/siemens-logo.svg",
    position: "Software Engineering Intern",
    size: "size-12 sm:size-16 md:size-20",
  },
];

const Experience = () => {
  return (
    <div className="flex flex-col items-center">
      <h2
        className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-header"
        data-text-cursor
      >
        Experience
      </h2>
      <div className="mt-0 sm:mt-1 space-y-[-3px] sm:space-y-0">
        {companies.map((company) => (
          <SlideFadeIn key={company.name}>
            <div
              className="flex items-center gap-x-3"
              data-cursor-generic-padded='{"left": 10, "right":10}'
              data-cursor-subcursor
            >
              <div
                className={`flex-shrink-0 size-12 sm:size-14 md:size-18 flex items-center justify-center`}
              >
                <CompanyLogo
                  url={company.site}
                  logoPath={company.logoPath}
                  size={company.size}
                  invertOnDark={company.invertOnDark}
                />
              </div>
              <div>
                <Link
                  className="font-semibold text-base sm:text-xl md:text-xl xl:text-2xl break-words underline-fade leading-0 hover:text-primary w-fit"
                  href={company.site}
                  target="_blank"
                  data-text-cursor
                >
                  {company.name}
                </Link>
                <h3
                  className="text-xs sm:text-base md:text-sm xl:text-base text-muted w-fit"
                  data-text-cursor
                >
                  {company.position}
                </h3>
              </div>
            </div>
          </SlideFadeIn>
        ))}
      </div>
    </div>
  );
};

export default Experience;
