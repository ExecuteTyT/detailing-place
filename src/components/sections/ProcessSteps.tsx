import type { ProcessStep } from "@/lib/types";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

interface ProcessStepsProps {
  steps: ProcessStep[];
  className?: string;
}

export default function ProcessSteps({ steps, className }: ProcessStepsProps) {
  return (
    <section className={cn("section-padding section-warm section-spotlight", className)}>
      <div className="container-main">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-text text-center mb-10">
            Как мы работаем
          </h2>
        </AnimatedSection>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:flex items-start justify-between relative">
          {/* Gradient connecting line */}
          <div
            className="absolute top-6 left-[10%] right-[10%] h-0.5"
            style={{
              background: "linear-gradient(90deg, var(--color-accent-gold), var(--color-accent-lime))",
              opacity: 0.3,
            }}
          />

          {steps.map((step, i) => (
            <AnimatedSection key={i} delay={i * 0.1} className="relative flex flex-col items-center text-center flex-1 px-2">
              {/* Number circle with glow */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold/80 text-bg flex items-center justify-center text-sm font-bold shadow-[var(--shadow-glow-gold)]">
                {i + 1}
              </div>
              <h3 className="mt-3 text-sm font-bold text-text">{step.title}</h3>
              <p className="mt-1 text-xs text-text-secondary leading-relaxed">{step.description}</p>
            </AnimatedSection>
          ))}
        </div>

        {/* Mobile: vertical stack with connecting line */}
        <div className="md:hidden relative">
          {/* Vertical connecting line */}
          <div
            className="absolute left-[18px] top-0 bottom-0 w-0.5"
            style={{
              background: "linear-gradient(180deg, var(--color-accent-gold) 0%, var(--color-accent-lime) 100%)",
              opacity: 0.2,
            }}
          />

          <div className="space-y-5">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start relative">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold/80 text-bg flex items-center justify-center text-sm font-bold shadow-[var(--shadow-glow-gold)] relative z-10">
                  {i + 1}
                </div>
                <div className="pt-1">
                  <h3 className="text-base font-bold text-text">{step.title}</h3>
                  <p className="mt-0.5 text-sm text-text-secondary">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
