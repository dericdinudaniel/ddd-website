"use client";

import { useState } from "react";

export type BrowserType =
  | "chrome"
  | "firefox"
  | "safari"
  | "edge"
  | "opera"
  | "ie"
  | "unknown";

export interface BrowserInfo {
  browser: BrowserType;
  isMobile: boolean;
}

/**
 * Simple hook to detect browser type and mobile device status
 */
export const useBrowserInfo = (): BrowserInfo => {
  const [browserInfo] = useState<BrowserInfo>(() => {
    if (typeof window === "undefined") {
      return { browser: "unknown", isMobile: false };
    }

    const ua = window.navigator.userAgent.toLowerCase();

    // Mobile detection
    const isMobile =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);

    // Browser detection
    let browser: BrowserType = "unknown";

    if (ua.includes("edg") || ua.includes("edge")) {
      browser = "edge";
    } else if (ua.includes("chrome")) {
      browser = "chrome";
    } else if (ua.includes("firefox")) {
      browser = "firefox";
    } else if (ua.includes("safari")) {
      browser = "safari";
    } else if (ua.includes("opera") || ua.includes("opr")) {
      browser = "opera";
    } else if (ua.includes("msie") || ua.includes("trident")) {
      browser = "ie";
    }

    return { browser, isMobile };
  });

  return browserInfo;
};
