import { eq, asc, and } from "drizzle-orm";
import { db } from "../index";
import {
  services,
  carClasses,
  navItems,
} from "../schema";
import type {
  ServiceData,
  ServicePackage,
  ElementPrice,
  HomepageService,
  CarClass,
} from "../../types";

// ── Helpers ──

/** Fetch all car classes ordered by sortOrder. */
function getOrderedCarClasses() {
  return db.select().from(carClasses).orderBy(asc(carClasses.sortOrder)).all();
}

/**
 * Build the `classPrices` array from a set of price rows.
 *
 * - If any row has `carClassId = null` it is a flat price  ->  return `[priceText]`
 * - Otherwise return an array of 5 elements ordered by car_classes.sortOrder,
 *   mapping each car class ID to its `priceText` (null when no row exists).
 */
function buildClassPrices(
  priceRows: { carClassId: number | null; priceText: string | null }[],
  orderedClasses: { id: number }[],
): (string | null)[] {
  // Flat price: row with carClassId === null
  const flatRow = priceRows.find((r) => r.carClassId === null);
  if (flatRow) {
    return [flatRow.priceText];
  }

  // Per-class pricing
  const priceMap = new Map<number, string | null>();
  for (const row of priceRows) {
    if (row.carClassId !== null) {
      priceMap.set(row.carClassId, row.priceText);
    }
  }

  return orderedClasses.map((cc) => priceMap.get(cc.id) ?? null);
}

// Shared relational query shape for eager-loading all service relations
const serviceWithRelations = {
  packages: {
    with: {
      prices: true as const,
      features: true as const,
    },
  },
  elementPricesList: {
    with: {
      prices: true as const,
    },
  },
  keywords: true as const,
  processSteps: true as const,
  faq: true as const,
  crossSell: true as const,
  beforeAfter: true as const,
  worksList: {
    with: {
      tags: true as const,
    },
  },
} as const;

/** Helper used only for type inference. Never called at runtime. */
function _inferServiceRow() {
  return db.query.services.findFirst({
    with: serviceWithRelations,
  }).sync();
}

/** The shape of a single service row with all relations eagerly loaded. */
type ServiceRow = NonNullable<ReturnType<typeof _inferServiceRow>>;

/**
 * Transform a raw relational-query result into the ServiceData interface.
 */
