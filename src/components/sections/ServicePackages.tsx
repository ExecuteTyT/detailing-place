"use client";

import { useState } from "react";
import { Check, Car, Truck, Crown, Zap } from "lucide-react";
import type { ServicePackage } from "@/lib/services";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

/* ───────── Car class pricing ───────── */

const CAR_CLASSES = [
  { id: "sedan", label: "Седан", shortLabel: "Седан", icon: Car, multiplier: 1 },
  { id: "crossover", label: "Кроссовер", shortLabel: "Кросс.", icon: Truck, multiplier: 1.2 },
  { id: "suv", label: "Внедорожник", shortLabel: "Внедор.", icon: Zap, multiplier: 1.4 },
  { id: "premium", label: "Премиум", shortLabel: "Прем.", icon: Crown, multiplier: 1.7 },
];

function parsePrice(price: string): number {
  return parseInt(price.replace(/\D/g, "")) || 0;
}

function formatPrice(num: number): string {
  return num.toLocaleString("ru-RU") + "₽";
}

function adjustPrice(basePrice: string, multiplier: number): string {
  const num = parsePrice(basePrice);
  if (!num) return basePrice;
  const adjusted = Math.round((num * multiplier) / 1000) * 1000;
  return "от " + formatPrice(adjusted);
}

/* ───────── Component ───────── */

interface ServicePackagesProps {
  packages: ServicePackage[];
  serviceName?: string;
  className?: string;
}

