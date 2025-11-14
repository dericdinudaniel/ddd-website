import useSWR from "swr";
import {
  fallbackNowPlaying,
  fallbackTracks,
  fallbackArtists,
} from "@/lib/spotify-fallback";

type SpotifyTrack = {
  title: string;
  songUrl: string;
  albumImageUrl: string;
  artists: Array<{
    name: string;
    url: string;
  }>;
};

export type PlaylistTrack = {
  title: string;
  songUrl: string;
  albumImageUrl: string;
  album?: string;
  artists: Array<{
    name: string;
    url: string;
  }>;
  duration?: number;
  addedAt?: string;
};

type SpotifyArtist = {
  name: string;
  imageUrl: string;
  artistUrl: string;
};

type NowPlaying = {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
};

const fetcher = async (url: string) => {
  try {
    const res = await fetch(url);
    const data = await res.json().catch(() => {
      // If response is not JSON, return null
      return null;
    });

    if (!res.ok) {
      // If we have error data, use it; otherwise use status text
      const errorMessage =
        data?.error || res.statusText || `HTTP error! status: ${res.status}`;
      throw new Error(errorMessage);
    }

    // If data is null or invalid, throw an error
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response data");
    }

    return data;
  } catch (error: any) {
    // Re-throw error so SWR can handle it properly
    console.error("Fetcher error:", error);
    throw error;
  }
};

export const useNowPlaying = () => {
  const { data, error, isLoading } = useSWR<NowPlaying>(
    "/api/spotify/now-playing",
    fetcher,
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );
  return {
    data: data || fallbackNowPlaying,
    isLoading,
    isError: error,
  };
};

export const useTopTracks = () => {
  const { data, error, isLoading } = useSWR<SpotifyTrack[]>(
    "/api/spotify/top-tracks",
    fetcher,
    {
      refreshInterval: 86400000, // 24 hours (1 day)
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 86400000,
    }
  );
  return {
    data: data || fallbackTracks,
    isLoading,
    isError: error,
  };
};

export const useTopArtists = () => {
  const { data, error, isLoading } = useSWR<SpotifyArtist[]>(
    "/api/spotify/top-artists",
    fetcher,
    {
      refreshInterval: 86400000, // 24 hours (1 day)
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 86400000,
    }
  );
  return {
    data: data || fallbackArtists,
    isLoading,
    isError: error,
  };
};

const playlistFetcher = async (url: string) => {
  const startTime = performance.now();
  try {
    const result = await fetcher(url);
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(
      `[usePlaylistSearch] Spotify API call took ${duration.toFixed(2)}ms`
    );
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(
      `[usePlaylistSearch] Spotify API call failed after ${duration.toFixed(
        2
      )}ms`
    );
    throw error;
  }
};

export const usePlaylistSearch = (searchQuery: string = "") => {
  const url = searchQuery.trim()
    ? `/api/spotify/playlist?search=${encodeURIComponent(searchQuery)}`
    : `/api/spotify/playlist`;

  const { data, error, isLoading, mutate } = useSWR<{
    tracks: PlaylistTrack[];
    total: number;
    originalTotal: number;
  }>(url, playlistFetcher, {
    refreshInterval: 0, // Don't auto-refresh, user will search manually
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    tracks: data?.tracks || [],
    total: data?.total || 0,
    originalTotal: data?.originalTotal || 0,
    isLoading,
    isError: error,
    mutate,
  };
};
