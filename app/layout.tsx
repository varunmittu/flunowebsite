import type { Metadata } from "next";
import { Quicksand, Outfit, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider }      from "@/context/CartContext";
import SessionProvider       from "@/components/SessionProvider";
import ConditionalLayout     from "@/components/ConditionalLayout";
import PageTracker           from "@/components/PageTracker";
import { SpeedInsights }     from "@vercel/speed-insights/next";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: { default: "Fluno — Care in Every Drop", template: "%s | Fluno" },
  description:
    "Fluno is a mid-premium personal care and hygiene brand from Hyderabad, India. Clean ingredients, dermatologist-tested, repeat-worthy results.",
  metadataBase: new URL("https://myfluno.com"),
  openGraph: { siteName: "Fluno", type: "website", locale: "en_IN" },
  twitter:    { card: "summary_large_image" },
  keywords:   ["fluno", "personal care", "hand wash", "sunscreen", "hyderabad", "clean beauty", "hygiene", "SPF 50"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${outfit.variable} ${publicSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <SessionProvider>
          <CartProvider>
            <PageTracker />
            <SpeedInsights />
            <ConditionalLayout>{children}</ConditionalLayout>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
