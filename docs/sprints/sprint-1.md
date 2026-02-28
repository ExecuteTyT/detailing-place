# Спринт 1: Фундамент

> **Результат:** `npm run dev` работает. Header + Footer + MobileFloatingPanel видны. Тёмная тема. Бургер-меню открывается.

## Задачи

### 1. Инициализация
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install framer-motion swiper react-hook-form @hookform/resolvers zod lucide-react clsx tailwind-merge
npm install -D @tailwindcss/typography
```

### 2. Tailwind config
Расширь `tailwind.config.ts` токенами из CLAUDE.md: цвета (bg, text, accent, border), шрифты (sans=Inter, display=Montserrat), spacing (section, safe-bottom), border-radius (card 12px, button 8px), max-width (container 1280px), анимации (pulse-ring, slide-up, fade-in).

### 3. globals.css
Создай `src/styles/globals.css`:
- Base: bg-bg text-text, scroll-behavior smooth, overflow-x hidden, input font-size 16px, scroll-margin-top 80px
- Components: `.container-main` (max-w-container mx-auto px-4), `.section-padding` (py-12 md:py-20), `.hero-overlay` (gradient затемнение), `.card`, `.btn-cta` (#CCFF00), `.btn-secondary` (border #00F0FF), `.btn-whatsapp` (#25D366)
- Utilities: `.pb-safe` (padding-bottom для floating panel), `.glass` (backdrop-blur для header), `.no-scrollbar`

### 4. UI компоненты
**Button.tsx** — 5 вариантов (primary/secondary/whatsapp/phone/ghost), min-h-[44px], поддержка href и onClick, размеры sm/md/lg, prop icon (Lucide component).
**Input.tsx** — тёмная тема, маска телефона +7(___), font-size 16px, type="tel" autocomplete="tel".
**Select.tsx** — кастомный select, ChevronDown, options через props.
**Badge.tsx** — варианты new(#CCFF00)/popular(#00F0FF)/discount(#FF4444).
**Card.tsx** — обёртка .card, опциональный href.
**Modal.tsx** — overlay+модалка, закрытие крестик/overlay/Escape, Framer Motion fade+scale.

### 5. Layout компоненты
**Header.tsx** — sticky top-0 z-50, glass эффект. Mobile: логотип+бургер. Desktop: логотип + «В работе: N авто» (зелёная пульсирующая точка) + телефон + WhatsApp + бургер. Высота 64px/72px.
**FullscreenMenu.tsx** — overlay bg-bg/95 z-60, список услуг крупным шрифтом, hover циан, бейдж NEW у новых, телефон+WhatsApp внизу, slide-in анимация, закрытие крестик/клик по ссылке.
**MobileFloatingPanel.tsx** — fixed bottom-0 z-[9999], md:hidden, две кнопки 50/50: Позвонить (#2E75B6) и WhatsApp (#CCFF00). Высота 56px, safe-area-inset-bottom.
**Footer.tsx** — 4 колонки desktop / аккордеон mobile. Логотип+соцсети | Услуги | Компания | Контакты. Оффер «Оплатим такси». Подвал ©.

### 6. layout.tsx
Root layout: Inter + Montserrat через next/font/google. `<html lang="ru">`. Подключить globals.css. Header + main(pb-safe) + Footer + MobileFloatingPanel.

### 7. Пустая главная
`src/app/page.tsx` — заглушка с H1 «Detailing Place» для проверки.

### 8. constants.ts
Телефон, WhatsApp URL, адрес, часы, координаты, навигация (NAV_ITEMS с isNew), CAR_CLASSES, LIVE_STATUS, SOCIAL_PROOF_ITEMS (15 записей), SEASONAL_OFFER, TRUST_BADGES, PARTNER_BRANDS. Все данные — из docs/SERVICES_DATA.md.

### 9. Утилиты
**utils.ts** — cn() (clsx+twMerge), formatPhone(), isValidPhone().
**analytics.ts** — обёртка ym(), reachGoal(), объект goals с 24 целями, METRIKA_SCRIPT.
**form-submit.ts** — submitForm() → fetch /api/submit, UTM params, localStorage markers.

## Чеклист
- [ ] `npm run dev` без ошибок
- [ ] localhost:3000 — тёмный фон, Header виден, Footer виден
- [ ] Mobile 375px — floating panel видна, header компактный
- [ ] Бургер → fullscreen меню → ссылки кликабельны → закрытие
- [ ] Телефон в header кликабельный (tel:)
- [ ] Все кнопки ≥44px
- [ ] Нет горизонтального скролла
