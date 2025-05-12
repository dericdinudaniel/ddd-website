"use client";

import { useEffect, useMemo, useState, useId } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Monitor,
  Loader,
  ChevronUp,
  ChevronDown,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DropdownMenu } from "radix-ui";

const iconMap = {
  light: <Sun className="mr-2 size-6" />,
  dark: <Moon className="mr-2 size-6" />,
  system: <Monitor className="mr-2 size-6" />,
};

const themeOptions = [
  { key: "light", label: "Light Mode", icon: iconMap.light },
  { key: "dark", label: "Dark Mode", icon: iconMap.dark },
  { key: "system", label: "System Theme", icon: iconMap.system },
];

const chevronTransition = { duration: 0.2 };

type ThemeSwitcherProps = {
  isScrolled: boolean;
  isMobile: boolean;
  animationDuration: number;
  formationDelayDuration: number;
};

const ThemeSwitcher = ({
  isScrolled,
  isMobile,
  animationDuration,
  formationDelayDuration,
}: ThemeSwitcherProps) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const labelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentIcon = useMemo(() => {
    if (!mounted || !resolvedTheme) {
      return <Loader className="animate-spin" />;
    }

    // Theme mode to use as key
    const key = theme === "system" ? "system" : resolvedTheme;
    return iconMap[key as keyof typeof iconMap];
  }, [mounted, resolvedTheme, theme]);

  return (
    <div className="pr-2">
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <motion.button
            data-cursor-generic
            aria-labelledby={labelId}
            animate={{
              scale: isScrolled ? (isMobile ? 0.8 : 0.9) : 1,
            }}
            transition={{
              duration: animationDuration,
              delay: formationDelayDuration,
            }}
            className="flex items-center rounded-md px-3 py-1 sm:py-2 text-foreground transition-colors duration-200 active:bg-muted/30 focus-visible:outline-none"
          >
            <span id={labelId} className="sr-only">
              Theme toggle
            </span>

            <motion.span whileTap={{ scale: 0.9 }}>{currentIcon}</motion.span>

            <AnimatePresence mode="sync" initial={false}>
              <div className="ml-[-5] relative size-4 min-w-[1rem] flex items-center justify-center overflow-visible">
                {isOpen ? (
                  <>
                    {/* ChevronUp enters from top */}
                    <motion.span
                      key="chevron-up"
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={chevronTransition}
                      className="absolute"
                    >
                      <ChevronUp className="size-4" />
                    </motion.span>

                    {/* ChevronDown exits downward */}
                    <motion.span
                      key="chevron-down-out"
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: 16 }}
                      exit={{ opacity: 0, y: 16 }}
                      transition={chevronTransition}
                      className="absolute"
                    >
                      <ChevronDown className="size-4" />
                    </motion.span>
                  </>
                ) : (
                  <>
                    {/* ChevronDown enters from below */}
                    <motion.span
                      key="chevron-down"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16 }}
                      transition={chevronTransition}
                      className="absolute"
                    >
                      <ChevronDown className="size-4" />
                    </motion.span>

                    {/* ChevronUp exits upward */}
                    <motion.span
                      key="chevron-up-out"
                      initial={{ opacity: 1, y: 0 }}
                      animate={{ opacity: 0, y: -16 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={chevronTransition}
                      className="absolute"
                    >
                      <ChevronUp className="size-4" />
                    </motion.span>
                  </>
                )}
              </div>
            </AnimatePresence>
          </motion.button>
        </DropdownMenu.Trigger>

        <AnimatePresence>
          {isOpen && (
            <DropdownMenu.Portal forceMount>
              <DropdownMenu.Content
                className="cursor-none"
                side="bottom"
                align="end"
                sideOffset={4}
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="w-44 rounded-lg bg-background border border-border shadow-md p-1 z-70"
                >
                  {themeOptions.map(({ key, label, icon }) => (
                    <DropdownMenu.Item
                      data-cursor-generic
                      data-cursor-subcursor
                      key={key}
                      className="flex items-center justify-between p-2 rounded-md text-sm text-foreground transition-all duration-200 hover:bg-muted/20 active:bg-muted/30 focus-visible:outline-none cursor-none"
                      onSelect={() => setTheme(key)}
                    >
                      <span className="flex items-center select-none">
                        {icon}
                        {label}
                      </span>
                      {theme === key && <Check className="size-4" />}
                    </DropdownMenu.Item>
                  ))}
                </motion.div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          )}
        </AnimatePresence>
      </DropdownMenu.Root>
    </div>
  );
};

export default ThemeSwitcher;
