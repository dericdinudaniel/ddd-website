import Head from "next/head";
import SocialLinks from "@/components/SocialLinks";
import Companies from "@/components/Companies";

export default function Home() {
  return (
    <>
      <Head>
        <title>Deric Dinu Daniel</title>
      </Head>

      <div className="relative max-w-5xl mx-auto pt-6 justify-items-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center">
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
