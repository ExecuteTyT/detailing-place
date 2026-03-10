import type { LucideIcon } from "lucide-react";

// ── Service Data Interfaces ──
// These match the existing interfaces from services.ts exactly.
// Components import these types — the contract is immutable.

export interface ServicePackage {
  name: string;
  description: string;
  /** Prices per car class (1-5). null = "договорная". Single element = flat price for all classes. */
  classPrices: (string | null)[];
  features: string[];
  isPopular?: boolean;
  duration?: string;
}

export interface ElementPrice {
  element: string;
  /** Prices per car class (1-5). null = "договорная" */
  classPrices: (string | null)[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface CrossSell {
  title: string;
  description: string;
  href: string;
  discount?: string;
}

export interface WorkExample {
  image: string;
  car: string;
  tags: string[];
}

export interface ServiceData {
  slug: string;
  url: string;
  title: string;
  h1: string;
  subtitle: string;
  badge?: string;
  keywords: string[];
  packages: ServicePackage[];
  elementPrices?: ElementPrice[];
  process: ProcessStep[];
  faq: FAQItem[];
  crossSell?: CrossSell;
  beforeAfter?: {
    before: string;
    after: string;
    beforeLabel: string;
    afterLabel: string;
  };
  works: WorkExample[];
  seoText: string;
  hasBeforeAfter: boolean;
  uniqueBlock?: string;
}

// ── Constants Interfaces ──

export interface NavItem {
  label: string;
  href: string;
  isNew?: boolean;
}

export interface TrustBadge {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface LiveStatusItem {
  car: string;
  service: string;
}

export interface SocialProofItem {
  name: string;
  car: string;
  service: string;
  minutesAgo: number;
}

export interface HomepageService {
  slug: string;
  url: string;
  title: string;
  tagline: string;
  price: string;
  isNew: boolean;
}

export interface CarClass {
  id: number;
  label: string;
  example: string;
}

export interface SeasonalOfferData {
  title: string;
  description: string;
  discount: number;
  promoCode?: string;
  endDate: string;
  isActive: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category: string;
  date: string;
  isFeatured: boolean;
}

export interface PortfolioItem {
  slug: string;
  car: string;
  serviceName?: string;
  image: string;
  tags: string[];
}

export interface Review {
  author: string;
  rating: number;
  text: string;
  car?: string;
  date?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}
