import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getHomepageServices } from "@/lib/db/queries/services";
import { getTrustBadges, getPartnerBrands } from "@/lib/db/queries/settings";
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
    url: "https://detailingplace.ru",
  },
  alternates: {
    canonical: "https://detailingplace.ru",
  },
};
import ServicesGrid from "@/components/sections/ServicesGrid";
import LiveStatus from "@/components/sections/LiveStatus";
import CTAForm from "@/components/sections/CTAForm";
import SEOText from "@/components/sections/SEOText";
import QuizCalculator from "@/components/funnel/QuizCalculator";
import SeasonalTimer from "@/components/funnel/SeasonalTimer";
import HeroBackground from "@/components/ui/HeroBackground";
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
  { image: "/images/works/ppf-1.webp", car: "BMW X5", tags: ["PPF", "Полная оклейка"] },
  { image: "/images/works/polish-1.webp", car: "Mercedes C-Class", tags: ["Полировка", "Керамика"] },
  { image: "/images/works/linz-1.webp", car: "Kia Ceed", tags: ["Bi-LED линзы"] },
  { image: "/images/works/antihrom-1.webp", car: "BMW X3", tags: ["Антихром", "Full Black"] },
  { image: "/images/works/tonirovka-1.webp", car: "Toyota Camry", tags: ["Тонировка"] },
  { image: "/images/works/himchistka-1.webp", car: "Toyota Camry", tags: ["Химчистка"] },
];

const HOMEPAGE_SEO = `
<h2>Детейлинг студия в Казани — Detailing Place</h2>
<p>Detailing Place — студия премиального автодетейлинга в Казани. Мы специализируемся на защите, уходе и тюнинге автомобилей: антигравийная плёнка (PPF), полировка и керамическое покрытие, тонировка, шумоизоляция, установка Bi-LED линз, химчистка салона и многое другое.</p>
<p>Работаем с премиальными материалами LLumar, SunTek, Koch Chemie, Ceramic Pro, Comfort Mat. Охраняемый бокс с видеонаблюдением. Фотоотчёты каждого этапа. Гарантия на все работы.</p>
`;

export default function Home() {
  const homepageServices = getHomepageServices();
  const trustBadges = getTrustBadges();
  const partnerBrands = getPartnerBrands();
  const reviews = getVisibleReviews();

  return (
    <>
      {/* Seasonal offer banner under header */}
      <SeasonalTimer />

      {/* Hero with embedded Quiz instead of simple form */}
      <section className="relative min-h-[60vh] md:min-h-[85vh] lg:min-h-[90vh] flex items-end overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg-card to-bg-gradient-end" />
        <HeroBackground src="/images/hero/home.webp" alt="Detailing Place — студия премиального детейлинга в Казани" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(12,11,9,0.15) 0%, rgba(12,11,9,0.5) 35%, rgba(12,11,9,0.88) 65%, rgba(12,11,9,0.97) 100%)",
          }}
        />


        <div className="relative z-10 container-main w-full pb-8 md:pb-20 pt-20 md:pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border bg-accent-gold/10 text-accent-gold border-accent-gold/25 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75 animate-pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-gold" />
                </span>
                Оплатим такси до студии
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-text leading-tight">
                <span className="bg-gradient-to-r from-accent-gold via-[#E0C840] to-accent-gold bg-clip-text text-transparent">Премиальный</span>{" "}
                детейлинг в Казани
              </h1>
              <p className="mt-4 text-base md:text-lg text-text-secondary max-w-xl leading-relaxed">
                Защита, красота, комфорт вашего автомобиля. Антигравийная плёнка, полировка, керамика, тонировка, шумоизоляция, Bi-LED линзы
              </p>
            </div>
            <QuizCalculator />
          </div>
        </div>
      </section>

      <TrustBadges badges={trustBadges} brands={partnerBrands} />

      <ServicesGrid services={homepageServices} />

      <LiveStatus />

      <WorkExamples works={HOMEPAGE_WORKS} title="Примеры наших работ" />

      <ReviewsCarousel reviews={reviews} />

      <div id="cta-form">
        <CTAForm
          variant="section"
          title="Рассчитайте стоимость за 15 минут"
          subtitle="Оплатим такси при заказе комплекса услуг"
        />
      </div>

      <SEOText html={HOMEPAGE_SEO} />
    </>
  );
}
