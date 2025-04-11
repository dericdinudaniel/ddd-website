import Section from "./Section";
import Experience from "../Experience";
import AboutMe from "../AboutMe";

type SectionProps = {
  className?: string;
};

const Section2 = ({ className = "" }: SectionProps) => {
  return (
    <Section className={`${className} border-t`}>
      <div className="flex flex-col w-full md:flex-row justify-center gap-x-10 gap-y-16 px-2">
        <Experience />
        <AboutMe />
      </div>
    </Section>
  );
};

export default Section2;
