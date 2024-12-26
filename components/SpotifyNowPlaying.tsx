import useSWR from "swr";
import { useEffect } from "react";
import { animate } from "motion";

import fetcher from "@/lib/fetcher";
import { BsSpotify } from "react-icons/bs";
import Image from "next/image";
import { NowPlayingSong } from "@/lib/types";
import React from "react";

function AnimatedBars() {
  useEffect(() => {
    animate(
      "#bar1",
      {
        transform: [
          "scaleY(1.0) translateY(0rem)",
          "scaleY(1.5) translateY(-0.082rem)",
          "scaleY(1.0) translateY(0rem)",
        ],
      },
      {
        duration: 1.0,
        repeat: Infinity,
        easing: ["ease-in-out"],
      }
    );
    animate(
      "#bar2",
      {
        transform: [
          "scaleY(1.0) translateY(0rem)",
          "scaleY(3) translateY(-0.083rem)",
          "scaleY(1.0) translateY(0rem)",
        ],
      },
      {
        delay: 0.2,
        duration: 1.5,
        repeat: Infinity,
        easing: ["ease-in-out"],
      }
    );
    animate(
      "#bar3",
      {
        transform: [
          "scaleY(1.0)  translateY(0rem)",
          "scaleY(0.5) translateY(0.37rem)",
          "scaleY(1.0)  translateY(0rem)",
        ],
      },
      {
        delay: 0.3,
        duration: 1.5,
        repeat: Infinity,
        easing: ["ease-in-out"],
      }
    );
  }, []);

  return (
    <div className="w-auto flex items-end overflow-hidden">
      <span
        id="bar1"
        className="w-1 mr-[3px] h-2 bg-gray-300 dark:bg-gray-500 opacity-75"
      />
      <span
        id="bar2"
        className="w-1 mr-[3px] h-1 bg-gray-300 dark:bg-gray-500"
      />
      <span
        id="bar3"
        className="w-1 h-3 bg-gray-300 dark:bg-gray-500 opacity-80"
      />
    </div>
  );
}

export default function SpotifyNowPlaying() {
  const { data } = useSWR<NowPlayingSong>("/api/now-playing", fetcher);

  return (
    <div className="md:pb-4 pb-2">
      {data?.songUrl ? (
        <div className="flex items-center">
          <div className="flex items-center">
            <a href={data.songUrl} target="_blank">
              <Image
                src={data.albumImageUrl}
                alt="Album Art"
                className="rounded-xl"
                height={64}
                width={64}
              />
            </a>
            <div className="md:block hidden px-5">
              <AnimatedBars />
            </div>
          </div>
          <div className="flex md:flex-row flex-col md:font-medium md:pl-0 pl-3">
            <a
              className="text-gray-800 dark:text-gray-200  underline-fade"
              href={data.songUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <p className="md:font-medium line-clamp-1">{data.title}</p>
            </a>
            <p className="md:px-2 hidden md:block">{" — "}</p>
            <div className="flex items-center">
              {data?.artists?.map((artist, index, array) => (
                <React.Fragment key={artist.url}>
                  <a
                    className="text-gray-800 dark:text-gray-200"
                    href={artist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="md:text-base text-sm">
                      <span className="underline-fade">{artist.name}</span>
                      {index < array.length - 1 && (
                        <>
                          {/* hidden md:inline-block */}
                          <span className="">,&nbsp;</span>
                          {/* <span className="md:hidden">,</span> */}
                        </>
                      )}
                    </p>
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center pb-1">
          <BsSpotify size={40} />
          <p className="pl-4">Not Playing</p>
          <p className="px-2">{" — "}</p>
          <p>Spotify</p>
        </div>
      )}
    </div>
  );
}

// return (
//   <div className="flex md:flex-row  md:justify-normal justify-between items-center md:pb-4 pb-2">
//     <div className="flex items-center">
//       {data?.albumImageUrl && (
//         <Image
//           src={data.albumImageUrl}
//           alt="Album Art"
//           className="rounded-2xl md:mr-4 h-16 w-16"
//           height={64}
//           width={64}
//         />
//       )}
//       {data?.songUrl ? (
//         <div className="md:block hidden">
//           <AnimatedBars />
//         </div>
//       ) : (
//         <BsSpotify size={40} />
//       )}
//     </div>
//     <div className="flex md:flex-row flex-col md:pl-4">
//       {data?.songUrl ? (
//         <a
//           className="text-gray-800 dark:text-gray-200  underline-fade"
//           href={data.songUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <p className="font-medium">{data.title}</p>
//         </a>
//       ) : (
//         <p>Not playing</p>
//       )}
//       <p className="md:px-2 hidden md:block">{" — "}</p>

//       {data?.artists ? (
//         <div className="flex items-center sm:flex-row">
//           {data?.artists?.map((artist, index, array) => (
//             <React.Fragment key={artist.url}>
//               <a
//                 className="text-gray-800 dark:text-gray-200 underline-fade"
//                 href={artist.url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <p className="md:pl-1 max-w-max md:text-base text-sm">
//                   {artist.name}
//                   {index < array.length - 1 && (
//                     <>
//                       <span className="hidden md:inline-block">,&nbsp;</span>
//                       <span className="md:hidden">,</span>
//                     </>
//                   )}
//                 </p>
//               </a>
//             </React.Fragment>
//           ))}
//         </div>
//       ) : (
//         <p>Spotify</p>
//       )}
//     </div>
//   </div>
// );

// <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-slate-900 dark:group-hover:border-slate-100 transition duration-[400ms] pointer-events-none"></div>
