"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitForm } from "@/lib/form-submit";
import { reachGoal, goals } from "@/lib/analytics";
import Button from "@/components/ui/Button";

export default function CallbackWidget() {
  const [modalOpen, setModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(28);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isAfterHours = new Date().getHours() >= 20;

  function openModal() {
    setModalOpen(true);
    reachGoal(goals.CALLBACK_OPEN);
  }

  function closeModal() {
    setModalOpen(false);
    setSubmitted(false);
    setCountdown(28);
    setPhone("");
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;
    await submitForm({ phone, source: "callback_widget" });
    reachGoal(goals.CALLBACK_SUBMIT);
    setSubmitted(true);

    // Start countdown
    setCountdown(28);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      {/* Floating button */}
      <div className="fixed right-4 bottom-24 md:bottom-8 z-[9990]">
        <button
          onClick={openModal}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-accent-gold to-[#B89E20] text-bg flex items-center justify-center shadow-[var(--shadow-glow-gold)] hover:scale-105 transition-transform cursor-pointer group"
          aria-label="Заказать звонок"
        >
          {/* Pulse ring */}
          <span className="absolute inset-0 rounded-full bg-accent-gold animate-pulse-ring" />
          {/* Outer glow ring */}
          <span className="absolute -inset-1 rounded-full border-2 border-accent-gold/20 animate-pulse" />
          <Phone size={24} className="relative z-10" />

          {/* Desktop hover text */}
          <span className="hidden md:group-hover:block absolute right-full mr-3 whitespace-nowrap bg-bg-card border border-border rounded-[var(--radius-button)] px-3 py-2 text-sm font-semibold text-text shadow-[var(--shadow-card)]">
            Перезвоним за 28 сек
          </span>
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-sm bg-bg-card border border-border rounded-[var(--radius-card)] p-6 shadow-[0_0_40px_rgba(204,255,0,0.06)] card-glow-top overflow-hidden"
            >
              <button
                onClick={closeModal}
                className="absolute right-3 top-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text cursor-pointer"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>

              {submitted ? (
                <div className="text-center py-4">
                  <p className="text-lg font-bold font-display text-text mb-2">
                    Ваш номер принят
                  </p>
                  {isAfterHours ? (
                    <p className="text-text-secondary">Перезвоним завтра в 10:00</p>
                  ) : (
                    <>
                      <div className="my-4">
                        <span className="text-4xl font-extrabold font-display text-accent-gold">
                          {countdown}
                        </span>
                        <span className="text-text-secondary ml-1">сек</span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {countdown > 0 ? "Набираем ваш номер..." : "Если не дозвонились — перезвоним ещё раз"}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center">
                      <Phone size={20} className="text-accent-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-display text-text">
                        {isAfterHours ? "Перезвоним завтра в 10:00" : "Перезвоним через 28 секунд"}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Оставьте номер &mdash; мы позвоним
                      </p>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="+7 (___) ___-__-__"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full min-h-[44px] rounded-[var(--radius-button)] bg-bg border border-border px-4 py-3 text-text text-[16px] placeholder:text-text-secondary/50 outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30"
                    />
                    <Button type="submit" variant="primary" className="w-full btn-cta-glow">
                      Жду звонка
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
