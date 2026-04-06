"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface PortfolioItem {
  slug: string;
  car: string;
  serviceName?: string;
  image: string;
  tags: string[];
}

interface PortfolioFilterProps {
  items: PortfolioItem[];
  allTags: string[];
}

export default function PortfolioFilter({ items, allTags }: PortfolioFilterProps) {
  const [activeTag, setActiveTag] = useState("Все");

  const filtered = activeTag === "Все"
    ? items
    : items.filter((item) => item.tags.includes(activeTag));

  // Count items per tag for badges
  const tagCounts: Record<string, number> = {};
  for (const tag of allTags) {
    tagCounts[tag] = tag === "Все" ? items.length : items.filter((item) => item.tags.includes(tag)).length;
  }

  return (
    <>
      {/* Filter tabs */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors min-h-[44px] cursor-pointer ${
              activeTag === tag
                ? "bg-accent-gold/15 border-accent-gold/40 text-accent-gold"
                : "border-border text-text-secondary hover:border-text-secondary/50 hover:text-text"
            }`}
          >
            {tag}
            <span className={`ml-1.5 text-xs ${activeTag === tag ? "text-accent-gold/70" : "text-text-secondary/50"}`}>
              {tagCounts[tag]}
            </span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mt-4 text-center text-sm text-text-secondary">
        {filtered.length} {filtered.length === 1 ? "работа" : filtered.length < 5 ? "работы" : "работ"}
      </p>

      {/* Masonry grid */}
      <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((item, i) => (
          <Link
            key={item.slug}
            href={`/portfolio/${item.slug}`}
            className="card block overflow-hidden break-inside-avoid group hover:border-accent-gold/30 transition-colors"
          >
            <div className={`relative overflow-hidden ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-video"}`}>
              <Image
                src={item.image}
                alt={`${item.car} — ${item.serviceName ?? ""}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4">
              <p className="font-bold text-text group-hover:text-accent-gold transition-colors">{item.car}</p>
              {item.serviceName && (
                <p className="text-sm text-text-secondary mt-0.5">{item.serviceName}</p>
              )}
              {item.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-accent-gold/10 text-accent-gold border border-accent-gold/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}

        {/* CTA card */}
        <div className="card card-glow-top p-6 break-inside-avoid flex flex-col items-center justify-center text-center min-h-[200px]">
          <p className="text-lg font-bold font-display text-text mb-2">
            Хотите так же?
          </p>
          <p className="text-sm text-text-secondary mb-4">
            Рассчитаем стоимость за 15 минут
          </p>
          <a href="#cta-form" className="btn-cta px-6 py-3 text-sm">
            Оставить заявку
          </a>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-text-secondary text-lg">Нет работ по выбранному фильтру</p>
          <button
            onClick={() => setActiveTag("Все")}
            className="mt-3 text-accent-gold hover:underline text-sm cursor-pointer"
          >
            Показать все работы
          </button>
        </div>
      )}
    </>
  );
}
