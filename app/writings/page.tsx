import { SlideFadeIn } from "@/components/SlideFadeIn";
import Link from "next/link";
import React from "react";

const writings = [
  { href: "/writings/macsetup", label: "Mac Setup" },
  { href: "/writings/clonesinspirations", label: "Clones + Inspirations" },
];

const WritingsPage = () => {
  return (
    <section className="bg-background text-foreground flex flex-col items-center justify-start pt-20 px-8">
      <h1
        className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-header tracking-[.1rem]"
        data-text-cursor
      >
        Writings
      </h1>

      <div className="mt-4 space-y-8">
        <div className="flex flex-col gap-y-1.5">
          {writings.map((article, idx) => {
            return (
              <SlideFadeIn key={idx} delay={0.03 * idx} duration={0.35}>
                <Link
                  href={article.href}
                  className="underline text-primary font-semibold text-base sm:text-lg"
                  data-text-cursor
                >
                  {article.label}
                </Link>
              </SlideFadeIn>
            );
          })}
        </div>
      </div>
      <div className="h-20 block md:hidden" />
    </section>
  );
};

export default WritingsPage;
