import SpotifyImageDisplay from "./SpotifyImageDisplay";
import ScrollingText from "../ScrollingText";
import Link from "next/link";

type ArtistDisplayProps = {
  name: string;
  url: string;
  imageUrl: string;
  maxWidth?: number;
};

export default function ArtistDisplay({
  name,
  url,
  imageUrl,
  maxWidth = 200,
}: ArtistDisplayProps) {
  return (
    <div
      className="flex items-center space-x-4"
      data-cursor-generic-padded='{"top": 3, "right": 8, "bottom": 3, "left": 8}'
      data-cursor-subcursor
    >
      <SpotifyImageDisplay href={url} imgUrl={imageUrl} alt={name} />
      <ScrollingText maxWidth={maxWidth}>
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold underline-fade text-left"
          data-text-cursor
        >
          {name}
        </Link>
      </ScrollingText>
    </div>
  );
}
