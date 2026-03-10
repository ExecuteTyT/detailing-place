"use client";

import { Car } from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";

interface LiveStatusProps {
  className?: string;
}

export default function LiveStatus({ className }: LiveStatusProps) {
  const { liveStatus } = useSiteData();
  return (
    <section className={cn("py-6 md:py-10", className)}>
      <div className="container-main">
        <AnimatedSection>
          <div className="card card-glow-top p-5 md:p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                Live
              </span>
              <h2 className="text-lg font-bold font-display text-text">
                В работе: <span className="text-accent-gold">{liveStatus.length} авто</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {liveStatus.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-button)] bg-bg-hover/50 border-l-2 border-accent-gold/20"
                >
                  <Car size={16} className="text-accent-gold/70 flex-shrink-0" />
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-semibold text-text truncate">{item.car}</span>
                    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                    </span>
                    <span className="text-xs text-text-secondary truncate">{item.service}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
