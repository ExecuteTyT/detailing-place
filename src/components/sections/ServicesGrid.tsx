"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { HomepageService } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

/* ───────── Visual config per service ───────── */

/** Services that span 2 columns in lg grid */
const FEATURED_SLUGS = new Set([
  "ppf",
  "tonirovka",
  "ustanovka-linz",
  "polirovka",
]);

/* ───────── Component ───────── */

interface ServicesGridProps {
  services: HomepageService[];
  className?: string;
}

export default function ServicesGrid({ services, className }: ServicesGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 6;
  const visibleServices = isExpanded
    ? services
    : services.slice(0, INITIAL_COUNT);

  return (
    <section className={cn("section-padding", className)}>
      <div className="container-main">
        <AnimatedSection>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-text">
              Наши услуги
            </h2>
            <p className="mt-2 text-text-secondary">
              12 направлений для защиты и преображения вашего автомобиля
            </p>
          </div>
        </AnimatedSection>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          style={{ gridAutoFlow: "dense" }}
        >
          {visibleServices.map((service, index) => {
            const isFeatured = FEATURED_SLUGS.has(service.slug);

            return (
              <AnimatedSection
                key={service.slug}
                delay={(index % INITIAL_COUNT) * 0.05}
                className={cn(isFeatured && "sm:col-span-2")}
              >
                <Link
                  href={service.url}
                  className={cn(
                    "group relative flex flex-col justify-end overflow-hidden",
                    "rounded-[var(--radius-card)] border border-border/60",
                    "transition-all duration-300",
                    "hover:border-accent-gold/40 hover:shadow-lg hover:-translate-y-0.5",
                    "h-[220px] sm:h-[240px]"
                  )}
                >
                  {/* Service photo */}
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 from-10% via-black/50 via-50% to-black/20" />

                  {/* Content */}
                  <div className="relative z-10 p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-text group-hover:text-accent-gold transition-colors text-sm sm:text-base line-clamp-1">
                        {service.title}
                      </h3>
                      {service.isNew && <Badge variant="new">NEW</Badge>}
                    </div>

                    {isFeatured && service.tagline && (
                      <p className="text-xs text-text-secondary line-clamp-1 mb-1">
                        {service.tagline}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-base sm:text-lg font-bold font-display text-accent-gold">
                        {service.price}
                      </p>
                      <span className="flex items-center gap-1 text-xs sm:text-sm text-text-secondary group-hover:text-accent-gold transition-all duration-300">
                        Подробнее
                        <ArrowUpRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                  </div>

                  {/* Hover outer glow */}
                  <div
                    className="absolute inset-0 rounded-[var(--radius-card)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: "inset 0 1px 0 0 rgba(212,184,48,0.15), 0 0 30px rgba(212,184,48,0.1)",
                    }}
                  />

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </AnimatedSection>
            );
          })}
        </div>

        {services.length > INITIAL_COUNT && (
          <AnimatedSection delay={0.3}>
            <div className="mt-8 flex justify-center">
              <Button
                variant={isExpanded ? "outline" : "secondary"}
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full sm:w-auto"
                icon={ChevronDown}
                iconPosition="right"
              >
                {isExpanded
                  ? "Скрыть часть услуг"
                  : `Показать еще ${services.length - INITIAL_COUNT} услуг`}
              </Button>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
