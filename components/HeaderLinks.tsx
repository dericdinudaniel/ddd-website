import Link from "next/link";
import React from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
];

const HeaderLinks = () => {
  return (
    <div className="flex items-center gap-x-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="underline-fade hover:text-primary transition-colors duration-200"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default HeaderLinks;
