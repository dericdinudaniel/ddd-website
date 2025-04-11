/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { SlideFadeIn } from "./SlideFadeIn";

// Hook to determine dark mode
const useIsDarkTheme = () => {
  const { theme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(
      Boolean(theme?.includes("dark") || resolvedTheme?.includes("dark"))
    );
  }, [theme, resolvedTheme]);

  return isDark;
};

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
    <div className={`${size} flex items-center justify-center`}>
      <a href={url} target="_blank">
        <Image
          src={logoPath}
          alt="Company Logo"
          height={80}
          width={80}
          className={isDark ? "invert" : ""}
        />
      </a>
    </div>
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
      <h2 className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-header">
        Experience
      </h2>
      <div className="mt-2 md:mt-1">
        {companies.map((company) => (
          <SlideFadeIn className="flex items-center gap-x-2" key={company.name}>
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
              <a
                className="font-semibold underline-fade text-base sm:text-xl md:text-xl xl:text-2xl break-words hover:underline"
                href={company.site}
                target="_blank"
              >
                {company.name}
              </a>
              <h3 className="text-xs sm:text-base md:text-sm xl:text-base text-muted">
                {company.position}
              </h3>
            </div>
          </SlideFadeIn>
        ))}
      </div>
    </div>
  );
};

export default Experience;
