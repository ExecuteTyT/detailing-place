"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full min-h-[44px] appearance-none rounded-[var(--radius-button)] bg-bg-card border border-border px-4 py-3 pr-10",
              "text-text text-[16px]",
              "outline-none transition-colors duration-200 cursor-pointer",
              "focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/30",
              error && "border-accent-red",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={20}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-accent-red">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
