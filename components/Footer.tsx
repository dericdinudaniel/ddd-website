import React from "react";
import SpotifyNowPlaying from "./SpotifyNowPlaying";

const Footer = () => {
  return (
    <footer className="flex flex-col justify-center px-10">
      <SpotifyNowPlaying />
      {/* <div className="border-t-muted flex flex-col-reverse justify-between gap-3 border-t-[1px] border-black py-3 text-sm dark:border-white md:flex-row"> */}
      <hr className="border-t-[1px] border-black dark:border-white py-1" />
      <p className="md:place-self-auto place-self-center md:text-base text-xs">
        made by Deric Dinu Daniel
      </p>
    </footer>
  );
};

export default Footer;
