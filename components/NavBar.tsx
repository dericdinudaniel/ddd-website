import React from "react";
import ColorSwitcher from "./ColorSwitcher";

const NavBar = () => {
  return (
    <div className="flex justify-between m-4">
      <span>DDD</span>
      <ColorSwitcher />
    </div>
  );
};

export default NavBar;
