"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Loader, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DropdownMenu } from "radix-ui";

const ThemeSwitcher = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const iconMap = {
    light: <Sun className="mr-2 h-4 w-4" />,
    dark: <Moon className="mr-2 h-4 w-4" />,
    system: <Monitor className="mr-2 h-4 w-4" />,
  };

  const getCurrentIcon = () => {
    if (!mounted || !resolvedTheme) return <Loader className="animate-spin" />;
    if (theme === "system") return <Monitor />;
    return resolvedTheme === "dark" ? <Moon /> : <Sun />;
  };

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-foreground transition-colors hover:bg-muted/20 active:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border"
          aria-label="Select theme"
        >
          <motion.span whileTap={{ scale: 0.9 }}>
            {getCurrentIcon()}
          </motion.span>
          <motion.span whileTap={{ scale: 0.9 }}>
            <ChevronDown className="ml-1 h-4 w-4" />
          </motion.span>
        </button>
      </DropdownMenu.Trigger>

      {/* Animate dropdown content */}
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
                {["light", "dark", "system"].map((mode) => (
                  <DropdownMenu.Item
                    key={mode}
                    className="flex items-center justify-between p-2 rounded-md text-sm cursor-pointer text-foreground transition-colors hover:bg-muted/20 active:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border"
                    onSelect={() => setTheme(mode)}
                  >
                    <span className="flex items-center">
                      {iconMap[mode as keyof typeof iconMap]}
                      {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                    </span>
                    {theme === mode && <Check className="h-4 w-4" />}
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
