import React from "react";
import SmallTextPills from "./SmallTextPills";

type skills = string[];

const languages: skills = [
  "C/C++",
  "Python",
  "RISC-V",
  "C#",
  "Typescript/Javascript",
  "SystemVerilog",
  "SQL",
];

const technologies: skills = [
  "Next.js/React.js",
  "Git",
  "gdb",
  "Linux",
  "Flask",
  "Multithreading",
  "Sockets",
  "Networks",
  "JUCE",
  "CUDA",
];

export const DisplayLanguages = () => {
  return (
    <div className="flex flex-col items-center px-3 w-95 sm:w-120 md:w-83 lg:w-100 xl:w-120">
      <h3 className="font-header text-3xl">Languages</h3>
      <SmallTextPills pills={languages} />
    </div>
  );
};

export const DisplayTechnologies = () => {
  return (
    <div className="flex flex-col items-center px-3 w-95 sm:w-120 md:w-83 lg:w-100 xl:w-120">
      <h3 className="font-header text-3xl">Technologies</h3>
      <SmallTextPills pills={technologies} />
    </div>
  );
};
