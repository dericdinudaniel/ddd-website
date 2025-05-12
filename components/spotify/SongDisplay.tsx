import SpotifyImageDisplay from "./SpotifyImageDisplay";
import ScrollingText from "../ScrollingText";
import Link from "next/link";

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
      <Link
        href={artist.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs md:text-sm xl:text-base underline-fade"
      >
        {artist.name}
      </Link>
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
          enableUnderlineFade={true}
          className="font-bold text-left text-sm md:text-base xl:text-lg"
        >
          <Link
            href={songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-left text-sm md:text-base xl:text-lg"
            data-text-cursor
          >
            {title}
          </Link>
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
            <p data-text-cursor>{artistList}</p>
          </ScrollingText>
        </div>
      </div>
    </div>
  );
}
