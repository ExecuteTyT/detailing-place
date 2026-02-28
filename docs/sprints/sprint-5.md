# Спринт 5: UX-полировка и мобильная оптимизация

> **Результат:** анимации, lazy loading, touch-жесты, идеальный mobile UX. Lighthouse >90.

## Задачи

### 1. 🔴 Scroll-анимации
Framer Motion: useInView + motion.div для fade-up появления секций. **ТОЛЬКО desktop (>768px).** На mobile — мгновенное появление (prefers-reduced-motion: reduce). Stagger для карточек в grid.

### 2. 🔴 Lazy loading изображений
Все next/image: loading="lazy", placeholder="blur" (где есть blurDataURL), адаптивный sizes: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`. Hero image: priority={true} (без lazy, для LCP).

### 3. 🟡 Шрифты
next/font/google для Inter (400,600,700) и Montserrat (700,800). CSS variable: `--font-inter`, `--font-montserrat`. font-display: swap. Проверить: нет FOIT/FOUT.

### 4. 🔴 Touch-жесты
Swiper настройки: touchRatio 1.5, resistance true, freeMode для WorkExamples. BeforeAfterSlider: проверить touch на реальном размере (DevTools touch simulation).

### 5. 🟡 Skeleton loading
Tailwind animate-pulse заглушки для тяжёлых блоков (WorkExamples, ReviewsCarousel). Серые прямоугольники размером с реальный контент.

### 6. 🔴 Мобильные формы
- Input type="tel": font-size 16px (ОБЯЗАТЕЛЬНО, iOS zoom), autocomplete="tel", inputmode="tel"
- Клавиатура: не перекрывает поля (проверить на iOS viewport)
- Select: нативный на mobile (<768px), кастомный на desktop

### 7. 🟡 Smooth scroll
CSS: scroll-behavior: smooth. Все якорные ссылки: scroll-margin-top: 80px (высота header). Кнопки «Записаться» в пакетах → smooth scroll к CTAForm.

### 8. 🔴 Preload
Hero image: `<link rel="preload" as="image">` в metadata. Шрифты: preload через next/font.

### 9. 🔴 Mobile тест (КРИТИЧЕСКИ ВАЖНО)
Проверить КАЖДУЮ страницу в DevTools на 3 размерах: 320px (SE), 375px (iPhone), 414px (Plus).
- Нет горизонтального скролла (max-width: 100vw на body)
- Все кнопки ≥44px
- Текст ≥15px
- Floating panel не перекрывает контент (pb-safe)
- Видео: poster + не autoplay на mobile
- Формы: нет zoom при focus

### 10. 🔴 Lighthouse
Запустить Lighthouse Mobile для главной и 3 ключевых страниц (PPF, Bi-LED, полировка стёкол).
Цель: Performance >90, Accessibility >90, Best Practices >90, SEO >95.
Если <90 — оптимизировать до достижения.

## Чеклист
- [ ] Анимации работают на desktop, нет на mobile
- [ ] Все изображения lazy (кроме hero)
- [ ] Нет FOIT при загрузке шрифтов
- [ ] Свайп работает на всех слайдерах
- [ ] Нет iOS zoom на input focus
- [ ] Нет горизонтального скролла на ВСЕХ страницах
- [ ] Lighthouse Mobile Performance >90
