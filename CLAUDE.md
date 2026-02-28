# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Premium auto detailing studio website for Kazan, Russia. 18 pages, Next.js 14, dark theme.
80% mobile traffic. Each page is a standalone landing page for Yandex.Direct ads.

## Commands

```bash
# Initialize (Sprint 1 — run once)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install framer-motion swiper react-hook-form @hookform/resolvers zod lucide-react clsx tailwind-merge
npm install -D @tailwindcss/typography

# Development
npm run dev          # localhost:3000
npm run build        # Production build
npm run lint         # ESLint

# Deploy
vercel --prod        # Env vars: CRM_WEBHOOK_URL, TG_BOT_TOKEN, TG_CHAT_ID
```

## Stack

- Next.js 14+ (App Router, TypeScript, `src/` directory, `@/*` alias)
- Tailwind CSS 3.4+ with `@tailwindcss/typography`
- Framer Motion (scroll animations desktop only >768px)
- Swiper.js 11+ (carousels, touch)
- React Hook Form + Zod (forms)
- Lucide React (icons)
- next/font/google: Inter (400,600,700) + Montserrat (700,800)

## Principles (violation = bug)

### MOBILE-FIRST (80% traffic)
- CSS: start at 375px, then `md:` 768px, then `lg:` 1280px
- All buttons `min-h-[44px]` (tap targets ≥ 44×44px)
- Input font-size ≥ 16px (iOS zoom prevention on `type="tel"` and all inputs)
- Padding-bottom on last block ≥ 80px (floating panel clearance via `.pb-safe`)
- No hover-only effects without touch fallback
- No horizontal scroll ever — test at 320px, 375px, 414px
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
- Hero image MUST have `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
- Fonts: next/font, font-display: swap, CSS vars `--font-inter`, `--font-montserrat`
- Tailwind border-radius: card=12px, button=8px

## Architecture

```
src/
├── app/                        # 18+ pages + API
│   ├── layout.tsx              # Root: Header+Footer+Panels+Metrika+SocialProofToast+ExitPopup+CallbackWidget
│   ├── page.tsx                # Homepage (ServicesGrid + LiveStatus + QuizCalculator in hero)
│   ├── [service]/page.tsx      # 14 service pages (ppf, polirovka, himchistka, etc.)
│   ├── portfolio/page.tsx      # Filter + masonry grid
│   ├── portfolio/[slug]/page.tsx  # Portfolio detail pages
│   ├── about/page.tsx
│   ├── blog/page.tsx
│   ├── blog/[slug]/page.tsx    # Blog article detail pages
│   ├── contacts/page.tsx       # Split layout: form + Yandex Map iframe + YouTube embed
│   └── api/submit/route.ts     # POST → CRM webhook + optional Telegram notify
├── components/
│   ├── layout/                 # Header, Footer, MobileFloatingPanel, FullscreenMenu
│   ├── sections/               # 12 reusable section blocks (see list below)
│   ├── funnel/                 # ExitPopup, Callback, Quiz, Toast, Timer, LoadBar
│   └── ui/                     # Button, Input, Select, Badge, Card, Modal
├── lib/
│   ├── constants.ts            # Phone, address, socials, nav, SEASONAL_OFFER, SOCIAL_PROOF_ITEMS
│   ├── services.ts             # ALL data for 14 services (packages, FAQ, SEO) + getService(slug)
│   ├── analytics.ts            # Yandex.Metrika wrapper, 24 goals
│   ├── form-submit.ts          # submitForm() → fetch /api/submit + UTM + localStorage markers
│   └── utils.ts                # cn(), formatPhone(), isValidPhone()
└── styles/globals.css          # Tailwind + custom utilities (.container-main, .section-padding, .glass, .pb-safe)
```

### Section Components (12 total)

11 universal + 1 homepage-only:
HeroSection, BeforeAfterSlider, ServicePackages, ProcessSteps, WorkExamples, FAQAccordion, CTAForm, SEOText, CrossSellBanner, TrustBadges, WhyUsGrid, **ServicesGrid** (homepage 3×3 grid using `HOMEPAGE_SERVICES`)

Plus homepage LiveStatus component ("В работе: N авто" with live list).

3 service-specific unique blocks (not universal sections):
- PhotoComparison → `/tonirovka` (4 tint levels: 5%/15%/35%/80%)
- CarBrandGrid → `/ustanovka-linz` (Kia Rio, Hyundai Solaris, Lada Vesta, etc.)
- BrandsGrid → `/rusifikaciya-avto` (Haval, Chery, Geely, Exeed, Changan, etc.)

Note: `/shumoizolyaciya` has NO BeforeAfterSlider (not visual). `/remont-vmyatin` is SEO-only placeholder, not for Yandex.Direct yet.

## Key Architecture Patterns

**Data-driven sections:** All section components receive data via props. Content lives in `src/lib/services.ts` (sourced from `docs/SERVICES_DATA.md`). NEVER hardcode text, prices, or FAQ in components. Use `getService(slug)` to fetch service data. `HOMEPAGE_SERVICES` array for the home grid.

**Service page assembly:** Each service page.tsx = import sections + `getService(slug)`. Standard order: HeroSection → BeforeAfterSlider (if visual) → ServicePackages → ProcessSteps → WorkExamples → FAQAccordion → CTAForm → SEOText → CrossSellBanner.

**BeforeAfterSlider is CSS-only** — uses range input with clip-path, no JavaScript library needed.

**Funnel system:** 6 conversion elements (full spec in `docs/FUNNEL.md`):
- ExitIntentPopup — 3 A/B variants, cursor-to-top (desktop) / back button (mobile), once per session + **72h localStorage cooldown**, suppressed if form already submitted
- CallbackWidget — pulsing ring animation, "Перезвоним за 28 сек" with countdown, after 20:00 shows "Перезвоним завтра в 10:00"
- QuizCalculator — 4-step wizard (car class → services → timeline → contact), **embedded in homepage hero replacing simple form**, also available via button elsewhere. Sends car class, services, urgency, phone, name, UTM to CRM
- StudioLoadBar — progress bar 75-92% filled, gradient `#CCFF00→#FF4444`, shows on service pages
- SeasonalTimer — full-width banner under header with countdown dd:hh:mm:ss, data from `SEASONAL_OFFER` in constants
- SocialProofToast — bottom-left desktop / top on mobile, rotates every 45s from 15 items in `SOCIAL_PROOF_ITEMS`, suppressed if form submitted

