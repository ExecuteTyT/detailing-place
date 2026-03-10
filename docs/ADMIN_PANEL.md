# Админ-панель Detailing Place — План реализации

## Обзор

Админ-панель встроена в основной Next.js проект и доступна по `/admin`.
Позволяет управлять **всем контентом сайта** без изменения кода: услуги, цены (с разбивкой по классам авто), блог, портфолио, отзывы, команда, настройки студии, воронка.

---

## Стек технологий

| Компонент | Технология |
|---|---|
| БД | SQLite (`better-sqlite3`) |
| ORM | Drizzle ORM |
| Админ UI | Next.js App Router (`/admin/*`) |
| Аутентификация | Session cookie + bcrypt |
| Загрузка файлов | `/public/uploads/` |
| Стилизация | Tailwind CSS |

---

## Управляемые сущности

### По страницам сайта

| Страница | Что управляется из админки |
|---|---|
| `/` (Главная) | Hero-текст, выбор услуг для 3×3 грида (homepage_services), сезонная акция, категории квиза, trust-бейджи, отзывы, примеры работ |
| `/[service]` (14 услуг) | Заголовки, описания, **пакеты с ценами по 5 классам авто**, **поэлементный прайс**, этапы, FAQ, cross-sell, before/after фото, примеры работ, SEO-текст, уникальный блок |
| `/about` | Команда (имя/роль/фото), статистика, фото студии, цитата |
| `/blog` | Статьи (заголовок/контент/фото/категория/дата) |
| `/portfolio` | Работы (авто/услуга/фото/теги) |
| `/contacts` | Телефон, WhatsApp, адрес, часы, координаты, реквизиты |

### Глобальные данные

- Бизнес-настройки (телефон, адрес, часы, WhatsApp, Метрика ID, CRM webhook)
- Навигация (пункты меню, флаг `is_new` для бейджа "NEW")
- Классы авто для ценообразования (5 классов: 1–5)
- Категории квиза (7 опций для QuizCalculator)
- Live-статус (авто в работе сейчас)
- Trust-бейджи
- Партнёрские бренды
- Social proof (уведомления «Ильнар записался на…»)
- Сезонная акция (таймер + скидка + промокод)

---

## Схема базы данных

### Основные таблицы

```
settings                — key/value бизнес-настроек

car_classes             — классы авто для ценообразования (id, label, example, sort_order)
                          5 записей: "1 класс (Kia Rio…)", "2 класс (Camry…)", … "5 класс (Bentley…)"

services                — 14 услуг (slug, title, h1, subtitle, badge, seo_text,
                          has_before_after, unique_block, sort_order, is_active, show_on_homepage, homepage_sort_order)
                          unique_block: NULL | "PhotoComparison" | "CarBrandGrid" | "BrandsGrid"

service_packages        — пакеты услуги (service_id, name, description, is_popular, duration, sort_order)
package_class_prices    — цена пакета по классу авто (package_id, car_class_id, price_text)
                          price_text: TEXT — "50 000₽", "от 180 000₽", NULL (= "Дог.")
                          Если у пакета одна цена для всех классов — одна запись с car_class_id = NULL
package_features        — фичи пакета (package_id, text, sort_order)

element_prices          — поэлементный прайс (service_id, element_name, sort_order)
                          Примеры: "Капот", "Бампер", "Крыло (1 шт.)"
element_class_prices    — цена элемента по классу (element_price_id, car_class_id, price_text)
                          Та же логика: car_class_id = NULL → единая цена для всех классов

service_keywords        — SEO-ключевики (service_id, keyword)
service_process_steps   — этапы работ (service_id, title, description, sort_order)
service_faq             — вопросы-ответы (service_id, question, answer, sort_order)
service_cross_sell      — перекрёстная продажа (service_id, title, description, href, discount)
service_before_after    — фото до/после (service_id, before_image, after_image, before_label, after_label)

works                   — примеры работ (service_id, image, car, sort_order)
work_tags               — теги работ (work_id, tag)

blog_posts              — статьи блога (slug, title, excerpt, content, image, category, date, is_featured)
reviews                 — отзывы (author, rating, text, car, date, is_visible)
team_members            — команда (name, role, image, sort_order)

nav_items               — пункты навигации (label, href, group, is_new, sort_order)
                          group: "service" | "info"
quiz_categories         — категории квиза (label, sort_order)

trust_badges            — бейджи доверия (icon_name, title, description, sort_order)
partner_brands          — партнёры (name, sort_order)
live_status             — авто в работе (car, service)
social_proof            — уведомления (name, car, service, minutes_ago)
seasonal_offer          — сезонная акция (title, description, discount, promo_code, end_date, is_active)
stats                   — статистика "О студии" (icon_name, value, label, sort_order)
admin_users             — пользователи админки (username, password_hash)
```

### ER-диаграмма (ключевые связи)

