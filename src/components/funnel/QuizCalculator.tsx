"use client";

import { useState } from "react";
import {
  Car, Truck, Zap, Bus, Check, MessageCircle, Send,
  ChevronLeft, ChevronDown, Shield, Sparkles, Palette, Volume2, Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitForm } from "@/lib/form-submit";
import { reachGoal, goals } from "@/lib/analytics";
import { useSiteData } from "@/lib/site-data";
import Button from "@/components/ui/Button";
import { cn, isWorkingHours, formatPhoneInput } from "@/lib/utils";

/* ───────── Price estimation data ───────── */

const SERVICE_PRICES: Record<string, { min: number; max: number }> = {
  "Антигравийная плёнка (PPF)": { min: 50000, max: 180000 },
  "Керамическое покрытие": { min: 5000, max: 30000 },
  "Антидождь": { min: 1500, max: 5000 },
  "Полировка кузова": { min: 16000, max: 26000 },
  "Полировка фар": { min: 2000, max: 5000 },
  "Полировка стёкол": { min: 2000, max: 5000 },
  "Тонировка": { min: 7000, max: 12000 },
  "Антихром": { min: 2000, max: 15000 },
  "Шумоизоляция": { min: 10000, max: 60000 },
  "Оптика (линзы, регулировка фар)": { min: 10000, max: 30000 },
  "Химчистка салона": { min: 15000, max: 18500 },
  "Ремонт вмятин (PDR)": { min: 5000, max: 30000 },
};

const CLASS_MULTIPLIERS: Record<string, number> = {
  sedan: 1,
  suv: 1.25,
  coupe: 1,
  minivan: 1.3,
};

const CLASS_LABELS: Record<string, string> = {
  sedan: "седана",
  suv: "кроссовера",
  coupe: "купе",
  minivan: "минивэна",
};

function estimatePrice(
  carClass: string,
  selectedServices: string[]
): { min: number; max: number } | null {
  if (!carClass || selectedServices.length === 0) return null;
  const mult = CLASS_MULTIPLIERS[carClass] || 1;
  let min = 0;
  let max = 0;
  for (const svc of selectedServices) {
    const prices = SERVICE_PRICES[svc];
    if (prices) {
      min += prices.min;
      max += prices.max;
    }
  }
  min = Math.round((min * mult) / 1000) * 1000;
  max = Math.round((max * mult) / 1000) * 1000;
  return { min, max };
}

function formatNum(n: number): string {
  return n.toLocaleString("ru-RU");
}

/* ───────── Service categories (accordion groups) ───────── */

interface ServiceCategory {
  label: string;
  icon: LucideIcon;
  items: string[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    label: "Защита кузова",
    icon: Shield,
    items: ["Антигравийная плёнка (PPF)", "Керамическое покрытие", "Антидождь"],
  },
  {
    label: "Полировка",
    icon: Sparkles,
    items: ["Полировка кузова", "Полировка фар", "Полировка стёкол"],
  },
  {
    label: "Стайлинг",
    icon: Palette,
    items: ["Тонировка", "Антихром"],
  },
  {
    label: "Комфорт и оптика",
    icon: Volume2,
    items: ["Шумоизоляция", "Оптика (линзы, регулировка фар)"],
  },
  {
    label: "Уход и ремонт",
    icon: Wrench,
    items: ["Химчистка салона", "Ремонт вмятин (PDR)"],
  },
];

/* ───────── Component ───────── */

const CAR_OPTIONS = [
  { value: "sedan", label: "Седан", icon: Car },
  { value: "suv", label: "Кроссовер / Внедорожник", icon: Truck },
  { value: "coupe", label: "Купе / Спорт", icon: Zap },
  { value: "minivan", label: "Минивэн", icon: Bus },
];

const URGENCY_OPTIONS = [
  { value: "week", label: "На этой неделе" },
  { value: "month", label: "В этом месяце" },
  { value: "browsing", label: "Пока присматриваюсь" },
];

const slideVariants = {
  enter: { x: 50, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -50, opacity: 0 },
};

interface QuizCalculatorProps {
  className?: string;
}

