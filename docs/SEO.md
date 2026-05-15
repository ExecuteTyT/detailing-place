# SEO и аналитика выдачи

Кратко: что сделано в коде, что осталось сделать руками (в кабинетах), и как подключить Google Search Console MCP для аналитики выдачи в чате.

## Что уже сделано в коде

### Sitemap и robots
- `src/app/sitemap.ts` теперь включает все 14 сервисов + блог-посты (6) + работы портфолио (12) + статические страницы — всего ~35+ URL.
- `src/app/robots.ts` явно закрывает `/api/` и `/admin*`, указывает `host: https://dpkzn.ru` для Яндекса.

### Метаданные
- `src/app/layout.tsx` — `verification.yandex` уже стоит, `verification.google` подтянется из env-переменной `GOOGLE_SITE_VERIFICATION`.
- `src/lib/utils.ts:formatPageTitle()` — гарантирует, что title сервисных страниц не превышает 60 символов и всегда заканчивается ` | Detailing Place`.
- На сервисных страницах поле `service.seoDescription` (140-160 символов с ключевиком/CTA) подтягивается из БД и заполнено для всех 14 услуг в seed.
- На сервисных страницах добавлен openGraph.images, указывающий на `/<service>/opengraph-image` (динамический OG).

### Structured data (JSON-LD)
- `LocalBusiness` на всём сайте (`(site)/layout.tsx`) с подсчитанным `AggregateRating` из таблицы reviews.
- `Service` + `FAQPage` + `AggregateRating` на каждой сервисной странице.
- `BlogPosting` на блог-постах (плюс страница теперь подтягивается из БД, а не из заголовка-заглушки).
- `BreadcrumbList` уже был на всех страницах через компонент `Breadcrumbs`.

### Open Graph картинки (1200×630)
- `src/app/opengraph-image.tsx` — главная.
- `src/app/(site)/[service]/opengraph-image.tsx` — динамическая, берёт `service.h1`.
- `src/app/(site)/blog/[slug]/opengraph-image.tsx` — динамическая, берёт `post.title` и `post.category`.

### Контент
- SEO-тексты 14 сервисов расширены до 2000-3500 знаков, добавлены H2, перелинковка между услугами, упоминания брендов-партнёров.
- 6 блог-постов получили полноценный `content` (2000-3000 знаков HTML с H2, списками и ссылками на услуги).
- Добавлен компонент `RelatedServices` на каждой сервисной странице (3 смежных сервиса).

### База данных
- Добавлено поле `services.seoDescription` (миграция `drizzle/0002_bouncy_scorpion.sql`).
- При деплое запустится `npm run build` → `db:migrate` + `db:seed`.

---

## Что нужно сделать руками (action items для владельца)

### 1. Подтвердить сайт в Google Search Console (15 минут)
1. Зайти на https://search.google.com/search-console.
2. Add property → URL prefix → `https://dpkzn.ru`.
3. Выбрать метод верификации **HTML tag** — скопировать значение `content="..."`.
4. На Vercel (Project Settings → Environment Variables) добавить переменную: `GOOGLE_SITE_VERIFICATION` = `<значение без кавычек>`.
5. Передеплоить (`vercel --prod`).
6. Вернуться в GSC и нажать **Verify**.
7. После верификации: Sitemaps → добавить `sitemap.xml`.
8. URL Inspection на главной → **Request indexing**. Повторить для 3-5 ключевых сервисов.

### 2. Подтвердить сайт в Яндекс.Вебмастере (10 минут)
Тег `<meta name="yandex-verification" content="533c7acbe681d96d">` уже стоит. Нужно:
1. Зайти на https://webmaster.yandex.ru.
2. Добавить сайт → дождаться автоматической проверки тега.
3. Sitemap → добавить `https://dpkzn.ru/sitemap.xml`.
4. Настройки → Регион → указать «Казань».
5. ИКС и качество → запросить переобход главных страниц.

### 3. Зарегистрироваться в локальных кабинетах (1-2 часа в сумме)
Для премиум-локального бизнеса в Казани это критично — без off-site SEO органика будет тяжело идти.

