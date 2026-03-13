"use client";

import { useState } from "react";
import { Check, Car } from "lucide-react";
import type { ServicePackage, ElementPrice } from "@/lib/types";
import { useSiteData } from "@/lib/site-data";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

/* ───────── Helpers ───────── */

/** Whether any package uses multi-class pricing (length > 1) */
function hasClassPricing(packages: ServicePackage[]): boolean {
  return packages.some((pkg) => pkg.classPrices.length > 1);
}

/** Get displayed price for a package given the selected class index */
function getPrice(pkg: ServicePackage, classIndex: number): string {
  if (pkg.classPrices.length === 1) {
    return pkg.classPrices[0] || "Дог.";
  }
  const price = pkg.classPrices[classIndex];
  return price ?? "Дог.";
}

/** Get displayed price for an element price row */
function getElementPrice(ep: ElementPrice, classIndex: number): string {
  if (ep.classPrices.length === 1) {
    return ep.classPrices[0] || "Дог.";
  }
  const price = ep.classPrices[classIndex];
  return price ?? "Дог.";
}

/* ───────── Component ───────── */

interface ServicePackagesProps {
  packages: ServicePackage[];
  elementPrices?: ElementPrice[];
  serviceName?: string;
  className?: string;
}

export default function ServicePackages({
  packages,
  elementPrices,
  serviceName,
  className,
}: ServicePackagesProps) {
  const { carClasses } = useSiteData();
  const [selectedClass, setSelectedClass] = useState(0);
  const showClassSelector = hasClassPricing(packages) || (elementPrices && elementPrices.some(ep => ep.classPrices.length > 1));

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

          {/* ───── Car class selector (only if multi-class pricing exists) ───── */}
          {showClassSelector && (
            <div className="mb-8">
              <p className="text-sm text-text-secondary text-center mb-3">
                Выберите класс автомобиля
              </p>
              <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                {carClasses.map((cls, idx) => {
                  const isActive = selectedClass === idx;
                  return (
                    <button
                      key={cls.id}
                      onClick={() => setSelectedClass(idx)}
                      className={cn(
                        "flex flex-col items-center gap-1 px-3 sm:px-4 py-2.5 rounded-[var(--radius-card)] border transition-all min-h-[44px] cursor-pointer",
                        isActive
                          ? "border-accent-gold bg-accent-gold/10 shadow-[var(--shadow-glow-gold)]"
                          : "border-border bg-bg-card hover:border-accent-gold/30 hover:bg-bg-hover"
                      )}
                    >
                      <Car
                        size={18}
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
                        {cls.label}
                      </span>
                      <span className="text-[10px] text-text-secondary/60 hidden sm:block">
                        {cls.example.split(",")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </AnimatedSection>

        {/* ───── Package cards ───── */}
        <div
          className={cn(
            "grid gap-4 md:gap-6",
            packages.length === 3 ? "md:grid-cols-3" : packages.length === 2 ? "md:grid-cols-2" : "max-w-lg mx-auto"
          )}
        >
          {packages.map((pkg, index) => (
            <AnimatedSection key={pkg.name} delay={index * 0.1}>
              <div className="relative">
              <div
                className={cn(
                  "card p-5 md:p-6 flex flex-col relative h-full",
                  pkg.isPopular
                    ? "border-accent-gold/50 border-2 shadow-[var(--shadow-glow-gold)]"
                    : ""
                )}
              >
                {/* Popular top accent bar + badge */}
                {pkg.isPopular && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-[var(--radius-card)] bg-accent-gold" />
                    <div className="flex justify-start mb-3">
                      <Badge variant="popular">ХИТ</Badge>
                    </div>
                  </>
                )}

                <h3 className="text-lg font-bold font-display text-text">
                  {pkg.name}
                </h3>
                <p className="mt-1 text-sm text-text-secondary">
                  {pkg.description}
                </p>

                {/* Dynamic price */}
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold font-display text-accent-gold transition-all">
                    {getPrice(pkg, selectedClass)}
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
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-gold/10 flex items-center justify-center mt-0.5">
                        <Check size={12} className="text-accent-gold" />
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
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* ───── Price comparison table (only for multi-class services) ───── */}
        {showClassSelector && packages.some(pkg => pkg.classPrices.length > 1) && (
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
                      {carClasses.map((cls, idx) => (
                        <th
                          key={cls.id}
                          className={cn(
                            "text-center px-4 py-3 font-semibold transition-colors",
                            selectedClass === idx
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
                    {packages.filter(pkg => pkg.classPrices.length > 1).map((pkg) => (
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
                        {carClasses.map((cls, idx) => (
                          <td
                            key={cls.id}
                            className={cn(
                              "text-center px-4 py-4 font-bold font-display transition-colors whitespace-nowrap",
                              selectedClass === idx
                                ? "text-accent-gold bg-accent-gold/5"
                                : "text-text"
                            )}
                          >
                            {getPrice(pkg, idx)}
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
                {packages.filter(pkg => pkg.classPrices.length > 1).map((pkg) => (
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
                      {carClasses.map((cls, idx) => (
                        <div
                          key={cls.id}
                          className={cn(
                            "text-center py-2 px-3 rounded-lg text-xs transition-colors",
                            selectedClass === idx
                              ? "bg-accent-gold/10 border border-accent-gold/30"
                              : "bg-bg-hover/50 border border-transparent"
                          )}
                        >
                          <span className="text-text-secondary block">
                            {cls.label}
                          </span>
                          <span
                            className={cn(
                              "font-bold font-display",
                              selectedClass === idx
                                ? "text-accent-gold"
                                : "text-text"
                            )}
                          >
                            {getPrice(pkg, idx)}
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
                  осмотра автомобиля. 5 класс — цена договорная.
                </p>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ───── Element pricing table ───── */}
        {elementPrices && elementPrices.length > 0 && (
          <AnimatedSection delay={0.4}>
            <div className="mt-8 card p-0 overflow-hidden">
              <div className="px-5 py-4 border-b border-border bg-bg-hover/30">
                <h3 className="font-bold font-display text-text text-sm sm:text-base">
                  Поэлементный прайс
                </h3>
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-3 font-semibold text-text-secondary">
                        Элемент
                      </th>
                      {elementPrices.some(ep => ep.classPrices.length > 1) ? (
                        carClasses.map((cls, idx) => (
                          <th
                            key={cls.id}
                            className={cn(
                              "text-center px-4 py-3 font-semibold transition-colors",
                              selectedClass === idx
                                ? "text-accent-gold bg-accent-gold/5"
                                : "text-text-secondary"
                            )}
                          >
                            {cls.label}
                          </th>
                        ))
                      ) : (
                        <th className="text-center px-4 py-3 font-semibold text-text-secondary">
                          Цена
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {elementPrices.map((ep) => (
                      <tr
                        key={ep.element}
                        className="border-b border-border/50 last:border-0"
                      >
                        <td className="px-5 py-3 font-medium text-text">
                          {ep.element}
                        </td>
                        {ep.classPrices.length > 1 ? (
                          carClasses.map((cls, idx) => (
                            <td
                              key={cls.id}
                              className={cn(
                                "text-center px-4 py-3 font-bold font-display whitespace-nowrap transition-colors",
                                selectedClass === idx
                                  ? "text-accent-gold bg-accent-gold/5"
                                  : "text-text"
                              )}
                            >
                              {getElementPrice(ep, idx)}
                            </td>
                          ))
                        ) : (
                          <td
                            className="text-center px-4 py-3 font-bold font-display text-text"
                            colSpan={elementPrices.some(e => e.classPrices.length > 1) ? carClasses.length : 1}
                          >
                            {ep.classPrices[0]}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <div className="sm:hidden divide-y divide-border/50">
                {elementPrices.map((ep) => (
                  <div key={ep.element} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text font-medium">{ep.element}</span>
                      <span className="text-sm font-bold font-display text-accent-gold">
                        {getElementPrice(ep, selectedClass)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
