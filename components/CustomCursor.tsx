"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { motion } from "motion/react";
import { useCustomCursor } from "./providers/CustomCursorProvider";

interface CustomCursorProps {
  mousePosition: { x: number; y: number };
  isClickable: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  mousePosition,
  isClickable,
}) => {
  const { isCursorVisible } = useCustomCursor();
  const [isOverText, setIsOverText] = useState(false);
  const [textHeight, setTextHeight] = useState(0);
  const [hoveredElement, setHoveredElement] = useState<{
    name: string;
    hovered: boolean;
  } | null>(null);
  const [textWidth, setTextWidth] = useState(0);
  const tempSpanRef = useRef<HTMLSpanElement | null>(null);

  // Memoize the cursor variants to prevent unnecessary recalculations
  const cursorVariants = useMemo(
    () => ({
      default: {
        width: 16,
        height: 16,
        borderRadius: 99,
        scale: 1,
        opacity: 0.5,
      },
      hovered: {
        width: textWidth + 20,
        height: 22,
        borderRadius: 99,
        scale: 1,
        opacity: 0.9,
      },
      text: {
        width: 4,
        height: textHeight,
        borderRadius: 99,
        scale: 1,
        opacity: 0.5,
      },
      clickable: {
        width: 16,
        height: 16,
        borderRadius: 2,
        scale: 1.2,
        opacity: 0.5,
      },
    }),
    [textWidth, textHeight]
  );

  const textVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: 0,
      },
      visible: {
        opacity: 1,
        scale: 1,
      },
    }),
    []
  );

  // Memoize the getCursorVariant function
  const getCursorVariant = useCallback(() => {
    if (hoveredElement?.hovered) return "hovered";
    if (isClickable) return "clickable";
    if (isOverText) return "text";
    return "default";
  }, [hoveredElement?.hovered, isClickable, isOverText]);

  // Create temp span element after mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.whiteSpace = "nowrap";
    span.style.fontSize = "12px";
    tempSpanRef.current = span;

    return () => {
      if (tempSpanRef.current && document.body.contains(tempSpanRef.current)) {
        document.body.removeChild(tempSpanRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const element = document.elementFromPoint(mousePosition.x, mousePosition.y);
    if (!element) {
      setIsOverText(false);
      return;
    }

    // Check if the element or any of its parents has the data-text-cursor attribute
    const textElement = element.closest("[data-text-cursor]");
    const shouldBeTextMode = !!textElement;
    setIsOverText(shouldBeTextMode);

    if (shouldBeTextMode && textElement instanceof HTMLElement) {
      setTextHeight(textElement.offsetHeight);
    } else {
      setTextHeight(0);
    }

    // Handle hover tooltips
    const socialLink = element.closest("[data-hover]");
    if (socialLink) {
      const name = socialLink.getAttribute("data-name");
      const hovered = socialLink.getAttribute("data-hover") === "true";

      // Only update state if values have changed
      if (
        hoveredElement?.name !== name ||
        hoveredElement?.hovered !== hovered
      ) {
        setHoveredElement({ name: name || "", hovered });

        // Calculate text width using the reusable temp span
        if (tempSpanRef.current) {
          tempSpanRef.current.textContent = name || "";
          document.body.appendChild(tempSpanRef.current);
          setTextWidth(tempSpanRef.current.offsetWidth);
          document.body.removeChild(tempSpanRef.current);
        }
      }
    } else if (hoveredElement !== null) {
      setHoveredElement(null);
      setTextWidth(0);
    }
  }, [mousePosition.x, mousePosition.y, hoveredElement]);

  if (!isCursorVisible) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes rainbow-glow {
          0% {
            filter: drop-shadow(0 0 5px #ff0000) drop-shadow(0 0 10px #ff0000);
          }
          16.666% {
            filter: drop-shadow(0 0 5px #ff8000) drop-shadow(0 0 10px #ff8000);
          }
          33.333% {
            filter: drop-shadow(0 0 5px #ffff00) drop-shadow(0 0 10px #ffff00);
          }
          50% {
            filter: drop-shadow(0 0 5px #00ff00) drop-shadow(0 0 10px #00ff00);
          }
          66.666% {
            filter: drop-shadow(0 0 5px #0000ff) drop-shadow(0 0 10px #0000ff);
          }
          83.333% {
            filter: drop-shadow(0 0 5px #8000ff) drop-shadow(0 0 10px #8000ff);
          }
          100% {
            filter: drop-shadow(0 0 5px #ff0000) drop-shadow(0 0 10px #ff0000);
          }
        }
      `}</style>
      <motion.div
        className="fixed pointer-events-none z-60 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out bg-foreground"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          animation: isClickable ? "rainbow-glow 4s linear infinite" : "none",
        }}
        variants={cursorVariants}
        initial="default"
        animate={getCursorVariant()}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {hoveredElement?.hovered && (
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center text-background text-xs whitespace-nowrap"
          >
            {hoveredElement.name}
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
