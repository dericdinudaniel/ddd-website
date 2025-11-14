"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePlaylistSearch } from "@/lib/hooks/useSpotify";
import PlaylistSearch from "@/components/spotify/PlaylistSearch";

function PlaylistPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize from URL query parameters on mount and when URL changes
  useEffect(() => {
    const query = searchParams.get("q") || "";
    // Update search query from URL
    setSearchQuery(query);
    setInputValue(query);
  }, [searchParams]);

  const { tracks, total, originalTotal, isLoading, isError } =
    usePlaylistSearch(searchQuery);

  // When searchQuery changes, update URL and SWR automatically cancels previous requests
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    // Reset page when searching
    params.delete("page");
    const newUrl = params.toString() ? `?${params.toString()}` : "/playlist";
    router.push(newUrl, { scroll: false });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    const newUrl = params.toString() ? `?${params.toString()}` : "/playlist";
    router.push(newUrl, { scroll: false });
  };

  // Get initial page from URL
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  return (
    <section className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start pt-24 px-4 sm:px-6 md:px-8 pb-20">
      <h1
        className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-header tracking-[.1rem] mb-8"
        data-text-cursor
      >
        Search the &quot;Deric&quot; Playlist
      </h1>

      <PlaylistSearch
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        tracks={tracks}
        total={total}
        originalTotal={originalTotal}
        isLoading={isLoading}
        isError={isError}
        initialPage={initialPage}
        onPageChange={handlePageChange}
      />
      <div className="h-10 block" />
    </section>
  );
}

export default function PlaylistPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start pt-24 px-4 sm:px-6 md:px-8 pb-20">
          <h1
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-header tracking-[.1rem] mb-8"
            data-text-cursor
          >
            Search the &quot;Deric&quot; Playlist
          </h1>
          <div>Loading...</div>
        </section>
      }
    >
      <PlaylistPageContent />
    </Suspense>
  );
}
