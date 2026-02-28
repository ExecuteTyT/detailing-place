# Спринт 2: Секции-конструктор

> **Результат:** 11 универсальных компонентов-секций + файл services.ts со всеми данными. Можно собрать любую страницу услуги за 5 минут.

## Принцип
Все компоненты в `src/components/sections/`. Все принимают данные через props. НЕ хардкодят текст. Данные — в `src/lib/services.ts`.

## Задачи

### 1. services.ts
Создай `src/lib/services.ts` со ВСЕМИ 14 услугами. TypeScript интерфейсы: ServiceData, ServicePackage, FAQItem, ProcessStep, CrossSell. Данные — из `docs/SERVICES_DATA.md`. Хелпер `getService(slug)`. Массив `HOMEPAGE_SERVICES`.

### 2. HeroSection
Props: backgroundImage, title (H1), subtitle, badge?, showSimpleForm?.
Min-h-[85vh] mobile / [90vh] desktop. Фото-фон + gradient overlay. H1 font-display. Бейдж сверху (#CCFF00). Если showSimpleForm — CTAForm внизу.

### 3. CTAForm
Props: title?, subtitle?, variant (hero|section|inline), serviceName?.
React Hook Form + Zod. Поля: phone (Input tel с маской) + carBrand (Select) + Button «Рассчитать стоимость».
Hero: горизонталь desktop / вертикаль mobile. Section: с заголовком, полная ширина.
Под формой: «Ответим за 15 минут» + WhatsApp иконка. Отправка через submitForm(). После — Modal «Спасибо».

### 4. BeforeAfterSlider
Props: beforeImage, afterImage, beforeLabel, afterLabel.
CSS-only: input[type=range] невидимый → clip-path левой картинки. Вертикальная линия-разделитель с ◀▶. Touch-friendly без JS. Метки ДО/ПОСЛЕ. Подпись labels.

### 5. ServicePackages
Props: packages[] (из ServiceData), serviceName.
2-3 карточки. isPopular → увеличена + бейдж «ХИТ» (#00F0FF). Цена: font-display text-accent-lime. Список features с галочками (Check). Кнопка «Записаться» → скролл к CTA.

### 6. ProcessSteps
Props: steps[]. Desktop: горизонтальный таймлайн с номерами в кругах (bg-accent-cyan). Mobile: вертикальный стек.

### 7. WorkExamples
Props: works[], title?, moreLink?. Swiper: autoplay 5s, 3 слайда desktop, 1.2 mobile. Карточка: фото (16/9) + марка + теги. Последний слайд → «Ещё N+ работ». Touch: touchRatio 1.5.

### 8. FAQAccordion
Props: items[]. Аккордеон: 1 открытый за раз. ChevronDown вращается. Framer Motion AnimatePresence. **JSON-LD FAQPage** в `<script type="application/ld+json">` — это критично для SEO.

### 9. SEOText
Props: html (string). dangerouslySetInnerHTML + prose prose-invert. Mobile: первые 200 символов + «Читать далее».

### 10. TrustBadges
Props: badges[], brands[]. 3 карточки с иконками Lucide. Лента логотипов (horizontal scroll mobile).

### 11. ReviewsCarousel
Props: reviews[]. Swiper: 1 mobile, 2 desktop. Звёзды (Star). Кнопка «Все отзывы на Яндекс.Картах».

### 12. CrossSellBanner
Props: title, description, href, buttonText. Gradient фон. Текст + btn-secondary.

## Чеклист
- [ ] Все 11 компонентов импортируются без ошибок
- [ ] Каждый адаптивен (375px и 1280px)
- [ ] FAQAccordion рендерит JSON-LD (проверить в DevTools Elements)
- [ ] BeforeAfterSlider работает touch (DevTools mobile)
- [ ] CTAForm: валидация срабатывает, submit отправляет fetch
- [ ] Swiper слайдеры свайпаются
