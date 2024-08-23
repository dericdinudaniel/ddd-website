import Head from "next/head";
import SocialLinks from "@/components/SocialLinks";
import Companies from "@/components/Companies";

export default function Home() {
  return (
    <>
      <Head>
        <title>Deric Dinu Daniel</title>
      </Head>

      <div className="relative max-w-5xl mx-auto pt-10 sm:pt-10 lg:pt-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-center">
          Deric Dinu Daniel
        </h1>
        <p className="p-0 mt-2 text-center text-gray-500 sm:text-lg lg:text-2xl">
          Software Engineer. Music Producer.
        </p>
        <SocialLinks className="mt-6" />
        <Companies className="mt-6" />
      </div>
    </>
  );
}
