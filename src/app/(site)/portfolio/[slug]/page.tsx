import type { Metadata } from "next";
import CTAForm from "@/components/sections/CTAForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PlaceholderImage from "@/components/ui/PlaceholderImage";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function slugToName(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slugToName(slug);
  return {
    title: `${title} — Портфолио | Detailing Place`,
    description: `Детейлинг ${title} в Казани. Фото работы до и после.`,
    openGraph: {
      title: `${title} — Портфолио | Detailing Place`,
      description: `Детейлинг ${title} в Казани. Фото работы до и после.`,
      url: `https://dpkzn.ru/portfolio/${slug}`,
    },
    alternates: {
      canonical: `https://dpkzn.ru/portfolio/${slug}`,
    },
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const name = slugToName(slug);

  return (
    <>
      <section className="section-padding">
        <div className="container-main">
          <Breadcrumbs
            items={[
              { label: "Портфолио", href: "/portfolio" },
              { label: name },
            ]}
            className="mb-6"
          />

          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-text">
            {name}
          </h1>
          <p className="mt-2 text-text-secondary">
            Детейлинг проект — фотоотчёт выполненной работы
          </p>

          {/* Gallery grid placeholder */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative aspect-video rounded-[var(--radius-card)] overflow-hidden bg-bg-card border border-border">
                <PlaceholderImage type="portfolio" label={`${name} #${i}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="cta-form">
        <CTAForm
          variant="section"
          title={`Владеете таким же авто?`}
          subtitle="Рассчитаем стоимость за 15 минут"
        />
      </div>
    </>
  );
}
