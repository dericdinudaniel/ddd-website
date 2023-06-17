import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import SocialLinks from "@/components/SocialLinks";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Deric Dinu Daniel</title>
      </Head>

      <NavBar />
      <div className="relative max-w-5xl mx-auto pt-20 sm:pt-24 lg:pt-32">
        <h1 className="text-4xl font-bold sm:tex lg:text-6xl tracking-tight text-center font-jetbrains_mono">
          Deric Dinu Daniel
        </h1>
        <p className="p-0 mt-2 text-center text-gray-500 sm:text-lg lg:text-xl font-jetbrains_mono">
          Software Engineer. Music Producer.
        </p>
        <SocialLinks className="mt-6" />
      </div>
    </>
  );
}
