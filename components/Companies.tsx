import React, { useState } from "react";
import Image from "next/image";

interface CompaniesProps {
  className?: string;
}

interface Company {
  name: string;
  site: string;
  logo: () => JSX.Element;
  position: string;
  description: string;
}

const companyImageClasses = "w-full h-full object-contain ";

const companies: Company[] = [
  {
    name: "Apple - Silicon Engineering Group",
    site: "https://www.apple.com",
    logo: () => {
      return (
        <div className="w-20 h-20">
          <Image
            src="/company-logos/apple-logo.svg"
            alt="Apple"
            height={10}
            width={10}
            className={companyImageClasses + "dark:invert"} // Hidden in dark mode
          />
        </div>
      );
    },
    position: "Incoming SoC Embedded Software Engineer",
    description: "Company A is a leading tech company specializing in...",
  },
  {
    name: "Microsoft - Data Security and Privacy",
    site: "https://www.microsoft.com",
    logo: () => {
      return (
        <div className="w-20">
          <Image
            src="/company-logos/microsoft-logo.svg"
            alt="Microsoft"
            height={20}
            width={20}
            className={companyImageClasses}
          />
        </div>
      );
    },
    position: "Software Engineering Intern",
    description: "Company A is a leading tech company specializing in...",
  },
  {
    name: "Bose - Research",
    site: "https://www.bose.com",
    logo: () => {
      return (
        <div className="w-20">
          <Image
            src="/company-logos/bose-logo.svg"
            alt="Bose Logo"
            height={900}
            width={100}
            className={companyImageClasses + "dark:hidden"} // Hidden in dark mode
          />
          <Image
            src="/company-logos/bose-logo.svg"
            alt="Bose Logo"
            height={900}
            width={100}
            className={companyImageClasses + "hidden dark:block filter invert"} // Visible in dark mode with color inverted
          />
        </div>
      );
    },
    position: "Systems Software Engineering Intern",
    description: "Company B is a global software development firm...",
  },
  {
    name: "Shade",
    site: "https://www.shade.inc",
    logo: () => {
      return (
        <div className="w-20">
          <Image
            src="/company-logos/shade-logo.svg"
            alt="Shade Logo"
            height={100}
            width={100}
            className={companyImageClasses}
          />
        </div>
      );
    },
    position: "Audio/Music Production Consultant",
    description: "Company C is a software development firm specializing in...",
  },
  {
    name: "Siemens - Digital Industries Software",
    site: "https://www.sw.siemens.com/en-US/",
    logo: () => {
      return (
        <div className="w-20">
          <Image
            src="/company-logos/siemens-logo.svg"
            alt="Siemens Logo"
            height={100}
            width={100}
            className={companyImageClasses}
          />
        </div>
      );
    },
    position: "Software Engineering Intern",
    description: "Company C is a software development firm specializing in...",
  },
];

const Companies = ({ className }: CompaniesProps) => {
  return (
    <div className={`${className} px-8 md:px-28 space-y-0`}>
      {companies.map((company) => (
        <div key={company.name} className="flex items-center p-3">
          <div>{company.logo()}</div>
          <div className="ml-8">
            <a
              className="font-bold underline-fade text-md md:text-xl"
              href={company.site}
              target="_blank"
            >
              {company.name}
            </a>
            <h3 className="text-sm md:text-lg">{company.position}</h3>
          </div>
          <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-slate-900 dark:group-hover:border-slate-100 transition duration-[400ms] pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
};

export default Companies;
