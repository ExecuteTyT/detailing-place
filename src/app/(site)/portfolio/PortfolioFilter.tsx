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
                ? "bg-bg-hover border-text-secondary/50 text-text"
                : "border-border text-text-secondary hover:border-text-secondary/50 hover:text-text"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map((item, i) => (
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
              {item.serviceName && (
                <p className="text-sm text-text-secondary">{item.serviceName}</p>
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
        <div className="card p-6 break-inside-avoid flex flex-col items-center justify-center text-center min-h-[200px]">
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
        <p className="mt-8 text-center text-text-secondary">
          Нет работ по выбранному фильтру
        </p>
      )}
    </>
  );
}
