import Section from "./Section";
import Experience from "../Experience";
import AboutMe from "../AboutMe";
import Education from "../Education";

type SectionProps = {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
};

const Section2 = ({ className = "", ref }: SectionProps) => {
  return (
    <Section className={`${className} border-t`} ref={ref} sectionName="About">
      <div className="flex flex-col w-full md:flex-row justify-center gap-x-10 gap-y-3 px-4">
        <Experience />
        <div className="flex flex-col gap-y-3">
          <Education />
          <AboutMe />
        </div>
      </div>
    </Section>
  );
};

export default Section2;
