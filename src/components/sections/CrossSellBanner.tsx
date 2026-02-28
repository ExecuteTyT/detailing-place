import { ArrowRight } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

interface CrossSellBannerProps {
  title: string;
  description: string;
  href: string;
  buttonText?: string;
  discount?: string;
  className?: string;
}

export default function CrossSellBanner({
  title,
  description,
  href,
  buttonText = "Подробнее",
  discount,
  className,
}: CrossSellBannerProps) {
  return (
    <section className={cn("section-padding", className)}>
      <div className="container-main">
        <AnimatedSection>
          <div className="relative gradient-section rounded-[var(--radius-card)] border border-border border-l-[3px] border-l-accent-gold p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 overflow-hidden shadow-[var(--shadow-card)]">
            {/* Decorative glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-accent-gold/3 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl md:text-2xl font-bold font-display text-text">
                  {title}
                </h2>
                {discount && <Badge variant="discount">&minus;{discount}</Badge>}
              </div>
              <p className="text-text-secondary">{description}</p>
            </div>

            <Button
              variant="secondary"
              size="lg"
              href={href}
              className="flex-shrink-0 relative z-10 gap-2"
            >
              {buttonText}
              <ArrowRight size={16} />
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
