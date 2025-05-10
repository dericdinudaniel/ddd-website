import MacSetup from "@/components/MacSetup";
import React from "react";

const Misc = () => {
  return (
    <section
      className="bg-background text-foreground flex flex-col items-center justify-start pt-20 px-8"
      data-section-name=""
    >
      <h1 className="text-5xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-header tracking-[.1rem]"></h1>

      <div className="mt-4 space-y-8">
        <MacSetup />
      </div>
      <div className="h-20 block md:hidden" />
    </section>
  );
};

export default Misc;
