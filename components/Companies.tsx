import React, { useState } from "react";
import Image from "next/image";

interface CompaniesProps {
  className?: string;
}

interface Company {
  name: string;
  site: string;
  logo: () => JSX.Element;
  // height: number;
  // width: number;
  position: string;
  description: string;
}

const companyImageClasses = "w-full h-full object-contain ";

const companies: Company[] = [
  {
    name: "Microsoft - Data Security and Privacy",
    site: "https://www.microsoft.com",
    logo: () => {
      return (
        <Image
          src="/company-logos/microsoft-logo.svg"
          alt="Microsoft"
          height={30}
          width={30}
          className={companyImageClasses}
        />
      );
    },
    // height: 30,
    // width: 30,
    position: "Software Engineering Intern",
    description: "Company A is a leading tech company specializing in...",
  },
  {
    name: "Bose - Research",
    site: "https://www.bose.com",
    logo: () => {
      return (
        <>
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
        </>
      );
    },
    // height: 100,
    // width: 500,
    position: "Systems Software Engineering Intern",
    description: "Company B is a global software development firm...",
  },
  {
    name: "Shade",
    site: "https://www.shade.inc",
    logo: () => {
      return (
        <Image
          src="/company-logos/shade-logo.svg"
          alt="Shade Logo"
          height={100}
          width={100}
          className={companyImageClasses}
        />
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
        <Image
          src="/company-logos/siemens-logo.svg"
          alt="Siemens Logo"
          height={100}
          width={100}
          className={companyImageClasses}
        />
      );
    },
    position: "Software Engineering Intern",
    description: "Company C is a software development firm specializing in...",
  },
  // Add more companies here
];

const Companies = ({ className }: CompaniesProps) => {
  return (
    <div className={`${className} space-y-4`}>
      {companies.map((company) => (
        <div key={company.name} className="flex items-center">
          <div className="w-40 h-28 flex-shrink-0">
            {/* <Image
              src={company.logo}
              alt={company.name}
              height={company.height}
              width={company.width}
              className="w-full h-full object-contain"
            /> */}
            {company.logo()}
          </div>
          <div className=" ml-8">
            <a
              className="font-bold text-xl hover:underline"
              href={company.site}
              target="_blank"
            >
              {company.name}
            </a>
            <h3 className="">{company.position}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Companies;
