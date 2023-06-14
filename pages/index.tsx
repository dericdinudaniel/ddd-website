import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import ColorSwitcher from "../components/ColorSwitcher";
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Deric Dinu Daniel</title>
      </Head>
      {/* <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white dark:bg-slate-900">
      </main> */}
      <NavBar />
      <div className="relative max-w-5xl mx-auto pt-20 sm:pt-24 lg:pt-32">
          <h1 className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white">
            Deric Dinu Daniel
          </h1>
      </div>
    </>
  );
}
