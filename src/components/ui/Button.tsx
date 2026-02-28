"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "whatsapp" | "phone" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-accent-gold to-[#B8965E] text-bg font-bold hover:from-[#D4B88E] hover:to-accent-gold active:scale-[0.98]",
  secondary:
    "border border-accent-cyan text-accent-cyan font-semibold hover:bg-accent-cyan/10",
  whatsapp:
    "bg-accent-whatsapp text-white font-bold hover:bg-[#1ebe57]",
  phone:
    "bg-accent-phone text-white font-bold hover:bg-[#2563a0]",
  ghost:
    "text-text-secondary hover:text-text hover:bg-bg-hover",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 min-h-[44px] rounded-[var(--radius-button)] transition-all duration-200 cursor-pointer",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon size={size === "sm" ? 16 : 20} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={size === "sm" ? 16 : 20} />}
    </>
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