```
car_classes ──────────────────────────────────────────┐
                                                      │
services ──1:N──> service_packages ──1:N──> package_class_prices ──N:1──> car_classes
                  service_packages ──1:N──> package_features
services ──1:N──> element_prices ──1:N──> element_class_prices ──N:1──> car_classes
services ──1:N──> service_keywords
services ──1:N──> service_process_steps
services ──1:N──> service_faq
services ──0:1──> service_cross_sell
services ──0:1──> service_before_after
services ──1:N──> works ──1:N──> work_tags
```

### Формат цен

Цены хранятся как `TEXT`, не числа. Это осознанное решение — на фронте цены отображаются как есть:
- `"50 000₽"` — фиксированная цена
- `"от 15 000₽"` — стартовая цена
- `NULL` — "Договорная" (отображается как "Дог." в UI)

Администратор вводит цену в точности так, как она будет показана на сайте.

---

## Маршруты админ-панели

```
/admin                     → Дашборд (сводка)
/admin/login               → Вход

/admin/services            → Список 14 услуг (drag & drop сортировка, чекбокс "на главной")
/admin/services/[id]       → Редактор услуги:
                               - Основное (h1, subtitle, badge, seo_text, unique_block, has_before_after)
                               - Пакеты и цены по классам авто (CRUD + матрица цен 5 классов)
                               - Поэлементный прайс (CRUD + матрица цен 5 классов)
                               - Этапы работ (CRUD)
                               - FAQ (CRUD)
                               - Фото (before/after, примеры работ)
                               - Cross-sell
                               - SEO-ключевики

/admin/blog                → Список статей
/admin/blog/new            → Создание статьи
/admin/blog/[id]           → Редактирование (WYSIWYG / Markdown)

/admin/portfolio           → Список работ
/admin/portfolio/new       → Добавление работы
/admin/portfolio/[id]      → Редактирование

/admin/reviews             → Отзывы (добавить / скрыть / сортировать)
/admin/team                → Команда (имя, роль, фото)

/admin/settings            → Бизнес-настройки (телефон, адрес, часы)
/admin/settings/nav        → Навигация (пункты меню, флаг NEW)
/admin/settings/car-classes → Классы авто (5 классов — влияет на ВСЕ цены на сайте)
/admin/settings/quiz       → Категории квиза
/admin/settings/seasonal   → Сезонная акция (+ промокод)
/admin/settings/trust      → Trust-бейджи
/admin/settings/brands     → Партнёрские бренды
/admin/settings/live       → Live-статус
/admin/settings/social     → Social Proof
/admin/settings/stats      → Статистика «О студии»
```

### UI для редактирования цен пакета

Редактор пакета услуги показывает матрицу: строки — пакеты, столбцы — 5 классов авто.
Чекбокс "Единая цена" — если включён, показывается одно поле, цена применяется ко всем классам.

```
                    │ 1 класс  │ 2 класс  │ 3 класс  │ 4 класс  │ 5 класс  │
─────────────────────────────────────────────────────────────────────────────
КОМПЛЕКС 1          │ 50 000₽  │ 55 000₽  │ 60 000₽  │ 65 000₽  │ [Дог.]   │
КОМПЛЕКС 2 ★        │ 70 000₽  │ 75 000₽  │ 80 000₽  │ 85 000₽  │ [Дог.]   │
ПОЛНАЯ ОКЛЕЙКА [✓ единая цена]  │ от 180 000₽                               │
```

Аналогичная матрица для поэлементного прайса (капот, бампер, крыло...).

---

## API маршруты

```
POST   /api/admin/auth              — Вход
DELETE /api/admin/auth              — Выход
POST   /api/admin/upload            — Загрузка изображений

GET|POST       /api/admin/services
GET|PUT|DELETE /api/admin/services/[id]
CRUD           /api/admin/services/[id]/packages
CRUD           /api/admin/services/[id]/packages/[pkgId]/prices   — матрица цен пакета
CRUD           /api/admin/services/[id]/elements                  — поэлементный прайс
CRUD           /api/admin/services/[id]/elements/[elId]/prices    — матрица цен элемента
CRUD           /api/admin/services/[id]/faq
CRUD           /api/admin/services/[id]/process
CRUD           /api/admin/services/[id]/keywords
PUT            /api/admin/services/[id]/cross-sell
PUT            /api/admin/services/[id]/before-after

GET|POST       /api/admin/blog
GET|PUT|DELETE /api/admin/blog/[id]

GET|POST       /api/admin/portfolio
GET|PUT|DELETE /api/admin/portfolio/[id]

CRUD           /api/admin/reviews
CRUD           /api/admin/team
GET|PUT        /api/admin/settings
CRUD           /api/admin/settings/nav
CRUD           /api/admin/settings/car-classes
CRUD           /api/admin/settings/quiz-categories
GET|PUT        /api/admin/seasonal
CRUD           /api/admin/trust-badges
CRUD           /api/admin/brands
CRUD           /api/admin/live-status
CRUD           /api/admin/social-proof
CRUD           /api/admin/stats
```

---

## План реализации по этапам

