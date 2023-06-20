import React from "react";
import ColorSwitcher from "./ColorSwitcher";
import { useTheme } from "next-themes";
import Logo from "./Logo";
import ColorSwitcher2 from "./ColorSwitcher2";

const NavBar = () => {
  const { resolvedTheme, theme, systemTheme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <>
      {/* flex justify-between m-8 mt-5 */}
      <nav className="flex justify-between m-8 mt-5">
        <Logo className="flex self-center" currentTheme={currentTheme} />
        {/* <ColorSwitcher className="self-center" /> */}
        <ColorSwitcher2 className="" />
      </nav>
    </>
  );
};

export default NavBar;
