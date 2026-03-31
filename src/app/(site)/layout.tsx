import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileFloatingPanel from "@/components/layout/MobileFloatingPanel";
import ExitIntentPopup from "@/components/funnel/ExitIntentPopup";
import CallbackWidget from "@/components/funnel/CallbackWidget";
import SocialProofToast from "@/components/funnel/SocialProofToast";
import ScrollTracker from "@/components/funnel/ScrollTracker";
import { SiteDataProvider } from "@/lib/site-data";
import { getSettings, getNavItems, getLiveStatus, getSocialProofItems, getSeasonalOffer, getQuizCategories } from "@/lib/db/queries/settings";
import { getCarClassesForPricing } from "@/lib/db/queries/services";
import { METRIKA_SCRIPT } from "@/lib/analytics";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSettings();
  const nav = getNavItems();
  const liveStatus = getLiveStatus();
  const socialProofItems = getSocialProofItems();
  const seasonalOffer = getSeasonalOffer();
  const quizCategories = getQuizCategories();
  const carClasses = getCarClassesForPricing();

  const phone = settings.phone || "+7 (843) 000-00-00";
  const phoneRaw = settings.phone_raw || "78430000000";
  const whatsappUrl = settings.whatsapp_url || "https://wa.me/79196449393";
  const telegramUrl = settings.telegram_url || "https://t.me/+79196449393";
  const maxUrl = settings.max_url || "https://max.im/+79196449393";
  const address = settings.address || "";
  const hours = settings.hours || "";
  const metrikaId = settings.metrika_id || "00000000";
  const coordLat = settings.coordinates_lat || "55.7887";
  const coordLng = settings.coordinates_lng || "49.1221";

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://dpkzn.ru/#organization",
    name: "Detailing Place",
    description:
      "Студия премиального автодетейлинга в Казани. Антигравийная плёнка, полировка, керамика, тонировка, шумоизоляция, Bi-LED линзы.",
    url: "https://dpkzn.ru",
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: "Казань",
      addressRegion: "Республика Татарстан",
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: parseFloat(coordLat),
      longitude: parseFloat(coordLng),
    },
    openingHours: hours,
    priceRange: "₽₽₽",
    image: "https://dpkzn.ru/images/studio-1.webp",
  };

  const siteData = {
    phone,
    phoneRaw,
    whatsappUrl,
    telegramUrl,
    maxUrl,
    address,
    hours,
    serviceNav: nav.service,
    infoNav: nav.info,
    liveStatus,
    socialProofItems,
    seasonalOffer,
    quizCategories,
    carClasses,
  };

  return (
    <SiteDataProvider data={siteData}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: METRIKA_SCRIPT }} />
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://mc.yandex.ru/watch/${metrikaId}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </head>
      <Header />
      <main className="pt-16 md:pt-[72px] pb-safe">{children}</main>
      <Footer />
      <MobileFloatingPanel />
      <ExitIntentPopup />
      <CallbackWidget />
      <SocialProofToast />
      <ScrollTracker />
    </SiteDataProvider>
  );
}
