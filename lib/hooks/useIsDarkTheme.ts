"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

// Hook to determine dark mode
export const useIsDarkTheme = () => {
  const { theme, resolvedTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(
      Boolean(theme?.includes("dark") || resolvedTheme?.includes("dark"))
    );
  }, [theme, resolvedTheme]);

  return isDark;
};
