import type { Metadata } from "next";
import { Playfair_Display, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
  title: {
    default: "Fluno — Care in Every Drop",
    template: "%s | Fluno",
  },
  description:
    "Fluno is a mid-premium personal care and hygiene brand from Hyderabad, India. Clean ingredients, trustworthy formulas, repeat-worthy results.",
  metadataBase: new URL("https://myfluno.com"),
  openGraph: {
    siteName: "Fluno",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
  keywords: [
    "fluno",
    "personal care",
    "hand wash",
    "sunscreen",
    "hyderabad",
    "clean beauty",
    "hygiene",
    "SPF 50",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${publicSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <CartProvider>
          <Header />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
