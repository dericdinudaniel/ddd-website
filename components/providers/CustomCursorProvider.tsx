"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";

interface CustomCursorContextType {
  isCursorVisible: boolean;
  customCursorNoneTW: string;
  sectionRef: React.RefObject<HTMLDivElement | null>;
}

const CustomCursorContext = createContext<CustomCursorContextType | undefined>(
  undefined
);

// Debounce utility with cancel function
interface DebouncedFunction<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): DebouncedFunction<T> => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const debouncedFn = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };

  debouncedFn.cancel = () => {
    clearTimeout(timeoutId);
  };

  return debouncedFn;
};

// Throttle utility using requestAnimationFrame
const throttleRAF = <T extends (e: MouseEvent) => void>(func: T): T => {
  let ticking = false;
  return ((e: MouseEvent) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        func(e);
        ticking = false;
      });
      ticking = true;
    }
  }) as T;
};

export function CustomCursorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [s1VisibleDesktop, setS1VisibleDesktop] = useState(false);
  const [isInSection, setIsInSection] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  // Memoize device check function with debounce
  const checkDevice = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
    setS1VisibleDesktop(!isMobileDevice);
  }, []);

  const debouncedCheckDevice = useMemo(
    () => debounce(checkDevice, 100),
    [checkDevice]
  );

  // Memoize mouse move handler with RAF throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    lastMousePosition.current = { x: e.clientX, y: e.clientY };

    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      // Only update state if the value actually changed
      setIsInSection((prev) => {
        if (prev !== isInside) {
          return isInside;
        }
        return prev;
      });
    }
  }, []);

  const throttledHandleMouseMove = useMemo(
    () => throttleRAF((e: MouseEvent) => handleMouseMove(e)),
    [handleMouseMove]
  );

  // Device check effect with cleanup
  useEffect(() => {
    checkDevice();
    window.addEventListener("resize", debouncedCheckDevice, { passive: true });
    return () => {
      window.removeEventListener("resize", debouncedCheckDevice);
      debouncedCheckDevice.cancel();
    };
  }, [checkDevice, debouncedCheckDevice]);

  // Mouse move effect with cleanup
  useEffect(() => {
    window.addEventListener("mousemove", throttledHandleMouseMove, {
      passive: true,
    });
    return () =>
      window.removeEventListener("mousemove", throttledHandleMouseMove);
  }, [throttledHandleMouseMove]);

  // Reset section state when pathname changes
  useEffect(() => {
    setIsInSection(false);
  }, [pathname]);

  // Memoize derived values with stable references
  const isCursorVisible = useMemo(
    () => s1VisibleDesktop && isInSection,
    [s1VisibleDesktop, isInSection]
  );

  const customCursorNoneTW = useMemo(
    () => (isCursorVisible ? "cursor-none" : ""),
    [isCursorVisible]
  );

  // Memoize context value with stable references
  const contextValue = useMemo(
    () => ({
      isCursorVisible,
      customCursorNoneTW,
      sectionRef,
    }),
    [isCursorVisible, customCursorNoneTW]
  );

  return (
    <CustomCursorContext.Provider value={contextValue}>
      {children}
    </CustomCursorContext.Provider>
  );
}

// Memoize the hook to prevent unnecessary re-renders
export const useCustomCursor = (() => {
  const context = useContext(CustomCursorContext);
  if (context === undefined) {
    throw new Error(
      "useCustomCursor must be used within a CustomCursorProvider"
    );
  }
  return context;
}) as () => CustomCursorContextType;
