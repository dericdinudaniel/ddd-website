import Link from "next/link";
import React from "react";
import { SlideFadeIn } from "./SlideFadeIn";

type MacApp = {
  name: string;
  link: string;
  description?: string;
};

const MacApps: MacApp[] = [
  {
    name: "Arc Browser",
    link: "https://arc.net/gift/6e0e6bb6",
    description:
      "I know this isn't the best for performance, but nothing beats its looks.",
  },
  {
    name: "Raycast",
    link: "https://www.raycast.com/",
    description: "I can't even fully explain how life-changing this is.",
  },
  {
    name: "Rectangle",
    link: "https://rectangleapp.com/",
    description:
      "Best window management + shortcuts. Could use Raycast if I really wanted for this.",
  },
  {
    name: "Bartender",
    link: "https://www.macbartender.com/",
    description: "Manage menubar items and clean it up.",
  },
  {
    name: "Warp",
    link: "https://app.warp.dev/referral/7DZN5L",
    description: "I use this because it looks super clean.",
  },
  {
    name: "Linear Mouse",
    link: "https://linearmouse.app/",
    description: "Customize mouse sensitivity and disable acceleration.",
  },
  {
    name: "Shottr",
    link: "https://shottr.cc/",
    description:
      "Best screenshot utility. Instant capture to clipboard, OCR, and editing.",
  },
  {
    name: "Notion Calendar",
    link: "",
    description:
      "Best simple calendar app that works with multiple accounts on all platforms.",
  },
  {
    name: "App Cleaner",
    link: "https://freemacsoft.net/appcleaner/",
    description: "Fully uninstall programs with no traces left behind.",
  },
  {
    name: "The Unarchiver",
    link: "https://theunarchiver.com/",
    description: "Open any compressed format.",
  },
  {
    name: "Al Dente",
    link: "",
    description: "Limit charging to preserve long-term battery health.",
  },
];
interface DisplayMacAppProps {
  app: MacApp;
}
const DisplayMacApp: React.FC<DisplayMacAppProps> = ({ app }) => {
  const { name, link, description } = app;

  return (
    <div>
      <Link href={link} className="underline text-primary font-semibold">
        {name}
      </Link>
      <p className="text-xs sm:text-sm text-muted">{description}</p>
    </div>
  );
};

const MacSetup = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-header tracking-[.1rem]">
        Mac Setup
      </h2>
      <h6 className="text-muted text-xs mt-1">
        I cannot live without any of these.
      </h6>

      <div className="mt-2 px-2 space-y-1.5 max-w-[95%]">
        {MacApps.map((app, idx) => (
          <SlideFadeIn key={idx} delay={0.03 * idx} duration={0.3}>
            <DisplayMacApp app={app} />
          </SlideFadeIn>
        ))}
      </div>
    </div>
  );
};

export default MacSetup;
