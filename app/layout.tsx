import type { Metadata } from "next";
import { Quicksand, Outfit, Public_Sans, IBM_Plex_Mono, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider }      from "@/context/CartContext";
import SessionProvider       from "@/components/SessionProvider";
import ConditionalLayout     from "@/components/ConditionalLayout";
import PageTracker           from "@/components/PageTracker";
import NotificationPrompt   from "@/components/NotificationPrompt";
import CookieConsent         from "@/components/CookieConsent";
import Analytics             from "@/components/Analytics";
import WhatsAppButton        from "@/components/WhatsAppButton";
import { SpeedInsights }     from "@vercel/speed-insights/next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { Toaster }           from "sonner";

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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/GeneralSans-Bold.woff2",     weight: "700", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Fluno — Care in Every Drop", template: "%s | Fluno" },
  description:
    "Fluno is a mid-premium personal care and hygiene brand from India. Clean ingredients, dermatologist-tested, repeat-worthy results.",
  metadataBase: new URL("https://myfluno.com"),
  openGraph: { siteName: "Fluno", type: "website", locale: "en_IN" },
  twitter:    { card: "summary_large_image" },
  keywords:   ["fluno", "myfluno", "personal care", "hand wash", "sunscreen", "india", "clean beauty", "hygiene", "SPF 50"],
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${outfit.variable} ${publicSans.variable} ${ibmPlexMono.variable} ${inter.variable} ${generalSans.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Fluno",
              legalName: "Parvar Enterprises",
              url: "https://myfluno.com",
              logo: "https://myfluno.com/icon",
              description: "Mid-premium personal care and hygiene brand from India.",
              sameAs: ["https://instagram.com/myfluno", "https://threads.net/@myfluno"],
              contactPoint: {
                "@type": "ContactPoint",
                email: "contact@myfluno.com",
                contactType: "customer service",
                areaServed: "IN",
              },
            }),
          }}
        />
        <SessionProvider>
          <CartProvider>
            <PageTracker />
            <SpeedInsights />
            <VercelAnalytics />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "#1A0A2E",
                  color: "#fff",
                  border: "1px solid rgba(189,126,250,0.3)",
                },
              }}
            />
            <NotificationPrompt />
            <CookieConsent />
            <Analytics />
            <WhatsAppButton />
            <ConditionalLayout>{children}</ConditionalLayout>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
