# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Premium auto detailing studio website for Kazan, Russia. 18+ pages, Next.js 16 (App Router), dark theme.
80% mobile traffic. Each page is a standalone landing page for Yandex.Direct ads.

## Commands

```bash
npm run dev          # localhost:3000
npm run build        # db:migrate + db:seed + next build (validates types + pages)
npm run start        # Run production server
npm run lint         # ESLint (eslint-config-next with core-web-vitals + typescript)

# Database
npm run db:generate  # Generate Drizzle migrations from schema changes
npm run db:migrate   # Apply migrations to SQLite database
npm run db:seed      # Seed database from src/lib/db/seed.ts
npm run db:reset     # Delete DB + migrate + seed (destructive)

# Deploy
vercel --prod        # Env vars: CRM_WEBHOOK_URL, TG_BOT_TOKEN, TG_CHAT_ID
```

E2E testing uses Playwright (`playwright` package installed as devDependency).

## Stack

- Next.js 16.1.6 (App Router, TypeScript, `src/` directory, `@/*` path alias)
- React 19, Tailwind CSS 4 with `@tailwindcss/typography`
- **SQLite** (better-sqlite3) + **Drizzle ORM** — file-based DB at `data/detailing.db`
- Framer Motion 12 (scroll animations desktop only >768px)
- Swiper.js 12 (carousels, touch)
- React Hook Form 7 + Zod 4 (forms + validation)
- Lucide React (icons), sharp (image processing)
- next/font/google: Inter (400,600,700) + Montserrat (700,800)
- jose + bcryptjs (admin auth via JWT)

## Principles (violation = bug)

### MOBILE-FIRST (80% traffic)
- CSS: start at 375px, then `md:` 768px, then `lg:` 1280px
- All buttons `min-h-[44px]` (tap targets >= 44x44px)
- Input font-size >= 16px (iOS zoom prevention on all inputs)
- Padding-bottom on last block >= 80px (floating panel clearance via `.pb-safe`)
- No hover-only effects without touch fallback
- No horizontal scroll — test at 320px, 375px, 414px
- `scroll-margin-top: 80px` on anchor targets (header clearance)

### CONVERSION-FIRST
- Lead capture form on every page minimum 2x (hero + final)
- WhatsApp button visible ALWAYS (header desktop, floating panel mobile)
- Phone clickable via `tel:` on mobile
- CTAForm shows "Ответим за 15 минут" + WhatsApp icon below form

### DARK THEME TOKENS
```
bg:         #0E0E0E (primary)   #1A1A1A (cards)     #252525 (hover)
text:       #F5F5F5 (primary)   #A0A0A0 (secondary)
accent:     #00F0FF (cyan — links, icons, highlights)
            #CCFF00 (lime — CTA buttons, prices, badges)
            #FF4444 (discounts, warnings)
border:     #333333
gradient:   #0E0E0E → #1A1A2E (section backgrounds for depth)
```

### PERFORMANCE
- Lighthouse Mobile > 90 (all metrics)
- LCP < 2.5s, CLS < 0.1
- Images: next/image, loading="lazy" (except hero: `priority={true}`), WebP, responsive sizes
- Hero image: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- Fonts: next/font, font-display: swap, CSS vars `--font-inter`, `--font-montserrat`
- Border-radius: card=12px, button=8px

## Architecture

Two route groups under `src/app/`:
- `(site)/` — public-facing pages (layout includes Header, Footer, MobileFloatingPanel, funnel elements)
- `(admin)/admin/` — admin panel (separate layout, JWT auth)

```
src/
├── app/
│   ├── layout.tsx              # Root: fonts, viewport, metadata only
│   ├── (site)/
│   │   ├── layout.tsx          # Site shell: Header+Footer+Panels+Metrika+SiteDataProvider+funnel
│   │   ├── page.tsx            # Homepage
│   │   ├── [service]/page.tsx  # 14 dynamic service pages
│   │   ├── portfolio/          # Listing + [slug] detail (with gallery lightbox)
│   │   ├── blog/               # Listing + [slug] detail
│   │   ├── about/ contacts/ privacy/
│   │   └── not-found.tsx
│   ├── (admin)/admin/
│   │   ├── login/page.tsx      # Admin login
│   │   └── (dashboard)/        # CRUD for services, blog, portfolio, reviews, team, settings
│   ├── api/
│   │   ├── submit/route.ts     # POST → CRM webhook + Telegram
│   │   └── admin/              # REST API for admin panel (auth, CRUD, upload, settings)
│   ├── sitemap.ts / robots.ts
│   └── layout.tsx              # Root layout
├── components/
│   ├── layout/                 # Header, Footer, MobileFloatingPanel, FullscreenMenu
│   ├── sections/               # 12+ reusable section blocks
│   ├── funnel/                 # ExitPopup, Callback, Quiz, Toast, Timer, LoadBar, ScrollTracker
│   └── ui/                     # Button, Input, Badge, Card, Modal, AnimatedSection, etc.
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema (20+ tables with relations)
│   │   ├── index.ts            # DB connection (better-sqlite3, WAL mode)
│   │   ├── seed.ts             # Seed script (run via tsx)
│   │   └── queries/
│   │       ├── services.ts     # getService(slug), getServicesForHomepage, getCarClassesForPricing
│   │       ├── settings.ts     # getSettings, getNavItems, getLiveStatus, getSocialProofItems, etc.
│   │       └── content.ts      # Blog posts, portfolio works, reviews, team queries
│   ├── site-data.tsx           # SiteDataProvider context (React Context for shared site data)
│   ├── analytics.ts            # Yandex.Metrika wrapper
│   ├── form-submit.ts          # submitForm() → fetch /api/submit + UTM + localStorage markers
│   ├── constants.ts            # Static constants
│   ├── types.ts                # Shared TypeScript types
│   ├── icons.ts                # Icon name → Lucide component mapping
│   └── utils.ts                # cn(), formatPhone(), isValidPhone()
├── styles/globals.css          # Tailwind + custom utilities (.container-main, .section-padding, .glass, .pb-safe)
data/                           # SQLite database file (gitignored, created by db:migrate + db:seed)
drizzle/                        # Migration SQL files (committed)
```

