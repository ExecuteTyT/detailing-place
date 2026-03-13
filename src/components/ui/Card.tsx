import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardProps {
  href?: string;
  className?: string;
  glowTop?: boolean;
  children: React.ReactNode;
}

export default function Card({ href, className, glowTop, children }: CardProps) {
  const classes = cn(
    "bg-bg-card border border-border rounded-[var(--radius-card)] p-5 transition-all duration-200",
    "shadow-[var(--shadow-card)]",
    href && "hover:border-border hover:bg-bg-hover cursor-pointer",
    glowTop && "card-glow-top",
    className
  );

  if (href) {
    return (
      <Link href={href} className={cn(classes, "block")}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
