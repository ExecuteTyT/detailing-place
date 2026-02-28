import { cn } from "@/lib/utils";

interface BrandsGridProps {
  className?: string;
}

const CHINESE_BRANDS = [
  "Haval",
  "Chery",
  "Geely",
  "Exeed",
  "Changan",
  "Omoda",
  "Jetour",
  "Dongfeng",
];

export default function BrandsGrid({ className }: BrandsGridProps) {
  return (
    <section className={cn("section-padding gradient-section", className)}>
      <div className="container-main">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-text text-center mb-3">
          Поддерживаемые марки
        </h2>
        <p className="text-text-secondary text-center mb-8">
          Русифицируем все популярные китайские автомобили
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CHINESE_BRANDS.map((brand) => (
            <div
              key={brand}
              className="card flex items-center justify-center p-5 min-h-[70px] text-center"
            >
              <span className="text-base font-bold text-text">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
