import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "@/styles/globals.css";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
