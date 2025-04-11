import SpotifyImageDisplay from "./SpotifyImageDisplay";
import ScrollingText from "../ScrollingText";

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
    <div className="flex items-center space-x-4">
      <SpotifyImageDisplay href={url} imgUrl={imageUrl} alt={name} />
      <ScrollingText maxWidth={maxWidth}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-bold hover:underline text-left"
        >
          {name}
        </a>
      </ScrollingText>
    </div>
  );
}