- **Google Business Profile** (https://business.google.com) — заполнить карточку: адрес Ямашева 7к1, фото студии, услуги, часы работы. Это попадание в Google Maps и локальную «pack» выдачу.
- **Яндекс Бизнес** — карточка в Яндекс.Картах.
- **2GIS Казань** — добавить организацию (бесплатно).
- **Zoon, Flamp** — добавить компанию + попросить первые отзывы у лояльных клиентов.

---

## Google Search Console MCP — подключение

### Зачем
После подключения можно прямо в чате запрашивать данные по выдаче: какие запросы привели трафик, какие страницы потеряли позиции, где низкий CTR → подсказывать правки title/description.

### Шаг 1. Service Account в Google Cloud
1. Зайти на https://console.cloud.google.com.
2. Создать проект `dpkzn-seo` (или выбрать существующий).
3. APIs & Services → Library → найти **Google Search Console API** → Enable.
4. IAM & Admin → Service Accounts → Create:
   - Name: `gsc-reader`
   - Role: Viewer (этого достаточно)
   - Создать ключ → JSON → скачать.
5. Сохранить JSON по пути `C:\Users\Admin\.config\gsc\service-account.json` (создать папку, если её нет). **Не коммитить в git.**

### Шаг 2. Дать Service Account доступ в Search Console
1. В GSC → Settings → Users and permissions → Add user.
2. Email — это `client_email` из скачанного JSON (формат `gsc-reader@dpkzn-seo.iam.gserviceaccount.com`).
3. Permission — **Owner** или **Full user**.

### Шаг 3. Установить MCP-сервер
В терминале:
```
npm install -g mcp-server-google-search-console
```
(Альтернатива: `@kazuph/mcp-search-console` или другой публичный MCP — проверить актуальность через `npm search mcp google-search-console`.)

### Шаг 4. Зарегистрировать в Claude Code
Файл `C:\Users\Admin\.claude.json` — добавить в `mcpServers`:
```json
{
  "mcpServers": {
    "gsc": {
      "command": "mcp-server-google-search-console",
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "C:\\Users\\Admin\\.config\\gsc\\service-account.json"
      }
    }
  }
}
```
Перезапустить Claude Code. Инструменты появятся под префиксом `mcp__gsc__*`.

### Шаг 5. Использование
После 2-4 недель индексации спросите в чате:
- «Какие запросы привели больше всего показов на dpkzn.ru за последние 30 дней?»
- «Какие страницы потеряли позиции по сравнению с прошлым месяцем?»
- «На каких страницах низкий CTR при высоких показах?»

Я прямо в чате через MCP вытащу данные и предложу правки title/description.

---

## Verification (как проверить, что всё работает)

После следующего деплоя (`vercel --prod`):

1. **Sitemap**:
   ```
   curl -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://dpkzn.ru/sitemap.xml
   ```
   Должно быть ~35+ URL, включая `/blog/<slug>` и `/portfolio/<slug>`. Если в браузере видите `<div id="in-page-channel-node-id">` — это инжекция расширения Yandex/Edge, в curl её не будет.

2. **robots.txt**:
   ```
   curl https://dpkzn.ru/robots.txt
   ```
   Должно содержать `Disallow: /admin` и `Sitemap: ...`.

3. **JSON-LD валидация**: открыть в браузере главную, сервисную страницу (например `/tonirovka`) и блог-пост (`/blog/kak-vybrat-ppf-plenku`). View Source → проверить `<script type="application/ld+json">` теги. Прогнать через https://search.google.com/test/rich-results — должно успешно парситься без ошибок.

4. **Open Graph**: вставить URL в Telegram/WhatsApp/Twitter — должна показываться картинка 1200×630 с заголовком и брендингом.

5. **Lighthouse**: запустить аудит на главной — score SEO должен быть 100.

6. **В Google Search Console** через 7-14 дней после Verify + submit sitemap:
   - Coverage → Discovered URLs ≥ 30.
   - Запрос `site:dpkzn.ru` в Google должен вернуть ≥ 10 страниц.

---

## Дальнейшие шаги для роста позиций

Это уже за пределами кодовых правок — но критично для бизнеса:

1. **Внешние ссылки** на dpkzn.ru:
   - Запросить размещение в «карте дилеров» у поставщиков (LLumar, Koch Chemie, Ceramic Pro).
   - Опубликовать развёрнутые статьи на vc.ru / Тинькофф Журнал в рубрике авто с обратной ссылкой.
   - Размещение в каталогах: Zoon, Flamp, Yell, 2GIS.

2. **Регулярный контент**: 2-4 блог-поста в месяц на популярные запросы. Темы можно брать из Wordstat по Казани:
   - «сколько стоит керамика на машину»
   - «оклейка PPF цена Казань»
   - «лучшая тонировка передних стёкол»

3. **Отзывы и AggregateRating**: чем больше реальных отзывов в админке (с фото клиента), тем больше Google показывает звёзды в выдаче. Цель — 50+ отзывов за полгода.

4. **Скорость сайта**: после каждого крупного релиза прогонять Lighthouse Mobile. Метрики LCP < 2.5s, CLS < 0.1 — Google это ранжирует напрямую.
