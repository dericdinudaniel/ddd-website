import React from "react";

const SmallTextPills = ({
  pills,
  className = "",
}: {
  pills: string[];
  className?: string;
}) => {
  return (
    <div className={className}>
      {pills && pills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {pills.map((tag, idx) => (
            <span
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
