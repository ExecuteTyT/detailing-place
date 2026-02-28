"use client";

import { Phone, MessageCircle } from "lucide-react";
import { PHONE_RAW, WHATSAPP_URL } from "@/lib/constants";
import { reachGoal, goals } from "@/lib/analytics";

export default function MobileFloatingPanel() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden flex shadow-[0_-4px_24px_rgba(0,0,0,0.5)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
    >
      {/* Call button */}
      <a
        href={`tel:${PHONE_RAW}`}
        onClick={() => reachGoal(goals.PHONE_CLICK)}
        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-b from-[#3a8fd4] to-accent-phone text-white font-bold text-sm h-14"
      >
        <Phone size={20} />
        Позвонить
      </a>

      {/* WhatsApp button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => reachGoal(goals.WHATSAPP_CLICK)}
        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-b from-[#2ee670] to-accent-whatsapp text-white font-bold text-sm h-14"
      >
        <MessageCircle size={20} />
        WhatsApp
      </a>
    </div>
  );
}
