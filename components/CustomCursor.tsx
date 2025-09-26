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

// Simple, efficient debounce hook
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

// Simple element cache - no complex spatial logic
const elementCache = new Map<
  string,
  { element: Element | null; timestamp: number }
>();
const CACHE_DURATION = 33; // ~30fps cache - sweet spot for performance

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
  const [subcursorGenericRect, setSubcursorGenericRect] =
    useState<DOMRect | null>(null);
  const [subcursorGenericBorderRadius, setSubcursorGenericBorderRadius] =
    useState<number>(15);

  const tempSpanRef = useRef<HTMLSpanElement | null>(null);

  // Balanced spring configurations for smooth performance
  const springConfig = { stiffness: 600, damping: 30, mass: 0.08 };
  const fastSpringConfig = { stiffness: 800, damping: 35, mass: 0.05 };

  const x = useSpring(mousePosition.x, { ...springConfig, mass: 0.001 });
  const y = useSpring(mousePosition.y, { ...springConfig, mass: 0.001 });
  const scale = useSpring(1, fastSpringConfig);
  const subcursorScale = useSpring(1, fastSpringConfig);
  const subcursorX = useSpring(mousePosition.x, {
    ...springConfig,
    mass: 0.001,
  });
  const subcursorY = useSpring(mousePosition.y, {
    ...springConfig,
    mass: 0.001,
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

    // Update subcursor position
    if (subcursorGenericRect) {
      const targetX =
        subcursorGenericRect.left + subcursorGenericRect.width / 2;
      const targetY =
        subcursorGenericRect.top + subcursorGenericRect.height / 2;
      subcursorX.set(targetX);
      subcursorY.set(targetY);
    } else {
      subcursorX.set(mousePosition.x);
      subcursorY.set(mousePosition.y);
    }
  }, [
    mousePosition,
    headerLinkRect,
    genericHoverRect,
    subcursorGenericRect,
    x,
    y,
    subcursorX,
    subcursorY,
  ]);

  // Add blinking animation effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const blink = () => {
      if (isOverText) {
        setCursorOpacity(0.5); // Turn on
        timeoutId = setTimeout(() => {
          setCursorOpacity(0.1); // Turn off
          timeoutId = setTimeout(blink, 300); // Wait _ms before next cycle
        }, 800); // Stay on for _ms
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
          setSubcursorOpacity(0.1); // Turn off
          timeoutId = setTimeout(blink, 300); // Wait _ms before next cycle
        }, 800); // Stay on for _ms
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
      subcursorGeneric: {
        width: subcursorGenericRect ? subcursorGenericRect.width : 12,
        height: subcursorGenericRect ? subcursorGenericRect.height : 12,
        borderRadius: subcursorGenericBorderRadius,
        scale: 1,
        opacity: 0.3,
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
      subcursorGenericRect,
      subcursorGenericBorderRadius,
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

  // Add a new function to get subcursor variant
  const getSubcursorVariant = useCallback(() => {
    if (subcursorGenericRect) return "subcursorGeneric";
    if (isSubcursorOverText) return "subcursorText";
    return "subcursor";
  }, [subcursorGenericRect, isSubcursorOverText]);

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

  // Simple, efficient element detection
  const detectElements = useCallback(() => {
    if (typeof window === "undefined") return;

    // Simple caching - check if we have a recent result for this position
    const cacheKey = `${Math.floor(mousePosition.x / 5)},${Math.floor(
      mousePosition.y / 5
    )}`;
    const cached = elementCache.get(cacheKey);
    const now = performance.now();

    let element: Element | null;
    if (cached && now - cached.timestamp < CACHE_DURATION) {
      element = cached.element;
    } else {
      element = document.elementFromPoint(mousePosition.x, mousePosition.y);
      elementCache.set(cacheKey, { element, timestamp: now });

      // Simple cache cleanup - only when cache gets too large
      if (elementCache.size > 50) {
        const entries = Array.from(elementCache.entries());
        entries.slice(0, 25).forEach(([key]) => elementCache.delete(key));
      }
    }

    if (!element) {
      setIsOverText(false);
      setHeaderLinkRect(null);
      setGenericHoverRect(null);
      setGenericBorderRadius(15);
      setIsOverSubcursor(false);
      setIsSubcursorOverText(false);
      setSubcursorGenericRect(null);
      setSubcursorGenericBorderRadius(15);
      return;
    }

    // Ultra-fast DOM queries with early returns
    const textElement = element.closest("[data-text-cursor]");
    const subcursorElement = element.closest("[data-cursor-subcursor]");
    const subcursorGenericElement = element.closest("[data-subcursor-generic]");
    const headerLink = element.closest("[data-header-link]");
    const genericElement = element.closest(
      "[data-cursor-generic], [data-cursor-generic-padded]"
    );
    const socialLink = element.closest("[data-tooltip-hover]");

    // Optimized subcursor detection
    const isOverSubcursorNew = !!subcursorElement;

    // Only update state if it actually changed
    if (isOverSubcursorNew !== isOverSubcursor) {
      setIsOverSubcursor(isOverSubcursorNew);
    }

    // Update text states
    const shouldBeTextMode = !!textElement;
    const isSubcursorOverTextNew = !!textElement;

    if (shouldBeTextMode !== isOverText) {
      setIsOverText(shouldBeTextMode);
    }
    if (isSubcursorOverTextNew !== isSubcursorOverText) {
      setIsSubcursorOverText(isSubcursorOverTextNew);
    }

    // Handle subcursor generic hover elements
    if (subcursorGenericElement instanceof HTMLElement) {
      const rect = subcursorGenericElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(subcursorGenericElement);
      const borderRadius = computedStyle.borderRadius;
      const radiusValue = parseFloat(borderRadius.split(" ")[0]);

      setSubcursorGenericRect(rect);
      setSubcursorGenericBorderRadius(radiusValue || 15);
    } else {
      setSubcursorGenericRect(null);
      setSubcursorGenericBorderRadius(15);
    }

    // Handle text height calculation
    if (shouldBeTextMode && textElement instanceof HTMLElement) {
      const computedStyle = window.getComputedStyle(textElement);
      const lineHeight = computedStyle.lineHeight;
      const lineHeightValue =
        lineHeight === "normal"
          ? parseFloat(computedStyle.fontSize) * 1
          : parseFloat(lineHeight) * 1;
      const newTextHeight = (lineHeightValue || textElement.offsetHeight) + 3;
      if (newTextHeight !== textHeight) {
        setTextHeight(newTextHeight);
      }
    } else if (textHeight !== 0) {
      setTextHeight(0);
    }

    // Handle header links
    if (headerLink instanceof HTMLElement) {
      const newRect = headerLink.getBoundingClientRect();
      // Only update if significantly different (reasonable threshold)
      if (
        !headerLinkRect ||
        Math.abs(newRect.width - headerLinkRect.width) > 2 ||
        Math.abs(newRect.height - headerLinkRect.height) > 2 ||
        Math.abs(newRect.left - headerLinkRect.left) > 2 ||
        Math.abs(newRect.top - headerLinkRect.top) > 2
      ) {
        setHeaderLinkRect(newRect);
      }
    } else if (headerLinkRect) {
      setHeaderLinkRect(null);
    }

    // Handle generic hover elements with optimized calculations
    if (genericElement instanceof HTMLElement) {
      const rect = genericElement.getBoundingClientRect();

      // Parse padding configuration (memoized)
      let padding = { top: 0, right: 0, bottom: 0, left: 0 };
      if (genericElement.hasAttribute("data-cursor-generic-padded")) {
        const paddingConfig = genericElement.getAttribute(
          "data-cursor-generic-padded"
        );
        if (!paddingConfig) {
          padding = { top: 10, right: 10, bottom: 10, left: 10 };
        } else {
          try {
            if (paddingConfig.startsWith("{")) {
              const parsedPadding = JSON.parse(paddingConfig);
              padding = {
                top: parsedPadding.top ?? 0,
                right: parsedPadding.right ?? 0,
                bottom: parsedPadding.bottom ?? 0,
                left: parsedPadding.left ?? 0,
              };
            } else {
              const value = parseInt(paddingConfig, 10) || 10;
              padding = {
                top: value,
                right: value,
                bottom: value,
                left: value,
              };
            }
          } catch (e) {
            padding = { top: 10, right: 10, bottom: 10, left: 10 };
          }
        }
      }

      const newRect = {
        ...rect,
        width: rect.width + padding.left + padding.right,
        height: rect.height + padding.top + padding.bottom,
        left: rect.left - padding.left,
        top: rect.top - padding.top,
      };

      // Only update if significantly different (reasonable threshold)
      if (
        !genericHoverRect ||
        Math.abs(newRect.width - genericHoverRect.width) > 2 ||
        Math.abs(newRect.height - genericHoverRect.height) > 2 ||
        Math.abs(newRect.left - genericHoverRect.left) > 2 ||
        Math.abs(newRect.top - genericHoverRect.top) > 2
      ) {
        setGenericHoverRect(newRect);
      }

      const computedStyle = window.getComputedStyle(genericElement);
      const borderRadius = computedStyle.borderRadius;
      const radiusValue = parseFloat(borderRadius.split(" ")[0]);
      const newBorderRadius = radiusValue || 15;
      if (newBorderRadius !== genericBorderRadius) {
        setGenericBorderRadius(newBorderRadius);
      }
    } else if (genericHoverRect) {
      setGenericHoverRect(null);
      setGenericBorderRadius(15);
    }

    // Handle hover tooltips
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
        if (tempSpanRef.current && name) {
          tempSpanRef.current.textContent = name;
          document.body.appendChild(tempSpanRef.current);
          const newTextWidth = tempSpanRef.current.offsetWidth;
          document.body.removeChild(tempSpanRef.current);
          if (newTextWidth !== textWidth) {
            setTextWidth(newTextWidth);
          }
        }
      }
    } else if (hoveredTooltip !== null) {
      setHoveredTooltip(null);
      setTextWidth(0);
    }
  }, [
    mousePosition.x,
    mousePosition.y,
    hoveredTooltip,
    isOverSubcursor,
    isOverText,
    isSubcursorOverText,
    textHeight,
    headerLinkRect,
    genericHoverRect,
    genericBorderRadius,
    textWidth,
  ]);

  // Use efficient debouncing for optimal performance
  const debouncedDetectElements = useDebounce(detectElements, 8); // ~120fps

  // Update the effect to use the debounced function
  useEffect(() => {
    debouncedDetectElements();
  }, [debouncedDetectElements]);

  // Add mouse position and clickable state handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
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

    const handleScroll = () => {
      // Re-detect elements at current mouse position when scrolling
      detectElements();
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

    // Add scroll event listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });

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
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scale, subcursorScale, isOverSubcursor, detectElements]);

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
            stiffness: 200,
            damping: 20,
            mass: 0.6,
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
            duration: 0.25,
            ease: "easeInOut",
            borderRadius: { duration: 0.2, ease: "easeOut" },
            ...((headerLinkRect || genericHoverRect) && {
              type: "spring",
              stiffness: 200,
              damping: 20,
              mass: 0.6,
            }),
          }}
        >
          {/* <GlowEffect
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
          /> */}
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
            left: subcursorX,
            top: subcursorY,
            scale: subcursorScale,
          }}
          variants={cursorVariants}
          initial="subcursor"
          animate={getSubcursorVariant()}
          transition={{
            duration: 0.2,
            ease: "easeOut",
            borderRadius: { duration: 0.2, ease: "easeOut" },
            ...(subcursorGenericRect && {
              type: "spring",
              stiffness: 200,
              damping: 20,
              mass: 0.6,
            }),
          }}
        />
      )}
    </>
  );
};

export default CustomCursor;
