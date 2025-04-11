import React from "react";

export const SkeletonSongDisplay = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-300 animate-pulse rounded-md"></div>
      <div className="flex flex-col space-y-2">
        <div className="w-32 h-5 bg-gray-300 animate-pulse rounded-md"></div>
        <div className="w-24 h-3 bg-gray-300 animate-pulse rounded-md"></div>
      </div>
    </div>
  );
};

export const SkeletonArtistDisplay = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-300 animate-pulse rounded-md"></div>
      <div className="flex flex-col space-y-2">
        <div className="w-32 h-5 bg-gray-300 animate-pulse rounded-md"></div>
      </div>
    </div>
  );
};
