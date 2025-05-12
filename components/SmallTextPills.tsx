import React from "react";

const SmallTextPills = ({
  pills,
  className = "",
  centered = false,
}: {
  pills: string[];
  className?: string;
  centered?: boolean;
}) => {
  return (
    <div className={className}>
      {pills && pills.length > 0 && (
        <div
          className={`flex flex-wrap gap-1.5 mt-auto pt-2 ${
            centered ? "justify-center" : ""
          }`}
        >
          {pills.map((tag, idx) => (
            <span
              data-cursor-generic
              key={idx}
              className="bg-primary/10 text-primary text-2xs sm:text-xs font-medium px-2 py-1 rounded-full border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmallTextPills;
