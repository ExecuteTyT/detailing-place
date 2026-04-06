import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPortfolioItemBySlug, getPortfolioNavigation } from "@/lib/db/queries/content";
import CTAForm from "@/components/sections/CTAForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PortfolioGallery from "./PortfolioGallery";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getPortfolioItemBySlug(slug);
  if (!item) return {};

  const title = `${item.car} — ${item.serviceName}`;
  return {
    title: `${title} | Портфолио Detailing Place`,
    description: `${item.car}: ${item.serviceName} в Казани. Фотоотчёт работы в студии Detailing Place.`,
    openGraph: {
      title: `${title} | Портфолио Detailing Place`,
      description: `${item.car}: ${item.serviceName} в Казани.`,
      url: `https://dpkzn.ru/portfolio/${slug}`,
      images: [{ url: `https://dpkzn.ru${item.image}` }],
    },
    alternates: {
      canonical: `https://dpkzn.ru/portfolio/${slug}`,
    },
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getPortfolioItemBySlug(slug);

  if (!item) notFound();

  const nav = getPortfolioNavigation(slug);

  return (
    <>
      <section className="section-padding">
        <div className="container-main">
          <Breadcrumbs
            items={[
              { label: "Портфолио", href: "/portfolio" },
              { label: item.car },
            ]}
            className="mb-6"
          />

          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-text">
            {item.car}
          </h1>
          <p className="mt-1 text-text-secondary">{item.serviceName}</p>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Gallery with lightbox */}
          <PortfolioGallery images={item.gallery} car={item.car} />

          {/* Prev / Next navigation */}
          <div className="mt-10 flex items-center justify-between gap-4">
            {nav.prev ? (
              <Link
                href={`/portfolio/${nav.prev.slug}`}
                className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors min-h-[44px] group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <span className="text-xs text-text-secondary">Назад</span>
                  <p className="text-sm font-semibold text-text">{nav.prev.car}</p>
                </div>
              </Link>
            ) : <div />}

            <Link
              href="/portfolio"
              className="text-sm text-text-secondary hover:text-text transition-colors min-h-[44px] flex items-center"
            >
              Все работы
            </Link>

            {nav.next ? (
              <Link
                href={`/portfolio/${nav.next.slug}`}
                className="flex items-center gap-2 text-text-secondary hover:text-text transition-colors min-h-[44px] group"
              >
                <div className="text-right">
                  <span className="text-xs text-text-secondary">Далее</span>
                  <p className="text-sm font-semibold text-text">{nav.next.car}</p>
                </div>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </section>

      <div id="cta-form">
        <CTAForm
          variant="section"
          title={`Хотите так же для вашего авто?`}
          subtitle="Рассчитаем стоимость за 15 минут"
        />
      </div>
    </>
  );
}
