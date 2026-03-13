"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Menu,
  ChevronDown,
  Shield,
  Sparkles,
  Droplets,
  Volume2,
  PaintBucket,
  Sun,
  Lightbulb,
  SlidersHorizontal,
  CircleDot,
  CloudRain,
  Globe,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useSiteData } from "@/lib/site-data";
import { reachGoal, goals } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import FullscreenMenu from "./FullscreenMenu";

/* ───────── Mega menu structure ───────── */

interface MegaItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isNew?: boolean;
}

interface MegaCategory {
  title: string;
  items: MegaItem[];
}

/** 3-column layout: balanced service distribution */
const MEGA_COLUMNS: MegaCategory[][] = [
  // Column 1
  [
    {
      title: "Защита",
      items: [
        { href: "/ppf", label: "Антигравийная плёнка", icon: Shield },
        { href: "/antidozhd", label: "Антидождь", icon: CloudRain, isNew: true },
      ],
    },
    {
      title: "Оптика",
      items: [
        { href: "/ustanovka-linz", label: "Bi-LED линзы", icon: Lightbulb, isNew: true },
        { href: "/regulirovka-far", label: "Регулировка фар", icon: SlidersHorizontal, isNew: true },
      ],
    },
  ],
  // Column 2
  [
    {
      title: "Полировка & Уход",
      items: [
        { href: "/polirovka", label: "Полировка и керамика", icon: Sparkles },
        { href: "/polirovka-stekol", label: "Полировка стёкол", icon: CircleDot, isNew: true },
        { href: "/polirovka-far", label: "Полировка фар", icon: CircleDot, isNew: true },
        { href: "/himchistka", label: "Химчистка салона", icon: Droplets },
      ],
    },
  ],
  // Column 3
  [
    {
      title: "Стайлинг & Комфорт",
      items: [
        { href: "/tonirovka", label: "Тонировка", icon: Sun },
        { href: "/antihrom", label: "Антихром", icon: PaintBucket },
        { href: "/shumoizolyaciya", label: "Шумоизоляция", icon: Volume2 },
      ],
    },
    {
      title: "Другое",
      items: [
        { href: "/rusifikaciya-avto", label: "Русификация", icon: Globe, isNew: true },
        { href: "/remont-vmyatin", label: "Ремонт вмятин", icon: Wrench, isNew: true },
      ],
    },
  ],
];

/* ───────── Component ───────── */

export default function Header() {
  const { phone, phoneRaw, whatsappUrl, liveStatus, infoNav } = useSiteData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* Scroll detection */
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mega on Escape or scroll */
  useEffect(() => {
    if (!megaOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMegaOpen(false);
    }
    function handleScroll() {
      setMegaOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [megaOpen]);

  function handleMegaEnter() {
    clearTimeout(closeTimeout.current);
    setMegaOpen(true);
  }

  function handleMegaLeave() {
    closeTimeout.current = setTimeout(() => setMegaOpen(false), 150);
  }

  function handlePhoneClick() {
    reachGoal(goals.PHONE_CLICK);
  }

  function handleWhatsAppClick() {
    reachGoal(goals.WHATSAPP_CLICK);
  }

  function handleMenuOpen() {
    setMenuOpen(true);
    reachGoal(goals.MENU_OPEN);
  }

  const liveCount = liveStatus.length;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "header-scrolled border-border"
            : "bg-bg/80 backdrop-blur-md border-transparent"
        )}
      >
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-accent-gold/40 via-accent-gold/20 to-transparent" />

        <div className="container-main flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/images/logo.webp"
              alt="Detailing Place"
              className="h-10 md:h-12 w-auto"
              width={160}
              height={44}
            />
          </Link>

          {/* ── Desktop Navigation (lg+) ── */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {/* Services mega dropdown trigger */}
            <div
              ref={megaRef}
              className="relative"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
            >
              <button
                onClick={() => setMegaOpen((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-[var(--radius-button)] min-h-[44px] cursor-pointer transition-colors",
                  megaOpen
                    ? "text-accent-gold bg-accent-gold/8"
                    : "text-text-secondary hover:text-text hover:bg-bg-hover"
                )}
              >
                Услуги
                <ChevronDown
                  size={15}
                  className={cn(
                    "transition-transform duration-200",
                    megaOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Mega dropdown */}
              <div
                className={cn(
                  "absolute top-full left-0 pt-3 transition-all duration-200 ease-out",
                  megaOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                )}
              >
                <div className="w-[660px] p-6 rounded-[var(--radius-card)] border border-border shadow-[0_20px_60px_rgba(0,0,0,0.6)] card-glow-top bg-[rgba(19,18,16,0.98)] backdrop-blur-xl">
                  <div className="grid grid-cols-3 gap-x-8 gap-y-5">
                    {MEGA_COLUMNS.map((column, colIdx) => (
                      <div key={colIdx} className="space-y-5">
                        {column.map((cat) => (
                          <div key={cat.title}>
                            <p className="text-[11px] font-bold text-accent-gold/70 uppercase tracking-[0.15em] mb-2.5">
                              {cat.title}
                            </p>
                            <ul className="space-y-0.5">
                              {cat.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      onClick={() => {
                                        setMegaOpen(false);
                                        reachGoal(goals.SERVICE_CLICK);
                                      }}
                                      className="group flex items-center gap-2.5 py-2 px-2.5 -mx-1 rounded-[var(--radius-button)] text-text-secondary hover:text-text hover:bg-bg-hover transition-all"
                                    >
                                      <span className="w-7 h-7 rounded-lg bg-accent-gold/8 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-gold/15 transition-colors">
                                        <Icon
                                          size={14}
                                          className="text-accent-gold/50 group-hover:text-accent-gold transition-colors"
                                        />
                                      </span>
                                      <span className="text-[13px] font-medium">
                                        {item.label}
                                      </span>
                                      {item.isNew && (
                                        <span className="ml-auto text-[9px] font-bold text-accent-gold bg-accent-gold/10 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                          new
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Bottom bar */}
                  <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-pulse-ring" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                      </span>
                      Сейчас в работе: {liveCount} авто
                    </div>
                    <Link
                      href="/"
                      onClick={() => setMegaOpen(false)}
                      className="text-xs font-semibold text-accent-gold hover:text-accent-gold/80 transition-colors"
                    >
                      Все услуги →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Info nav links */}
            {infoNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-sm font-semibold text-text-secondary hover:text-text hover:bg-bg-hover rounded-[var(--radius-button)] min-h-[44px] flex items-center transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Phone (md+) */}
            <a
              href={`tel:${phoneRaw}`}
              onClick={handlePhoneClick}
              className="hidden md:flex items-center gap-2 text-text hover:text-accent-gold transition-colors min-h-[44px] px-2"
            >
              <Phone size={18} />
              <span className="font-semibold text-sm hidden xl:inline">
                {phone}
              </span>
            </a>

            {/* WhatsApp (md+) */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="hidden md:flex items-center gap-2 min-h-[44px] px-3.5 py-2 bg-accent-whatsapp text-white rounded-[var(--radius-button)] font-semibold text-sm hover:bg-[#1ebe57] transition-colors shadow-md"
            >
              <MessageCircle size={18} />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>

            {/* Burger — mobile & tablet only */}
            <button
              onClick={handleMenuOpen}
              className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-text hover:text-accent-gold transition-colors cursor-pointer"
              aria-label="Открыть меню"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <FullscreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
