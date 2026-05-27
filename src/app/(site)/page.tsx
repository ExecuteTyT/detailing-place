import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getHomepageServices } from "@/lib/db/queries/services";
import { getTrustBadges } from "@/lib/db/queries/settings";
import { getVisibleReviews } from "@/lib/db/queries/content";
import TrustBadges from "@/components/sections/TrustBadges";

export const metadata: Metadata = {
  title: "Детейлинг в Казани — Премиум автодетейлинг | Detailing Place",
  description:
    "Антигравийная плёнка, полировка, керамика, тонировка, шумоизоляция, Bi-LED линзы. Премиальный детейлинг в Казани. Гарантия, фотоотчёт.",
  openGraph: {
    title: "Детейлинг в Казани — Премиум автодетейлинг | Detailing Place",
    description:
      "Антигравийная плёнка, полировка, керамика, тонировка, шумоизоляция, Bi-LED линзы. Премиальный детейлинг в Казани.",
    url: "https://dpkzn.ru",
  },
  alternates: {
    canonical: "https://dpkzn.ru",
  },
};
import ServicesGrid from "@/components/sections/ServicesGrid";
import LiveStatus from "@/components/sections/LiveStatus";
import CTAForm from "@/components/sections/CTAForm";
import SEOText from "@/components/sections/SEOText";
import QuizCalculator from "@/components/funnel/QuizCalculator";
import SeasonalTimer from "@/components/funnel/SeasonalTimer";
import HeroContact from "@/components/sections/HeroContact";
import HeroSlideshow from "@/components/ui/HeroSlideshow";
import WorkExamplesSkeleton from "@/components/sections/WorkExamplesSkeleton";
import ReviewsCarouselSkeleton from "@/components/sections/ReviewsCarouselSkeleton";

const WorkExamples = dynamic(
  () => import("@/components/sections/WorkExamples"),
  { loading: () => <WorkExamplesSkeleton /> }
);

const ReviewsCarousel = dynamic(
  () => import("@/components/sections/ReviewsCarousel"),
  { loading: () => <ReviewsCarouselSkeleton /> }
);

const HOMEPAGE_WORKS = [
  { image: "/images/works/IMG_4975.webp", car: "Lamborghini Urus", tags: ["PPF", "Детейлинг"] },
  { image: "/images/works/IMG_3857.webp", car: "Rolls-Royce Cullinan", tags: ["PPF", "Премиум"] },
  { image: "/images/works/IMG_4450.webp", car: "Porsche Cayenne", tags: ["Полировка", "Керамика"] },
  { image: "/images/works/IMG_0941.webp", car: "BMW 420d", tags: ["Полировка", "Глянец"] },
  { image: "/images/works/IMG_8627.webp", car: "Mercedes-Benz GLA", tags: ["Полировка", "Финиш"] },
  { image: "/images/works/IMG_9045.webp", car: "Porsche Cayenne Coupe", tags: ["PPF", "Керамика"] },
];

const HOMEPAGE_SEO = `
<h2>Детейлинг студия в Казани — Detailing Place</h2>
<p>Detailing Place — студия премиального автодетейлинга в Казани. Мы специализируемся на защите, уходе и тюнинге автомобилей: антигравийная плёнка (PPF), полировка и керамическое покрытие, тонировка, шумоизоляция, установка Bi-LED линз, химчистка салона и многое другое.</p>
<p>Работаем с премиальными материалами. Охраняемый бокс с видеонаблюдением. Фотоотчёты каждого этапа. Гарантия на все работы.</p>
`;

export default function Home() {
  const homepageServices = getHomepageServices();
  const trustBadges = getTrustBadges();
  const reviews = getVisibleReviews();

  return (
    <>
      {/* Seasonal offer banner under header */}
      <SeasonalTimer />

      {/* Hero with embedded Quiz instead of simple form */}
      <section className="relative min-h-[60vh] md:min-h-[85vh] lg:min-h-[90vh] flex items-end overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg-card to-bg-gradient-end" />
        <HeroSlideshow />
        {/* Mobile overlay — photo is dark, light touch needed */}
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(12,11,9,0.15) 0%, rgba(12,11,9,0.10) 20%, rgba(12,11,9,0.50) 45%, rgba(12,11,9,0.88) 65%, rgba(12,11,9,0.95) 100%)",
          }}
        />
        {/* Desktop overlay — left scrim keeps the text column readable over any photo,
            plus a bottom fade for the buttons. Right side stays lighter (quiz has its own dark card). */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to right, rgba(12,11,9,0.92) 0%, rgba(12,11,9,0.70) 28%, rgba(12,11,9,0.25) 50%, rgba(12,11,9,0) 72%), linear-gradient(to bottom, rgba(12,11,9,0) 35%, rgba(12,11,9,0.45) 70%, rgba(12,11,9,0.85) 100%)",
          }}
        />


        <div className="relative z-10 container-main w-full pb-8 md:pb-20 pt-20 md:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold bg-bg/55 backdrop-blur-md text-accent-gold border border-accent-gold/40 shadow-[0_4px_16px_rgba(0,0,0,0.4)] mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75 animate-pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-gold" />
                </span>
                Оплатим дорогу до дома
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-text leading-tight [text-shadow:_0_2px_16px_rgba(0,0,0,0.7)]">
                <span className="bg-gradient-to-r from-accent-gold via-[#E0C840] to-accent-gold bg-clip-text text-transparent">Премиальный</span>{" "}
                детейлинг в Казани
              </h1>
              <p className="mt-4 text-base md:text-lg text-text/90 max-w-lg leading-relaxed font-medium [text-shadow:_0_2px_12px_rgba(0,0,0,0.95)]">
                Оригинальные материалы, гарантия и фотоотчёт. Работаем с Porsche, BMW, Mercedes, Lamborghini.
                <span className="hidden md:inline"> Антигравийная плёнка, полировка, керамика, тонировка, шумоизоляция, Bi-LED линзы.</span>
              </p>

              {/* One-tap contact for referral visitors */}
              <HeroContact className="mt-6" />
            </div>
            <QuizCalculator />
          </div>
        </div>
      </section>

      <TrustBadges badges={trustBadges} />

      {/* Trust first: premium work + real reviews before everything else */}
      <WorkExamples works={HOMEPAGE_WORKS} title="Примеры наших работ" />

      <ReviewsCarousel reviews={reviews} />

      <ServicesGrid services={homepageServices} />

      <LiveStatus />

      <div id="cta-form">
        <CTAForm
          variant="section"
          title="Рассчитайте стоимость за 15 минут"
          subtitle="Оплатим дорогу до дома при заказе комплекса"
        />
      </div>

      <SEOText html={HOMEPAGE_SEO} />
    </>
  );
}