function transformService(
  raw: ServiceRow,
  orderedClasses: { id: number }[],
): ServiceData {
  // Packages
  const pkgs: ServicePackage[] = [...(raw.packages ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((pkg) => {
      const classPrices = buildClassPrices(
        (pkg.prices ?? []).map((p) => ({
          carClassId: p.carClassId,
          priceText: p.priceText,
        })),
        orderedClasses,
      );

      const features = [...(pkg.features ?? [])]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((f) => f.text);

      const sp: ServicePackage = {
        name: pkg.name,
        description: pkg.description,
        classPrices,
        features,
      };
      if (pkg.isPopular) sp.isPopular = true;
      if (pkg.duration) sp.duration = pkg.duration;
      return sp;
    });

  // Element prices
  const elPrices: ElementPrice[] | undefined =
    raw.elementPricesList && raw.elementPricesList.length > 0
      ? [...raw.elementPricesList]
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((ep) => ({
            element: ep.elementName,
            classPrices: buildClassPrices(
              (ep.prices ?? []).map((p) => ({
                carClassId: p.carClassId,
                priceText: p.priceText,
              })),
              orderedClasses,
            ),
          }))
      : undefined;

  // Process steps
  const process = [...(raw.processSteps ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => ({ title: s.title, description: s.description }));

  // FAQ
  const faq = [...(raw.faq ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((f) => ({ question: f.question, answer: f.answer }));

  // Keywords
  const keywords = (raw.keywords ?? []).map((k) => k.keyword);

  // Cross-sell (0 or 1)
  const crossSell = raw.crossSell
    ? (() => {
        const cs: ServiceData["crossSell"] = {
          title: raw.crossSell.title,
          description: raw.crossSell.description,
          href: raw.crossSell.href,
        };
        if (raw.crossSell.discount) cs.discount = raw.crossSell.discount;
        return cs;
      })()
    : undefined;

  // Before/After (0 or 1)
  const beforeAfter = raw.beforeAfter
    ? {
        before: raw.beforeAfter.beforeImage,
        after: raw.beforeAfter.afterImage,
        beforeLabel: raw.beforeAfter.beforeLabel,
        afterLabel: raw.beforeAfter.afterLabel,
      }
    : undefined;

  // Works
  const worksArr = [...(raw.worksList ?? [])]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((w) => ({
      image: w.image,
      car: w.car,
      tags: (w.tags ?? []).map((t) => t.tag),
    }));

  const data: ServiceData = {
    slug: raw.slug,
    url: `/${raw.slug}`,
    title: raw.title,
    h1: raw.h1,
    subtitle: raw.subtitle,
    keywords,
    packages: pkgs,
    process,
    faq,
    works: worksArr,
    seoText: raw.seoText,
    hasBeforeAfter: raw.hasBeforeAfter,
  };

  if (raw.badge) data.badge = raw.badge;
  if (elPrices) data.elementPrices = elPrices;
  if (crossSell) data.crossSell = crossSell;
  if (beforeAfter) data.beforeAfter = beforeAfter;
  if (raw.uniqueBlock) data.uniqueBlock = raw.uniqueBlock;

  return data;
}

// ── Public API ──

/**
 * Get a single service by slug, with all nested data fully transformed
 * into the ServiceData interface.
 */
export function getService(slug: string): ServiceData | undefined {
  const raw = db.query.services.findFirst({
    where: eq(services.slug, slug),
    with: serviceWithRelations,
  }).sync();

  if (!raw) return undefined;

  const orderedClasses = getOrderedCarClasses();
  return transformService(raw, orderedClasses);
}

/**
 * Get all active services ordered by sortOrder, each fully transformed
 * into ServiceData.
 */
export function getAllServices(): ServiceData[] {
  const rows = db.query.services.findMany({
    where: eq(services.isActive, true),
    orderBy: asc(services.sortOrder),
    with: serviceWithRelations,
  }).sync();

  if (rows.length === 0) return [];

  const orderedClasses = getOrderedCarClasses();
  return rows.map((r) => transformService(r, orderedClasses));
}

/**
 * Get services for the homepage grid.
 *
 * - Filter: isActive AND showOnHomepage
 * - Order by homepageSortOrder
 * - Extract first package's first price
 * - title = h1 stripped of " в Казани..." / " — ..."
 * - tagline = first sentence of subtitle
 * - isNew = nav_items.is_new for the matching href
 */
export function getHomepageServices(): HomepageService[] {
  const rows = db.query.services.findMany({
    where: and(eq(services.isActive, true), eq(services.showOnHomepage, true)),
    orderBy: asc(services.homepageSortOrder),
    with: {
      packages: {
        with: {
          prices: true as const,
        },
      },
    },
  }).sync();

  // Build a lookup: href -> isNew from nav_items
  const navRows = db.select().from(navItems).all();
  const isNewByHref = new Map<string, boolean>();
  for (const nav of navRows) {
    isNewByHref.set(nav.href, nav.isNew);
  }

  const orderedClasses = getOrderedCarClasses();

  return rows.map((svc) => {
    // Title: strip " в Казани..." and " — ..."
    const title = svc.h1.replace(/ в Казани.*/, "").replace(/ — .*/, "");

    // Tagline: first sentence of subtitle
    const tagline = svc.subtitle.includes(". ")
      ? svc.subtitle.split(". ")[0]
      : svc.subtitle;

    // Price: first price of the first package (by sortOrder)
    let price = "";
    const sortedPkgs = [...(svc.packages ?? [])].sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
    if (sortedPkgs.length > 0) {
      const firstPkg = sortedPkgs[0];
      const classPrices = buildClassPrices(
        (firstPkg.prices ?? []).map((p) => ({
          carClassId: p.carClassId,
          priceText: p.priceText,
        })),
        orderedClasses,
      );
      price = classPrices[0] ?? "";
    }

    // isNew: check nav_items for this service's href
    const href = `/${svc.slug}`;
    const isNew = isNewByHref.get(href) ?? false;

    return {
      slug: svc.slug,
      url: href,
      title,
      tagline,
      price,
      isNew,
    };
  });
}

/**
 * Get all car classes ordered by sortOrder, for use in pricing tables.
 */
export function getCarClassesForPricing(): CarClass[] {
  const rows = db
    .select()
    .from(carClasses)
    .orderBy(asc(carClasses.sortOrder))
    .all();

  return rows.map((r) => ({
    id: r.id,
    label: r.label,
    example: r.example,
  }));
}
