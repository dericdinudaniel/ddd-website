"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { motion, useSpring } from "motion/react";
import { useCustomCursor } from "./providers/CustomCursorProvider";
import { GlowEffect } from "./motion-primitives/glow-effect";

// Custom debounce hook
const useDebounce = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
};

const CustomCursor: React.FC = () => {
  const { isCursorVisible } = useCustomCursor();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClickable, setIsClickable] = useState(false);
  const [isOverText, setIsOverText] = useState(false);
  const [textHeight, setTextHeight] = useState(0);
  const [hoveredTooltip, setHoveredTooltip] = useState<{
    name: string;
    hovered: boolean;
  } | null>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [headerLinkRect, setHeaderLinkRect] = useState<DOMRect | null>(null);
  const [genericHoverRect, setGenericHoverRect] = useState<DOMRect | null>(
    null
  );
  const [genericBorderRadius, setGenericBorderRadius] = useState<number>(15);
  const [isOverSubcursor, setIsOverSubcursor] = useState(false);
  const [isSubcursorOverText, setIsSubcursorOverText] = useState(false);
  const [cursorOpacity, setCursorOpacity] = useState(0.5);
  const [subcursorOpacity, setSubcursorOpacity] = useState(0.85);

  const tempSpanRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Create spring animations for smooth transitions
  const springConfig = { stiffness: 800, damping: 35, mass: 0.2 };
  const x = useSpring(mousePosition.x, springConfig);
  const y = useSpring(mousePosition.y, springConfig);
  const scale = useSpring(1, { stiffness: 1000, damping: 50, mass: 0.1 });
  const subcursorScale = useSpring(1, {
    stiffness: 1000,
    damping: 50,
    mass: 0.1,
  });

  // Update spring values when mouse position or link changes
  useEffect(() => {
    if (headerLinkRect) {
      const targetX = headerLinkRect.left + headerLinkRect.width / 2;
      const targetY = headerLinkRect.top + headerLinkRect.height / 2;
      x.set(targetX);
      y.set(targetY);
    } else if (genericHoverRect) {
      const targetX = genericHoverRect.left + genericHoverRect.width / 2;
      const targetY = genericHoverRect.top + genericHoverRect.height / 2;
      x.set(targetX);
      y.set(targetY);
    } else {
      x.set(mousePosition.x);
      y.set(mousePosition.y);
    }
  }, [mousePosition, headerLinkRect, genericHoverRect, x, y]);

  // Add blinking animation effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const blink = () => {
      if (isOverText) {
        setCursorOpacity(0.5); // Turn on
        timeoutId = setTimeout(() => {
          setCursorOpacity(0); // Turn off
          timeoutId = setTimeout(blink, 300); // Wait _ms before next cycle
        }, 700); // Stay on for _ms
      } else {
        setCursorOpacity(0.5);
      }
    };

    blink();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isOverText]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const blink = () => {
      if (isSubcursorOverText) {
        setSubcursorOpacity(0.85); // Turn on
        timeoutId = setTimeout(() => {
          setSubcursorOpacity(0); // Turn off
          timeoutId = setTimeout(blink, 300); // Wait _ms before next cycle
        }, 700); // Stay on for _ms
      } else {
        setSubcursorOpacity(0.85);
      }
    };

    blink();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSubcursorOverText]);

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
      tooltipHovered: {
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
        opacity: cursorOpacity,
      },
      clickableText: {
        width: 4,
        height: textHeight,
        borderRadius: 99,
        scale: 1.2,
        opacity: 0.8,
      },
      clickable: {
        width: 16,
        height: 16,
        borderRadius: 4,
        scale: 1.2,
        opacity: 0.5,
      },
      headerLink: {
        width: headerLinkRect ? headerLinkRect.width + 12 : 16,
        height: headerLinkRect ? headerLinkRect.height + 10 : 16,
        borderRadius: 15,
        scale: 1,
        opacity: 0.5,
      },
      genericHover: {
        width: genericHoverRect ? genericHoverRect.width : 16,
        height: genericHoverRect ? genericHoverRect.height : 16,
        borderRadius: genericBorderRadius,
        scale: 1,
        opacity: 0.3,
      },
      subcursor: {
        width: 12,
        height: 12,
        borderRadius: 99,
        scale: 1,
        opacity: 0.85,
      },
      subcursorText: {
        width: 4,
        height: textHeight,
        borderRadius: 99,
        scale: 1,
        opacity: subcursorOpacity,
      },
    }),
    [
      textWidth,
      textHeight,
      headerLinkRect,
      genericHoverRect,
      genericBorderRadius,
      cursorOpacity,
      subcursorOpacity,
    ]
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
    if (headerLinkRect) return "headerLink";
    if (genericHoverRect) return "genericHover";
    if (hoveredTooltip?.hovered) return "tooltipHovered";
    if (isOverText && isClickable) return "clickableText";
    if (isOverText) return "text";
    if (isClickable) return "clickable";
    return "default";
  }, [
    headerLinkRect,
    genericHoverRect,
    hoveredTooltip?.hovered,
    isClickable,
    isOverText,
  ]);

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

  // Memoize the element detection logic
  const detectElements = useCallback(() => {
    if (typeof window === "undefined") return;

    const element = document.elementFromPoint(mousePosition.x, mousePosition.y);
    if (!element) {
      setIsOverText(false);
      setHeaderLinkRect(null);
      setGenericHoverRect(null);
      setGenericBorderRadius(15);
      setIsOverSubcursor(false);
      setIsSubcursorOverText(false);
      return;
    }

    // Check for subcursor elements with improved Safari handling
    const subcursorElement = element.closest("[data-cursor-subcursor]");
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
      // For Safari, use a more reliable method to detect if we're over the element
      if (subcursorElement instanceof HTMLElement) {
        const rect = subcursorElement.getBoundingClientRect();
        const isOver =
          mousePosition.x >= rect.left &&
          mousePosition.x <= rect.right &&
          mousePosition.y >= rect.top &&
          mousePosition.y <= rect.bottom;

        // Only update if the state would change
        if (isOver !== isOverSubcursor) {
          setIsOverSubcursor(isOver);
        }
      } else {
        setIsOverSubcursor(false);
      }
    } else {
      setIsOverSubcursor(!!subcursorElement);
    }

    // Check if subcursor is over text cursor element
    const textElement = element.closest("[data-text-cursor]");
    setIsSubcursorOverText(!!textElement);

    // Check if the element or any of its parents has the data-text-cursor attribute
    const shouldBeTextMode = !!textElement;
    setIsOverText(shouldBeTextMode);

    if (shouldBeTextMode && textElement instanceof HTMLElement) {
      // Get the computed line height instead of full element height
      const computedStyle = window.getComputedStyle(textElement);
      const lineHeight = computedStyle.lineHeight;
      // Convert line height to number (removes 'px' and handles 'normal')
      const lineHeightValue =
        lineHeight === "normal"
          ? parseFloat(computedStyle.fontSize) * 1 // Default line height is usually 1.2x font size
          : parseFloat(lineHeight) * 1;
      setTextHeight((lineHeightValue || textElement.offsetHeight) + 3);
    } else {
      setTextHeight(0);
    }

    // Handle header links
    const headerLink = element.closest("[data-header-link]");
    if (headerLink instanceof HTMLElement) {
      setHeaderLinkRect(headerLink.getBoundingClientRect());
    } else {
      setHeaderLinkRect(null);
    }

    // Handle generic hover elements
    const genericElement = element.closest(
      "[data-cursor-generic], [data-cursor-generic-padded]"
    );
    if (genericElement instanceof HTMLElement) {
      const rect = genericElement.getBoundingClientRect();

      // Parse padding configuration
      let padding = { top: 0, right: 0, bottom: 0, left: 0 };
      if (genericElement.hasAttribute("data-cursor-generic-padded")) {
        const paddingConfig = genericElement.getAttribute(
          "data-cursor-generic-padded"
        );

        // If attribute exists but no value, use default
        if (!paddingConfig) {
          padding = { top: 10, right: 10, bottom: 10, left: 10 };
        } else {
          try {
            // Handle both JSON and single number formats
            if (paddingConfig.startsWith("{")) {
              const parsedPadding = JSON.parse(paddingConfig);
              // Ensure all sides have a value, defaulting to 0 if missing
              padding = {
                top: parsedPadding.top ?? 0,
                right: parsedPadding.right ?? 0,
                bottom: parsedPadding.bottom ?? 0,
                left: parsedPadding.left ?? 0,
              };
            } else {
              const value = parseInt(paddingConfig, 10) || 10; // Default to 10 if parsing fails
              padding = {
                top: value,
                right: value,
                bottom: value,
                left: value,
              };
            }
          } catch (e) {
            console.error("Failed to parse padding configuration:", e);
            padding = { top: 10, right: 10, bottom: 10, left: 10 };
          }
        }
      }

      // Ensure padding values are valid numbers
      padding = {
        top: Math.max(0, Number(padding.top) || 0),
        right: Math.max(0, Number(padding.right) || 0),
        bottom: Math.max(0, Number(padding.bottom) || 0),
        left: Math.max(0, Number(padding.left) || 0),
      };

      setGenericHoverRect({
        ...rect,
        width: rect.width + padding.left + padding.right,
        height: rect.height + padding.top + padding.bottom,
        left: rect.left - padding.left,
        top: rect.top - padding.top,
      });

      const computedStyle = window.getComputedStyle(genericElement);
      const borderRadius = computedStyle.borderRadius;
      // Convert border radius to number (removes 'px' and handles multiple values)
      const radiusValue = parseFloat(borderRadius.split(" ")[0]);
      setGenericBorderRadius(radiusValue || 15);
    } else {
      setGenericHoverRect(null);
      setGenericBorderRadius(15);
    }

    // Handle hover tooltips
    const socialLink = element.closest("[data-tooltip-hover]");
    if (socialLink) {
      const name = socialLink.getAttribute("data-tooltip-name");
      const hovered = socialLink.getAttribute("data-tooltip-hover") === "true";

      // Only update state if values have changed
      if (
        hoveredTooltip?.name !== name ||
        hoveredTooltip?.hovered !== hovered
      ) {
        setHoveredTooltip({ name: name || "", hovered });

        // Calculate text width using the reusable temp span
        if (tempSpanRef.current) {
          tempSpanRef.current.textContent = name || "";
          document.body.appendChild(tempSpanRef.current);
          setTextWidth(tempSpanRef.current.offsetWidth);
          document.body.removeChild(tempSpanRef.current);
        }
      }
    } else if (hoveredTooltip !== null) {
      setHoveredTooltip(null);
      setTextWidth(0);
    }
  }, [mousePosition.x, mousePosition.y, hoveredTooltip]);

  // Create debounced version of detectElements
  const debouncedDetectElements = useDebounce(detectElements, 6); // ~60fps

  // Update the effect to use the debounced function
  useEffect(() => {
    debouncedDetectElements();
  }, [debouncedDetectElements]);

  // Add mouse position and clickable state handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update mouse position immediately for Safari
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      if (isSafari) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      } else {
        mousePositionRef.current = { x: e.clientX, y: e.clientY };

        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(() => {
            setMousePosition(mousePositionRef.current);
            rafRef.current = undefined;
          });
        }
      }
    };

    const handleHoverChange = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest(
        'a, button, [role="button"], [tabindex="0"]'
      );
      setIsClickable(!!clickable);
    };

    const handleMouseDown = () => {
      if (isOverSubcursor) {
        subcursorScale.set(0.8);
      } else {
        scale.set(0.8);
      }
    };

    const handleMouseUp = () => {
      if (isOverSubcursor) {
        subcursorScale.set(1);
      } else {
        scale.set(1);
      }
    };

    // Add pointer events for better Safari support
    window.addEventListener("pointermove", handleMouseMove);
    window.addEventListener("pointerover", handleHoverChange);
    window.addEventListener("pointerout", handleHoverChange);
    window.addEventListener("pointerdown", handleMouseDown);
    window.addEventListener("pointerup", handleMouseUp);

    // Keep mouse events for other browsers
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleHoverChange);
    window.addEventListener("mouseout", handleHoverChange);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("pointermove", handleMouseMove);
      window.removeEventListener("pointerover", handleHoverChange);
      window.removeEventListener("pointerout", handleHoverChange);
      window.removeEventListener("pointerdown", handleMouseDown);
      window.removeEventListener("pointerup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleHoverChange);
      window.removeEventListener("mouseout", handleHoverChange);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [scale, subcursorScale, isOverSubcursor]);

  if (!isCursorVisible) return null;

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[999] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out bg-foreground ring-2 ring-border/80"
        style={{
          left: x,
          top: y,
          scale: isOverSubcursor ? 1 : scale,
        }}
        variants={cursorVariants}
        initial="default"
        animate={getCursorVariant()}
        transition={{
          duration: 0.2,
          ease: "easeOut",
          borderRadius: { duration: 0.2, ease: "easeOut" },
          ...((headerLinkRect || genericHoverRect) && {
            type: "spring",
            stiffness: 150,
            damping: 15,
            mass: 0.8,
          }),
        }}
      >
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 scale-110"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isClickable ? 1 : 0,
            width:
              isClickable && !genericHoverRect && !hoveredTooltip?.hovered
                ? cursorVariants[getCursorVariant()].width * 8
                : cursorVariants[getCursorVariant()].width,
            height:
              isClickable && !genericHoverRect && !hoveredTooltip?.hovered
                ? cursorVariants[getCursorVariant()].height * 1.5
                : cursorVariants[getCursorVariant()].height,
            borderRadius: cursorVariants[getCursorVariant()].borderRadius,
            scale: 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
            borderRadius: { duration: 0.2, ease: "easeOut" },
            ...((headerLinkRect || genericHoverRect) && {
              type: "spring",
              stiffness: 150,
              damping: 15,
              mass: 0.8,
            }),
          }}
        >
          <GlowEffect
            colors={[
              "#ff0000",
              "#ff8000",
              "#ffff00",
              "#00ff00",
              "#0000ff",
              "#8000ff",
            ]}
            mode="colorShift"
            blur="strongest"
            duration={4}
            scale={1}
            className="h-full w-full"
          />
        </motion.div>
        {hoveredTooltip?.hovered && (
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center text-background text-xs whitespace-nowrap"
          >
            {hoveredTooltip.name}
          </motion.div>
        )}
      </motion.div>
      {isOverSubcursor && (
        <motion.div
          className="fixed pointer-events-none z-[999] transform -translate-x-1/2 -translate-y-1/2 bg-foreground"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            scale: subcursorScale,
          }}
          variants={cursorVariants}
          initial="subcursor"
          animate={isSubcursorOverText ? "subcursorText" : "subcursor"}
          transition={{
            duration: 0.1,
            ease: "easeOut",
          }}
        />
      )}
    </>
  );
};

export default CustomCursor;
