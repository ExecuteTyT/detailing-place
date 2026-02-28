# Спринт 3: Все 18 страниц

> **Результат:** все URL работают, каждая страница собрана из секций спринта 2 + данных из services.ts. SEO metadata на каждой.

## Принцип
Каждая page.tsx = import секций + getService(slug). generateMetadata() для SEO.

## Задачи

### 1. 🔴 Главная — `src/app/page.tsx`
Секции: HeroSection (квиз-форма на первом экране, фон — премиальное авто в студии) → TrustBadges → **ServicesGrid** (новый: сетка 3×3 карточек из HOMEPAGE_SERVICES, бейдж «НОВИНКА» у isNew) → **LiveStatus** (новый: «В работе: N авто» + список из LIVE_STATUS) → WorkExamples → ReviewsCarousel → CTAForm (variant=section, оффер «Оплатим такси при комплексе») → SEOText.

### 2. 🔴 Страницы существующих услуг
Каждая: Hero → BeforeAfter (если есть) → Packages → Process → WorkExamples(заглушки) → FAQ → CTAForm → SEOText → CrossSell.
- `/ppf` — getService('ppf')
- `/polirovka` — getService('polirovka')
- `/himchistka` — getService('himchistka')
- `/shumoizolyaciya` — getService('shumoizolyaciya'), без BeforeAfter
- `/antihrom` — getService('antihrom')
- `/tonirovka` — getService('tonirovka') + **PhotoComparison** (новый: 4 фото тонировки 5%/15%/35%/80%, 4 col desktop, 2×2 mobile)

### 3. 🔴 Новые услуги (★)
Тот же шаблон + уникальные блоки:
- `/ustanovka-linz` — + **CarBrandGrid** (сетка логотипов авто из SERVICES_DATA)
- `/regulirovka-far` — базовый шаблон
- `/polirovka-stekol` — базовый шаблон
- `/polirovka-far` — базовый шаблон
- `/antidozhd` — базовый шаблон, без BeforeAfter
- `/rusifikaciya-avto` — + **BrandsGrid** (логотипы: Haval, Chery, Geely, Exeed...)
- `/remont-vmyatin` — базовый шаблон (SEO-заглушка)

### 4. 🟡 Портфолио
`/portfolio` — фильтры (select марка + tabs услуга) + CSS Masonry grid (3/2/1 col). Карточки-заглушки (placeholder фото). CTA каждая 9-я карточка.
`/portfolio/[slug]` — шапка (марка+задача) + gallery grid + CTA «Владеете [марка]?».

### 5. 🟢 О компании, Блог, Контакты
`/about` — манифест(цитата) + команда(карточки-заглушки) + студия(фото) + сертификаты + CTA.
`/blog` — tabs + featured + grid 2 col. Заглушки статей.
`/blog/[slug]` — заглушка страницы статьи.
`/contacts` — split layout + телефон/WA/TG кнопки + Яндекс.Карта iframe + YouTube embed + реквизиты аккордеон.

### 6. 🟡 API route
`/api/submit/route.ts` — POST handler: принимает form data, отправляет webhook в CRM (env variable), возвращает 200.

### 7. 🟢 404 и privacy
`/not-found.tsx` — кастомная 404 с навигацией.
`/privacy/page.tsx` — политика конфиденциальности ФЗ-152.

## Чеклист
- [ ] Все 18 URL открываются без ошибок
- [ ] Уникальный title на каждой странице (проверить в DevTools <head>)
- [ ] Формы отправляются на /api/submit (проверить в Network tab)
- [ ] FAQ генерирует JSON-LD на каждой странице услуги
- [ ] Навигация: все ссылки ведут куда надо
- [ ] Mobile 375px: всё читаемо, нет overflow