**FAQAccordion generates JSON-LD FAQPage** — renders `<script type="application/ld+json">` in component output. Critical for SEO, not just UI.

**SEO per page:** Every page needs `generateMetadata()` with title ≤60 chars including "Казань" + "| Detailing Place", description ≤160 chars, openGraph, canonical. JSON-LD types: LocalBusiness (layout), Service (service pages), Article (blog), FAQPage (FAQAccordion), BreadcrumbList (all pages except home). Breadcrumbs component required on all pages except home.

**Form pipeline:** CTAForm (React Hook Form + Zod) → `submitForm()` from `form-submit.ts` → `POST /api/submit` → CRM webhook + optional Telegram. After submit: "Thank you" modal (auto-close 5 sec) + localStorage marker to suppress exit popup and social proof toast.

**Framer Motion:** Scroll animations (`useInView` + `motion.div` fade-up) on desktop >768px ONLY. Mobile gets instant rendering via `prefers-reduced-motion`. Swiper carousels use `touchRatio: 1.5`, `resistance: true`, `freeMode` for WorkExamples.

## Sprint Workflow

Implementation follows sprints in `docs/sprints/` strictly in order. Each sprint has a checklist at the bottom — verify before moving to the next. One sprint = one prompt.

| Sprint | What |
|--------|------|
| 1 | Foundation: UI kit, Header, Footer, MobileFloatingPanel, constants, utils |
| 2 | 12 section components + services.ts data + unique blocks |
| 3 | All 18 pages assembled from sections + SEO metadata |
| 4 | Sales funnel: 6 conversion elements (see `docs/FUNNEL.md`) |
| 5 | UX polish: animations, lazy loading, touch, Lighthouse >90 |
| 6 | SEO (JSON-LD, sitemap, robots), analytics (24 goals), API route, deploy |

## Business Data (TODO — replace with real values)
```
Phone:    +7 (843) 000-00-00
WhatsApp: wa.me/78430000000
Address:  г. Казань, ул. ________
Hours:    Ежедневно 10:00–20:00
Metrika:  ID 00000000
CRM URL:  (amoCRM webhook)
Partner brands: LLumar, SunTek, Koch Chemie, Ceramic Pro, Comfort Mat, STP
```
