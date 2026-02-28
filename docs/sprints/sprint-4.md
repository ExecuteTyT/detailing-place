# Спринт 4: Воронка продаж

> **Результат:** все 6 элементов воронки работают. Сайт превращается из каталога в машину генерации заявок.
> Подробные спецификации — в `docs/FUNNEL.md`.

## Задачи

### 1. 🔴 ExitIntentPopup
Файл: `src/components/funnel/ExitIntentPopup.tsx`. Спецификация в FUNNEL.md §1.
Три варианта через prop variant. A/B тест (рандомный выбор). localStorage контроль.
Встроить в layout.tsx — показывается глобально.

### 2. 🔴 CallbackWidget
Файл: `src/components/funnel/CallbackWidget.tsx`. FUNNEL.md §2.
Пульсирующая кнопка fixed + модалка с таймером 28 сек.
Встроить в layout.tsx — показывается глобально, над MobileFloatingPanel.

### 3. 🔴 QuizCalculator
Файл: `src/components/funnel/QuizCalculator.tsx`. FUNNEL.md §3.
4 шага, state machine, AnimatePresence slide-left, прогресс-бар.
Встроить на главную (заменить простую форму в Hero) + доступен по кнопке «Рассчитать» на остальных.

### 4. 🟡 StudioLoadBar
Файл: `src/components/funnel/StudioLoadBar.tsx`. FUNNEL.md §4.
Прогресс-бар загрузки. Встроить в страницы услуг (над финальным CTA).

### 5. 🟡 SeasonalTimer
Файл: `src/components/funnel/SeasonalTimer.tsx`. FUNNEL.md §5.
Баннер с обратным отсчётом. Данные из SEASONAL_OFFER. Встроить под header на главной.

### 6. 🟡 SocialProofToast
Файл: `src/components/funnel/SocialProofToast.tsx`. FUNNEL.md §6.
Тост каждые 45 сек. Данные из SOCIAL_PROOF_ITEMS. Встроить в layout.tsx.

### 7. 🟡 Обновить analytics.ts
Добавить все цели воронки (12 новых). Подключить к компонентам.

## Чеклист
- [ ] Exit popup срабатывает при уходе курсора (desktop) — проверить mousemove к верху
- [ ] Exit popup не показывается повторно (localStorage)
- [ ] Callback кнопка пульсирует, модалка открывается, таймер 28→0
- [ ] Quiz: 4 шага работают, данные отправляются
- [ ] Social proof тосты появляются каждые ~45 сек
- [ ] Seasonal timer показывает обратный отсчёт
- [ ] Load bar отображается на страницах услуг
