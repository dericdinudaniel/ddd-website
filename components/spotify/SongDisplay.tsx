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
  addedAt?: string;
};

export default function SongDisplay({
  title,
  songUrl,
  albumImageUrl,
  artists,
  size = "medium",
  maxWidth = 150,
  pauseDuration = 1,
  addedAt,
}: SongDisplayProps) {
  // Ensure artists is an array and filter out invalid artists
  const validArtists = (artists || []).filter(
    (artist) => artist && artist.name
  );

  const artistList =
    validArtists.length > 0 ? (
      validArtists.map((artist, index) => (
        <span key={`${artist.url || index}-${artist.name}`}>
          <Link
            href={artist.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs md:text-sm xl:text-base underline-fade"
          >
            {artist.name}
          </Link>
          {index < validArtists.length - 1 && ", "}
        </span>
      ))
    ) : (
      <span>Unknown Artist</span>
    );

  // Format the added date
  const formatAddedDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return null;
    }
  };

  const formattedDate = formatAddedDate(addedAt);

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
        {formattedDate && (
          <div className="text-xs text-muted text-left mt-0.5">
            <span data-text-cursor>Added: {formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
