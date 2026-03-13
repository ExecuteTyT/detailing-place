"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
}

function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";

  let result = "+7";
  const d = digits.startsWith("7") || digits.startsWith("8") ? digits.slice(1) : digits;

  if (d.length > 0) result += " (" + d.slice(0, 3);
  if (d.length >= 3) result += ") " + d.slice(3, 6);
  if (d.length >= 6) result += "-" + d.slice(6, 8);
  if (d.length >= 8) result += "-" + d.slice(8, 10);

  return result;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, className, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");
    const isPhone = type === "tel";

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (isPhone) {
        const formatted = formatPhoneInput(e.target.value);
        setDisplayValue(formatted);
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: formatted },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      } else {
        onChange?.(e);
      }
    }

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          inputMode={isPhone ? "tel" : props.inputMode}
          autoComplete={isPhone ? "tel" : props.autoComplete}
          className={cn(
            "w-full min-h-[44px] rounded-[var(--radius-button)] bg-bg-card border border-border px-4 py-3",
            "text-text text-[16px] placeholder:text-text-secondary/50",
            "outline-none transition-colors duration-200",
            "focus:border-accent-gold focus:ring-1 focus:ring-accent-gold/30",
            error && "border-accent-red focus:border-accent-red focus:ring-accent-red/30",
            className
          )}
          {...(isPhone ? { value: displayValue, onChange: handleChange } : { onChange })}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-accent-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
