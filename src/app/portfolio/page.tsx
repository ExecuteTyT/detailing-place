import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import CTAForm from "@/components/sections/CTAForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

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

const PORTFOLIO_ITEMS = [
  { slug: "bmw-x5-ppf", car: "BMW X5", service: "Оклейка PPF — Полный фронт", image: "/images/works/ppf-1.jpg", tags: ["PPF"] },
  { slug: "mercedes-gle-ppf", car: "Mercedes GLE", service: "PPF + Керамика", image: "/images/works/ppf-2.jpg", tags: ["PPF", "Керамика"] },
  { slug: "porsche-cayenne-ppf", car: "Porsche Cayenne", service: "PPF зоны риска", image: "/images/works/ppf-3.jpg", tags: ["PPF"] },
  { slug: "mercedes-c-polish", car: "Mercedes C-Class", service: "Полировка + Керамика", image: "/images/works/polish-1.jpg", tags: ["Полировка"] },
  { slug: "bmw-5-polish", car: "BMW 5 Series", service: "Exhibition полировка", image: "/images/works/polish-2.jpg", tags: ["Полировка"] },
  { slug: "kia-ceed-linz", car: "Kia Ceed", service: "Установка Bi-LED линз", image: "/images/works/linz-1.jpg", tags: ["Bi-LED"] },
  { slug: "hyundai-solaris-linz", car: "Hyundai Solaris", service: "Bi-LED Premium", image: "/images/works/linz-2.jpg", tags: ["Bi-LED"] },
  { slug: "bmw-x3-antihrom", car: "BMW X3", service: "Антихром Full Black", image: "/images/works/antihrom-1.jpg", tags: ["Антихром"] },
  { slug: "toyota-camry-tonirovka", car: "Toyota Camry", service: "Тонировка полный круг", image: "/images/works/tonirovka-1.jpg", tags: ["Тонировка"] },
  { slug: "toyota-camry-himchistka", car: "Toyota Camry", service: "Химчистка STANDARD", image: "/images/works/himchistka-1.jpg", tags: ["Химчистка"] },
  { slug: "zeekr-001-ceramica", car: "Zeekr 001", service: "Керамика 9H", image: "/images/works/polish-1.jpg", tags: ["Керамика"] },
  { slug: "haval-jolion-rusifikaciya", car: "Haval Jolion", service: "Русификация + навигация", image: "/images/works/linz-1.jpg", tags: ["Русификация"] },
];

const ALL_TAGS = ["Все", "PPF", "Полировка", "Керамика", "Тонировка", "Bi-LED", "Антихром", "Химчистка", "Русификация"];

export default function PortfolioPage() {
  return (
    <>
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
                className="px-4 py-2 rounded-full text-sm font-semibold border border-border text-text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-colors min-h-[44px] cursor-pointer first:bg-accent-cyan/10 first:border-accent-cyan first:text-accent-cyan"
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
                className="card block overflow-hidden break-inside-avoid hover:border-accent-cyan/50 transition-colors"
              >
                <div className={`relative ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-video"}`}>
                  <Image
                    src={item.image}
                    alt={`${item.car} — ${item.service}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <p className="font-bold text-text">{item.car}</p>
                  <p className="text-sm text-text-secondary">{item.service}</p>
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
