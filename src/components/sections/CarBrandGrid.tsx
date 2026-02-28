import { cn } from "@/lib/utils";

interface CarBrandGridProps {
  className?: string;
}

const CAR_BRANDS = [
  "Kia Rio",
  "Kia Ceed",
  "Hyundai Solaris",
  "Hyundai Creta",
  "Lada Vesta",
  "Lada Granta",
  "VW Polo",
  "Skoda Rapid",
  "Toyota Camry",
  "Ford Focus",
];

export default function CarBrandGrid({ className }: CarBrandGridProps) {
  return (
    <section className={cn("section-padding gradient-section", className)}>
      <div className="container-main">
        <h2 className="text-2xl md:text-3xl font-bold font-display text-text text-center mb-3">
          Устанавливаем на все марки
        </h2>
        <p className="text-text-secondary text-center mb-8">
          Подбираем модуль под вашу фару
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CAR_BRANDS.map((brand) => (
            <div
              key={brand}
              className="card flex items-center justify-center p-4 min-h-[60px] text-center"
            >
              <span className="text-sm font-semibold text-text">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
