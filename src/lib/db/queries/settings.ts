import { eq, asc } from "drizzle-orm";
import { db } from "../index";
import {
  settings,
  navItems,
  quizCategories,
  liveStatus,
  trustBadges,
  partnerBrands,
  socialProof,
  seasonalOffer,
  stats,
} from "../schema";
import type {
  NavItem,
  LiveStatusItem,
  TrustBadge,
  SocialProofItem,
  SeasonalOfferData,
  StatItem,
} from "../../types";
import { resolveIcon } from "../../icons";

// ── Settings cache (60-second TTL) ──

let settingsCache: Record<string, string> | null = null;
let settingsCacheTime = 0;
const SETTINGS_TTL = 60_000;

export function invalidateSettingsCache(): void {
  settingsCache = null;
  settingsCacheTime = 0;
}

export function getSettings(): Record<string, string> {
  const now = Date.now();
  if (settingsCache && now - settingsCacheTime < SETTINGS_TTL) {
    return settingsCache;
  }

  const rows = db.select().from(settings).all();
  const result: Record<string, string> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }

  settingsCache = result;
  settingsCacheTime = now;
  return result;
}

// ── Navigation Items ──

export function getNavItems(): { service: NavItem[]; info: NavItem[] } {
  const rows = db
    .select()
    .from(navItems)
    .orderBy(asc(navItems.sortOrder))
    .all();

  const service: NavItem[] = [];
  const info: NavItem[] = [];

  for (const row of rows) {
    const item: NavItem = {
      label: row.label,
      href: row.href,
      ...(row.isNew ? { isNew: true } : {}),
    };
    if (row.group === "info") {
      info.push(item);
    } else {
      service.push(item);
    }
  }

  return { service, info };
}

// ── Quiz Categories ──

export function getQuizCategories(): string[] {
  const rows = db
    .select({ label: quizCategories.label })
    .from(quizCategories)
    .orderBy(asc(quizCategories.sortOrder))
    .all();

  return rows.map((r) => r.label);
}

// ── Live Status ──

export function getLiveStatus(): LiveStatusItem[] {
  const rows = db.select().from(liveStatus).all();

  return rows.map((row) => ({
    car: row.car,
    service: row.service,
  }));
}

// ── Trust Badges ──

export function getTrustBadges(): TrustBadge[] {
  const rows = db
    .select()
    .from(trustBadges)
    .orderBy(asc(trustBadges.sortOrder))
    .all();

  return rows.map((row) => ({
    icon: resolveIcon(row.iconName),
    title: row.title,
    description: row.description,
  }));
}

// ── Partner Brands ──

export function getPartnerBrands(): string[] {
  const rows = db
    .select({ name: partnerBrands.name })
    .from(partnerBrands)
    .orderBy(asc(partnerBrands.sortOrder))
    .all();

  return rows.map((r) => r.name);
}

// ── Social Proof ──

export function getSocialProofItems(): SocialProofItem[] {
  const rows = db.select().from(socialProof).all();

  return rows.map((row) => ({
    name: row.name,
    car: row.car,
    service: row.service,
    minutesAgo: row.minutesAgo,
  }));
}

// ── Seasonal Offer ──

export function getSeasonalOffer(): SeasonalOfferData | null {
  const row = db
    .select()
    .from(seasonalOffer)
    .where(eq(seasonalOffer.isActive, true))
    .get();

  if (!row) return null;

  return {
    title: row.title,
    description: row.description,
    discount: row.discount,
    ...(row.promoCode ? { promoCode: row.promoCode } : {}),
    endDate: row.endDate,
    isActive: row.isActive,
  };
}

// ── Stats ──

export function getStats(): StatItem[] {
  const rows = db
    .select()
    .from(stats)
    .orderBy(asc(stats.sortOrder))
    .all();

  return rows.map((row) => ({
    icon: resolveIcon(row.iconName),
    value: row.value,
    label: row.label,
  }));
}
