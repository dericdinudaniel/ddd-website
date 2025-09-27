import { useBrowserInfo } from "@/lib/hooks/useBrowserInfo";
import React, { useEffect, useState } from "react";

// https://www.tonnitools.com/liquid-glass/

type LiquidGlassProps = {
  children: React.ReactNode;
  className?: string;
  roundness?: number; // in pixels
};

const LiquidGlass = ({
  children,
  className = "",
  roundness = 24,
}: LiquidGlassProps) => {
  const [isClient, setIsClient] = useState(false);
  const browserInfo = useBrowserInfo();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addUnit = (value: string | number | undefined, unit: string) => {
    if (value === undefined) return undefined;
    if (typeof value === "number") return `${value}${unit}`;
    return value;
  };

  if (!isClient || browserInfo.isMobile || browserInfo.browser != "chrome") {
    return (
      <div
        className={`relative shadow-[0px_0px_10px_var(--shadow)] ${className}`}
        style={{ borderRadius: `${roundness}px` }}
      >
        {/* Glass material with backdrop blur */}
        <div
          className="absolute inset-0 backdrop-blur-[3px] bg-white/10 dark:bg-white/10"
          style={{ borderRadius: `${roundness}px` }}
        />
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  // chrome desktop
  return (
    <div
      className={`GlassContainer shadow-[0px_0px_20px_var(--shadow)] ${className}`}
      style={
        {
          borderRadius: `${roundness}px`,
          "--corner-radius": `${roundness}px`,
        } as React.CSSProperties
      }
    >
      <div className="GlassContent ">{children}</div>
      <div className="GlassMaterial" style={{ borderRadius: `${roundness}px` }}>
        {/* <div className="GlassEdgeReflection"></div> */}
        <div className="GlassEmbossReflection"></div>
        {/* <div className="GlassRefraction"></div> */}
        <div className="backdrop-blur-[3px]"></div>
        {/* <Zdiv className="GlassBlur"></Zdiv> */}
        <div className="BlendLayers"></div>
        <div className="BlendEdge"></div>
        <div className="Highlight"></div>
      </div>
    </div>
  );
};

export default LiquidGlass;
