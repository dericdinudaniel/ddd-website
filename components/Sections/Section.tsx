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
      className={`relative snap-none min-h-screen flex flex-col justify-center items-center bg-background ${className}`}
    >
      {children}
    </div>
  );
};

export default Section;
