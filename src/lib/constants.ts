import {
  ShieldCheck,
  ScanBarcode,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

// ===== BUSINESS DATA =====
export const PHONE = "+7 (843) 000-00-00";
export const PHONE_RAW = "78430000000";
export const WHATSAPP_URL = "https://wa.me/78430000000";
export const ADDRESS = "г. Казань, ул. ________";
export const HOURS = "Ежедневно 10:00–20:00";
export const COORDINATES = { lat: 55.7887, lng: 49.1221 }; // Kazan center
export const METRIKA_ID = "108264725";
export const CRM_WEBHOOK_URL = process.env.CRM_WEBHOOK_URL || "";

// ===== NAVIGATION =====
export interface NavItem {
  label: string;
  href: string;
  isNew?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Антигравийная плёнка", href: "/ppf" },
  { label: "Полировка и керамика", href: "/polirovka" },
  { label: "Химчистка салона", href: "/himchistka" },
  { label: "Шумоизоляция", href: "/shumoizolyaciya" },
  { label: "Антихром", href: "/antihrom" },
  { label: "Тонировка", href: "/tonirovka" },
  { label: "Установка Bi-LED линз", href: "/ustanovka-linz", isNew: true },
  { label: "Регулировка фар", href: "/regulirovka-far", isNew: true },
  { label: "Полировка стёкол", href: "/polirovka-stekol", isNew: true },
  { label: "Полировка фар", href: "/polirovka-far", isNew: true },
  { label: "Антидождь", href: "/antidozhd", isNew: true },
  { label: "Русификация авто", href: "/rusifikaciya-avto", isNew: true },
  { label: "Ремонт вмятин (PDR)", href: "/remont-vmyatin", isNew: true },
  { label: "Портфолио", href: "/portfolio" },
  { label: "О студии", href: "/about" },
  { label: "Блог", href: "/blog" },
  { label: "Контакты", href: "/contacts" },
];

export const SERVICE_NAV = NAV_ITEMS.filter((item) => item.href.startsWith("/") && !["/portfolio", "/about", "/blog", "/contacts"].includes(item.href));
export const INFO_NAV = NAV_ITEMS.filter((item) => ["/portfolio", "/about", "/blog", "/contacts"].includes(item.href));

// ===== CAR CLASSES =====
export const CAR_CLASSES = [
  { value: "sedan", label: "Седан" },
  { value: "suv", label: "Кроссовер/Внедорожник" },
  { value: "coupe", label: "Купе/Спорт" },
  { value: "minivan", label: "Минивэн" },
] as const;

// ===== QUIZ CATEGORIES =====
export const QUIZ_CATEGORIES = [
  "Защита кузова (плёнка, керамика)",
  "Полировка и керамика",
  "Тонировка",
  "Шумоизоляция",
  "Тюнинг оптики (Bi-LED)",
  "Химчистка салона",
  "Другое",
] as const;

// ===== LIVE STATUS =====
export interface LiveStatusItem {
  car: string;
  service: string;
}

export const LIVE_STATUS: LiveStatusItem[] = [
  { car: "BMW X5", service: "Оклейка PPF" },
  { car: "Kia Ceed", service: "Установка Bi-LED" },
  { car: "Zeekr 001", service: "Керамика" },
  { car: "Toyota Camry", service: "Тонировка" },
  { car: "Haval Jolion", service: "Русификация" },
];

// ===== TRUST BADGES =====
export interface TrustBadge {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const TRUST_BADGES: TrustBadge[] = [
  {
    icon: ShieldCheck,
    title: "Охраняемый периметр 24/7",
    description: "Ваш автомобиль ночует в тёплом боксе под видеонаблюдением",
  },
  {
    icon: ScanBarcode,
    title: "Только оригиналы",
    description: "Пробиваем рулон плёнки при вас. Никакого Китая под видом бренда",
  },
  {
    icon: MessageCircle,
    title: "Фотоотчёты",
    description: "Отправляем фото каждого этапа. Контролируете процесс удалённо",
  },
];

// ===== PARTNER BRANDS =====
export const PARTNER_BRANDS = [
  "LLumar",
  "SunTek",
  "Koch Chemie",
  "Ceramic Pro",
  "Comfort Mat",
  "STP",
] as const;

// ===== SOCIAL PROOF =====
export interface SocialProofItem {
  name: string;
  car: string;
  service: string;
  minutesAgo: number;
}

export const SOCIAL_PROOF_ITEMS: SocialProofItem[] = [
  { name: "Ильнар", car: "BMW X5", service: "оклейку PPF", minutesAgo: 12 },
  { name: "Артём", car: "Kia Ceed", service: "установку Bi-LED линз", minutesAgo: 23 },
  { name: "Марат", car: "Zeekr 001", service: "керамику", minutesAgo: 34 },
  { name: "Алексей", car: "Toyota Camry", service: "тонировку", minutesAgo: 45 },
  { name: "Дамир", car: "VW Polo", service: "полировку фар", minutesAgo: 8 },
  { name: "Руслан", car: "Hyundai Creta", service: "шумоизоляцию", minutesAgo: 55 },
  { name: "Тимур", car: "Haval Jolion", service: "русификацию", minutesAgo: 18 },
  { name: "Ренат", car: "Lada Vesta", service: "полировку стёкол", minutesAgo: 29 },
  { name: "Эдуард", car: "Skoda Rapid", service: "химчистку", minutesAgo: 41 },
  { name: "Айрат", car: "Porsche Cayenne", service: "антихром Full Black", minutesAgo: 7 },
  { name: "Вадим", car: "Mercedes C-Class", service: "полировку + керамику", minutesAgo: 33 },
  { name: "Олег", car: "Chery Tiggo 7", service: "русификацию + тонировку", minutesAgo: 52 },
  { name: "Денис", car: "Ford Focus", service: "регулировку фар", minutesAgo: 15 },
  { name: "Рамиль", car: "Geely Monjaro", service: "антидождь", minutesAgo: 27 },
  { name: "Фарид", car: "Exeed VX", service: "полную оклейку", minutesAgo: 44 },
];

// ===== SEASONAL OFFER =====
export const SEASONAL_OFFER = {
  title: "Весенний детокс",
  description: "Химчистка + полировка + керамика — скидка 15%",
  discount: 15,
  endDate: "2026-04-30T23:59:59",
} as const;
