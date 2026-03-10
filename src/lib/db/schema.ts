import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ── Settings (key-value) ──

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

// ── Admin Users ──

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").notNull().default(""),
});

// ── Car Classes (5 pricing tiers) ──

export const carClasses = sqliteTable("car_classes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  example: text("example").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Services ──

export const services = sqliteTable("services", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  h1: text("h1").notNull(),
  subtitle: text("subtitle").notNull(),
  badge: text("badge"),
  seoText: text("seo_text").notNull().default(""),
  hasBeforeAfter: integer("has_before_after", { mode: "boolean" }).notNull().default(false),
  uniqueBlock: text("unique_block"), // "PhotoComparison" | "CarBrandGrid" | "BrandsGrid" | null
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  showOnHomepage: integer("show_on_homepage", { mode: "boolean" }).notNull().default(true),
  homepageSortOrder: integer("homepage_sort_order").notNull().default(0),
});

// ── Service Packages ──

export const servicePackages = sqliteTable("service_packages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  isPopular: integer("is_popular", { mode: "boolean" }).notNull().default(false),
  duration: text("duration"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Package Class Prices (package × car_class matrix) ──

export const packageClassPrices = sqliteTable("package_class_prices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  packageId: integer("package_id").notNull().references(() => servicePackages.id, { onDelete: "cascade" }),
  carClassId: integer("car_class_id").references(() => carClasses.id, { onDelete: "cascade" }), // NULL = flat price
  priceText: text("price_text"), // NULL = "Дог." (договорная)
});

// ── Package Features ──

export const packageFeatures = sqliteTable("package_features", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  packageId: integer("package_id").notNull().references(() => servicePackages.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Element Prices (per-element pricing, e.g. "Капот", "Бампер") ──

export const elementPrices = sqliteTable("element_prices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  elementName: text("element_name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Element Class Prices (element × car_class matrix) ──

export const elementClassPrices = sqliteTable("element_class_prices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  elementPriceId: integer("element_price_id").notNull().references(() => elementPrices.id, { onDelete: "cascade" }),
  carClassId: integer("car_class_id").references(() => carClasses.id, { onDelete: "cascade" }), // NULL = flat price
  priceText: text("price_text"), // NULL = "Дог."
});

// ── Service Keywords (SEO) ──

export const serviceKeywords = sqliteTable("service_keywords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  keyword: text("keyword").notNull(),
});

// ── Service Process Steps ──

export const serviceProcessSteps = sqliteTable("service_process_steps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Service FAQ ──

export const serviceFaq = sqliteTable("service_faq", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Service Cross-Sell (0..1 per service) ──

export const serviceCrossSell = sqliteTable("service_cross_sell", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id").notNull().unique().references(() => services.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  href: text("href").notNull(),
  discount: text("discount"),
});

// ── Service Before/After (0..1 per service) ──

export const serviceBeforeAfter = sqliteTable("service_before_after", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id").notNull().unique().references(() => services.id, { onDelete: "cascade" }),
  beforeImage: text("before_image").notNull(),
  afterImage: text("after_image").notNull(),
  beforeLabel: text("before_label").notNull(),
  afterLabel: text("after_label").notNull(),
});

// ── Works (portfolio items, linked to services) ──

export const works = sqliteTable("works", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  serviceId: integer("service_id").references(() => services.id, { onDelete: "set null" }),
  slug: text("slug"),
  car: text("car").notNull(),
  serviceName: text("service_name"),
  image: text("image").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Work Tags ──

export const workTags = sqliteTable("work_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workId: integer("work_id").notNull().references(() => works.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});

// ── Blog Posts ──

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content"),
  image: text("image").notNull().default(""),
  category: text("category").notNull().default(""),
  date: text("date").notNull(),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
});

// ── Reviews ──

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  author: text("author").notNull(),
  rating: integer("rating").notNull().default(5),
  text: text("text").notNull(),
  car: text("car"),
  date: text("date"),
  isVisible: integer("is_visible", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Team Members ──

export const teamMembers = sqliteTable("team_members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  image: text("image").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Navigation Items ──

export const navItems = sqliteTable("nav_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  href: text("href").notNull(),
  group: text("group").notNull().default("service"), // "service" | "info"
  isNew: integer("is_new", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Quiz Categories ──

export const quizCategories = sqliteTable("quiz_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Trust Badges ──

export const trustBadges = sqliteTable("trust_badges", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  iconName: text("icon_name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Partner Brands ──

export const partnerBrands = sqliteTable("partner_brands", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ── Live Status ──

export const liveStatus = sqliteTable("live_status", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  car: text("car").notNull(),
  service: text("service").notNull(),
});

// ── Social Proof ──

export const socialProof = sqliteTable("social_proof", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  car: text("car").notNull(),
  service: text("service").notNull(),
  minutesAgo: integer("minutes_ago").notNull(),
});

// ── Seasonal Offer ──

export const seasonalOffer = sqliteTable("seasonal_offer", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discount: integer("discount").notNull(),
  promoCode: text("promo_code"),
  endDate: text("end_date").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});

// ── Stats (About page) ──

export const stats = sqliteTable("stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  iconName: text("icon_name").notNull(),
  value: text("value").notNull(),
  label: text("label").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ══════════════════════════════════════
// RELATIONS (for relational queries)
// ══════════════════════════════════════

export const servicesRelations = relations(services, ({ many, one }) => ({
  packages: many(servicePackages),
  elementPricesList: many(elementPrices),
  keywords: many(serviceKeywords),
  processSteps: many(serviceProcessSteps),
  faq: many(serviceFaq),
  crossSell: one(serviceCrossSell),
  beforeAfter: one(serviceBeforeAfter),
  worksList: many(works),
}));

export const servicePackagesRelations = relations(servicePackages, ({ one, many }) => ({
  service: one(services, { fields: [servicePackages.serviceId], references: [services.id] }),
  prices: many(packageClassPrices),
  features: many(packageFeatures),
}));

export const packageClassPricesRelations = relations(packageClassPrices, ({ one }) => ({
  package: one(servicePackages, { fields: [packageClassPrices.packageId], references: [servicePackages.id] }),
  carClass: one(carClasses, { fields: [packageClassPrices.carClassId], references: [carClasses.id] }),
}));

export const packageFeaturesRelations = relations(packageFeatures, ({ one }) => ({
  package: one(servicePackages, { fields: [packageFeatures.packageId], references: [servicePackages.id] }),
}));

export const elementPricesRelations = relations(elementPrices, ({ one, many }) => ({
  service: one(services, { fields: [elementPrices.serviceId], references: [services.id] }),
  prices: many(elementClassPrices),
}));

export const elementClassPricesRelations = relations(elementClassPrices, ({ one }) => ({
  elementPrice: one(elementPrices, { fields: [elementClassPrices.elementPriceId], references: [elementPrices.id] }),
  carClass: one(carClasses, { fields: [elementClassPrices.carClassId], references: [carClasses.id] }),
}));

export const serviceKeywordsRelations = relations(serviceKeywords, ({ one }) => ({
  service: one(services, { fields: [serviceKeywords.serviceId], references: [services.id] }),
}));

export const serviceProcessStepsRelations = relations(serviceProcessSteps, ({ one }) => ({
  service: one(services, { fields: [serviceProcessSteps.serviceId], references: [services.id] }),
}));

export const serviceFaqRelations = relations(serviceFaq, ({ one }) => ({
  service: one(services, { fields: [serviceFaq.serviceId], references: [services.id] }),
}));

export const serviceCrossSellRelations = relations(serviceCrossSell, ({ one }) => ({
  service: one(services, { fields: [serviceCrossSell.serviceId], references: [services.id] }),
}));

export const serviceBeforeAfterRelations = relations(serviceBeforeAfter, ({ one }) => ({
  service: one(services, { fields: [serviceBeforeAfter.serviceId], references: [services.id] }),
}));

export const worksRelations = relations(works, ({ one, many }) => ({
  service: one(services, { fields: [works.serviceId], references: [services.id] }),
  tags: many(workTags),
}));

export const workTagsRelations = relations(workTags, ({ one }) => ({
  work: one(works, { fields: [workTags.workId], references: [works.id] }),
}));
