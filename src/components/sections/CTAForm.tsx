"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { MessageCircle, CheckCircle } from "lucide-react";
import { submitForm } from "@/lib/form-submit";
import { reachGoal, goals } from "@/lib/analytics";
import { useSiteData } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

const CAR_CLASSES = [
  { value: "sedan", label: "Седан" },
  { value: "suv", label: "Кроссовер/Внедорожник" },
  { value: "coupe", label: "Купе/Спорт" },
  { value: "minivan", label: "Минивэн" },
] as const;

interface FormValues {
  phone: string;
  carClass?: string;
}

interface CTAFormProps {
  title?: string;
  subtitle?: string;
  variant?: "hero" | "section" | "inline";
  serviceName?: string;
  className?: string;
}

export default function CTAForm({
  title,
  subtitle,
  variant = "section",
  serviceName,
  className,
}: CTAFormProps) {
  const { whatsappUrl } = useSiteData();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    reachGoal(goals.FORM_SUBMIT);

    const result = await submitForm({
      phone: data.phone,
      carClass: data.carClass,
      service: serviceName,
      source: variant,
    });

    setIsSubmitting(false);

    if (result.success) {
      reachGoal(goals.FORM_SUCCESS);
      setShowSuccess(true);
      reset();
      setTimeout(() => setShowSuccess(false), 5000);
    } else {
      reachGoal(goals.FORM_ERROR);
    }
  }

  const isHero = variant === "hero";

  return (
    <>
      <div
        className={cn(
          variant === "section" && "section-padding cta-section-bg relative overflow-hidden",
          className
        )}
      >
        {/* Decorative glows for section variant */}
        {variant === "section" && (
          <>
            <div className="absolute top-1/2 -left-24 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -right-24 w-64 h-64 bg-accent-gold/5 rounded-full blur-3xl" />
          </>
        )}

        <div className={cn(variant === "section" && "container-main relative z-10")}>
          {(title || subtitle) && (
            <div className={cn("mb-6", variant === "section" && "text-center")}>
              {title && (
                <h2 className="text-2xl md:text-3xl font-bold font-display text-text">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-2 text-text-secondary">{subtitle}</p>
              )}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "flex gap-3",
              isHero
                ? "flex-col md:flex-row md:items-end"
                : "flex-col max-w-lg",
              variant === "section" && "mx-auto"
            )}
          >
            {/* Phone */}
            <div className={cn("flex-1", isHero && "md:flex-[2]")}>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
                className={cn(
                  "w-full min-h-[44px] rounded-[var(--radius-button)] bg-bg-card border border-border px-4 py-3",
                  "text-text text-[16px] placeholder:text-text-secondary/50",
                  "outline-none transition-colors",
                  "focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30",
                  errors.phone && "border-accent-red"
                )}
                {...register("phone", {
                  required: "Введите номер телефона",
                  validate: (val) => {
                    const digits = val.replace(/\D/g, "");
                    return digits.length >= 11 || "Введите корректный номер";
                  },
                })}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-accent-red">{errors.phone.message}</p>
              )}
            </div>

            {/* Car class */}
            <div className={cn("flex-1", isHero && "md:flex-[1.5]")}>
              <select
                className={cn(
                  "w-full min-h-[44px] appearance-none select-custom rounded-[var(--radius-button)] bg-bg-card border border-border px-4 py-3",
                  "text-text text-[16px] outline-none transition-colors cursor-pointer",
                  "focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30"
                )}
                defaultValue=""
                {...register("carClass")}
              >
                <option value="" disabled>
                  Класс авто
                </option>
                {CAR_CLASSES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className={cn("whitespace-nowrap btn-cta-glow", isHero && "md:flex-1")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Отправка..." : "Рассчитать стоимость"}
            </Button>
          </form>

          {/* Sub-form text */}
          <div
            className={cn(
              "mt-3 flex items-center gap-2 text-sm text-text-secondary",
              variant === "section" && "justify-center"
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span>Ответим за 15 минут</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent-whatsapp hover:underline"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={showSuccess} onClose={() => setShowSuccess(false)} title="Спасибо!">
        <div className="flex flex-col items-center text-center py-4">
          <CheckCircle size={48} className="text-accent-gold mb-3" />
          <p className="text-text text-lg font-semibold">Заявка отправлена!</p>
          <p className="mt-2 text-text-secondary">
            Перезвоним в течение 15 минут
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 btn-whatsapp px-5 py-2.5 text-sm inline-flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Написать в WhatsApp, если срочно
          </a>
        </div>
      </Modal>
    </>
  );
}
