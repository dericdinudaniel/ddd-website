import React from "react";
import SmallTextPills from "./SmallTextPills";

type skills = string[];

const languages: skills = [
  "C/C++",
  "Python",
  "RISC-V",
  "C#",
  "Typescript",
  "SystemVerilog",
  "SQL",
];

const technologies: skills = [
  "Next.js/React.js",
  "Git",
  "gdb",
  "Linux",
  "Flask",
  "Networks",
  "JUCE",
  "CUDA",
];

export const DisplayLanguages = () => {
  return (
    <div className="flex flex-col items-center px-3 w-95 sm:w-120 md:w-90 lg:w-120 xl:w-130">
      <h3 className="font-header text-3xl" data-text-cursor>
        Languages
      </h3>
      <SmallTextPills pills={languages} centered />
    </div>
  );
};

export const DisplayTechnologies = () => {
  return (
    <div className="flex flex-col items-center px-3 w-95 sm:w-120 md:w-83 lg:w-100 xl:w-120">
      <h3 className="font-header text-3xl" data-text-cursor>
        Technologies
      </h3>
      <SmallTextPills pills={technologies} centered />
    </div>
  );
};
