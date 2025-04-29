import React from "react";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
};

const Section = ({ className = "", children, ref }: SectionProps) => {
  return (
    <div
      ref={ref}
      className={`relative snap-none sm:snap-start min-h-screen flex flex-col justify-center items-center bg-background ${className}`}
    >
      {children}
    </div>
  );
};

export default Section;
