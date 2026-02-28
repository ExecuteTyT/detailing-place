"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SOCIAL_PROOF_ITEMS } from "@/lib/constants";
import { isFormSubmitted } from "@/lib/form-submit";

export default function SocialProofToast() {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isFormSubmitted()) return;

    // First toast after 30s, then every 45s
    const firstTimer = setTimeout(() => {
      setVisible(true);

      // Auto-hide after 5s
      setTimeout(() => setVisible(false), 5000);
    }, 30000);

    const interval = setInterval(() => {
      if (dismissed) return;
      setCurrentIndex((prev) => (prev + 1) % SOCIAL_PROOF_ITEMS.length);
      setVisible(true);
      setTimeout(() => setVisible(false), 5000);
    }, 45000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed) return null;

  const item = SOCIAL_PROOF_ITEMS[currentIndex];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: 0 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed z-[9980] bottom-20 left-4 md:bottom-4 md:left-4 right-4 md:right-auto md:max-w-sm"
        >
          <div className="bg-bg-card border border-border rounded-[var(--radius-card)] p-4 shadow-lg flex items-start gap-3">
            <CheckCircle size={20} className="text-accent-gold flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text">
                <span className="font-semibold">{item.name}</span> заказал{" "}
                <span className="text-accent-cyan">{item.service}</span>
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                {item.car} • {item.minutesAgo} мин назад
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="flex-shrink-0 text-text-secondary hover:text-text min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer -mt-2 -mr-2"
              aria-label="Закрыть"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
