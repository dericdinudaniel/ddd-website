import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const fonts = [jetbrainsMono.variable, instrumentSerif.variable];
const fontVariables = fonts.join(" ");

export const metadata: Metadata = {
  title: "Deric Dinu Daniel",
  description: "Built by Deric",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="no-scrollbar" suppressHydrationWarning>
      <body
        className={`${fontVariables} antialiased bg-background scroll-smooth`}
      >
        <ThemeProvider enableSystem={true} disableTransitionOnChange={true}>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
