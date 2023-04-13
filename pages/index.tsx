import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <p className="text-4xl font-bold"> Hi Daniel Kang & Hannah Sullivan </p>
      </main>
    </>
  );
}
