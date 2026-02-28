"use client";

import { useRef, useSyncExternalStore } from "react";
import { SEASONAL_OFFER } from "@/lib/constants";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col items-center">
      <span className="bg-bg-card border border-border/50 rounded-md px-2 py-1 text-sm font-mono font-bold text-accent-gold min-w-[36px] text-center">
        {value}
      </span>
      <span className="text-[10px] text-text-secondary/60 mt-0.5">{label}</span>
    </div>
  );
}

interface SeasonalTimerProps {
  className?: string;
}

export default function SeasonalTimer({ className }: SeasonalTimerProps) {
  const timeLeft = useCountdown(SEASONAL_OFFER.endDate);

  if (!timeLeft) return null;

  return (
    <div className={cn("bg-gradient-to-r from-accent-gold/8 via-transparent to-accent-red/8 border-b border-border/50", className)}>
      <div className="container-main py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <span className="text-sm font-bold text-text flex items-center gap-1.5">
          <span className="text-base">&#x1F525;</span>
          {SEASONAL_OFFER.title}: {SEASONAL_OFFER.description}
        </span>

        <div className="flex items-center gap-1">
          <TimeBox value={pad(timeLeft.days)} label="дн" />
          <span className="text-accent-gold/60 font-bold pb-3">:</span>
          <TimeBox value={pad(timeLeft.hours)} label="ч" />
          <span className="text-accent-gold/60 font-bold pb-3">:</span>
          <TimeBox value={pad(timeLeft.minutes)} label="мин" />
          <span className="text-accent-gold/60 font-bold pb-3">:</span>
          <TimeBox value={pad(timeLeft.seconds)} label="сек" />
        </div>

        <a
          href="#cta-form"
          className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent-gold/10 border border-accent-gold/25 text-xs font-bold text-accent-gold hover:bg-accent-gold/20 transition-colors min-h-[44px] whitespace-nowrap"
        >
          Записаться &rarr;
        </a>
      </div>
    </div>
  );
}
