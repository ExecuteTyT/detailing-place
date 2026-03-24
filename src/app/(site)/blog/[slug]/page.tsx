import type { Metadata } from "next";
import CTAForm from "@/components/sections/CTAForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function slugToTitle(slug: string) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slugToTitle(slug);
  return {
    title: `${title} — Блог | Detailing Place`,
    description: `Статья: ${title}. Полезные советы от Detailing Place Казань.`,
    openGraph: {
      title: `${title} — Блог | Detailing Place`,
      description: `Статья: ${title}. Полезные советы от Detailing Place.`,
      url: `https://dpkzn.ru/blog/${slug}`,
      type: "article",
    },
    alternates: {
      canonical: `https://dpkzn.ru/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const title = slugToTitle(slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    author: {
      "@type": "Organization",
      name: "Detailing Place",
    },
    publisher: {
      "@type": "Organization",
      name: "Detailing Place",
      url: "https://dpkzn.ru",
    },
    datePublished: "2026-02-01",
    image: `https://dpkzn.ru/images/blog/${slug}.webp`,
    url: `https://dpkzn.ru/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="section-padding">
        <div className="container-main max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Блог", href: "/blog" },
              { label: title },
            ]}
            className="mb-6"
          />

          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-text">
            {title}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">Detailing Place • 2026</p>

          {/* Article content placeholder */}
          <div className="mt-8 prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-display prose-p:text-text-secondary prose-a:text-accent-gold">
            <p>
              Эта статья скоро будет дополнена подробным содержанием.
              Следите за обновлениями блога Detailing Place.
            </p>
            <p>
              Если у вас есть вопросы — свяжитесь с нами по телефону или через WhatsApp.
              Мы с удовольствием проконсультируем.
            </p>
          </div>
        </div>
      </article>

      <div id="cta-form">
        <CTAForm variant="section" title="Остались вопросы?" subtitle="Проконсультируем бесплатно" />
      </div>
    </>
  );
}
