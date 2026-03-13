import { cn } from "@/lib/utils";

type BadgeVariant = "new" | "popular" | "discount" | "tag";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  new: "bg-accent-gold/15 text-accent-gold border-accent-gold/30",
  popular: "bg-accent-gold text-bg border-accent-gold shadow-[0_0_12px_rgba(212,184,48,0.3)]",
  discount: "bg-accent-red/15 text-accent-red border-accent-red/30",
  tag: "bg-bg-hover text-text-secondary border-border/50",
};

export default function Badge({
  variant = "new",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
