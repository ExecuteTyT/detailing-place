import type { Metadata } from "next";
import { getPortfolioItems, getPortfolioTags } from "@/lib/db/queries/content";
import CTAForm from "@/components/sections/CTAForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import PortfolioTracker from "./PortfolioTracker";
import PortfolioFilter from "./PortfolioFilter";

export const metadata: Metadata = {
  title: "Портфолио работ — детейлинг в Казани | Detailing Place",
  description: "Примеры наших работ: антигравийная плёнка, полировка, керамика, тонировка, Bi-LED линзы. Фото до и после.",
  openGraph: {
    title: "Портфолио работ — детейлинг в Казани | Detailing Place",
    description: "Примеры наших работ: антигравийная плёнка, полировка, керамика, тонировка, Bi-LED линзы. Фото до и после.",
    url: "https://dpkzn.ru/portfolio",
  },
  alternates: { canonical: "https://dpkzn.ru/portfolio" },
};

export default function PortfolioPage() {
  const items = getPortfolioItems();
  const allTags = ["Все", ...getPortfolioTags()];
  return (
    <>
      <PortfolioTracker />
      <section className="section-padding">
        <div className="container-main">
          <Breadcrumbs items={[{ label: "Портфолио" }]} className="mb-6" />
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-text text-center">
            Портфолио
          </h1>
          <p className="mt-3 text-text-secondary text-center">
            Примеры наших работ — фото до и после
          </p>

          <PortfolioFilter items={items} allTags={allTags} />
        </div>
      </section>

      <div id="cta-form">
        <CTAForm variant="section" title="Запишитесь на детейлинг" />
      </div>
    </>
  );
}
