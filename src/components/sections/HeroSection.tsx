import Badge from "@/components/ui/Badge";
import HeroBackground from "@/components/ui/HeroBackground";
import CTAForm from "./CTAForm";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface HeroSectionProps {
  /** Path to hero background image, e.g. "/images/hero/ppf.jpg" */
  backgroundImage?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  showSimpleForm?: boolean;
  serviceName?: string;
  className?: string;
  /** Service-specific colored gradient overlay (CSS background value) */
  themeGradient?: string;
  /** Service icon rendered as large watermark in the background */
  ThemeIcon?: LucideIcon;
}

export default function HeroSection({
  backgroundImage,
  title,
  subtitle,
  badge,
  showSimpleForm = true,
  serviceName,
  className,
  themeGradient,
  ThemeIcon,
}: HeroSectionProps) {
  const hasPhoto = !!backgroundImage;

  return (
    <section
      className={cn(
        "relative min-h-[60vh] md:min-h-[85vh] lg:min-h-[90vh] flex items-end overflow-hidden",
        className
      )}
    >
      {/* Layer 1: Base gradient (always present, visible when no photo) */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg-card to-bg-gradient-end" />

      {/* Layer 2: Photo background (gracefully handles missing images) */}
      {backgroundImage && (
        <HeroBackground src={backgroundImage} alt={title} />
      )}

      {/* Layer 3: Dark overlay — lighter when photo present to let it show through */}
      <div
        className="absolute inset-0"
        style={{
          background: hasPhoto
            ? "linear-gradient(to bottom, rgba(12,11,9,0.35) 0%, rgba(12,11,9,0.7) 50%, rgba(12,11,9,0.92) 100%)"
            : "linear-gradient(to bottom, rgba(12,11,9,0.6) 0%, rgba(12,11,9,0.92) 100%)",
        }}
      />

      {/* Layer 4: Service-specific theme gradient — only when no photo */}
      {themeGradient && !hasPhoto && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: themeGradient }}
        />
      )}

      {/* Layer 5: Service icon watermark — only when no photo */}
      {ThemeIcon && !hasPhoto && (
        <div className="absolute top-[15%] right-[8%] pointer-events-none opacity-[0.035]">
          <ThemeIcon size={280} strokeWidth={0.5} className="text-text" />
        </div>
      )}

      {/* Layer 6: Subtle grid pattern — only when no photo */}
      {!hasPhoto && (
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,169,126,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,126,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      )}

      {/* Decorative glows — only when no photo */}
      {!hasPhoto && (
        <>
          <div className="absolute top-1/3 -left-24 w-72 h-72 bg-accent-cyan/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 -right-24 w-72 h-72 bg-accent-gold/3 rounded-full blur-3xl" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 container-main w-full pb-8 md:pb-20 pt-20 md:pt-24">
        {badge && (
          <div className="mb-4">
            <Badge variant="new">{badge}</Badge>
          </div>
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-text leading-tight max-w-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {showSimpleForm && (
          <div className="mt-8 max-w-2xl">
            <CTAForm variant="hero" serviceName={serviceName} />
          </div>
        )}
      </div>
    </section>
  );
}
