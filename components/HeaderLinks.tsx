import Link from "next/link";
import React from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/writings", label: "Writings" },
];

const HeaderLinks = () => {
  return (
    <div className="flex items-center gap-x-2 sm:gap-x-2 lg:gap-x-3">
      {links.map((link) => (
        <span
          data-cursor-generic-padded='{"top": 4, "right": 7, "bottom": 7, "left": 7}'
          key={link.href}
          className="font-semibold text-xs sm:text-sm lg:text-base select-none"
        >
          <Link href={link.href} className="underline-fade">
            {link.label}
          </Link>
        </span>
      ))}
    </div>
  );
};

export default HeaderLinks;
