import React from "react";

const SmallTextPills = ({
  pills,
  className = "",
  centered = false,
  subcursor = false,
}: {
  pills: string[];
  className?: string;
  centered?: boolean;
  subcursor?: boolean;
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
            <React.Fragment key={idx}>
              {!subcursor ? (
                <span
                  data-cursor-generic
                  className="bg-primary/10 text-primary text-2xs sm:text-xs font-medium px-2 py-1 rounded-full border border-primary/20"
                >
                  {tag}
                </span>
              ) : (
                <span
                  data-subcursor-generic
                  className="bg-primary/10 text-primary text-2xs sm:text-xs font-medium px-2 py-1 rounded-full border border-primary/20"
                >
                  {tag}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmallTextPills;
