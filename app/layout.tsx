import type { Metadata } from "next";
import { Quicksand, Outfit, Public_Sans, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider }      from "@/context/CartContext";
import SessionProvider       from "@/components/SessionProvider";
import ConditionalLayout     from "@/components/ConditionalLayout";
import PageTracker           from "@/components/PageTracker";
import NotificationPrompt   from "@/components/NotificationPrompt";
import CookieConsent         from "@/components/CookieConsent";
import Analytics             from "@/components/Analytics";
import WhatsAppButton        from "@/components/WhatsAppButton";
import ScrollAnimator        from "@/components/ScrollAnimator";
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

export const metadata: Metadata = {
  title: { default: "Fluno — Care in Every Drop", template: "%s | Fluno" },
  description:
    "Fluno is a mid-premium personal care and hygiene brand from India. Thoughtfully formulated everyday essentials, honestly priced.",
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
      className={`${quicksand.variable} ${outfit.variable} ${publicSans.variable} ${ibmPlexMono.variable} ${inter.variable}`}
    >
      <body>
        {/* Pre-paint: hide reveal elements before first paint (no flash). The failsafe
            reveals everything ONLY if the ScrollAnimator never runs (broken JS) — it
            sets __revealReady and clears this timer, so it never fires in normal use. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('reveal-on');window.__revealFailsafe=setTimeout(function(){if(!window.__revealReady){document.querySelectorAll('.reveal,.reveal-stagger').forEach(function(e){e.classList.add('is-visible')})}},8000);",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://myfluno.com/#organization",
                  name: "Fluno",
                  legalName: "Parvar Enterprise",
                  alternateName: ["myfluno", "Fluno Personal Care"],
                  url: "https://myfluno.com",
                  logo: "https://myfluno.com/icon",
                  image: "https://myfluno.com/opengraph-image",
                  description:
                    "Fluno is a mid-premium personal care and hygiene brand from India offering everyday essentials like hand wash and SPF 50+ sunscreen — thoughtfully formulated, cruelty-free, and honestly priced.",
                  slogan: "Care that keeps up with you.",
                  email: "contact@myfluno.com",
                  areaServed: "IN",
                  knowsAbout: [
                    "personal care", "skincare", "sunscreen", "hand wash",
                    "hygiene", "SPF 50", "cruelty-free cosmetics", "clean beauty",
                  ],
                  sameAs: [
                    "https://instagram.com/myfluno",
                    "https://threads.net/@myfluno",
                    "https://www.facebook.com/myfluno",
                    "https://www.youtube.com/@myfluno",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    email: "contact@myfluno.com",
                    contactType: "customer service",
                    areaServed: "IN",
                    availableLanguage: ["en", "hi"],
                  },
                },
                {
                  "@type": "Brand",
                  "@id": "https://myfluno.com/#brand",
                  name: "Fluno",
                  logo: "https://myfluno.com/icon",
                  slogan: "Care that keeps up with you.",
                  description:
                    "Fluno makes mid-premium, cruelty-free everyday personal care essentials — hand wash, SPF 50+ sunscreen and more — made in India.",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://myfluno.com/#website",
                  url: "https://myfluno.com",
                  name: "Fluno",
                  description:
                    "Everyday personal care, thoughtfully formulated and honestly priced.",
                  inLanguage: "en-IN",
                  publisher: { "@id": "https://myfluno.com/#organization" },
                },
              ],
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
                  background: "#2C2A27",
                  color: "#F7F3EC",
                  border: "1px solid rgba(192, 120, 91,0.35)",
                },
              }}
            />
            <NotificationPrompt />
            <CookieConsent />
            <Analytics />
            <WhatsAppButton />
            <ScrollAnimator />
            <ConditionalLayout>{children}</ConditionalLayout>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
