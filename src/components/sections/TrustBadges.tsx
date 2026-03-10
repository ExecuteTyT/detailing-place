import type { TrustBadge } from "@/lib/types";
import Card from "@/components/ui/Card";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

interface TrustBadgesProps {
  badges: TrustBadge[];
  brands?: readonly string[];
  className?: string;
}

export default function TrustBadges({ badges, brands, className }: TrustBadgesProps) {
  return (
    <section className={cn("section-padding section-warm", className)}>
      <div className="container-main">
        {/* Trust cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <AnimatedSection key={badge.title} delay={index * 0.1}>
                <Card glowTop>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-gold/12 to-accent-gold/4 flex items-center justify-center shadow-[var(--shadow-glow-gold)]">
                      <Icon size={28} className="text-accent-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text text-base">{badge.title}</h3>
                      <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Partner brands */}
        {brands && brands.length > 0 && (
          <AnimatedSection className="mt-10">
            <p className="text-xs text-text-secondary uppercase tracking-widest text-center mb-5">
              Работаем с премиальными брендами
            </p>
            <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="px-4 py-2 rounded-full bg-bg-hover/60 border border-border text-sm font-semibold text-text-secondary/80 whitespace-nowrap"
                >
                  {brand}
                </span>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
