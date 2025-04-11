import React from "react";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
};

const Section = ({ className = "", children }: SectionProps) => {
  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center sticky top-0 bg-background ${className}`}
    >
      {children}
    </div>
  );
};

export default Section;
