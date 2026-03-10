import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, getBlogCategories } from "@/lib/db/queries/content";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Блог о детейлинге — статьи и советы | Detailing Place",
  description: "Полезные статьи о защите кузова, полировке, тонировке, уходе за автомобилем. Советы от специалистов Detailing Place.",
  openGraph: {
    title: "Блог о детейлинге — статьи и советы | Detailing Place",
    description: "Полезные статьи о защите кузова, полировке, тонировке, уходе за автомобилем. Советы от специалистов Detailing Place.",
    url: "https://detailingplace.ru/blog",
  },
  alternates: { canonical: "https://detailingplace.ru/blog" },
};

export default function BlogPage() {
  const BLOG_POSTS = getBlogPosts();
  const CATEGORIES = ["Все", ...getBlogCategories()];
  const featured = BLOG_POSTS.find((p) => p.isFeatured);
  const rest = BLOG_POSTS.filter((p) => !p.isFeatured);

  return (
    <section className="section-padding">
      <div className="container-main">
        <Breadcrumbs items={[{ label: "Блог" }]} className="mb-6" />
        <h1 className="text-3xl md:text-4xl font-extrabold font-display text-text text-center">
          Блог
        </h1>
        <p className="mt-3 text-text-secondary text-center">
          Полезные статьи о детейлинге и уходе за автомобилем
        </p>

        {/* Category tabs */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full text-sm font-semibold border border-border text-text-secondary hover:border-accent-cyan hover:text-accent-cyan transition-colors min-h-[44px] cursor-pointer first:bg-accent-cyan/10 first:border-accent-cyan first:text-accent-cyan"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="card mt-8 block overflow-hidden md:flex group hover:border-accent-cyan/50 transition-colors"
          >
            <div className="relative aspect-video md:aspect-auto md:w-1/2 flex-shrink-0">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            <div className="p-5 md:p-6 flex flex-col justify-center">
              <span className="text-xs font-semibold text-accent-cyan uppercase">{featured.category}</span>
              <h2 className="mt-2 text-xl md:text-2xl font-bold font-display text-text group-hover:text-accent-cyan transition-colors">
                {featured.title}
              </h2>
              <p className="mt-2 text-text-secondary text-sm leading-relaxed">
                {featured.excerpt}
              </p>
              <p className="mt-3 text-xs text-text-secondary">{featured.date}</p>
            </div>
          </Link>
        )}

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card overflow-hidden group hover:border-accent-cyan/50 transition-colors"
            >
              <div className="relative aspect-video">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-accent-cyan uppercase">{post.category}</span>
                <h3 className="mt-1 font-bold text-text group-hover:text-accent-cyan transition-colors">
                  {post.title}
                </h3>
                <p className="mt-1 text-sm text-text-secondary line-clamp-2">
                  {post.excerpt}
                </p>
                <p className="mt-2 text-xs text-text-secondary">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
