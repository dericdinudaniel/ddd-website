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

export function CustomCursorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Memoize device check function with debounce
  const checkDevice = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent
      );
    setIsDesktop(!isMobileDevice);
  }, []);

  const debouncedCheckDevice = useMemo(
    () => debounce(checkDevice, 100),
    [checkDevice]
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

  // Memoize derived values with stable references
  const isCursorVisible = useMemo(() => isDesktop, [isDesktop]);

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
