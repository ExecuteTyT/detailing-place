import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import CTAForm from "@/components/sections/CTAForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getBlogPost, getBlogPosts } from "@/lib/db/queries/content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const fullTitle = `${post.title} | Detailing Place`;
  const title = fullTitle.length <= 60 ? fullTitle : post.title;
  const description = post.excerpt || `Статья блога Detailing Place: ${post.title}.`;
  const url = `https://dpkzn.ru/blog/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      locale: "ru_RU",
      siteName: "Detailing Place",
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const url = `https://dpkzn.ru/blog/${slug}`;
  const imageUrl = post.image
    ? post.image.startsWith("http")
      ? post.image
      : `https://dpkzn.ru${post.image}`
    : "https://dpkzn.ru/images/og-default.webp";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Detailing Place",
      url: "https://dpkzn.ru",
    },
    publisher: {
      "@type": "Organization",
      name: "Detailing Place",
      url: "https://dpkzn.ru",
      logo: {
        "@type": "ImageObject",
        url: "https://dpkzn.ru/icon.svg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    ...(post.category ? { articleSection: post.category } : {}),
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
              { label: post.title },
            ]}
            className="mb-6"
          />

          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-text">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            {post.category && <span>{post.category} · </span>}
            Detailing Place · {new Date(post.date).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          {post.image && (
            <div className="mt-6 relative aspect-video rounded-card overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="mt-8 prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-display prose-p:text-text-secondary prose-a:text-accent-gold">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <>
                <p>{post.excerpt}</p>
                <p>Полное содержание статьи скоро появится. Подпишитесь на обновления в нашем Telegram.</p>
              </>
            )}
          </div>
        </div>
      </article>

      <div id="cta-form">
        <CTAForm variant="section" title="Остались вопросы?" subtitle="Проконсультируем бесплатно" />
      </div>
    </>
  );
}
