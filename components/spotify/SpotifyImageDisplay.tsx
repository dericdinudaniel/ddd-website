import Image from "next/image";
import Link from "next/link";

type SpotifyImageDisplayProps = {
  href: string;
  imgUrl: string;
  alt: string;
  size?: "small" | "medium" | "large";
};

export const sizeClasses = {
  small:
    "min-h-9 min-w-9 max-h-9 max-w-9 lg:min-h-12 lg:min-w-12 lg:max-h-12 lg:max-w-12",
  medium:
    "min-h-12 min-w-12 max-h-12 max-w-12 lg:min-h-14 lg:min-w-14 lg:max-h-14 lg:max-w-14",
  large:
    "min-h-18 min-w-18 max-h-18 max-w-18 lg:min-h-20 lg:min-w-20 lg:max-h-20 lg:max-w-20",
};

export default function SpotifyImageDisplay({
  href,
  imgUrl,
  alt = "Spotify Image",
  size = "medium",
}: SpotifyImageDisplayProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:scale-95 transition-transform duration-200"
    >
      <Image
        src={imgUrl}
        alt={alt}
        width={640}
        height={640}
        className={`${sizeClasses[size]} rounded object-cover select-none`}
      />
    </Link>
  );
}
