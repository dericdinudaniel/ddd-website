import React from "react";
import ColorSwitcher from "./ColorSwitcher";
import localFont from "@next/font/local";
import { useTheme } from "next-themes";
import Logo from "./Logo";

const garet = localFont({
  src: "../public/fonts/Garet-Font-Family/Spacetype-Garet_Heavy.otf",
  variable: "--font-garet",
});

const NavBar = () => {
  const { resolvedTheme, theme, systemTheme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <>
      <div className="flex justify-between m-8 mt-5">
        <Logo className="flex self-center" currentTheme={currentTheme} />
        <ColorSwitcher className="self-center" />
      </div>
    </>
  );
};

export default NavBar;
