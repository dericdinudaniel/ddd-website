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
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch {
    return null;
  }
};

export const useNowPlaying = () => {
  const { data, error, isLoading } = useSWR<NowPlaying>(
    "/api/spotify/now-playing",
    fetcher
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
    fetcher
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
    fetcher
  );
  return {
    data: data || fallbackArtists,
    isLoading,
    isError: error,
  };
};
