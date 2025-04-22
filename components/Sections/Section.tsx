import React from "react";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
};

const Section = ({ className = "", children }: SectionProps) => {
  return (
    <div
      className={`relative snap-none sm:snap-start min-h-screen flex flex-col justify-center items-center bg-background ${className}`}
    >
      {children}
    </div>
  );
};

export default Section;
