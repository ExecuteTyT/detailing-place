import type { Metadata } from "next";
import Image from "next/image";
import { getTeamMembers } from "@/lib/db/queries/content";
import { getPartnerBrands, getStats } from "@/lib/db/queries/settings";
import CTAForm from "@/components/sections/CTAForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "О студии Detailing Place — детейлинг в Казани | Detailing Place",
  description: "Студия премиального детейлинга в Казани. Команда профессионалов, охраняемый бокс, оригинальные материалы.",
  openGraph: {
    title: "О студии Detailing Place — детейлинг в Казани | Detailing Place",
    description: "Студия премиального детейлинга в Казани. Команда профессионалов, охраняемый бокс, оригинальные материалы.",
    url: "https://detailingplace.ru/about",
  },
  alternates: { canonical: "https://detailingplace.ru/about" },
};

export default function AboutPage() {
  const TEAM = getTeamMembers();
  const STATS = getStats();
  const PARTNER_BRANDS = getPartnerBrands();
  return (
    <>
      {/* Hero / Manifesto */}
      <section className="section-padding gradient-section">
        <div className="container-main text-center max-w-3xl mx-auto">
          <Breadcrumbs items={[{ label: "О студии" }]} className="mb-6 justify-center" />
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-text">
            О студии Detailing Place
          </h1>
          <blockquote className="mt-6 text-lg md:text-xl text-text-secondary italic leading-relaxed">
            &laquo;Мы не просто клеим плёнку и полируем — мы создаём ощущение нового автомобиля.
            Каждый проект — это ответственность перед клиентом и репутацией.&raquo;
          </blockquote>
          <p className="mt-4 text-text-secondary">— Команда Detailing Place</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card p-5 text-center">
                  <Icon size={28} className="mx-auto text-accent-cyan mb-2" />
                  <p className="text-2xl font-extrabold font-display text-accent-gold">{stat.value}</p>
                  <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-text text-center mb-8">
            Команда
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TEAM.map((member) => (
              <div key={member.name} className="card overflow-hidden">
                <div className="relative aspect-[3/4] bg-bg-hover">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="font-bold text-text">{member.name}</p>
                  <p className="text-xs text-text-secondary">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio */}
      <section className="section-padding gradient-section">
        <div className="container-main">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-text text-center mb-8">
            Наша студия
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-video rounded-[var(--radius-card)] overflow-hidden bg-bg-card border border-border">
              <Image
                src="/images/studio-1.jpg"
                alt="Студия Detailing Place — рабочая зона"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
            <div className="relative aspect-video rounded-[var(--radius-card)] overflow-hidden bg-bg-card border border-border">
              <Image
                src="/images/studio-2.jpg"
                alt="Студия Detailing Place — зона ожидания"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-8">
        <div className="container-main">
          <h2 className="text-lg font-bold font-display text-text text-center mb-6">
            Сертифицированные материалы
          </h2>
          <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
            {PARTNER_BRANDS.map((brand) => (
              <span key={brand} className="text-base font-semibold text-text-secondary/70">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div id="cta-form">
        <CTAForm variant="section" title="Запишитесь на визит" subtitle="Покажем студию и рассчитаем стоимость" />
      </div>
    </>
  );
}
