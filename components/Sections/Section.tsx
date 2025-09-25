import React from "react";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
  sectionName?: string;
};

const Section = ({
  className = "",
  children,
  ref,
  sectionName = "NAME NOT PROVIDED",
}: SectionProps) => {
  return (
    <div
      ref={ref}
      data-section-name={sectionName}
      className={`relative snap-none sm:snap-start min-h-screen flex flex-col justify-center items-center py-3 ${className}`}
    >
      {children}
    </div>
  );
};

export default Section;
