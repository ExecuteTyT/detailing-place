"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { reachGoal, goals } from "@/lib/analytics";
import { cn } from "@/lib/utils";

function useRandomLoad() {
  const valueRef = useRef<number | null>(null);

  const subscribe = () => () => {};
  const getSnapshot = () => {
    if (valueRef.current === null) {
      valueRef.current = Math.floor(Math.random() * 18) + 75;
    }
    return valueRef.current;
  };
  const getServerSnapshot = () => 80;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface StudioLoadBarProps {
  className?: string;
}

export default function StudioLoadBar({ className }: StudioLoadBarProps) {
  const load = useRandomLoad();

  useEffect(() => {
    reachGoal(goals.LOAD_BAR_VIEW);
  }, []);

  const slots = load >= 85 ? 1 : load >= 80 ? 2 : 3;
  const isUrgent = load >= 85;

  return (
    <div className={cn("container-main py-6", className)}>
      <div className={cn(
        "card p-5",
        isUrgent && "border-accent-red/30"
      )}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-text flex items-center gap-2">
            Загрузка студии на эту неделю:{" "}
            <span className={cn(
              "font-bold",
              isUrgent ? "text-accent-red" : "text-accent-gold"
            )}>
              {load}%
            </span>
          </p>
          <p className="text-xs font-semibold flex items-center gap-1.5">
            {isUrgent && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
            )}
            <span className="text-accent-red">
              {slots === 1 ? "Последний слот!" : `Осталось ${slots} слота`}
            </span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-3 rounded-full bg-bg-hover overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 relative"
            style={{
              width: `${load}%`,
              background: "linear-gradient(90deg, #D4B830 0%, #D45555 100%)",
            }}
          >
            {/* Animated glow at the end */}
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white/20 to-transparent rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
