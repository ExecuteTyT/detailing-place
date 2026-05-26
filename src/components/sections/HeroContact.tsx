"use client";

import { Phone, MessageCircle } from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import { reachGoal, goals } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * One-tap contact for the hero — for visitors who arrived via referral
 * and just want to reach the studio without filling a quiz.
 * WhatsApp is primary (premium clients prefer messaging over forms).
 */
export default function HeroContact({ className }: { className?: string }) {
  const { phoneRaw, whatsappUrl } = useSiteData();

  return (
    <div className={cn("flex flex-col sm:flex-row gap-3", className)}>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => reachGoal(goals.WHATSAPP_CLICK)}
        className={cn(
          "flex items-center justify-center gap-2 min-h-[52px] px-6",
          "rounded-[var(--radius-button)] bg-accent-whatsapp text-white",
          "font-semibold text-base active:scale-[0.98] transition-all",
          "shadow-[0_6px_24px_rgba(37,211,102,0.35)]"
        )}
      >
        <MessageCircle size={20} />
        Написать в WhatsApp
      </a>
      <a
        href={`tel:${phoneRaw}`}
        onClick={() => reachGoal(goals.PHONE_CLICK)}
        className={cn(
          "flex items-center justify-center gap-2 min-h-[52px] px-6",
          "rounded-[var(--radius-button)] border border-accent-gold/40 bg-bg-card/70 backdrop-blur-sm text-text",
          "font-semibold text-base active:scale-[0.98] transition-all hover:border-accent-gold/70"
        )}
      >
        <Phone size={18} />
        Позвонить
      </a>
    </div>
  );
}
