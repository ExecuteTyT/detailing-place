import type { Metadata } from "next";
import { Phone, MessageCircle, MapPin, Clock, ChevronDown } from "lucide-react";
import { getSettings } from "@/lib/db/queries/settings";
import CTAForm from "@/components/sections/CTAForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Контакты Detailing Place — адрес, телефон, карта | Detailing Place",
  description: "Адрес студии Detailing Place в Казани. Телефон, WhatsApp, карта проезда. Ежедневно 10:00–20:00.",
  openGraph: {
    title: "Контакты Detailing Place — адрес, телефон, карта | Detailing Place",
    description: "Адрес студии Detailing Place в Казани. Телефон, WhatsApp, карта проезда. Ежедневно 10:00–20:00.",
    url: "https://detailingplace.ru/contacts",
  },
  alternates: { canonical: "https://detailingplace.ru/contacts" },
};

export default function ContactsPage() {
  const cfg = getSettings();
  const PHONE = cfg.phone ?? "+7 (843) 000-00-00";
  const PHONE_RAW = cfg.phone_raw ?? "78430000000";
  const WHATSAPP_URL = cfg.whatsapp_url ?? "https://wa.me/78430000000";
  const ADDRESS = cfg.address ?? "";
  const HOURS = cfg.hours ?? "";
  const COORDINATES = {
    lat: cfg.coordinates_lat ?? "55.7887",
    lng: cfg.coordinates_lng ?? "49.1221",
  };

  return (
    <>
      <section className="section-padding">
        <div className="container-main">
          <Breadcrumbs items={[{ label: "Контакты" }]} className="mb-6" />
          <h1 className="text-3xl md:text-4xl font-extrabold font-display text-text text-center">
            Контакты
          </h1>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Contact info + form */}
            <div>
              <div className="space-y-4 mb-8">
                <a
                  href={`tel:${PHONE_RAW}`}
                  className="card p-4 flex items-center gap-4 hover:border-accent-cyan/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-accent-cyan" />
                  </div>
                  <div>
                    <p className="font-bold text-text">{PHONE}</p>
                    <p className="text-xs text-text-secondary">Позвонить</p>
                  </div>
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-4 hover:border-accent-whatsapp/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-accent-whatsapp/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={20} className="text-accent-whatsapp" />
                  </div>
                  <div>
                    <p className="font-bold text-text">WhatsApp</p>
                    <p className="text-xs text-text-secondary">Написать в мессенджер</p>
                  </div>
                </a>

                <div className="card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-accent-cyan" />
                  </div>
                  <div>
                    <p className="font-bold text-text">{ADDRESS}</p>
                    <p className="text-xs text-text-secondary">Казань</p>
                  </div>
                </div>

                <div className="card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-accent-cyan" />
                  </div>
                  <div>
                    <p className="font-bold text-text">{HOURS}</p>
                    <p className="text-xs text-text-secondary">Без выходных</p>
                  </div>
                </div>
              </div>

              <CTAForm variant="inline" title="Записаться на визит" />

              {/* Requisites accordion */}
              <details className="card mt-6 group">
                <summary className="p-4 flex items-center justify-between cursor-pointer min-h-[44px] list-none">
                  <span className="font-semibold text-text">Реквизиты</span>
                  <ChevronDown size={18} className="text-text-secondary transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-4 pb-4 text-sm text-text-secondary space-y-1">
                  <p>ИП ________</p>
                  <p>ИНН: ________</p>
                  <p>ОГРНИП: ________</p>
                </div>
              </details>
            </div>

            {/* Right: Map + Video */}
            <div className="space-y-4">
              {/* Yandex Map */}
              <div className="rounded-[var(--radius-card)] overflow-hidden border border-border aspect-video">
                <iframe
                  src={`https://yandex.ru/map-widget/v1/?ll=${COORDINATES.lng}%2C${COORDINATES.lat}&z=15&l=map`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  title="Карта Detailing Place"
                  loading="lazy"
                  className="w-full h-full"
                />
              </div>

              {/* YouTube embed */}
              <div className="rounded-[var(--radius-card)] overflow-hidden border border-border aspect-video">
                <div className="w-full h-full bg-bg-card flex items-center justify-center">
                  <p className="text-text-secondary text-sm text-center px-4">
                    Видео-обзор студии<br />
                    <span className="text-xs">(YouTube embed будет добавлен)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
