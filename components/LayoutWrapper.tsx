import React, { ReactNode } from "react";
import SectionContainer from "./SectionContainer";
import Footer from "./Footer";
import NavBar from "@/components/NavBar";

interface Props {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: Props) => {
  return (
    <SectionContainer>
      <div
        // className={`container mx-auto flex  h-screen flex-col px-10 font-jetbrains-mono`}
        className={`mx-auto flex h-screen flex-col font-jetbrains-mono md:px-8 px-2 md:py-6 py-4`}
      >
        <NavBar />
        <main>{children}</main>
        <div className="grow" />
        <Footer />
      </div>
    </SectionContainer>
  );
};

export default LayoutWrapper;