export default function QuizCalculator({ className }: QuizCalculatorProps) {
  const { whatsappUrl, telegramUrl, maxUrl, quizCategories } = useSiteData();
  const [step, setStep] = useState(1);
  const [carClass, setCarClass] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [urgency, setUrgency] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const estimate = estimatePrice(carClass, services);

  // Filter categories to only include items that exist in quizCategories from DB
  const filteredCategories = SERVICE_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => quizCategories.includes(item)),
  })).filter((cat) => cat.items.length > 0);

  function nextStep() {
    const next = step + 1;
    setStep(next);
    if (next === 2) reachGoal(goals.QUIZ_STEP_2);
    if (next === 3) reachGoal(goals.QUIZ_STEP_3);
    if (next === 4) reachGoal(goals.QUIZ_STEP_4);
  }

  function prevStep() {
    if (step > 1) setStep(step - 1);
  }

  function toggleService(s: string) {
    setServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function toggleCategory(label: string) {
    setOpenCategories((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhoneInput(e.target.value);
    setPhone(formatted);
    setPhoneError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setPhoneError("Введите корректный номер");
      return;
    }
    setIsSubmitting(true);
    reachGoal(goals.QUIZ_SUBMIT);

    const result = await submitForm({
      phone,
      name,
      carClass,
      services,
      urgency,
      source: "quiz",
    });

    setIsSubmitting(false);
    if (result.success) {
      reachGoal(goals.QUIZ_SUCCESS);
      setSubmitted(true);
    } else {
      setPhoneError(result.error || "Ошибка отправки");
    }
  }

  if (submitted) {
    return (
      <div className={cn("card card-glow-top p-6 text-center", className)}>
        <p className="text-2xl font-bold font-display text-accent-gold mb-2">
          {isWorkingHours() ? "Расчёт будет через 15 минут" : "Расчёт будет утром"}
        </p>
        <p className="text-text-secondary mb-4">
          Мы подготовим персональное предложение
        </p>
        <div className="flex flex-col gap-2 w-full">
          <Button
            variant="whatsapp"
            size="md"
            href={`${whatsappUrl}?text=${encodeURIComponent("Здравствуйте! Жду расчёт стоимости детейлинга.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <MessageCircle size={18} />
            WhatsApp
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="md"
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Send size={18} />
              Telegram
            </Button>
            <Button
              variant="outline"
              size="md"
              href={maxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <MessageCircle size={18} />
              Max
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("card card-glow-top p-5 md:p-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="flex items-center gap-0.5 text-xs text-text-secondary hover:text-text transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>Назад</span>
            </button>
          )}
          <p className="text-xs font-semibold text-accent-gold uppercase tracking-wider">
            Калькулятор стоимости
          </p>
        </div>
        <span className="text-xs text-text-secondary font-mono">
          {step}/4
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-5">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className="h-1.5 flex-1 rounded-full overflow-hidden bg-border"
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-500",
                s <= step ? "w-full" : "w-0"
              )}
              style={
                s <= step
                  ? {
                      background:
                        "linear-gradient(90deg, var(--color-accent-gold), var(--color-accent-gold))",
                    }
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Car class */}
        {step === 1 && (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <p className="text-lg font-bold font-display text-text mb-4">
              Какой у вас автомобиль?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CAR_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setCarClass(opt.value);
                      reachGoal(goals.QUIZ_START);
                      nextStep();
                    }}
                    className={cn(
                      "card p-4 flex flex-col items-center gap-2 min-h-[44px] cursor-pointer transition-colors duration-200",
                      carClass === opt.value
                        ? "border-accent-gold bg-accent-gold/5 shadow-[var(--shadow-glow-gold)]"
                        : "hover:border-accent-gold/50 hover:bg-bg-hover"
                    )}
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center">
                      <Icon size={24} className="text-accent-gold" />
                    </div>
                    <span className="text-sm font-semibold text-text">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Step 2: Services (accordion categories) */}
        {step === 2 && (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <p className="text-lg font-bold font-display text-text mb-4">
              Что хотите сделать?
            </p>
            <div className="space-y-2">
              {filteredCategories.map((cat) => {
                const Icon = cat.icon;
                const isOpen = openCategories.includes(cat.label);
                const selectedCount = cat.items.filter((item) =>
                  services.includes(item)
                ).length;

                return (
                  <div key={cat.label}>
                    {/* Category header */}
                    <button
                      onClick={() => toggleCategory(cat.label)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-[var(--radius-button)] border text-left min-h-[44px] cursor-pointer transition-colors duration-200",
                        isOpen || selectedCount > 0
                          ? "border-accent-gold/40 bg-accent-gold/5"
                          : "border-border hover:border-accent-gold/50 hover:bg-bg-hover"
                      )}
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-accent-gold" />
                      </div>
                      <span className="text-sm font-semibold text-text flex-1">
                        {cat.label}
                      </span>
                      {selectedCount > 0 && (
                        <span className="text-xs text-accent-gold font-semibold px-1.5 py-0.5 rounded-full bg-accent-gold/10">
                          {selectedCount}
                        </span>
                      )}
                      <ChevronDown
                        size={16}
                        className={cn(
                          "text-text-secondary transition-transform duration-200 flex-shrink-0",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Subcategories (animated) */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pt-1.5 space-y-1.5">
                            {cat.items.map((item) => (
                              <button
                                key={item}
                                onClick={() => toggleService(item)}
                                className={cn(
                                  "w-full flex items-center gap-3 p-2.5 rounded-[var(--radius-button)] border text-left min-h-[44px] cursor-pointer transition-colors duration-200",
                                  services.includes(item)
                                    ? "border-accent-gold bg-accent-gold/5"
                                    : "border-border/50 hover:border-accent-gold/50 hover:bg-bg-hover"
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors duration-200",
                                    services.includes(item)
                                      ? "bg-accent-gold"
                                      : "border border-border"
                                  )}
                                >
                                  {services.includes(item) && (
                                    <Check size={14} className="text-bg" />
                                  )}
                                </div>
                                <span className="text-sm text-text">{item}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Price estimate — shows immediately as user selects services */}
            {estimate && (
              <div className="mt-4 p-3 rounded-[var(--radius-button)] bg-accent-gold/8 border border-accent-gold/20">
                <p className="text-xs text-text-secondary mb-1">
                  Примерная стоимость для {CLASS_LABELS[carClass] || "авто"}:
                </p>
                <p className="text-lg font-extrabold font-display text-accent-gold">
                  {formatNum(estimate.min)} — {formatNum(estimate.max)}₽
                </p>
              </div>
            )}

            <Button
              variant="primary"
              className="w-full mt-4 btn-cta-glow"
              onClick={nextStep}
              disabled={services.length === 0}
            >
              {estimate ? "Получить точный расчёт" : "Далее"}
            </Button>
          </motion.div>
        )}

        {/* Step 3: Urgency */}
        {step === 3 && (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <p className="text-lg font-bold font-display text-text mb-2">
              Когда планируете?
            </p>

            {/* Carry over the estimate */}
            {estimate && (
              <p className="text-sm text-text-secondary mb-4">
                Предварительно:{" "}
                <span className="font-bold text-accent-gold">
                  {formatNum(estimate.min)} — {formatNum(estimate.max)}₽
                </span>
              </p>
            )}

            <div className="space-y-2">
              {URGENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setUrgency(opt.value);
                    nextStep();
                  }}
                  className={cn(
                    "w-full p-4 rounded-[var(--radius-button)] border text-left min-h-[44px] cursor-pointer transition-colors duration-200 font-semibold text-text",
                    urgency === opt.value
                      ? "border-accent-gold bg-accent-gold/5 shadow-sm"
                      : "border-border hover:border-accent-gold/50 hover:bg-bg-hover"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 4: Contact */}
        {step === 4 && (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            <p className="text-lg font-bold font-display text-text mb-2">
              Куда прислать расчёт?
            </p>

            {/* Final estimate reminder */}
            {estimate && (
              <div className="mb-4 p-3 rounded-[var(--radius-button)] bg-accent-gold/8 border border-accent-gold/20">
                <p className="text-xs text-text-secondary mb-1">
                  Ориентировочная стоимость:
                </p>
                <p className="text-xl font-extrabold font-display text-accent-gold">
                  {formatNum(estimate.min)} — {formatNum(estimate.max)}₽
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {isWorkingHours() ? "Точный расчёт пришлём за 15 минут" : "Точный расчёт пришлём утром"}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={handlePhoneChange}
                required
                className={cn(
                  "w-full min-h-[44px] rounded-[var(--radius-button)] bg-bg border border-border px-4 py-3 text-text text-[16px] placeholder:text-text-secondary/50 outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30",
                  phoneError && "border-accent-red focus:border-accent-red focus:ring-accent-red/30"
                )}
              />
              {phoneError && (
                <p className="mt-1 text-sm text-accent-red">{phoneError}</p>
              )}
              <input
                type="text"
                autoComplete="given-name"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] rounded-[var(--radius-button)] bg-bg border border-border px-4 py-3 text-text text-[16px] placeholder:text-text-secondary/50 outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30"
              />
              <Button
                type="submit"
                variant="primary"
                className="w-full btn-cta-glow"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправка..." : "Получить точный расчёт"}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
