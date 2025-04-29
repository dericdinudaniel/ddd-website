"use client";

import ScrollDots from "@/components/ScrollDots";
import { useRef } from "react";
import Section1 from "@/components/Sections/Section1";
import Section2 from "@/components/Sections/Section2";
import Section3 from "@/components/Sections/Section3";

export default function Home() {
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  return (
    <>
      <Section1 ref={sectionRefs[0]} />
      <Section2 ref={sectionRefs[1]} />
      <Section3 ref={sectionRefs[2]} ref2={sectionRefs[3]} />
      <ScrollDots sectionRefs={sectionRefs} />
    </>
  );
}
