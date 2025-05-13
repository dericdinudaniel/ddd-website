import ClonesInspirations from "@/components/ClonesInspirations";
import React from "react";

const Misc = () => {
  return (
    <section
      className="bg-background text-foreground flex flex-col items-center justify-start pt-20 px-8"
      data-section-name=""
    >
      <div className="mt-4 space-y-8">
        <ClonesInspirations />
      </div>
      <div className="h-20 block md:hidden" />
    </section>
  );
};

export default Misc;
