"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Sparkles,
  Droplets,
  Sun,
  Volume2,
  PaintBucket,
  Lightbulb,
  SlidersHorizontal,
  CircleDot,
  GlassWater,
  CloudRain,
  Globe,
  Wrench,
  ArrowUpRight,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import type { HomepageService } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

/* ───────── Visual config per service ───────── */

interface ServiceVisual {
  icon: LucideIcon;
  /** CSS radial-gradient for the card background */
  gradient: string;
  /** RGBA for the glow effect on hover */
  glowColor: string;
  /** If true, spans 2 columns in lg grid */
  featured?: boolean;
}

const VISUALS: Record<string, ServiceVisual> = {
  ppf: {
    icon: Shield,
    gradient:
      "radial-gradient(ellipse at 25% 30%, rgba(59,130,246,0.22) 0%, rgba(67,56,202,0.08) 40%, transparent 70%)",
    glowColor: "rgba(59,130,246,0.15)",
    featured: true,
  },
  polirovka: {
    icon: Sparkles,
    gradient:
      "radial-gradient(ellipse at 70% 25%, rgba(245,158,11,0.2) 0%, rgba(217,119,6,0.07) 40%, transparent 70%)",
    glowColor: "rgba(245,158,11,0.15)",
  },
  himchistka: {
    icon: Droplets,
    gradient:
      "radial-gradient(ellipse at 30% 60%, rgba(20,184,166,0.2) 0%, rgba(6,148,162,0.07) 40%, transparent 70%)",
    glowColor: "rgba(20,184,166,0.15)",
  },
  shumoizolyaciya: {
    icon: Volume2,
    gradient:
      "radial-gradient(ellipse at 60% 35%, rgba(139,92,246,0.2) 0%, rgba(109,40,217,0.07) 40%, transparent 70%)",
    glowColor: "rgba(139,92,246,0.15)",
  },
  antihrom: {
    icon: PaintBucket,
    gradient:
      "radial-gradient(ellipse at 50% 25%, rgba(161,161,170,0.14) 0%, rgba(82,82,91,0.05) 40%, transparent 70%)",
    glowColor: "rgba(161,161,170,0.12)",
  },
  tonirovka: {
    icon: Sun,
    gradient:
      "radial-gradient(ellipse at 75% 20%, rgba(249,115,22,0.2) 0%, rgba(234,88,12,0.07) 40%, transparent 70%)",
    glowColor: "rgba(249,115,22,0.15)",
    featured: true,
  },
  "ustanovka-linz": {
    icon: Lightbulb,
    gradient:
      "radial-gradient(ellipse at 45% 20%, rgba(250,204,21,0.2) 0%, rgba(234,179,8,0.07) 40%, transparent 70%)",
    glowColor: "rgba(250,204,21,0.15)",
    featured: true,
  },
  "regulirovka-far": {
    icon: SlidersHorizontal,
    gradient:
      "radial-gradient(ellipse at 40% 50%, rgba(100,116,139,0.14) 0%, rgba(71,85,105,0.05) 40%, transparent 70%)",
    glowColor: "rgba(100,116,139,0.12)",
  },
  "polirovka-stekol": {
    icon: CircleDot,
    gradient:
      "radial-gradient(ellipse at 30% 35%, rgba(34,211,238,0.2) 0%, rgba(6,182,212,0.07) 40%, transparent 70%)",
    glowColor: "rgba(34,211,238,0.15)",
  },
  "polirovka-far": {
    icon: CircleDot,
    gradient:
      "radial-gradient(ellipse at 60% 40%, rgba(251,191,36,0.16) 0%, rgba(245,158,11,0.06) 40%, transparent 70%)",
    glowColor: "rgba(251,191,36,0.12)",
  },
  antidozhd: {
    icon: CloudRain,
    gradient:
      "radial-gradient(ellipse at 35% 30%, rgba(56,189,248,0.2) 0%, rgba(14,165,233,0.07) 40%, transparent 70%)",
    glowColor: "rgba(56,189,248,0.15)",
  },
  "rusifikaciya-avto": {
    icon: Globe,
    gradient:
      "radial-gradient(ellipse at 70% 50%, rgba(239,68,68,0.16) 0%, rgba(185,28,28,0.06) 40%, transparent 70%)",
    glowColor: "rgba(239,68,68,0.12)",
    featured: true,
  },
  keramika: {
    icon: GlassWater,
    gradient:
      "radial-gradient(ellipse at 40% 30%, rgba(56,189,248,0.18) 0%, rgba(14,165,233,0.06) 40%, transparent 70%)",
    glowColor: "rgba(56,189,248,0.12)",
  },
};

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
            const visual = VISUALS[service.slug] || {
              icon: Wrench,
              gradient:
                "radial-gradient(ellipse at 50% 50%, rgba(200,169,126,0.12) 0%, transparent 70%)",
              glowColor: "rgba(200,169,126,0.1)",
            };
            const Icon = visual.icon;
            const isFeatured = !!visual.featured;

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
                    "rounded-[var(--radius-card)] border border-border/60 bg-bg-card",
                    "transition-all duration-300",
                    "hover:border-accent-gold/40 hover:shadow-lg hover:-translate-y-0.5",
                    "h-[220px] sm:h-[240px]"
                  )}
                >
                  {/* Service gradient glow */}
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ background: visual.gradient }}
                  />
                  {/* Intensified glow layer on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: visual.gradient }}
                  />

                  {/* Center icon with glow halo */}
                  <div className="absolute inset-0 flex items-center justify-center -translate-y-6">
                    <div className="relative">
                      <div
                        className="absolute -inset-10 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                        style={{ background: visual.glowColor }}
                      />
                      <Icon
                        size={isFeatured ? 56 : 44}
                        strokeWidth={1.2}
                        className="relative text-text/30 group-hover:text-text/55 transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Dark gradient overlay at bottom for text readability */}
                  <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-bg-card from-20% via-bg-card/85 via-50% to-transparent" />

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
                      boxShadow: `inset 0 1px 0 0 rgba(200,169,126,0.15), 0 0 30px ${visual.glowColor}`,
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
