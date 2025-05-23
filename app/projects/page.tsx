"use client";

import React from "react";
import { SlideFadeIn } from "@/components/SlideFadeIn";
import { Github, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import ScrollProgress from "@/components/ScrollProgress";
import SmallTextPills from "@/components/SmallTextPills";

// MonthYear type for month/year-only dates
interface MonthYear {
  month: number; // 1-12
  year: number; // full year, e.g. 2025
}

// ProjectDate can be a single MonthYear, the string "Present", or a date range
type ProjectDate =
  | MonthYear
  | "Present"
  | { start: MonthYear; end: MonthYear | "Present" };

// Project type using ProjectDate
type Project = {
  title: string;
  shortDescription: React.ReactNode;
  longDescription?: string;
  tags: string[];
  date?: ProjectDate;
  link?: string;
  github?: string;
};

// hardcoded projects list
const projects: Project[] = [
  {
    title: "This Website",
    shortDescription: "Personal portfolio.",
    tags: ["Next.js", "Tailwind CSS", "TypeScript", "Framer Motion/motion.dev"],
    link: "/",
    github: "https://github.com/dericdinudaniel/ddd-website",
    date: { start: { month: 4, year: 2023 }, end: "Present" },
  },
  {
    title: "Research: ECC Pointers",
    shortDescription: "Apply ECC to pointers for reliability using AN Codes.",
    date: {
      start: { month: 1, year: 2025 },
      end: { month: 5, year: 2025 },
    },
    link: "/research/PECCA.pdf",
    tags: ["Computer Architecture", "ECC", "C++"],
  },
  {
    title: "Advanced Out-of-Order RISC-V Core",
    shortDescription:
      "Built an advanced out-of-order and superscalar RISC-V core.",
    tags: ["SystemVerilog", "RISC-V", "RTL", "DV"],
    date: { start: { month: 8, year: 2024 }, end: { month: 12, year: 2024 } },
  },
  {
    title: "Kernel Thread Library",
    shortDescription:
      "Built a kernel thread library in C++ on simulated CPU cores.",
    tags: [
      "C++",
      "Multi-threading",
      "Mutexes",
      "Condition Variables",
      "Semaphores",
      "Unix",
    ],
    date: { start: { month: 8, year: 2023 }, end: { month: 12, year: 2023 } },
  },
  {
    title: "Virtual Memory Pager",
    shortDescription: "Managed virtual memory space.",
    tags: ["C++", "Virtual Memory", "Page Faults"],
    date: { start: { month: 8, year: 2023 }, end: { month: 12, year: 2023 } },
  },
  {
    title: "Multithreaded Network File Server",
    shortDescription: "Title speaks for itself.",
    tags: ["C++", "Boost Library", "Threads", "Sockets"],
    date: { start: { month: 8, year: 2023 }, end: { month: 12, year: 2023 } },
  },
  {
    title: "DDDelay",
    shortDescription: "Delay Audio Effect Plugin.",
    tags: ["C++", "JUCE Library", "DSP"],
    github: "https://github.com/dericdinudaniel/DDDelay",
    date: { start: { month: 6, year: 2024 }, end: { month: 7, year: 2024 } },
  },
  {
    title: "Visual CPU Debugger",
    shortDescription: "Visual debugger for above CPU core.",
    tags: ["Next.js", "Tailwind CSS", "TypeScript", "Flask", "Python"],
    github: "https://github.com/dericdinudaniel/eecs470-p4-gui-debugger",
    date: { start: { month: 8, year: 2024 }, end: { month: 12, year: 2024 } },
  },
];

// Month names lookup
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

// Format a MonthYear as "Month Year"
function formatMonthYear(d: MonthYear): string {
  const name = monthNames[d.month - 1] || "";
  return `${name} ${d.year}`;
}

// Format a ProjectDate, handling "Present" and ranges
function formatProjectDate(date: ProjectDate): string {
  if (date === "Present") {
    return "Present";
  }
  if (typeof date === "object" && "start" in date) {
    const { start, end } = date;
    // If both in same year, omit repeating the year
    if (end !== "Present" && end.year === start.year) {
      const startName = monthNames[start.month - 1] || "";
      const endName = monthNames[(end as MonthYear).month - 1] || "";
      return `${startName} — ${endName} ${start.year}`;
    }
    // Otherwise, show full Month Year – Month Year or Present
    const startStr = formatMonthYear(start);
    const endStr =
      end === "Present" ? "Present" : formatMonthYear(end as MonthYear);
    return `${startStr} — ${endStr}`;
  }
  // Single month/year
  return formatMonthYear(date as MonthYear);
}

// ProjectCard component
interface ProjectCardProps {
  project: Project;
}
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, shortDescription, date, github, link, tags } = project; // Added imageUrl

  return (
    <div
      className="w-full h-full relative flex flex-col bg-background border border-border rounded-lg shadow-shadow_c shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
      data-cursor-generic
      data-cursor-subcursor
    >
      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-start mb-1">
          <h2
            className="text-lg lg:text-xl font-bold text-foreground"
            data-text-cursor
          >
            {title}
          </h2>
          <div className="flex space-x-3">
            {link && (
              <Link
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} - Live Preview`}
              >
                <LinkIcon className="w-6 h-6 text-muted hover:text-primary transition-colors duration-200" />
              </Link>
            )}
            {github && (
              <Link
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} - GitHub Repository`}
              >
                <Github className="w-6 h-6 text-muted hover:text-primary transition-colors duration-200" />
              </Link>
            )}
          </div>
        </div>
        {date && (
          <p
            className="text-xs text-muted-foreground mb-2 w-fit"
            data-text-cursor
          >
            {formatProjectDate(date)}
          </p>
        )}
        <p
          className="text-sm text-foreground mb-4 line-clamp-3 flex-grow w-fit"
          data-text-cursor
        >
          {shortDescription}
        </p>
        <SmallTextPills pills={tags} subcursor={true} />
      </div>
    </div>
  );
};

// Main Projects page component
export default function Home() {
  return (
    <section className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start pt-20 px-8">
      <h1
        className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-header tracking-[.1rem]"
        data-text-cursor
      >
        Projects
      </h1>

      <div className="w-full mt-8 max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
        {projects.map((project, idx) => (
          <SlideFadeIn
            key={idx}
            delay={idx * 0.02}
            duration={0.3}
            slideOffset={20}
          >
            <ProjectCard project={project} />
          </SlideFadeIn>
        ))}
      </div>
      <ScrollProgress />
      <div className="h-20 block md:hidden" />
    </section>
  );
}
