# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Premium auto detailing studio website for Kazan, Russia. 18+ pages, Next.js 16 (App Router), dark theme.
80% mobile traffic. Each page is a standalone landing page for Yandex.Direct ads.

## Commands

```bash
npm run dev          # localhost:3000
npm run build        # Production build (validates types + pages)
npm run start        # Run production server
npm run lint         # ESLint (eslint-config-next with core-web-vitals + typescript)

# Deploy
vercel --prod        # Env vars: CRM_WEBHOOK_URL, TG_BOT_TOKEN, TG_CHAT_ID
```

E2E testing uses Playwright (`playwright` package installed as devDependency).

## Stack

- Next.js 16.1.6 (App Router, TypeScript, `src/` directory, `@/*` path alias)
- React 19, Tailwind CSS 4 with `@tailwindcss/typography`
- Framer Motion 12 (scroll animations desktop only >768px)
- Swiper.js 12 (carousels, touch)
- React Hook Form 7 + Zod 4 (forms + validation)
- Lucide React (icons)
- next/font/google: Inter (400,600,700) + Montserrat (700,800)

## Principles (violation = bug)

### MOBILE-FIRST (80% traffic)
- CSS: start at 375px, then `md:` 768px, then `lg:` 1280px
- All buttons `min-h-[44px]` (tap targets ≥ 44×44px)
- Input font-size ≥ 16px (iOS zoom prevention on all inputs)
- Padding-bottom on last block ≥ 80px (floating panel clearance via `.pb-safe`)
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

```
src/
├── app/                        # 18+ pages + API
│   ├── layout.tsx              # Root: Header+Footer+Panels+Metrika+SocialProofToast+ExitPopup+CallbackWidget
│   ├── page.tsx                # Homepage (ServicesGrid + LiveStatus + QuizCalculator in hero)
│   ├── [service]/page.tsx      # 14 dynamic service pages (ppf, polirovka, himchistka, etc.)
│   ├── portfolio/              # Listing + [slug] detail pages
│   ├── blog/                   # Listing + [slug] detail pages
│   ├── about/ contacts/ privacy/  # Static pages
│   ├── not-found.tsx           # 404 page
│   ├── sitemap.ts / robots.ts  # Auto-generated SEO files
│   └── api/submit/route.ts     # POST → CRM webhook + optional Telegram notify
├── components/
│   ├── layout/                 # Header, Footer, MobileFloatingPanel, FullscreenMenu
│   ├── sections/               # 12+ reusable section blocks (see below)
│   ├── funnel/                 # ExitPopup, Callback, Quiz, Toast, Timer, LoadBar, ScrollTracker
│   └── ui/                     # Button, Input, Select, Badge, Card, Modal, Breadcrumbs, AnimatedSection
├── lib/
│   ├── constants.ts            # Phone, address, socials, nav, SEASONAL_OFFER, SOCIAL_PROOF_ITEMS
│   ├── services.ts             # ALL data for 14 services (packages, FAQ, SEO) + getService(slug)
│   ├── analytics.ts            # Yandex.Metrika wrapper, 24 goals
│   ├── form-submit.ts          # submitForm() → fetch /api/submit + UTM + localStorage markers
│   └── utils.ts                # cn(), formatPhone(), isValidPhone()
└── styles/globals.css          # Tailwind + custom utilities (.container-main, .section-padding, .glass, .pb-safe)
```

### Section Components

11 universal + 1 homepage-only:
HeroSection, BeforeAfterSlider, ServicePackages, ProcessSteps, WorkExamples, FAQAccordion, CTAForm, SEOText, CrossSellBanner, TrustBadges, WhyUsGrid, **ServicesGrid** (homepage 3×3 grid using `HOMEPAGE_SERVICES`)

Plus homepage LiveStatus ("В работе: N авто" with live list).

3 service-specific unique blocks:
- PhotoComparison → `/tonirovka` (4 tint levels: 5%/15%/35%/80%)
- CarBrandGrid → `/ustanovka-linz` (popular car models)
- BrandsGrid → `/rusifikaciya-avto` (Chinese brands)

Note: `/shumoizolyaciya` has NO BeforeAfterSlider (not visual). `/remont-vmyatin` is SEO-only placeholder.

## Key Architecture Patterns

**Data-driven sections:** All section components receive data via props. Content lives in `src/lib/services.ts` (sourced from `docs/SERVICES_DATA.md`). NEVER hardcode text, prices, or FAQ in components. Use `getService(slug)` to fetch service data.

**Service page assembly:** Each `[service]/page.tsx` = import sections + `getService(slug)`. Standard order: HeroSection → BeforeAfterSlider (if visual) → ServicePackages → ProcessSteps → WorkExamples → FAQAccordion → CTAForm → SEOText → CrossSellBanner.

**BeforeAfterSlider is CSS-only** — uses range input with clip-path, no JS library.

**Funnel system (6 elements, spec in `docs/FUNNEL.md`):**
- ExitIntentPopup — 3 A/B variants, 72h localStorage cooldown, suppressed post-submit
- CallbackWidget — pulsing ring, "Перезвоним за 28 сек" countdown, after-hours message
- QuizCalculator — 4-step wizard embedded in homepage hero, also modal elsewhere
- StudioLoadBar — progress bar 75-92% filled, gradient `#CCFF00→#FF4444`
- SeasonalTimer — countdown banner dd:hh:mm:ss, data from `SEASONAL_OFFER`
- SocialProofToast — rotates 15 reviews every 45s, suppressed post-submit

**FAQAccordion generates JSON-LD FAQPage** — renders `<script type="application/ld+json">`. Critical for SEO.

**SEO per page:** Every page needs `generateMetadata()` with title ≤60 chars including "Казань" + "| Detailing Place", description ≤160 chars. JSON-LD types: LocalBusiness (layout), Service (service pages), Article (blog), FAQPage (FAQAccordion), BreadcrumbList (all pages except home). Breadcrumbs required on all pages except home.

**Form pipeline:** CTAForm → `submitForm()` → `POST /api/submit` → CRM webhook + Telegram. Post-submit: "Thank you" modal (auto-close 5s) + localStorage marker suppresses exit popup and social proof toast.

**Framer Motion:** Scroll animations (`useInView` + `motion.div` fade-up) on desktop >768px ONLY. Mobile gets instant rendering. Swiper carousels use `touchRatio: 1.5`, `resistance: true`, `freeMode`.

## Sprint Workflow

Implementation follows sprints in `docs/sprints/` strictly in order. Each sprint has a checklist — verify before moving on.

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
Metrika:  ID 00000000
CRM URL:  (amoCRM webhook — set as CRM_WEBHOOK_URL env var)
Partner brands: LLumar, SunTek, Koch Chemie, Ceramic Pro, Comfort Mat, STP
```
