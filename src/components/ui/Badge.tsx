import { cn } from "@/lib/utils";

type BadgeVariant = "new" | "popular" | "discount";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  new: "bg-accent-gold/15 text-accent-gold border-accent-gold/30",
  popular: "bg-accent-gold/15 text-accent-gold border-accent-gold/30",
  discount: "bg-accent-red/15 text-accent-red border-accent-red/30",
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
