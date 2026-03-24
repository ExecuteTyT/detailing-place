import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPortfolioItemBySlug } from "@/lib/db/queries/content";
import CTAForm from "@/components/sections/CTAForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

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

          {/* Gallery */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {item.gallery.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-[var(--radius-card)] border border-border ${
                  i === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={img}
                  alt={`${item.car} — фото ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 1200px" : "(max-width: 640px) 100vw, 50vw"}
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
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
