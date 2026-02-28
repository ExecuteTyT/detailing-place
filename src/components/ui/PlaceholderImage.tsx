import { Shield, Sparkles, Car, Droplets, Sun, Wrench, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  work: { icon: Camera, label: "Фото работы" },
  "before-after": { icon: Sparkles, label: "До / После" },
  hero: { icon: Car, label: "" },
  portfolio: { icon: Camera, label: "Фото проекта" },
  ppf: { icon: Shield, label: "PPF" },
  polish: { icon: Sparkles, label: "Полировка" },
  ceramic: { icon: Droplets, label: "Керамика" },
  tint: { icon: Sun, label: "Тонировка" },
  default: { icon: Wrench, label: "Детейлинг" },
} as const;

type PlaceholderType = keyof typeof TYPE_CONFIG;

interface PlaceholderImageProps {
  type?: PlaceholderType;
  label?: string;
  className?: string;
}

export default function PlaceholderImage({
  type = "default",
  label,
  className,
}: PlaceholderImageProps) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.default;
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <div
      className={cn(
        "placeholder-image w-full h-full rounded-[var(--radius-card)]",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 opacity-40">
        <Icon size={32} strokeWidth={1.5} />
        {displayLabel && (
          <span className="text-xs font-medium">{displayLabel}</span>
        )}
      </div>
    </div>
  );
}
