import Link from "next/link";
import React from "react";

interface SocialLinksProps {
  className?: string;
  // currentTheme?: string;
}

interface IconProps {
  // currentTheme?: string;
  [key: string]: any; // Allows other props to be passed to the SVG element
}

function GitHubIcon({ ...props }: IconProps) {
  return (
    <Link href="https://github.com/dericdinudaniel" target="_blank">
      <svg
        className="h-10 w-10 fill-slate-900 dark:fill-slate-100"
        viewBox="-10 -15 120 120"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
        />
      </svg>
    </Link>
  );
}

function EmailIcon({ ...props }: IconProps) {
  return (
    <Link href="mailto:dericdd@umich.edu" target="_blank">
      <svg
        className="h-12 w-12 fill-slate-900 dark:fill-slate-100"
        viewBox="0 0 550 550"
      >
        <path
          d="M485.211,363.906c0,10.637-2.992,20.498-7.785,29.174L324.225,221.67l151.54-132.584
		c5.895,9.355,9.446,20.344,9.446,32.219V363.906z M242.606,252.793l210.863-184.5c-8.653-4.737-18.397-7.642-28.908-7.642H60.651
		c-10.524,0-20.271,2.905-28.889,7.642L242.606,252.793z M301.393,241.631l-48.809,42.734c-2.855,2.487-6.41,3.729-9.978,3.729
		c-3.57,0-7.125-1.242-9.98-3.729l-48.82-42.736L28.667,415.23c9.299,5.834,20.197,9.329,31.983,9.329h363.911
		c11.784,0,22.687-3.495,31.983-9.329L301.393,241.631z M9.448,89.085C3.554,98.44,0,109.429,0,121.305v242.602
		c0,10.637,2.978,20.498,7.789,29.174l153.183-171.44L9.448,89.085z"
        />
      </svg>
    </Link>
  );
}

function LinkedInIcon({ ...props }: IconProps) {
  return (
    <Link href="https://www.linkedin.com/in/dericdinudaniel/" target="_blank">
      <svg
        className="h-[3rem] w-[3rem] fill-slate-900 dark:fill-slate-100"
        viewBox="0 0 27 27"
      >
        <path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 01-1.548-1.549 1.548 1.548 0 111.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z"></path>
      </svg>
    </Link>
  );
}

const ResumeLink = ({ className }: SocialLinksProps) => {
  return (
    <Link
      href="/Deric_Dinu_Daniel_Resume.pdf"
      target="_blank"
      className="h-10 w-10 fill-slate-900 dark:fill-slate-100"
    >
      <svg viewBox="7 -2 99 99">
        <path d="M71.38,9.82H28.62a12.51,12.51,0,0,0-12.5,12.5V77.68a12.51,12.51,0,0,0,12.5,12.5H71.38a12.51,12.51,0,0,0,12.5-12.5V22.32A12.51,12.51,0,0,0,71.38,9.82ZM38.17,21a6.39,6.39,0,1,1-6.39,6.39A6.4,6.4,0,0,1,38.17,21ZM27,45.47a9.91,9.91,0,0,1,9.9-9.9h2.53a9.91,9.91,0,0,1,9.9,9.9v.46a.76.76,0,0,1-.76.76H27.77a.76.76,0,0,1-.76-.76ZM72.65,75.19H28.4a2.5,2.5,0,0,1,0-5H72.65a2.5,2.5,0,0,1,0,5Zm0-12H28.4a2.5,2.5,0,0,1,0-5H72.65a2.5,2.5,0,0,1,0,5Zm0-18H55.4a2.5,2.5,0,0,1,0-5H72.65a2.5,2.5,0,0,1,0,5Zm0-12H55.4a2.5,2.5,0,0,1,0-5H72.65a2.5,2.5,0,0,1,0,5Z" />
      </svg>
    </Link>
  );
};

// make an array that returns the icons
const icons = [
  {
    name: "GitHub",
    icon: GitHubIcon,
  },
  {
    name: "Email",
    icon: EmailIcon,
  },
  {
    name: "LinkedIn",
    icon: LinkedInIcon,
  },
  {
    name: "Resume",
    icon: ResumeLink,
  },
];

const SocialLinks = ({ className }: SocialLinksProps) => {
  return (
    <div className={className + " flex justify-center gap-5 w-full"}>
      {icons.map((link) => {
        return <link.icon key={link.name} className="" />;
      })}
    </div>
  );
};

export default SocialLinks;
