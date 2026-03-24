import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getService, getAllServices } from "@/lib/db/queries/services";
import HeroSection from "@/components/sections/HeroSection";
import BeforeAfterSlider from "@/components/sections/BeforeAfterSlider";
import ServicePackages from "@/components/sections/ServicePackages";
import ProcessSteps from "@/components/sections/ProcessSteps";
import FAQAccordion from "@/components/sections/FAQAccordion";
import CTAForm from "@/components/sections/CTAForm";
import SEOText from "@/components/sections/SEOText";
import CrossSellBanner from "@/components/sections/CrossSellBanner";
import PhotoComparison from "@/components/sections/PhotoComparison";
import CarBrandGrid from "@/components/sections/CarBrandGrid";
import BrandsGrid from "@/components/sections/BrandsGrid";
import StudioLoadBar from "@/components/funnel/StudioLoadBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WorkExamplesSkeleton from "@/components/sections/WorkExamplesSkeleton";
import {
  Shield,
  Sparkles,
  Droplets,
  Volume2,
  PaintBucket,
  Sun,
  Lightbulb,
  SlidersHorizontal,
  CircleDot,
  GlassWater,
  CloudRain,
  Globe,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const WorkExamples = dynamic(
  () => import("@/components/sections/WorkExamples"),
  { loading: () => <WorkExamplesSkeleton /> }
);

/* ───────── Service-specific hero themes ───────── */

interface ServiceTheme {
  /** CSS background — colored radial gradient overlay */
  gradient: string;
  /** Large watermark icon */
  icon: LucideIcon;
}

const HERO_THEMES: Record<string, ServiceTheme> = {
  ppf: {
    gradient:
      "radial-gradient(ellipse at 20% 40%, rgba(59,130,246,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(67,56,202,0.05) 0%, transparent 50%)",
    icon: Shield,
  },
  polirovka: {
    gradient:
      "radial-gradient(ellipse at 75% 30%, rgba(245,158,11,0.1) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(212,184,48,0.05) 0%, transparent 50%)",
    icon: Sparkles,
  },
  himchistka: {
    gradient:
      "radial-gradient(ellipse at 30% 55%, rgba(20,184,166,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(6,148,162,0.04) 0%, transparent 50%)",
    icon: Droplets,
  },
  shumoizolyaciya: {
    gradient:
      "radial-gradient(ellipse at 60% 35%, rgba(139,92,246,0.1) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(109,40,217,0.04) 0%, transparent 50%)",
    icon: Volume2,
  },
  antihrom: {
    gradient:
      "radial-gradient(ellipse at 50% 40%, rgba(161,161,170,0.08) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(82,82,91,0.04) 0%, transparent 50%)",
    icon: PaintBucket,
  },
  tonirovka: {
    gradient:
      "radial-gradient(ellipse at 70% 25%, rgba(249,115,22,0.1) 0%, transparent 60%), radial-gradient(ellipse at 20% 65%, rgba(234,88,12,0.04) 0%, transparent 50%)",
    icon: Sun,
  },
  "ustanovka-linz": {
    gradient:
      "radial-gradient(ellipse at 40% 20%, rgba(250,204,21,0.1) 0%, transparent 60%), radial-gradient(ellipse at 80% 60%, rgba(234,179,8,0.04) 0%, transparent 50%)",
    icon: Lightbulb,
  },
  "regulirovka-far": {
    gradient:
      "radial-gradient(ellipse at 50% 45%, rgba(100,116,139,0.08) 0%, transparent 55%), radial-gradient(ellipse at 20% 20%, rgba(71,85,105,0.04) 0%, transparent 50%)",
    icon: SlidersHorizontal,
  },
  "polirovka-stekol": {
    gradient:
      "radial-gradient(ellipse at 30% 35%, rgba(34,211,238,0.1) 0%, transparent 60%), radial-gradient(ellipse at 75% 70%, rgba(6,182,212,0.04) 0%, transparent 50%)",
    icon: CircleDot,
  },
  "polirovka-far": {
    gradient:
      "radial-gradient(ellipse at 55% 40%, rgba(251,191,36,0.08) 0%, transparent 55%), radial-gradient(ellipse at 20% 70%, rgba(245,158,11,0.04) 0%, transparent 50%)",
    icon: CircleDot,
  },
  antidozhd: {
    gradient:
      "radial-gradient(ellipse at 35% 30%, rgba(56,189,248,0.1) 0%, transparent 60%), radial-gradient(ellipse at 75% 65%, rgba(14,165,233,0.04) 0%, transparent 50%)",
    icon: CloudRain,
  },
  "rusifikaciya-avto": {
    gradient:
      "radial-gradient(ellipse at 65% 50%, rgba(239,68,68,0.08) 0%, transparent 55%), radial-gradient(ellipse at 25% 25%, rgba(185,28,28,0.04) 0%, transparent 50%)",
    icon: Globe,
  },
  "remont-vmyatin": {
    gradient:
      "radial-gradient(ellipse at 45% 35%, rgba(212,184,48,0.08) 0%, transparent 55%)",
    icon: Wrench,
  },
  keramika: {
    gradient:
      "radial-gradient(ellipse at 40% 30%, rgba(56,189,248,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 65%, rgba(14,165,233,0.04) 0%, transparent 50%)",
    icon: GlassWater,
  },
};

/* ───────── Page ───────── */

interface PageProps {
  params: Promise<{ service: string }>;
}

export async function generateStaticParams() {
  return getAllServices().map((s) => ({ service: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.subtitle,
    openGraph: {
      title: service.title,
      description: service.subtitle,
      url: `https://dpkzn.ru${service.url}`,
      type: "website",
    },
    alternates: {
      canonical: `https://dpkzn.ru${service.url}`,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const theme = HERO_THEMES[slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.h1,
    description: service.subtitle,
    provider: {
      "@type": "LocalBusiness",
      name: "Detailing Place",
      "@id": "https://dpkzn.ru/#organization",
    },
    areaServed: "Казань",
    offers: service.packages.length > 0
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "RUB",
          lowPrice: (service.packages[0].classPrices[0] || "").replace(/\D/g, ""),
          offerCount: service.packages.length,
        }
      : undefined,
  };

  return (
    <>
      {/* JSON-LD Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs with JSON-LD */}
      <div className="container-main pt-4">
        <Breadcrumbs items={[{ label: service.h1 }]} />
      </div>

      <HeroSection
        title={service.h1}
        subtitle={service.subtitle}
        badge={service.badge}
        showSimpleForm
        serviceName={service.h1}
        backgroundImage={`/images/hero/${slug}.webp`}
        themeGradient={theme?.gradient}
        ThemeIcon={theme?.icon}
      />

      {/* Unique blocks */}
      {service.uniqueBlock === "PhotoComparison" && <PhotoComparison />}
      {service.uniqueBlock === "CarBrandGrid" && <CarBrandGrid />}
      {service.uniqueBlock === "BrandsGrid" && <BrandsGrid />}

      {service.hasBeforeAfter && service.beforeAfter && (
        <BeforeAfterSlider
          beforeImage={service.beforeAfter.before}
          afterImage={service.beforeAfter.after}
          beforeLabel={service.beforeAfter.beforeLabel}
          afterLabel={service.beforeAfter.afterLabel}
        />
      )}

      <ServicePackages packages={service.packages} elementPrices={service.elementPrices} serviceName={service.h1} />

      {service.process.length > 0 && <ProcessSteps steps={service.process} />}

      {service.works.length > 0 && (
        <WorkExamples works={service.works} />
      )}

      {service.faq.length > 0 && <FAQAccordion items={service.faq} />}

      <StudioLoadBar />

      <div id="cta-form">
        <CTAForm
          variant="section"
          title="Рассчитайте стоимость"
          subtitle="Ответим за 15 минут. Рассчитаем по фото."
          serviceName={service.h1}
        />
      </div>

      <SEOText html={service.seoText} />

      {service.crossSell && (
        <CrossSellBanner
          title={service.crossSell.title}
          description={service.crossSell.description}
          href={service.crossSell.href}
          discount={service.crossSell.discount}
        />
      )}
    </>
  );
}
