import MacSetup from "@/components/MacSetup";
import React from "react";

const Misc = () => {
  return (
    <section className="bg-background text-foreground flex flex-col items-center justify-start pt-20 px-8">
      <div className="mt-4 space-y-8">
        <MacSetup />
      </div>
      <div className="h-20 block md:hidden" />
    </section>
  );
};

export default Misc;