## Key Architecture Patterns

### Database-driven content
All content (services, prices, FAQ, blog, portfolio, settings) lives in SQLite via Drizzle ORM. Schema: `src/lib/db/schema.ts`. Queries: `src/lib/db/queries/`. The `data/detailing.db` file is created at build time (`npm run build` runs migrate + seed). NEVER hardcode text, prices, or FAQ in components.

### SiteDataProvider context
The `(site)/layout.tsx` fetches shared data (phone, nav, live status, seasonal offer, quiz categories, car classes) from the DB and passes it via `SiteDataProvider`. Client components access it via `useSiteData()` hook from `src/lib/site-data.tsx`.

### Service page assembly
Each `[service]/page.tsx` = import sections + `getService(slug)` from DB. Standard order: HeroSection -> BeforeAfterSlider (if visual) -> ServicePackages -> ProcessSteps -> WorkExamples -> FAQAccordion -> CTAForm -> SEOText -> CrossSellBanner.

### Admin panel
Full CRUD at `/admin` with JWT auth (jose + bcryptjs). REST API routes under `src/app/api/admin/`. Manages all DB content: services (with nested packages, prices, FAQ, process steps), blog, portfolio, reviews, team, and site settings.

### Pricing model
Two pricing patterns in DB: **package-based** (servicePackages -> packageClassPrices matrix by car class) and **element-based** (elementPrices -> elementClassPrices matrix). Car classes are 5 pricing tiers. Price can be NULL = "Дог." (negotiable).

### Section components
11 universal + 1 homepage-only (ServicesGrid). 3 service-specific unique blocks:
- PhotoComparison -> `/tonirovka`
- CarBrandGrid -> `/ustanovka-linz`
- BrandsGrid -> `/rusifikaciya-avto`

Note: `/shumoizolyaciya` has NO BeforeAfterSlider (not visual).

### Funnel system (spec in `docs/FUNNEL.md`)
ExitIntentPopup, CallbackWidget, QuizCalculator, StudioLoadBar, SeasonalTimer, SocialProofToast. All mounted in `(site)/layout.tsx`. Post-submit localStorage marker suppresses exit popup and social proof toast.

### SEO
Every page needs `generateMetadata()` with title <= 60 chars including "Казань" + "| Detailing Place". JSON-LD types: LocalBusiness (site layout), Service (service pages), Article (blog), FAQPage (FAQAccordion auto-generates), BreadcrumbList (all pages except home).

### Form pipeline
CTAForm -> `submitForm()` -> `POST /api/submit` -> CRM webhook + Telegram.

### Framer Motion
Scroll animations (`useInView` + `motion.div` fade-up) on desktop >768px ONLY. Mobile gets instant rendering.

## Sprint Workflow

Implementation follows sprints in `docs/sprints/` strictly in order. Each sprint has a checklist.

| Sprint | What |
|--------|------|
| 1 | Foundation: UI kit, Header, Footer, MobileFloatingPanel, constants, utils |
| 2 | 12 section components + services.ts data + unique blocks |
| 3 | All 18 pages assembled from sections + SEO metadata |
| 4 | Sales funnel: 6 conversion elements (`docs/FUNNEL.md`) |
| 5 | UX polish: animations, lazy loading, touch, Lighthouse >90 |
| 6 | SEO (JSON-LD, sitemap, robots), analytics (24 goals), API route, deploy |

## Business Data (TODO — replace with real values)
```
Phone:    +7 (843) 000-00-00
WhatsApp: wa.me/78430000000
Address:  г. Казань, ул. ________
Hours:    Ежедневно 10:00–20:00
Metrika:  ID 108264725
CRM URL:  (amoCRM webhook — set as CRM_WEBHOOK_URL env var)
Partner brands: LLumar, SunTek, Koch Chemie, Ceramic Pro, Comfort Mat, STP
```
