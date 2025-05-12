import Section from "@/components/Sections/Section";
import React from "react";

const NotFound = () => {
  return (
    <Section>
      <h1
        className="font-bold font-header tracking-[.1rem] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl"
        data-text-cursor
      >
        ERROR 404: NOT FOUND
      </h1>
    </Section>
  );
};

export default NotFound;
