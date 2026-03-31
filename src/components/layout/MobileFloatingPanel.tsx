"use client";

import { Phone, MessageCircle, Send } from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import { reachGoal, goals } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export default function MobileFloatingPanel() {
  const { phoneRaw, whatsappUrl, telegramUrl, maxUrl } = useSiteData();

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[9999] md:hidden",
        "bg-bg/85 backdrop-blur-md border-t border-border/50",
        "px-4 pt-3 pb-5 flex gap-2 shadow-[0_-8px_32px_rgba(0,0,0,0.6)]"
      )}
      style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom, 1.25rem))" }}
    >
      {/* Call button */}
      <a
        href={`tel:${phoneRaw}`}
        onClick={() => reachGoal(goals.PHONE_CLICK)}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5",
          "h-12 rounded-[var(--radius-button)]",
          "bg-bg-card border border-border text-text",
          "font-semibold text-[13px] active:scale-[0.98] transition-all"
        )}
      >
        <Phone size={16} />
        Звонок
      </a>

      {/* Telegram button */}
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5",
          "h-12 rounded-[var(--radius-button)]",
          "bg-[#2AABEE] text-white",
          "font-semibold text-[13px] active:scale-[0.98] transition-all"
        )}
      >
        <Send size={16} />
        Telegram
      </a>

      {/* WhatsApp button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => reachGoal(goals.WHATSAPP_CLICK)}
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5",
          "h-12 rounded-[var(--radius-button)]",
          "bg-accent-whatsapp text-white",
          "font-semibold text-[13px] active:scale-[0.98] transition-all",
          "shadow-[0_4px_16px_rgba(37,211,102,0.3)]"
        )}
      >
        <MessageCircle size={16} />
        WhatsApp
      </a>

      {/* Max button */}
      <a
        href={maxUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "flex-1 flex items-center justify-center gap-1.5",
          "h-12 rounded-[var(--radius-button)]",
          "bg-[#0077FF] text-white",
          "font-semibold text-[13px] active:scale-[0.98] transition-all"
        )}
      >
        <MessageCircle size={16} />
        Max
      </a>
    </div>
  );
}
