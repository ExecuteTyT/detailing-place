"use client";

import { useRef, useEffect, useSyncExternalStore } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { reachGoal, goals } from "@/lib/analytics";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(endDate: string): TimeLeft | null {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function useCountdown(endDate: string) {
  const callbacksRef = useRef(new Set<() => void>());

  const subscribe = (cb: () => void) => {
    callbacksRef.current.add(cb);
    const interval = setInterval(() => {
      callbacksRef.current.forEach((fn) => fn());
    }, 1000);
    return () => {
      callbacksRef.current.delete(cb);
      clearInterval(interval);
    };
  };

  const getSnapshot = () => {
    const tl = calcTimeLeft(endDate);
    if (!tl) return "expired";
    return `${tl.days}:${tl.hours}:${tl.minutes}:${tl.seconds}`;
  };

  const getServerSnapshot = () => "server";

  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (snapshot === "expired" || snapshot === "server") return null;
  const [days, hours, minutes, seconds] = snapshot.split(":").map(Number);
  return { days, hours, minutes, seconds } as TimeLeft;
}

function TimeBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[32px] sm:min-w-[36px]">
      <span className="font-mono text-sm sm:text-[15px] font-semibold text-text tabular-nums leading-none">
        {value}
      </span>
      <span className="text-[10px] text-text-secondary/70 mt-1 uppercase tracking-widest leading-none">
        {label}
      </span>
    </div>
  );
}

interface SeasonalTimerProps {
  className?: string;
}

export default function SeasonalTimer({ className }: SeasonalTimerProps) {
  const { seasonalOffer } = useSiteData();
  const timeLeft = useCountdown(seasonalOffer?.endDate ?? "");
  const timerFired = useRef(false);

  useEffect(() => {
    if (timeLeft && !timerFired.current) {
      timerFired.current = true;
      reachGoal(goals.TIMER_VIEW);
    }
  }, [timeLeft]);

  if (!seasonalOffer || !timeLeft) return null;

  return (
    <div className={cn("relative z-20 bg-[#0C0B09] border-b border-[#2A2723]", className)}>
      {/* Refined subtle gradient backing */}
      <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/5 via-transparent to-accent-cyan/5 pointer-events-none" />

      <div className="container-main relative z-10 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">

          {/* Left: Offer Content */}
          <div className="flex items-start md:items-center gap-3 w-full md:w-auto">
            {/* Elegant Icon Container */}
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#1E1C18] border border-[#2A2723] hidden sm:flex">
              <Sparkles size={16} className="text-accent-gold opacity-90" strokeWidth={1.5} />
            </div>

            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <span className="font-display font-bold text-text uppercase tracking-wider text-xs sm:text-sm">
                {seasonalOffer.title}
              </span>
              <span className="hidden md:block w-1 h-1 rounded-full bg-border" />
              <span className="text-text-secondary text-xs sm:text-sm">
                {seasonalOffer.description}
              </span>
            </div>
          </div>

          {/* Right: Timer & CTA */}
          <div className="flex items-center justify-between md:justify-end gap-5 lg:gap-8 w-full md:w-auto">
            {/* Clean Timer */}
            <div className="flex items-center gap-1 sm:gap-2">
              <TimeBox value={pad(timeLeft.days)} label="дн" />
              <span className="text-border font-bold pb-3">:</span>
              <TimeBox value={pad(timeLeft.hours)} label="ч" />
              <span className="text-border font-bold pb-3">:</span>
              <TimeBox value={pad(timeLeft.minutes)} label="мин" />
              <span className="text-border font-bold pb-3">:</span>
              <TimeBox value={pad(timeLeft.seconds)} label="сек" />
            </div>

            {/* Ghost / Outline style CTA for sleek look */}
            <a
              href="#cta-form"
              className="group flex flex-shrink-0 items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-gold/40 text-xs font-semibold text-text transition-all duration-300"
            >
              Записаться
              <ArrowRight size={14} className="text-accent-gold group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
}
