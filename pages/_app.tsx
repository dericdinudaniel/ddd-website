import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Inter, JetBrains_Mono } from "next/font/google";

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
        <Component {...pageProps} />
      </ThemeProvider>
    </main>
  );
}
