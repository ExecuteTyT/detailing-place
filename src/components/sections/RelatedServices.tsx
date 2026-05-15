import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllServices } from "@/lib/db/queries/services";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface RelatedServicesProps {
  currentSlug: string;
  title?: string;
  limit?: number;
}

export default function RelatedServices({
  currentSlug,
  title = "Также вам может быть интересно",
  limit = 3,
}: RelatedServicesProps) {
  const all = getAllServices();
  const related = all
    .filter((s) => s.slug !== currentSlug)
    .slice(0, limit);

  if (related.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-bg to-[#0E0E0E]">
      <div className="container-main">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-text mb-8 text-center">
            {title}
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map((service, i) => {
            const cleanTitle = service.h1
              .replace(/ в Казани.*/, "")
              .replace(/ — .*/, "");
            return (
              <AnimatedSection key={service.slug} delay={i * 0.08}>
                <Link
                  href={service.url}
                  className="group relative flex flex-col justify-end overflow-hidden rounded-[var(--radius-card)] border border-border/60 transition-all duration-300 hover:border-accent-gold/40 hover:-translate-y-0.5 h-[200px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/hero/${service.slug}.webp`}
                    alt={cleanTitle}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 from-10% via-black/55 via-55% to-black/20" />
                  <div className="relative z-10 p-4">
                    <h3 className="font-bold text-text group-hover:text-accent-gold transition-colors text-base line-clamp-1">
                      {cleanTitle}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                      {service.subtitle}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-text-secondary group-hover:text-accent-gold transition-all">
                      Подробнее
                      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
