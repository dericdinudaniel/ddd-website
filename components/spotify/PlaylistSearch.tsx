/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import SongDisplay from "./SongDisplay";
import { SkeletonSongDisplay } from "./Skeletons";
// import { SlideFadeIn } from "../SlideFadeIn";
import { Search, X } from "lucide-react";
import { BsSpotify } from "react-icons/bs";
import { PlaylistTrack } from "@/lib/hooks/useSpotify";
import Link from "next/link";

type PlaylistSearchProps = {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  tracks: PlaylistTrack[];
  total: number;
  originalTotal: number;
  isLoading: boolean;
  isError: boolean;
  initialPage?: number;
  onPageChange?: (page: number) => void;
};

const RESULTS_PER_PAGE = 50;
const IMAGE_TEXT_GAP = 16; // space-x-4 = 16px gap between image and text in SongDisplay

export default function PlaylistSearch({
  inputValue,
  onInputChange,
  onSearch,
  searchQuery,
  tracks,
  total,
  originalTotal,
  isLoading,
  isError,
  initialPage = 1,
  onPageChange,
}: PlaylistSearchProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageInput, setPageInput] = useState(initialPage.toString());
  const [maxWidth, setMaxWidth] = useState(200);
  const songDisplayContainerRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);

  // Update current page when initialPage changes (from URL)
  // This ensures the page is always in sync with the URL
  useEffect(() => {
    if (initialPage >= 1) {
      setCurrentPage(initialPage);
      setPageInput(initialPage.toString());
    }
  }, [initialPage]);

  // Update page input when current page changes
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Paginate tracks
  const paginatedTracks = useMemo(() => {
    const start = (currentPage - 1) * RESULTS_PER_PAGE;
    const end = start + RESULTS_PER_PAGE;
    return tracks.slice(start, end);
  }, [tracks, currentPage]);

  // Calculate maxWidth based on available width for text content
  useEffect(() => {
    const updateMaxWidth = () => {
      if (songDisplayContainerRef.current) {
        // Measure the flex-1 container that holds SongDisplay
        const songDisplayContainerWidth =
          songDisplayContainerRef.current.offsetWidth;

        // Find the SongDisplay root div (first direct child div)
        const songDisplayDiv = songDisplayContainerRef.current
          .firstElementChild as HTMLElement;

        if (songDisplayDiv) {
          // Find the image element inside SongDisplay to measure its actual width
          const imageElement = songDisplayDiv.querySelector("img");
          const imageWidth = imageElement
            ? imageElement.offsetWidth
            : window.innerWidth >= 1024
            ? 56
            : 48;

          // Calculate available width for text: container width - (image + gap)
          const calculatedWidth =
            songDisplayContainerWidth - imageWidth - IMAGE_TEXT_GAP;

          setMaxWidth(Math.max(100, calculatedWidth));
        }
      }
    };

    // Initial calculation with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateMaxWidth, 0);

    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
      updateMaxWidth();
    });
    if (songDisplayContainerRef.current) {
      resizeObserver.observe(songDisplayContainerRef.current);
    }
    if (durationRef.current) {
      resizeObserver.observe(durationRef.current);
    }

    // Also listen to window resize
    window.addEventListener("resize", updateMaxWidth);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMaxWidth);
    };
  }, [paginatedTracks]); // Recalculate when tracks change

  const totalPages = Math.ceil(total / RESULTS_PER_PAGE);

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };

  // Handle Enter key press to trigger search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(inputValue.trim());
    }
  };

  // Clear search
  const handleClear = () => {
    onInputChange("");
    onSearch("");
  };

  // Handle page input change
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setPageInput(value);
    }
  };

  // Handle page change
  const handlePageChangeInternal = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageInput(page.toString());
      // Call onPageChange callback if provided (to update URL)
      if (onPageChange) {
        onPageChange(page);
      }
    }
  };

  // Handle page input Enter key or blur
  const handlePageInputSubmit = () => {
    if (pageInput === "") {
      setPageInput(currentPage.toString());
      return;
    }

    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChangeInternal(pageNum);
    } else {
      // Reset to current page if invalid
      setPageInput(currentPage.toString());
    }
  };

  // Handle page input Enter key
  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePageInputSubmit();
    }
  };

  // Format duration in ms to MM:SS
  const formatDuration = (ms?: number) => {
    if (!ms) return "";
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-6xl flex flex-col items-center space-y-6">
      {/* Search Input */}
      <div className="w-full max-w-2xl relative">
        <div className="relative flex items-center border-b border-border pb-2">
          <Search className="absolute left-0 text-muted w-5 h-5" />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search by song, artist, or album... (Press Enter to search)"
            className="w-full pl-8 pr-8 py-2 bg-transparent border-0 focus:outline-none text-foreground placeholder:text-muted focus:placeholder:text-muted/50 transition-colors"
            data-text-cursor
          />
          {(inputValue || searchQuery) && (
            <button
              onClick={handleClear}
              className="absolute right-0 text-muted hover:text-foreground transition-colors"
              aria-label="Clear search"
              data-text-cursor
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {!isLoading && !isError && originalTotal > 0 && (
        <div
          className="text-sm text-muted flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center"
          data-text-cursor
        >
          <span className="text-center sm:text-left">
            {searchQuery ? (
              <>
                Showing {total} of {originalTotal.toLocaleString()} tracks
                <span className="ml-2">
                  (searching for &quot;{searchQuery}&quot;)
                </span>
              </>
            ) : (
              <>Total: {originalTotal.toLocaleString()} tracks</>
            )}
          </span>
          <span className="text-muted hidden sm:inline">•</span>
          <Link
            href="https://open.spotify.com/playlist/3Fpf3LeKFu8mrPR0XeBuM4?si=c8785639d7a641af"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            data-text-cursor
          >
            <BsSpotify className="text-base" />
            <span>Open on Spotify</span>
          </Link>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center space-y-4 py-8">
          <BsSpotify className="text-4xl text-muted" />
          <p className="text-lg text-muted" data-text-cursor>
            Failed to load playlist. Please try again later.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonSongDisplay key={index} />
          ))}
        </div>
      )}

      {/* Results */}
      {!isLoading && !isError && (
        <>
          {paginatedTracks.length === 0 ? (
            <div className="flex flex-col items-center space-y-4 py-8">
              <p className="text-lg text-muted" data-text-cursor>
                {searchQuery.trim()
                  ? "No tracks found matching your search."
                  : "No tracks in playlist."}
              </p>
            </div>
          ) : (
            <>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-y-1 sm:gap-y-2 gap-x-4">
                {paginatedTracks
                  .filter(
                    (track: any) =>
                      track &&
                      track.title &&
                      track.songUrl &&
                      Array.isArray(track.artists)
                  )
                  .map((track: any, index: number) => (
                    <div
                      key={`${track.songUrl}-${index}`}
                      // delay={0}
                      // duration={0}
                      // slideOffset={20}
                    >
                      <div
                        data-cursor-generic-padded='{"top": 3, "right": 8, "bottom": 3, "left": 8}'
                        data-cursor-subcursor
                        className="flex items-center justify-between gap-4"
                      >
                        <div
                          ref={
                            index === 0 ? songDisplayContainerRef : undefined
                          }
                          className="flex-1 min-w-0"
                        >
                          <SongDisplay
                            title={track.title || "Unknown Title"}
                            songUrl={track.songUrl || "#"}
                            albumImageUrl={track.albumImageUrl || ""}
                            artists={track.artists || []}
                            maxWidth={maxWidth}
                            addedAt={track.addedAt}
                          />
                        </div>
                        {track.duration && (
                          <div
                            ref={index === 0 ? durationRef : undefined}
                            className="text-xs text-muted whitespace-nowrap"
                          >
                            {formatDuration(track.duration)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-6 flex-wrap gap-2">
                  <button
                    onClick={() =>
                      handlePageChangeInternal(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-background border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/10 transition-colors"
                    data-text-cursor
                  >
                    Previous
                  </button>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted" data-text-cursor>
                      Page
                    </span>
                    <input
                      type="text"
                      value={pageInput}
                      onChange={handlePageInputChange}
                      onBlur={handlePageInputSubmit}
                      onKeyDown={handlePageInputKeyDown}
                      className="w-16 px-2 py-1 text-center bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                      data-text-cursor
                      aria-label="Page number"
                    />
                    <span className="text-sm text-muted" data-text-cursor>
                      of {totalPages}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handlePageChangeInternal(
                        Math.min(totalPages, currentPage + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-background border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/10 transition-colors"
                    data-text-cursor
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
