// artists is an array of {name, url}

export type NowPlayingSong = {
  album: string;
  albumImageUrl: string;
  artists: { name: string; url: string }[];
  isPlaying: boolean;
  songUrl: string;
  title: string;
};
