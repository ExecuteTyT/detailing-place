"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Gift, FileText, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitForm } from "@/lib/form-submit";
import { isFormSubmitted } from "@/lib/form-submit";
import { reachGoal, goals } from "@/lib/analytics";
import { useSiteData } from "@/lib/site-data";
import Button from "@/components/ui/Button";

type Variant = "discount" | "leadmagnet" | "photo";

const COOLDOWN_KEY = "dp_exit_popup_shown";
const COOLDOWN_MS = 72 * 60 * 60 * 1000; // 72 hours

function getRandomVariant(): Variant {
  const variants: Variant[] = ["discount", "leadmagnet", "photo"];
  return variants[Math.floor(Math.random() * variants.length)];
}

function shouldShow(): boolean {
  if (typeof window === "undefined") return false;
  if (isFormSubmitted()) return false;
  const ts = localStorage.getItem(COOLDOWN_KEY);
  if (ts && Date.now() - Number(ts) < COOLDOWN_MS) return false;
  return true;
}

function markShown() {
  localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
}

export default function ExitIntentPopup() {
  const { whatsappUrl } = useSiteData();
  const [visible, setVisible] = useState(false);
  const [variant] = useState<Variant>(getRandomVariant);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ready, setReady] = useState(false);

  // Wait 15s before arming the trigger
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  const show = useCallback(() => {
    if (!ready || visible || !shouldShow()) return;
    setVisible(true);
    markShown();
    reachGoal(goals.EXIT_POPUP_SHOW);
  }, [ready, visible]);

  // Desktop: cursor moves to top
  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      if (e.clientY < 10) show();
    }
    document.addEventListener("mousemove", handleMouse);
    return () => document.removeEventListener("mousemove", handleMouse);
  }, [show]);

  // Mobile: popstate (back button)
  useEffect(() => {
    function handlePop() {
      show();
    }
    if (ready && shouldShow()) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePop);
    }
    return () => window.removeEventListener("popstate", handlePop);
  }, [ready, show]);

  function close() {
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;
    await submitForm({ phone, source: `exit_popup_${variant}` });
    reachGoal(goals.EXIT_POPUP_SUBMIT);
    setSubmitted(true);
  }

  // Hours left until end of day
  const now = new Date();
  const hoursLeft = 23 - now.getHours();

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed inset-0 z-[9997] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative z-10 w-full max-w-[480px] bg-bg-card border border-border rounded-2xl p-6 md:p-8 shadow-[0_0_60px_rgba(200,169,126,0.06)] card-glow-top overflow-hidden"
          >
            <button
              onClick={close}
              className="absolute right-3 top-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary hover:text-text cursor-pointer"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <p className="text-2xl font-bold font-display text-accent-gold mb-2">Готово!</p>
                <p className="text-text-secondary">Мы свяжемся с вами в ближайшее время</p>
              </div>
            ) : (
              <>
                {variant === "discount" && (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent-gold/10 flex items-center justify-center">
                        <Gift size={28} className="text-accent-gold" />
                      </div>
                      <h3 className="text-xl font-bold font-display text-text">Скидка 10%</h3>
                    </div>
                    <p className="text-text-secondary mb-1">При записи сегодня</p>
                    <p className="text-sm text-accent-gold font-semibold mb-4">
                      Промокод: EXIT10 &bull; Осталось {hoursLeft} ч
                    </p>
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
                        Получить скидку
                      </Button>
                    </form>
                  </>
                )}

                {variant === "leadmagnet" && (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 flex items-center justify-center">
                        <FileText size={28} className="text-accent-cyan" />
                      </div>
                      <h3 className="text-xl font-bold font-display text-text">Бесплатный чек-лист</h3>
                    </div>
                    <p className="text-text-secondary mb-4">
                      20 пунктов проверки детейлинга &mdash; чтобы вас не обманули
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="tel"
                        autoComplete="tel"
                        placeholder="WhatsApp номер"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full min-h-[44px] rounded-[var(--radius-button)] bg-bg border border-border px-4 py-3 text-text text-[16px] placeholder:text-text-secondary/50 outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30"
                      />
                      <Button type="submit" variant="primary" className="w-full btn-cta-glow">
                        Получить чек-лист
                      </Button>
                    </form>
                  </>
                )}

                {variant === "photo" && (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 flex items-center justify-center">
                        <Camera size={28} className="text-accent-cyan" />
                      </div>
                      <h3 className="text-xl font-bold font-display text-text">Расчёт по фото</h3>
                    </div>
                    <p className="text-text-secondary mb-6">
                      Пришлите фото авто &mdash; рассчитаем стоимость за 15 минут
                    </p>
                    <Button
                      variant="whatsapp"
                      className="w-full"
                      href={`${whatsappUrl}?text=${encodeURIComponent("Здравствуйте! Хочу рассчитать стоимость детейлинга. Отправляю фото:")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Отправить фото в WhatsApp
                    </Button>
                  </>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
