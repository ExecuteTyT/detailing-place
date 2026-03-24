import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioItemBySlug } from "@/lib/db/queries/content";
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
