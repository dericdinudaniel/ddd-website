// components/ThemeSwitcher.tsx

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Loader } from "lucide-react";
import { motion } from "motion/react";

const ThemeSwitcher = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted on the client side before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const getIcon = () => {
    if (!mounted || !resolvedTheme) {
      // Show a loading spinner while the theme is resolving
      return <Loader className="animate-spin" />;
    }
    if (theme === "system") return <Monitor />;
    return resolvedTheme === "dark" ? <Moon /> : <Sun />;
  };

  return (
    <div className="inline-flex relative">
      <motion.button
        className=""
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {getIcon()}
      </motion.button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <ul className="text-sm">
            <li
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleThemeChange("light")}
            >
              <Sun className="mr-2" />
              Light Mode
            </li>
            <li
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleThemeChange("dark")}
            >
              <Moon className="mr-2" />
              Dark Mode
            </li>
            <li
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleThemeChange("system")}
            >
              <Monitor className="mr-2" />
              System Theme
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
