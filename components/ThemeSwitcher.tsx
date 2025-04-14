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
  light: <Sun className="mr-2 h-4 w-4" />,
  dark: <Moon className="mr-2 h-4 w-4" />,
  system: <Monitor className="mr-2 h-4 w-4" />,
};

const themeOptions = [
  { key: "light", label: "Light Mode", icon: iconMap.light },
  { key: "dark", label: "Dark Mode", icon: iconMap.dark },
  { key: "system", label: "System Theme", icon: iconMap.system },
];

const chevronTransition = { duration: 0.2 };

const ThemeSwitcher = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const labelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentIcon = useMemo(() => {
    if (!mounted || !resolvedTheme) return <Loader className="animate-spin" />;
    if (theme === "system") return <Monitor />;
    return resolvedTheme === "dark" ? <Moon /> : <Sun />;
  }, [mounted, resolvedTheme, theme]);

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          aria-labelledby={labelId}
          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-foreground transition-colors hover:bg-muted/20 active:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border"
        >
          <span id={labelId} className="sr-only">
            Theme toggle
          </span>

          <motion.span whileTap={{ scale: 0.9 }}>{currentIcon}</motion.span>

          <AnimatePresence mode="sync" initial={false}>
            <div className="ml-1 relative h-4 w-4 min-w-[1rem] flex items-center justify-center overflow-visible">
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
                    <ChevronUp className="h-4 w-4" />
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
                    <ChevronDown className="h-4 w-4" />
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
                    <ChevronDown className="h-4 w-4" />
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
                    <ChevronUp className="h-4 w-4" />
                  </motion.span>
                </>
              )}
            </div>
          </AnimatePresence>
        </button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
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
                className="w-44 rounded-lg bg-background border border-border shadow-md p-1 z-50"
              >
                {themeOptions.map(({ key, label, icon }) => (
                  <DropdownMenu.Item
                    key={key}
                    className="flex items-center justify-between p-2 rounded-md text-sm cursor-pointer text-foreground transition-colors hover:bg-muted/20 active:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border"
                    onSelect={() => setTheme(key)}
                  >
                    <span className="flex items-center">
                      {icon}
                      {label}
                    </span>
                    {theme === key && <Check className="h-4 w-4" />}
                  </DropdownMenu.Item>
                ))}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
};

export default ThemeSwitcher;
