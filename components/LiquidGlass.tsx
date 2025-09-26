import React from "react";

// https://www.tonnitools.com/liquid-glass/

type LiquidGlassProps = {
  children: React.ReactNode;
  className?: string;
  vars?: {
    cornerRadius?: string | number;
    baseStrength?: string | number;
    extraBlur?: string | number;
    softness?: string | number;
    tintAmount?: string | number;
    tintSaturation?: string | number;
    tintHue?: string | number;
    contrast?: string | number;
    brightness?: string | number;
    invert?: string | number;
  };
  variant?: "full" | "lite";
};

const LiquidGlass = ({
  children,
  className = "",
  vars = {},
  variant = "lite",
}: LiquidGlassProps) => {
  const addUnit = (value: string | number | undefined, unit: string) => {
    if (value === undefined) return undefined;
    if (typeof value === "number") return `${value}${unit}`;
    return value;
  };

  // return <div>{children}</div>;

  const styleVars = {
    ...(vars.cornerRadius !== undefined && {
      ["--corner-radius"]: addUnit(vars.cornerRadius, "px"),
    }),
    ...(vars.baseStrength !== undefined && {
      ["--base-strength"]: addUnit(vars.baseStrength, "px"),
    }),
    ...(vars.extraBlur !== undefined && {
      ["--extra-blur"]: addUnit(vars.extraBlur, "px"),
    }),
    ...(vars.softness !== undefined && {
      ["--softness"]: addUnit(vars.softness, "px"),
    }),
    ...(vars.tintAmount !== undefined && {
      ["--tint-amount"]: vars.tintAmount,
    }),
    ...(vars.tintSaturation !== undefined && {
      ["--tint-saturation"]: vars.tintSaturation,
    }),
    ...(vars.tintHue !== undefined && {
      ["--tint-hue"]: addUnit(vars.tintHue, "deg"),
    }),
    ...(vars.contrast !== undefined && { ["--contrast"]: vars.contrast }),
    ...(vars.brightness !== undefined && { ["--brightness"]: vars.brightness }),
    ...(vars.invert !== undefined && {
      ["--invert"]: addUnit(vars.invert, "%"),
    }),
  } as unknown as React.CSSProperties;

  return (
    <div
      className={`GlassContainer shadow-[0px_0px_20px_var(--shadow)] ${className}`}
      style={styleVars}
    >
      <div className="GlassContent">{children}</div>
      <div className="GlassMaterial">
        {variant === "full" && <div className="GlassEdgeReflection"></div>}
        {variant === "full" && <div className="GlassEmbossReflection"></div>}
        {variant === "full" && <div className="GlassRefraction"></div>}
        {variant === "lite" && <div className="GlassBlur"></div>}
        {variant === "lite" && <div className="BlendLayers"></div>}
        {variant === "lite" && <div className="BlendEdge"></div>}
        {variant === "full" && <div className="Highlight"></div>}
      </div>
    </div>
  );
};

export default LiquidGlass;
