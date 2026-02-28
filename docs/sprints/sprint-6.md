# Спринт 6: SEO, аналитика, запуск

> **Результат:** сайт полностью готов к запуску. SEO, метрика, формы, деплой.

## Задачи

### 1. 🔴 SEO metadata
Для КАЖДОЙ из 18 страниц: `generateMetadata()` или `export const metadata`.
- title: ≤60 символов, ключевой запрос + «Казань» + «| Detailing Place» (брать из services.ts)
- description: ≤160 символов, УТП + призыв
- openGraph: title, description, images (placeholder), url
- alternates: { canonical: 'https://domain.ru/url' }

### 2. 🔴 JSON-LD Schema.org
**layout.tsx:** LocalBusiness — name, address, phone, geo (lat/lng), openingHours, image, url, priceRange
**Страницы услуг:** Service — name, description, provider (ссылка на LocalBusiness), areaServed: «Казань», offers (priceCurrency: RUB, price)
**FAQ блоки:** FAQPage — mainEntity [{@type: Question, name, acceptedAnswer: {text}}] (уже в FAQAccordion)
**Блог:** Article — headline, author, datePublished, image
**Все страницы:** BreadcrumbList — Главная → Раздел → Страница

### 3. 🔴 sitemap.xml
`src/app/sitemap.ts` — все 18 страниц + будущие блог/портфолио.
```ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://domain.ru', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://domain.ru/ppf', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    // ... все 18 страниц
  ]
}
```

### 4. 🟡 robots.txt
`src/app/robots.ts`: Allow /, Disallow /api/, Sitemap URL.

### 5. 🟡 Breadcrumbs
Компонент Breadcrumbs с JSON-LD BreadcrumbList. Добавить на все страницы кроме главной.

### 6. 🔴 Яндекс.Метрика
Скрипт счётчика в layout.tsx (через dangerouslySetInnerHTML или Script component).
Все 24 цели подключены к компонентам через goals из analytics.ts.
Проверить: form_submit, phone_click, whatsapp_click, quiz_start, quiz_complete, exit_popup_submit, callback_request — все срабатывают.

### 7. 🔴 API route для форм
`src/app/api/submit/route.ts`:
- POST handler
- Принимает: phone, carBrand, service, name, source, utm
- Отправляет webhook на CRM URL (env: CRM_WEBHOOK_URL)
- Отправляет уведомление в Telegram (env: TG_BOT_TOKEN, TG_CHAT_ID) — опционально
- Валидация на сервере (Zod)
- Возвращает 200 OK или 400/500

### 8. 🟡 Попап «Спасибо»
После успешной отправки любой формы: Modal «Заявка отправлена! Перезвоним в течение 15 минут» + кнопка «Написать в WhatsApp, если срочно» + автозакрытие 5 сек.

### 9. 🟢 404
`src/app/not-found.tsx` — кастомная: тёмный фон, «Страница не найдена», навигация к популярным страницам, кнопка «На главную».

### 10. 🟢 Политика конфиденциальности
`src/app/privacy/page.tsx` — стандартный текст ФЗ-152.

### 11. 🟡 Favicons
public/favicon.ico, public/apple-touch-icon.png, public/site.webmanifest. Тёмный фон, белый логотип.

### 12. 🔴 Финальный аудит
Проверить ВСЁ:
- Все 18 URL работают
- Все формы отправляются
- Все ссылки живые (нет 404)
- Lighthouse Mobile >90 на 3+ страницах
- JSON-LD валидный (Google Rich Results Test)
- Mobile: нет overflow, tap targets OK, шрифт читаемый

### 13. 🔴 Деплой
```bash
# Vercel
npm i -g vercel
vercel --prod
# Или: подключить GitHub repo к Vercel
```
- Environment variables: CRM_WEBHOOK_URL, TG_BOT_TOKEN, TG_CHAT_ID
- Привязать домен
- Проверить: HTTPS работает, все страницы доступны

## Чеклист
- [ ] Каждая страница: уникальный title ≤60 символов с «Казань»
- [ ] Каждая страница: один H1
- [ ] JSON-LD валидный (Rich Results Test)
- [ ] sitemap.xml доступен по /sitemap.xml
- [ ] robots.txt доступен по /robots.txt
- [ ] Метрика: счётчик установлен, цели срабатывают
- [ ] Формы → API → webhook работает
- [ ] Попап «Спасибо» после submit
- [ ] 404 страница кастомная
- [ ] Lighthouse Mobile Performance >90
- [ ] Деплой успешный, сайт доступен по домену
