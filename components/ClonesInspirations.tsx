import Link from "next/link";
import React from "react";
import { SlideFadeIn } from "./SlideFadeIn";

type ci_t = {
  name: string;
  link: string;
  description?: React.ReactNode;
};

type clone = ci_t;

type inspiration = ci_t;

const clones: clone[] = [
  {
    name: "ritij.dev",
    link: "https://ritij.dev/",
    description: (
      <>
        <span>Whole design. Previously cloned </span>
        <Link href="https://vador.dev/" className="underline text-primary">
          vador.dev
        </Link>
        <span> design, which was clone of V1 design.</span>
      </>
    ),
  },
  {
    name: "pranaygupta.dev",
    link: "https://pranaygupta.dev/",
    description: "Old V1 design.",
  },
  {
    name: "vador.dev",
    link: "https://vador.dev/",
    description: "Previously copied old V1 design.",
  },
  {
    name: "VCDive",
    link: "",
    description: "Copied 470 debugger design and improved on my architecture.",
  },
];

const inspirations: inspiration[] = [
  {
    name: "kunjadia.dev",
    link: "https://kunjadia.dev/",
    description: "Landing page design (name, subtext, socials)",
  },
  {
    name: "jasminehou.dev",
    link: "https://jasminehou.dev/",
    description: "Spotify: currently playing + top tracks/artists",
  },
];

const DisplayCIList = ({ items }: { items: ci_t[] }) => {
  return (
    <div className="flex flex-col gap-y-1.5">
      {items.map((item, idx) => (
        <SlideFadeIn key={idx} delay={0.03 * idx} duration={0.3}>
          <Link
            href={item.link}
            className="underline text-primary font-semibold"
            data-text-cursor
          >
            {item.name}
          </Link>
          {item.description && (
            <p className="text-xs sm:text-sm text-muted w-fit" data-text-cursor>
              {item.description}
            </p>
          )}
        </SlideFadeIn>
      ))}
    </div>
  );
};

const ClonesInspirations = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-y-8">
      <div className="flex flex-col items-center w-full sm:w-1/2 px-4">
        <h2
          className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-header tracking-[.1rem]"
          data-text-cursor
        >
          Clones
        </h2>
        <DisplayCIList items={clones} />
      </div>

      <div className="flex flex-col items-center w-full sm:w-1/2 px-4">
        <h2
          className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold font-header tracking-[.1rem]"
          data-text-cursor
        >
          Inspirations
        </h2>
        <DisplayCIList items={inspirations} />
      </div>
    </div>
  );
};

export default ClonesInspirations;
