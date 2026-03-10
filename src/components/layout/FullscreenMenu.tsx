"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  X,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
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
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteData } from "@/lib/site-data";
import { reachGoal, goals } from "@/lib/analytics";
import Badge from "@/components/ui/Badge";

/* ───────── Service groups with icons ───────── */

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isNew?: boolean;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const SERVICE_GROUPS: MenuGroup[] = [
  {
    title: "Защита",
    items: [
      { href: "/ppf", label: "Антигравийная плёнка", icon: Shield },
      { href: "/antidozhd", label: "Антидождь", icon: CloudRain, isNew: true },
    ],
  },
  {
    title: "Полировка & Уход",
    items: [
      { href: "/polirovka", label: "Полировка и керамика", icon: Sparkles },
      { href: "/polirovka-stekol", label: "Полировка стёкол", icon: CircleDot, isNew: true },
      { href: "/polirovka-far", label: "Полировка фар", icon: CircleDot, isNew: true },
      { href: "/himchistka", label: "Химчистка салона", icon: Droplets },
    ],
  },
  {
    title: "Стайлинг & Комфорт",
    items: [
      { href: "/tonirovka", label: "Тонировка", icon: Sun },
      { href: "/antihrom", label: "Антихром", icon: PaintBucket },
      { href: "/shumoizolyaciya", label: "Шумоизоляция", icon: Volume2 },
    ],
  },
  {
    title: "Оптика",
    items: [
      { href: "/ustanovka-linz", label: "Bi-LED линзы", icon: Lightbulb, isNew: true },
      { href: "/regulirovka-far", label: "Регулировка фар", icon: SlidersHorizontal, isNew: true },
    ],
  },
  {
    title: "Другое",
    items: [
      { href: "/rusifikaciya-avto", label: "Русификация авто", icon: Globe, isNew: true },
      { href: "/remont-vmyatin", label: "Ремонт вмятин", icon: Wrench, isNew: true },
    ],
  },
];

/* ───────── Animation variants ───────── */

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.12,
    },
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

/* ───────── Component ───────── */

interface FullscreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FullscreenMenu({ isOpen, onClose }: FullscreenMenuProps) {
  const { infoNav, phone, phoneRaw, whatsappUrl, address, hours } = useSiteData();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function handleServiceClick() {
    reachGoal(goals.SERVICE_CLICK);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="fullscreen-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10000]"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Side Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="absolute top-0 right-0 bottom-0 w-full max-w-[420px] bg-bg overflow-y-auto overscroll-contain"
          >
            {/* Top gold accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent-gold via-accent-gold/50 to-transparent z-10" />

            {/* Content with staggered animation */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="px-6 pt-6 pb-24"
            >
              {/* Header */}
              <motion.div variants={fadeInRight} className="flex items-center justify-between mb-8">
                <span className="text-lg font-extrabold font-display tracking-tight text-text">
                  DETAILING
                  <span
                    className="text-accent-gold"
                    style={{ textShadow: "0 0 20px rgba(200,169,126,0.2)" }}
                  >
                    {" "}PLACE
                  </span>
                </span>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-secondary hover:text-text hover:border-text-secondary/50 transition-colors cursor-pointer"
                  aria-label="Закрыть меню"
                >
                  <X size={20} />
                </button>
              </motion.div>

              {/* Services section label */}
              <motion.p
                variants={fadeInRight}
                className="text-[11px] font-bold text-text-secondary/50 uppercase tracking-[0.2em] mb-4 pl-1"
              >
                Услуги
              </motion.p>

              {/* Service groups */}
              <div className="space-y-5 mb-8">
                {SERVICE_GROUPS.map((group) => (
                  <motion.div key={group.title} variants={fadeInRight}>
                    <p className="text-[11px] font-bold text-accent-gold/60 uppercase tracking-[0.15em] mb-2 pl-1">
                      {group.title}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleServiceClick}
                            className="group flex items-center gap-3 py-2.5 px-3 rounded-[var(--radius-button)] hover:bg-bg-hover transition-colors min-h-[44px]"
                          >
                            <span className="w-8 h-8 rounded-lg bg-accent-gold/8 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-gold/15 transition-colors">
                              <Icon
                                size={16}
                                className="text-accent-gold/50 group-hover:text-accent-gold transition-colors"
                              />
                            </span>
                            <span className="text-[15px] font-medium text-text">
                              {item.label}
                            </span>
                            {item.isNew && (
                              <Badge variant="new" className="ml-auto text-[10px] px-2 py-0">
                                NEW
                              </Badge>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <motion.div
                variants={fadeInRight}
                className="h-[1px] bg-gradient-to-r from-border via-border to-transparent mb-6"
              />

              {/* Info pages — 2-column grid */}
              <motion.div variants={fadeInRight} className="mb-8">
                <p className="text-[11px] font-bold text-text-secondary/50 uppercase tracking-[0.2em] mb-3 pl-1">
                  Компания
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {infoNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-1.5 py-2.5 px-3 text-[15px] font-medium text-text-secondary hover:text-text hover:bg-bg-hover rounded-[var(--radius-button)] transition-colors min-h-[44px]"
                    >
                      {item.label}
                      <ArrowUpRight size={14} className="text-text-secondary/30" />
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div
                variants={fadeInRight}
                className="h-[1px] bg-gradient-to-r from-border via-border to-transparent mb-6"
              />

              {/* Contact section */}
              <motion.div variants={fadeInRight} className="space-y-4">
                {/* Phone */}
                <a
                  href={`tel:${phoneRaw}`}
                  className="flex items-center gap-3 text-lg font-bold text-text hover:text-accent-gold transition-colors min-h-[44px]"
                >
                  <span className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-accent-gold" />
                  </span>
                  {phone}
                </a>

                {/* WhatsApp CTA */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full min-h-[48px] px-5 py-3 bg-accent-whatsapp text-white rounded-[var(--radius-button)] font-bold text-base hover:bg-[#1ebe57] transition-colors"
                >
                  <MessageCircle size={20} />
                  Написать в WhatsApp
                </a>

                {/* Address & Hours */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-start gap-3 text-sm text-text-secondary">
                    <MapPin size={16} className="text-accent-gold/40 mt-0.5 flex-shrink-0" />
                    <span>{address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Clock size={16} className="text-accent-gold/40 flex-shrink-0" />
                    <span>{hours}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