### Этап 1 — Инфраструктура БД
1. Установить зависимости: `better-sqlite3`, `drizzle-orm`, `drizzle-kit`, `bcryptjs`
2. Создать Drizzle-схему (`src/lib/db/schema.ts`) — все таблицы включая `car_classes`, `package_class_prices`, `element_prices`, `element_class_prices`, `nav_items`, `quiz_categories`
3. Создать клиент БД (`src/lib/db/index.ts`)
4. Настроить `drizzle.config.ts`
5. Запустить миграцию
6. Написать seed-скрипт: перенос данных из `constants.ts` и `services.ts` → SQLite. Включает:
   - 5 классов авто из `CAR_CLASSES` (services.ts)
   - 14 услуг со всеми пакетами, **матрицей цен по 5 классам**, поэлементными ценами
   - 7 категорий квиза из `QUIZ_CATEGORIES`
   - 17 пунктов навигации из `NAV_ITEMS` (с флагом `is_new`)
   - Все остальные данные из constants.ts (trust badges, brands, social proof и т.д.)

### Этап 2 — Аутентификация
7. Middleware для защиты `/admin/*` и `/api/admin/*`
8. API авторизации (login/logout)
9. Страница входа `/admin/login`

### Этап 3 — API
10. CRUD для всех сущностей (Services, Blog, Portfolio, Reviews, Team, Settings)
11. API для матрицы цен: пакеты × классы авто, элементы × классы авто
12. Загрузка изображений

### Этап 4 — Админ UI
13. Layout админки (сайдбар, хедер)
14. Дашборд
15. Редактор услуги с матрицей цен (пакеты + поэлементный прайс)
16. Формы CRUD для остальных сущностей
17. WYSIWYG-редактор для блога
18. Управление навигацией, категориями квиза, классами авто

### Этап 5 — Интеграция с фронтом
19. Создать query-функции в `src/lib/db/queries/` — возвращают данные в формате текущих интерфейсов (`ServiceData`, `ServicePackage` с `classPrices[]`, `ElementPrice` и т.д.)
20. Заменить импорты из `constants.ts` / `services.ts` на чтение из БД
21. Серверные компоненты читают SQLite напрямую (без API — прямой доступ через Drizzle)
22. Проверить все 14 услуг: селектор классов, матрица цен, поэлементный прайс
23. Проверить главную: 3×3 грид (управляется через `show_on_homepage` + `homepage_sort_order`)

---

## Безопасность

- Пароль хранится как bcrypt-хеш, никогда в открытом виде
- Session cookie: `httpOnly`, `secure`, `sameSite: strict`
- Middleware блокирует доступ к `/admin/*` без валидной сессии
- Загрузка файлов: валидация типа (только изображения), лимит размера (5 МБ)
- Rate limiting на endpoint логина (защита от брутфорса)
- Цены хранятся как TEXT — валидация формата на стороне админки (паттерн: цифры + пробелы + ₽, допустим префикс "от ")

---

## Файловая структура (новые файлы)

```
src/
├── lib/
│   └── db/
│       ├── index.ts          — клиент БД
│       ├── schema.ts         — Drizzle-схема всех таблиц
│       ├── seed.ts           — Seed-скрипт (перенос constants.ts + services.ts → SQLite)
│       └── queries/          — Готовые запросы для фронта (возвращают текущие интерфейсы)
│           ├── services.ts   — getService(slug), getAllServices(), с JOIN car_classes + prices
│           ├── blog.ts
│           ├── portfolio.ts
│           └── settings.ts   — getNavItems(), getQuizCategories(), getSeasonalOffer()…
├── app/
│   ├── admin/
│   │   ├── layout.tsx        — Layout админки (сайдбар)
│   │   ├── page.tsx          — Дашборд
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx      — Список услуг (сортировка, чекбокс "на главной")
│   │   │   └── [id]/
│   │   │       └── page.tsx  — Редактор услуги (вкладки: основное / цены / этапы / FAQ / фото)
│   │   ├── blog/
│   │   ├── portfolio/
│   │   ├── reviews/
│   │   ├── team/
│   │   └── settings/
│   │       ├── page.tsx      — Бизнес-настройки
│   │       ├── nav/          — Навигация
│   │       ├── car-classes/  — Классы авто (⚠️ влияет на все цены)
│   │       ├── quiz/         — Категории квиза
│   │       ├── seasonal/
│   │       ├── trust/
│   │       ├── brands/
│   │       ├── live/
│   │       ├── social/
│   │       └── stats/
│   └── api/
│       └── admin/
│           ├── auth/
│           ├── upload/
│           ├── services/
│           │   └── [id]/
│           │       ├── packages/
│           │       │   └── [pkgId]/prices/
│           │       ├── elements/
│           │       │   └── [elId]/prices/
│           │       ├── faq/
│           │       ├── process/
│           │       └── keywords/
│           ├── blog/
│           ├── portfolio/
│           ├── reviews/
│           ├── team/
│           └── settings/
│               ├── nav/
│               ├── car-classes/
│               └── quiz-categories/
├── data/
│   └── detailing.db          — Файл SQLite
drizzle.config.ts
```
