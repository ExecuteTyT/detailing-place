import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPortfolioItems, getPortfolioTags } from "@/lib/db/queries/content";
import CTAForm from "@/components/sections/CTAForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PortfolioTracker from "./PortfolioTracker";

export const metadata: Metadata = {
  title: "Портфолио работ — детейлинг в Казани | Detailing Place",
  description: "Примеры наших работ: антигравийная плёнка, полировка, керамика, тонировка, Bi-LED линзы. Фото до и после.",
  openGraph: {
    title: "Портфолио работ — детейлинг в Казани | Detailing Place",
    description: "Примеры наших работ: антигравийная плёнка, полировка, керамика, тонировка, Bi-LED линзы. Фото до и после.",
    url: "https://detailingplace.ru/portfolio",
  },
  alternates: { canonical: "https://detailingplace.ru/portfolio" },
};

export default function PortfolioPage() {
  const PORTFOLIO_ITEMS = getPortfolioItems();
  const ALL_TAGS = ["Все", ...getPortfolioTags()];
  return (
    <>
      <PortfolioTracker />
      <section className="section-padding">
        <div className="container-main">
          <Breadcrumbs items={[{ label: "Портфолио" }]} className="mb-6" />
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-text text-center">
            Портфолио
          </h1>
          <p className="mt-3 text-text-secondary text-center">
            Примеры наших работ — фото до и после
          </p>

          {/* Filter tabs */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-border text-text-secondary hover:border-text-secondary/50 hover:text-text transition-colors min-h-[44px] cursor-pointer first:bg-bg-hover first:border-text-secondary/50 first:text-text"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {PORTFOLIO_ITEMS.map((item, i) => (
              <Link
                key={item.slug}
                href={`/portfolio/${item.slug}`}
                className="card block overflow-hidden break-inside-avoid hover:border-border transition-colors"
              >
                <div className={`relative ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-video"}`}>
                  <Image
                    src={item.image}
                    alt={`${item.car} — ${item.serviceName ?? ""}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="font-bold text-text">{item.car}</p>
                  <p className="text-sm text-text-secondary">{item.serviceName}</p>
                </div>
              </Link>
            ))}

            {/* CTA card */}
            <div className="card p-6 break-inside-avoid flex flex-col items-center justify-center text-center min-h-[200px]">
              <p className="text-lg font-bold font-display text-text mb-2">
                Хотите так же?
              </p>
              <p className="text-sm text-text-secondary mb-4">
                Рассчитаем стоимость за 15 минут
              </p>
              <a
                href="#cta-form"
                className="btn-cta px-6 py-3 text-sm"
              >
                Оставить заявку
              </a>
            </div>
          </div>
        </div>
      </section>

      <div id="cta-form">
        <CTAForm variant="section" title="Запишитесь на детейлинг" />
      </div>
    </>
  );
}
