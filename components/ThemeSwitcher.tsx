import { useTheme } from "next-themes";
import Button from "./Button";
import { useState, useEffect } from "react";

interface IconProps {
  selected: boolean;
  [key: string]: any; // Allows other props to be passed to the SVG element
}

function SunIcon({ selected, ...props }: IconProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={
        "w-8 h-8 " +
        (selected
          ? "fill-sky-400/20 stroke-sky-500"
          : "stroke-slate-400 dark:stroke-slate-500")
      }
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
  );
}

function MoonIcon({ selected, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
        className={selected ? "fill-sky-400/20" : "fill-transparent"}
      />
      <path
        d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
        className={
          selected ? "fill-sky-500" : "fill-slate-400 dark:fill-slate-500"
        }
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
        className={
          selected ? "fill-sky-500" : "fill-slate-400 dark:fill-slate-500"
        }
      />
    </svg>
  );
}

function PcIcon({ selected, ...props }: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" className="w-8 h-8" {...props}>
      <path
        d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
        strokeWidth="2"
        strokeLinejoin="round"
        className={
          selected
            ? "stroke-sky-500 fill-sky-400/20"
            : "stroke-slate-400 dark:stroke-slate-500"
        }
      />
      <path
        d="M14 15c0 3 2 5 2 5H8s2-2 2-5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={
          selected ? "stroke-sky-500" : "stroke-slate-400 dark:stroke-slate-500"
        }
      />
    </svg>
  );
}

const themeList = [{ name: "Light" }, { name: "Dark" }, { name: "System" }];

const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { theme, systemTheme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const renderMainIcon = () => {
    switch (theme) {
      case "light":
        return <SunIcon selected={true} />;
      case "dark":
        return <MoonIcon selected={true} />;
      case "system":
        return <PcIcon selected={true} />;
      default:
        return null;
    }
  };

  const selected = true;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-lg active:bg-slate-200 active:dark:bg-slate-800 duration-100 p-1"
      >
        {renderMainIcon()}
      </button>

      {isOpen && (
        <div className="bg-slate-700 absolute flex flex-col items-start rounded-lg p-2 w-full">
          {themeList.map((item, i) => (
            <div
              key={i}
              className="flex w-full hover:bg-blue-300 p-1 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4"
            >
              <h3 className="font-jetbrains_mono">{item.name}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
