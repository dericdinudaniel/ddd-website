"use client";
import { useIsDarkTheme } from "@/lib/hooks/useIsDarkTheme";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { SlideFadeIn } from "./SlideFadeIn";
import Link from "next/link";

const UniversityLogo = ({
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
  const isDark = useIsDarkTheme() && invertOnDark;
  return (
    <a href={url} target="_blank">
      <div
        className={`${size} flex items-center justify-center hover:scale-95 transition-transform duration-200`}
      >
        <Image
          src={logoPath}
          alt="University Logo"
          height={80}
          width={80}
          className={`${isDark ? "invert" : ""} select-none rounded`}
        />
      </div>
    </a>
  );
};

// University Data
const universities = [
  {
    name: "University of Michigan",
    location: "Ann Arbor, MI",
    college: "College of Engineering",
    site: "https://eecs.engin.umich.edu/",
    logoPath: "/university-logos/umich-logo.svg",
    degree: "B.S.E. – Computer Science",
    size: "size-8 sm:size-9 md:size-11",
    invertOnDark: false,
  },
];

const Education = () => {
  const [direction, setDirection] = useState<"left" | "right">("left");
  useEffect(() => {
    const updateDirection = () => {
      setDirection(window.innerWidth >= 768 ? "right" : "left");
    };

    updateDirection(); // initial check
    window.addEventListener("resize", updateDirection);
    return () => window.removeEventListener("resize", updateDirection);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2
        className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-header"
        data-text-cursor
      >
        Education
      </h2>
      <div className="mt-0 sm:mt-1">
        {universities.map((university) => (
          <SlideFadeIn key={university.name} direction={direction}>
            <div
              className="flex items-center gap-x-3 py-1"
              data-cursor-generic-padded='{"left": 10, "right":10}'
              data-cursor-subcursor
            >
              <div
                className={`flex-shrink-0 size-12 sm:size-14 md:size-18 flex items-center justify-center`}
              >
                <UniversityLogo
                  url={university.site}
                  logoPath={university.logoPath}
                  size={university.size}
                  invertOnDark={university.invertOnDark}
                />
              </div>
              <div>
                <Link
                  className="font-semibold text-base sm:text-xl md:text-xl xl:text-2xl break-words underline-fade leading-0 hover:text-primary w-fit"
                  href={university.site}
                  target="_blank"
                  data-text-cursor
                >
                  {university.name}
                </Link>
                <h3 className="text-xs w-fit" data-text-cursor>
                  {university.location}
                </h3>
                <h3
                  className="text-xs sm:text-base md:text-sm xl:text-base text-muted w-fit"
                  data-text-cursor
                >
                  {university.degree}
                </h3>
              </div>
            </div>
          </SlideFadeIn>
        ))}
      </div>
    </div>
  );
};

export default Education;