export default function ServicePackages({
  packages,
  serviceName,
  className,
}: ServicePackagesProps) {
  const [selectedClass, setSelectedClass] = useState("sedan");

  const currentClass = CAR_CLASSES.find((c) => c.id === selectedClass) || CAR_CLASSES[0];

  function scrollToCTA() {
    const el = document.getElementById("cta-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className={cn("section-padding", className)}>
      <div className="container-main">
        <AnimatedSection>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-text text-center mb-3">
            Стоимость услуг
          </h2>
          {serviceName && (
            <p className="text-center text-text-secondary mb-6">{serviceName}</p>
          )}

          {/* ───── Car class selector ───── */}
          <div className="mb-8">
            <p className="text-sm text-text-secondary text-center mb-3">
              Выберите класс автомобиля
            </p>
            <div className="flex justify-center gap-2 sm:gap-3">
              {CAR_CLASSES.map((cls) => {
                const Icon = cls.icon;
                const isActive = selectedClass === cls.id;
                return (
                  <button
                    key={cls.id}
                    onClick={() => setSelectedClass(cls.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 px-3 sm:px-5 py-3 rounded-[var(--radius-card)] border transition-all min-h-[44px] cursor-pointer",
                      isActive
                        ? "border-accent-gold bg-accent-gold/10 shadow-[var(--shadow-glow-gold)]"
                        : "border-border bg-bg-card hover:border-accent-gold/30 hover:bg-bg-hover"
                    )}
                  >
                    <Icon
                      size={20}
                      className={cn(
                        "transition-colors",
                        isActive ? "text-accent-gold" : "text-text-secondary"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-semibold transition-colors",
                        isActive ? "text-accent-gold" : "text-text-secondary"
                      )}
                    >
                      <span className="hidden sm:inline">{cls.label}</span>
                      <span className="sm:hidden">{cls.shortLabel}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* ───── Package cards ───── */}
        <div
          className={cn(
            "grid gap-4 md:gap-6",
            packages.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
          )}
        >
          {packages.map((pkg, index) => (
            <AnimatedSection key={pkg.name} delay={index * 0.1}>
              <div
                className={cn(
                  "card p-5 md:p-6 flex flex-col relative h-full",
                  pkg.isPopular
                    ? "border-accent-gold/60 border-2 shadow-[var(--shadow-glow-gold)] card-glow-top"
                    : ""
                )}
              >
                {/* Popular gradient top bar */}
                {pkg.isPopular && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-[var(--radius-card)] bg-gradient-to-r from-accent-gold to-accent-cyan/40" />
                )}

                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="popular">ХИТ</Badge>
                  </div>
                )}

                <h3 className="text-lg font-bold font-display text-text">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-sm text-text-secondary">
                  {pkg.description}
                </p>

                {/* Dynamic price based on selected class */}
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold font-display text-accent-gold transition-all">
                    {adjustPrice(pkg.price, currentClass.multiplier)}
                  </p>
                </div>
                {pkg.duration && (
                  <p className="text-xs text-text-secondary mt-1">
                    Защита {pkg.duration}
                  </p>
                )}

                <ul className="mt-5 space-y-2.5 flex-1">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-text-secondary"
                    >
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-cyan/10 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-accent-cyan" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={pkg.isPopular ? "primary" : "secondary"}
                  size="md"
                  className={cn(
                    "mt-5 w-full",
                    pkg.isPopular && "btn-cta-glow"
                  )}
                  onClick={scrollToCTA}
                >
                  Записаться
                </Button>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* ───── Price comparison table ───── */}
        <AnimatedSection delay={0.3}>
          <div className="mt-8 card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border bg-bg-hover/30">
              <h3 className="font-bold font-display text-text text-sm sm:text-base">
                Полный прайс-лист
              </h3>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 font-semibold text-text-secondary">
                      Пакет
                    </th>
                    {CAR_CLASSES.map((cls) => (
                      <th
                        key={cls.id}
                        className={cn(
                          "text-center px-4 py-3 font-semibold transition-colors",
                          selectedClass === cls.id
                            ? "text-accent-gold bg-accent-gold/5"
                            : "text-text-secondary"
                        )}
                      >
                        {cls.label}
                      </th>
                    ))}
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr
                      key={pkg.name}
                      className={cn(
                        "border-b border-border/50 last:border-0 transition-colors",
                        pkg.isPopular && "bg-accent-gold/[0.03]"
                      )}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text">
                            {pkg.name}
                          </span>
                          {pkg.isPopular && (
                            <Badge variant="popular">ХИТ</Badge>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {pkg.description}
                        </p>
                      </td>
                      {CAR_CLASSES.map((cls) => (
                        <td
                          key={cls.id}
                          className={cn(
                            "text-center px-4 py-4 font-bold font-display transition-colors",
                            selectedClass === cls.id
                              ? "text-accent-gold bg-accent-gold/5"
                              : "text-text"
                          )}
                        >
                          {adjustPrice(pkg.price, cls.multiplier)}
                        </td>
                      ))}
                      <td className="px-4 py-4">
                        <button
                          onClick={scrollToCTA}
                          className="text-xs font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Записаться →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-border/50">
              {packages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={cn(
                    "px-5 py-4",
                    pkg.isPopular && "bg-accent-gold/[0.03]"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text text-sm">
                        {pkg.name}
                      </span>
                      {pkg.isPopular && (
                        <Badge variant="popular">ХИТ</Badge>
                      )}
                    </div>
                    <button
                      onClick={scrollToCTA}
                      className="text-xs font-semibold text-accent-gold cursor-pointer"
                    >
                      Записаться →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {CAR_CLASSES.map((cls) => (
                      <div
                        key={cls.id}
                        className={cn(
                          "text-center py-2 px-3 rounded-lg text-xs transition-colors",
                          selectedClass === cls.id
                            ? "bg-accent-gold/10 border border-accent-gold/30"
                            : "bg-bg-hover/50 border border-transparent"
                        )}
                      >
                        <span className="text-text-secondary block">
                          {cls.shortLabel}
                        </span>
                        <span
                          className={cn(
                            "font-bold font-display",
                            selectedClass === cls.id
                              ? "text-accent-gold"
                              : "text-text"
                          )}
                        >
                          {adjustPrice(pkg.price, cls.multiplier)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="px-5 py-3 border-t border-border bg-bg-hover/20">
              <p className="text-xs text-text-secondary/70">
                * Цены ориентировочные. Точная стоимость рассчитывается после
                осмотра автомобиля.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
