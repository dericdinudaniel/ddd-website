import React, { RefObject } from "react";
import { motion } from "motion/react";
import { useCustomCursor } from "./providers/CustomCursorProvider";

interface CustomCursorProps {
  mousePosition: { x: number; y: number };
  hoveredElement: { name: string; hovered: boolean } | null;
  textWidth: number;
  isClickable: boolean;
  isOverName: boolean;
  isOverSubText: boolean;
  nameHeight: number;
  subTextHeight: number;
  textRef: RefObject<HTMLDivElement | null>;
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  mousePosition,
  hoveredElement,
  textWidth,
  isClickable,
  isOverName,
  isOverSubText,
  nameHeight,
  subTextHeight,
  textRef,
}) => {
  const { isCursorVisible } = useCustomCursor();

  if (!isCursorVisible) return null;

  const cursorVariants = {
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
    name: {
      width: 4,
      height: nameHeight,
      borderRadius: 99,
      scale: 1,
      opacity: 0.5,
    },
    subText: {
      width: 4,
      height: subTextHeight,
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
  };

  const textVariants = {
    hidden: {
      opacity: 0,
      scale: 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  const getCursorVariant = () => {
    if (hoveredElement?.hovered) return "hovered";
    if (isClickable) return "clickable";
    if (isOverName) return "name";
    if (isOverSubText) return "subText";
    return "default";
  };

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
            <div ref={textRef} className="invisible absolute">
              {hoveredElement.name}
            </div>
            {hoveredElement.name}
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
