"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import { cn } from "@/lib/utils";

interface FooterAccordionProps {
  title: string;
  children: React.ReactNode;
}

function FooterAccordion({ title, children }: FooterAccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/50 md:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left md:pointer-events-none md:cursor-default min-h-[44px] cursor-pointer"
      >
        <span className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
          {title}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-text-secondary transition-transform md:hidden",
            open && "rotate-180"
          )}
        />
      </button>
      <div className={cn("overflow-hidden transition-all md:block", open ? "max-h-96 pb-4" : "max-h-0 md:max-h-none")}>
        {children}
      </div>
    </div>
  );
}

export default function Footer() {
  const { phone, phoneRaw, whatsappUrl, address, hours, serviceNav, infoNav } = useSiteData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-transparent bg-gradient-to-b from-bg to-[#080706]">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />

      <div className="container-main section-padding">
        {/* Grid */}
        <div className="md:grid md:grid-cols-4 md:gap-8">
          {/* Column 1: Logo + Offer */}
          <div className="pb-6 md:pb-0">
            <img
              src="/images/logo.webp"
              alt="Detailing Place"
              className="h-9 w-auto"
              width={140}
              height={36}
            />
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              Премиальный детейлинг в Казани. Защита, красота, комфорт вашего автомобиля.
            </p>
            <div className="mt-4 p-3 rounded-[var(--radius-card)] bg-accent-gold/10 border border-accent-gold/20">
              <p className="text-sm font-bold text-accent-gold">
                Оплатим такси до студии
              </p>
              <p className="text-xs text-text-secondary mt-1">
                При заказе от 15 000₽
              </p>
            </div>
          </div>

          {/* Column 2: Services */}
          <FooterAccordion title="Услуги">
            <ul className="space-y-2">
              {serviceNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-accent-cyan transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* Column 3: Company */}
          <FooterAccordion title="Компания">
            <ul className="space-y-2">
              {infoNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-accent-cyan transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          {/* Column 4: Contacts */}
          <FooterAccordion title="Контакты">
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${phoneRaw}`}
                  className="flex items-center gap-2 text-sm text-text hover:text-accent-cyan transition-colors"
                >
                  <Phone size={16} className="flex-shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent-whatsapp hover:text-[#1ebe57] transition-colors"
                >
                  <MessageCircle size={16} className="flex-shrink-0" />
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-text-secondary">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                {address}
              </li>
              <li className="flex items-center gap-2 text-sm text-text-secondary">
                <Clock size={16} className="flex-shrink-0" />
                {hours}
              </li>
            </ul>
          </FooterAccordion>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-text-secondary/60">
            &copy; {currentYear} Detailing Place. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
