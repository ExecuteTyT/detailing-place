import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileFloatingPanel from "@/components/layout/MobileFloatingPanel";
import ExitIntentPopup from "@/components/funnel/ExitIntentPopup";
import CallbackWidget from "@/components/funnel/CallbackWidget";
import SocialProofToast from "@/components/funnel/SocialProofToast";
import { PHONE, ADDRESS, HOURS, COORDINATES, METRIKA_ID } from "@/lib/constants";
import { METRIKA_SCRIPT } from "@/lib/analytics";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Detailing Place — Премиальный детейлинг в Казани",
  description:
    "Антигравийная плёнка, полировка, керамика, тонировка, шумоизоляция, Bi-LED линзы. Премиальный автодетейлинг в Казани.",
  openGraph: {
    title: "Detailing Place — Премиальный детейлинг в Казани",
    description:
      "Антигравийная плёнка, полировка, керамика, тонировка, шумоизоляция, Bi-LED линзы. Премиальный автодетейлинг в Казани.",
    url: "https://detailingplace.ru",
    siteName: "Detailing Place",
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: "https://detailingplace.ru",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://detailingplace.ru"),
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://detailingplace.ru/#organization",
  name: "Detailing Place",
  description:
    "Студия премиального автодетейлинга в Казани. Антигравийная плёнка, полировка, керамика, тонировка, шумоизоляция, Bi-LED линзы.",
  url: "https://detailingplace.ru",
  telephone: PHONE,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS,
    addressLocality: "Казань",
    addressRegion: "Республика Татарстан",
    addressCountry: "RU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: COORDINATES.lat,
    longitude: COORDINATES.lng,
  },
  openingHours: HOURS,
  priceRange: "₽₽₽",
  image: "https://detailingplace.ru/images/studio-1.jpg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        {/* LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        {/* Yandex.Metrika */}
        <script dangerouslySetInnerHTML={{ __html: METRIKA_SCRIPT }} />
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </head>
      <body className="antialiased">
        <Header />
        <main className="pt-16 md:pt-[72px] pb-safe">{children}</main>
        <Footer />
        <MobileFloatingPanel />
        <ExitIntentPopup />
        <CallbackWidget />
        <SocialProofToast />
      </body>
    </html>
  );
}
