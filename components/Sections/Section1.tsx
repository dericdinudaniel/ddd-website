"use client";

import { useEffect, useState, useRef } from "react";
import Section from "./Section";
import SocialLinks from "../SocialLinks";
import { SlideFadeIn } from "../SlideFadeIn";
import Background from "../Background";
import CustomCursor from "../CustomCursor";
import { useCustomCursor } from "../providers/CustomCursorProvider";

type SectionProps = {
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
};

const SubText = () => {
  const [hovered, setHovered] = useState(false);
  const subTextRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={subTextRef}
      className="flex items-center justify-center z-1"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      data-subtext
    >
      <div
        key={hovered ? "hovered" : "default"}
        className="whitespace-nowrap text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl"
      >
        {hovered ? (
          <div className="flex gap-x-3">
            <SlideFadeIn slideOffset={20} delay={0.06}>
              Vibe Curator.
            </SlideFadeIn>
            <SlideFadeIn slideOffset={20}>Signal Processor.</SlideFadeIn>
          </div>
        ) : (
          <div className="flex gap-x-3">
            <SlideFadeIn slideOffset={20} delay={0.06}>
              Software Engineer.
            </SlideFadeIn>
            <SlideFadeIn slideOffset={20}>Music Producer.</SlideFadeIn>
          </div>
        )}
      </div>
    </div>
  );
};

const Section1 = ({ className = "", ref }: SectionProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredElement, setHoveredElement] = useState<{
    name: string;
    hovered: boolean;
  } | null>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [isClickable, setIsClickable] = useState(false);
  const [isOverName, setIsOverName] = useState(false);
  const [isOverSubText, setIsOverSubText] = useState(false);
  const [nameHeight, setNameHeight] = useState(0);
  const [subTextHeight, setSubTextHeight] = useState(0);
  const { sectionRef } = useCustomCursor();
  const textRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 640);
      if (nameRef.current) {
        setNameHeight(nameRef.current.offsetHeight);
      }
      const subText = document.querySelector("[data-subtext]");
      if (subText) {
        setSubTextHeight(subText.getBoundingClientRect().height);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (textRef.current && hoveredElement?.hovered) {
      const width = textRef.current.offsetWidth;
      setTextWidth(width);
    } else {
      setTextWidth(0);
    }
  }, [hoveredElement]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleHoverChange = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const socialLink = target.closest("[data-hover]");
      const clickable = target.closest(
        'a, button, [role="button"], [tabindex="0"]'
      );
      const nameText = target.closest("h1");
      const subText = target.closest("[data-subtext]");

      setIsClickable(!!clickable);
      setIsOverName(!!nameText);
      setIsOverSubText(!!subText);

      if (socialLink) {
        const name = socialLink.getAttribute("data-name");
        const hovered = socialLink.getAttribute("data-hover") === "true";
        setHoveredElement({ name: name || "", hovered });
      } else {
        setHoveredElement(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleHoverChange);
    window.addEventListener("mouseout", handleHoverChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleHoverChange);
      window.removeEventListener("mouseout", handleHoverChange);
    };
  }, []);

  const { customCursorNoneTW } = useCustomCursor();

  return (
    <Section
      className={`${className} ${customCursorNoneTW}`}
      ref={(el) => {
        if (typeof ref === "function") ref(el);
        if (sectionRef) sectionRef.current = el;
      }}
      sectionName={isMobile ? "DDD" : ""}
    >
      <style jsx global>{`
        /* Hide pointer for all clickable elements inside Section1 */
        [data-section1-cursor] a,
        [data-section1-cursor] button,
        [data-section1-cursor] [role="button"],
        [data-section1-cursor] [tabindex="0"] {
          cursor: none !important;
        }
      `}</style>
      <div data-section1-cursor>
        <CustomCursor
          mousePosition={mousePosition}
          hoveredElement={hoveredElement}
          textWidth={textWidth}
          isClickable={isClickable}
          isOverName={isOverName}
          isOverSubText={isOverSubText}
          nameHeight={nameHeight}
          subTextHeight={subTextHeight}
          textRef={textRef}
        />
        <Background className="flex flex-col justify-center items-center align-middle">
          <h1
            ref={nameRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-9xl font-bold font-header tracking-[.1rem] flex gap-x-2 md:gap-x-3 xl:gap-x-4"
          >
            <SlideFadeIn delay={0.12}>Deric</SlideFadeIn>
            <SlideFadeIn delay={0.06}>Dinu</SlideFadeIn>
            <SlideFadeIn delay={0}>Daniel</SlideFadeIn>
          </h1>

          <SubText />

          <SocialLinks />
        </Background>
      </div>
    </Section>
  );
};

export default Section1;
