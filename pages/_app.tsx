import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Inter, JetBrains_Mono } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

const jetbrains_mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains_mono",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${inter.className} ${jetbrains_mono.variable}`}>
      <ThemeProvider enableSystem={true} attribute="class">
        <LayoutWrapper>
          <Component {...pageProps} />
        </LayoutWrapper> 
      </ThemeProvider>
    </main>
  );
}

// function Apkp({ Component, pageProps }: AppProps) {
//   return (
//     <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
//       <Head>
//         <meta content="width=device-width, initial-scale=1" name="viewport" />
//       </Head>
//       <Analytics analyticsConfig={siteMetadata.analytics} />
//       <LayoutWrapper>
//         <SearchProvider searchConfig={siteMetadata.search}>
//           <Component {...pageProps} />
//         </SearchProvider>
//       </LayoutWrapper>
//     </ThemeProvider>
//   );
// }
