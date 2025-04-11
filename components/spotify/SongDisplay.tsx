import SpotifyImageDisplay from "./SpotifyImageDisplay";
import ScrollingText from "../ScrollingText";

type SongDisplayProps = {
  title: string;
  songUrl: string;
  albumImageUrl: string;
  artists: { name: string; url: string }[];
  size?: "small" | "medium" | "large";
  maxWidth?: number;
  pauseDuration?: number;
};

export default function SongDisplay({
  title,
  songUrl,
  albumImageUrl,
  artists,
  size = "medium",
  maxWidth = 150,
  pauseDuration = 1,
}: SongDisplayProps) {
  const artistList = artists.map((artist, index) => (
    <span key={artist.url}>
      <a
        href={artist.url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline text-xs md:text-sm xl:text-base"
      >
        {artist.name}
      </a>
      {index < artists.length - 1 && ", "}
    </span>
  ));

  return (
    <div className="flex items-center space-x-4">
      <SpotifyImageDisplay
        href={songUrl}
        imgUrl={albumImageUrl}
        alt={title}
        size={size}
      />
      <div className="flex flex-col">
        <ScrollingText
          maxWidth={maxWidth}
          pauseDuration={pauseDuration}
          className="font-bold hover:underline text-left text-sm md:text-base xl:text-lg"
        >
          <a
            href={songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline text-left text-sm md:text-base xl:text-lg"
          >
            {title}
          </a>
        </ScrollingText>
        <div
          className="text-sm text-muted text-left overflow-hidden whitespace-nowrap relative"
          style={{ maxWidth }}
        >
          <ScrollingText
            maxWidth={maxWidth}
            pauseDuration={pauseDuration}
            className="text-xs md:text-sm xl:text-base"
          >
            {artistList}
          </ScrollingText>
        </div>
      </div>
    </div>
  );
}
