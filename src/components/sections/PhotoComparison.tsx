import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhotoComparisonItem {
  image: string;
  label: string;
}

interface PhotoComparisonProps {
  items?: PhotoComparisonItem[];
  className?: string;
}

const DEFAULT_TINT_LEVELS: PhotoComparisonItem[] = [
  { image: "/images/tonirovka-5.webp", label: "5% — Лимузинная" },
  { image: "/images/tonirovka-15.webp", label: "15% — Тёмная" },
  { image: "/images/tonirovka-35.webp", label: "35% — Средняя" },
  { image: "/images/tonirovka-80.webp", label: "80% — Атермальная" },
];

export default function PhotoComparison({
  items = DEFAULT_TINT_LEVELS,
  className,
}: PhotoComparisonProps) {
  return (
    <section className={cn("section-padding", className)}>
      <div className="container-main">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-text text-center mb-8">
          Сравнение процентов тонировки
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {items.map((item) => (
            <div key={item.label} className="card overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  loading="lazy"
                />
              </div>
              <p className="p-3 text-sm font-semibold text-text text-center">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
