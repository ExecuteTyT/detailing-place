# Промпты для генерации изображений — Detailing Place

Генератор: **Gemini (nano banana)**
Формат вывода: скачать → конвертировать в WebP (quality 80-85%) → положить по указанному пути.

---

## Как пользоваться

1. Копируй текст из блока `КОПИРОВАТЬ:` — вставляй в nano banana
2. Если результат не подходит — генерируй ещё раз (Gemini даёт разные варианты)
3. Скачивай лучший вариант
4. Конвертируй в WebP и клади в `/public/images/...` по указанному пути
5. Hero-картинки должны быть минимум 1920×1080
6. Portfolio — минимум 1080×1350 (вертикальные)
7. Команда — минимум 900×1200 (вертикальные)

**Важно:** Gemini может игнорировать aspect ratio в тексте. Если получается квадрат — добавь в промпт слова "wide cinematic frame" для 16:9, или "vertical portrait format" для 3:4.

---

## Два типа картинок

**Тип A — Hero-фоны** (под оверлеем 35-92% затемнения):
- Текст и форма закрывают левую часть и низ
- Виден только верхний-правый угол (~35% затемнения)
- Нужны яркие блики, которые пробьют через затемнение

**Тип B — Полноценные фото** (карточки, слайдеры, блог):
- Видны на 100%, без оверлея
- Полная детализация, красивая композиция

---

## 1. ГЛАВНАЯ СТРАНИЦА

### `/images/hero/home.jpg` (Тип A — самый тяжёлый оверлей)

Результат, который ты уже сгенерировал — **подходит отлично**. Используй его.

Если нужен ещё вариант:

КОПИРОВАТЬ:
```
Abstract dark premium texture, extreme close-up of liquid-like glossy black surface with subtle warm golden caustic light reflections, hints of hexagonal LED ceiling pattern reflected in the gloss, shallow depth of field, the entire frame is dark with isolated specular highlights concentrated in the upper-center area, bottom half fades to pure black, cinematic color grading with warm amber undertones, 8k macro photography, wide cinematic frame 16:9
```

---

## 2. HERO-ФОН СТРАНИЦ УСЛУГ (Тип A)

Все промпты ниже заканчиваются одинаково — это обеспечивает правильную композицию под оверлей.

### `/images/hero/ppf.jpg` — PPF Оклейка

КОПИРОВАТЬ:
```
Extreme macro of transparent polyurethane protection film being peeled back from a glossy dark car hood, dramatic blue-white rim light catching the film edge creating a bright luminous line, the film refracts hexagonal LED ceiling lights into prismatic highlights, wet-look adhesive layer glistening, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/polirovka.jpg` — Полировка

КОПИРОВАТЬ:
```
Professional dual-action polisher with orange foam pad mid-rotation on mirror-black car paint, golden sparks of polishing compound dust illuminated by warm directional spotlight, the flawless paint reflects hexagonal LED lights like a black mirror, motion blur on the spinning pad, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/himchistka.jpg` — Химчистка

КОПИРОВАТЬ:
```
Rich dark brown perforated leather car seat being detailed with a premium horsehair brush, warm directional light reveals the leather grain texture and deep shadows in the perforations, steam wisps catching the light, leather surface has a satin sheen, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/shumoizolyaciya.jpg` — Шумоизоляция

КОПИРОВАТЬ:
```
Macro of premium butyl sound-deadening mat with diamond-embossed aluminum surface being pressed onto bare car metal, single dramatic purple-tinted spotlight creates high-contrast metallic reflections on the aluminum texture, the installation tool catches a rim light, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/antihrom.jpg` — Антихром

КОПИРОВАТЬ:
```
Sleek murdered-out car front grille close-up, every chrome element wrapped in satin black vinyl, a single aggressive LED headlight cuts through the darkness with a sharp white beam, matte vs gloss texture contrast on the black surfaces, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/tonirovka.jpg` — Тонировка

КОПИРОВАТЬ:
```
Frameless car side window with freshly applied dark tint film, dramatic backlight from inside the cabin creates a warm amber glow through the tint gradient, the sharp edge of the film catches a bright highlight line, dark studio environment, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/ustanovka-linz.jpg` — Установка Bi-LED линз

КОПИРОВАТЬ:
```
Crystal-clear automotive headlight housing opened up revealing precision Bi-LED projector lens inside, the lens emits a faint cold white glow, intricate reflector bowl catches warm-yellow highlights, bare fiber optic DRL strip glowing, high-tech surgical precision aesthetic, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/regulirovka-far.jpg` — Регулировка фар

КОПИРОВАТЬ:
```
Laser alignment beam projected as a sharp red horizontal line across a car headlight lens surface, professional calibration equipment visible in soft focus, the red laser creates a dramatic streak of light in the dark environment, technical and precise atmosphere, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/polirovka-stekol.jpg` — Полировка стёкол

КОПИРОВАТЬ:
```
Flawless dark car windshield reflecting a single straight cyan neon tube light as a perfect unbroken line, the glass surface is so clear it looks like liquid, polishing tool resting on the glass catches a rim light highlight, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/polirovka-far.jpg` — Полировка фар

КОПИРОВАТЬ:
```
Perfectly restored crystal-clear car headlight extreme close-up, complex internal reflector geometry catching warm amber light creating intricate caustic patterns, the outer lens is flawlessly transparent, a single bright specular highlight on the lens surface, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/antidozhd.jpg` — Антидождь

КОПИРОВАТЬ:
```
Macro of perfectly spherical water beads standing tall on hydrophobic-coated dark car glass, each bead acts as a tiny lens refracting overhead hexagonal LED lights into bright blue-white points, the glass surface between beads is mirror-dark, extreme shallow depth of field, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/rusifikaciya-avto.jpg` — Русификация авто

КОПИРОВАТЬ:
```
Sharp 4K car infotainment touchscreen glowing in a dark cabin, the display shows an elegant digital interface with Cyrillic text, soft red-amber ambient LED strips frame the screen, the screen glow illuminates nearby surfaces with colored light, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/remont-vmyatin.jpg` — Ремонт вмятин PDR

КОПИРОВАТЬ:
```
Glossy black car body panel with a bright yellow LED reflection board stripe running across it showing a perfectly straight line indicating zero dents, the bright yellow stripe is the dominant light source in the frame, professional PDR tools in soft focus, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/keramika.jpg` — Керамическое покрытие

КОПИРОВАТЬ:
```
Extreme macro of 9H ceramic coating liquid being applied to a dark car panel, the coating flows like liquid glass creating a visible wet layer with extreme depth of gloss, a single bright spotlight creates an intense specular reflection in the wet coating, the surface looks like black liquid mercury, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/hero/ustanovka-signalizacii.jpg` — Сигнализация (если есть эта услуга)

КОПИРОВАТЬ:
```
Sleek modern car key fob and smartphone lying on dark leather dashboard surface, the phone screen glows with a high-tech car security app interface showing a vehicle silhouette, cold blue LED accent lights from the dashboard create rim lighting on both objects, composition weighted to right side of frame, left third is pure black empty space, bottom fades to pure black, single dramatic key light from upper right, 8k photorealistic, wide cinematic frame 16:9
```

---

## 3. ДО/ПОСЛЕ — СЛАЙДЕРЫ (Тип B — полная видимость)

Эти картинки показываются в BeforeAfterSlider БЕЗ оверлея. Каждая пара должна быть с одного ракурса.

**Правило:** сначала генерируй «До», потом описывай «После» максимально похоже, меняя только состояние поверхности.

### Полировка До/После

КОПИРОВАТЬ (До):
```
Macro shot of dark car paint surface severely damaged with spider web swirl marks, micro-scratches and haze visible under harsh single-point LED inspection light, the clear coat looks grey and lifeless, shot from 45-degree angle in dark detailing studio with hexagonal LED ceiling lights, 8k photorealistic, wide cinematic frame 16:9
```

КОПИРОВАТЬ (После):
```
Macro shot of dark car paint from the same 45-degree angle in the same dark detailing studio, the paint is now fully restored to absolute mirror finish, zero scratches visible, the single-point LED inspection light reflects as a perfect sharp point, deep wet-look black gloss, hexagonal ceiling lights reflected like on still water, 8k photorealistic, wide cinematic frame 16:9
```

### PPF До/После

КОПИРОВАТЬ (До):
```
Car hood with visible rock chips, small scratches and paint damage from road debris, harsh inspection light revealing each defect, dark studio environment with hexagonal LED lights, shot from low angle, 8k photorealistic, wide cinematic frame 16:9
```

КОПИРОВАТЬ (После):
```
Same car hood from same low angle in same dark studio, now protected with invisible PPF film, surface is flawless and glossy, the protection film edge barely visible at the hood line, all previous damage gone, hexagonal LED reflections are crisp and undistorted, 8k photorealistic, wide cinematic frame 16:9
```

### Химчистка До/После

КОПИРОВАТЬ (До):
```
Dirty car interior leather seat with visible stains, dust in seams, worn and dull leather surface, harsh inspection light revealing every imperfection, dark car cabin, 8k photorealistic, wide cinematic frame 16:9
```

КОПИРОВАТЬ (После):
```
Same leather car seat from same angle, now perfectly clean, rich leather color restored, conditioned satin sheen, clean seams, the leather looks new and supple, same lighting showing flawless result, 8k photorealistic, wide cinematic frame 16:9
```

### Полировка фар До/После

КОПИРОВАТЬ (До):
```
Yellowed and hazed car headlight lens close-up, UV damage visible, the light output looks dim and scattered, oxidized plastic surface, dark studio, 8k photorealistic, wide cinematic frame 16:9
```

КОПИРОВАТЬ (После):
```
Same headlight from same angle, now crystal clear and fully restored, sharp internal reflector details visible through flawless transparent lens, bright clean light output, 8k photorealistic, wide cinematic frame 16:9
```

### Полировка стёкол До/После

КОПИРОВАТЬ (До):
```
Car windshield with visible wiper marks, light scratches and water spots under inspection light, the glass distorts reflections, dark studio, 8k photorealistic, wide cinematic frame 16:9
```

КОПИРОВАТЬ (После):
```
Same windshield from same angle, now optically perfect, zero distortion, a straight neon light reflected as a clean unbroken line, crystal clarity, 8k photorealistic, wide cinematic frame 16:9
```

### Антидождь До/После

КОПИРОВАТЬ (До):
```
Car glass with water sheeting across the surface in messy streaks, poor visibility through the wet glass, dark background, 8k photorealistic, wide cinematic frame 16:9
```

КОПИРОВАТЬ (После):
```
Same car glass from same angle, now with perfect hydrophobic coating, water forms tight spherical beads that roll off cleanly, excellent visibility, each bead refracts light beautifully, 8k photorealistic, wide cinematic frame 16:9
```

### Керамика До/После

КОПИРОВАТЬ (До):
```
Dark car body panel that looks flat and dull, no depth to the paint, light reflections are soft and diffused, minor swirls visible, dark studio, 8k photorealistic, wide cinematic frame 16:9
```

КОПИРОВАТЬ (После):
```
Same dark car body panel from same angle, now with ceramic coating applied, extreme wet-look gloss and depth, light reflections are razor-sharp, the surface looks like liquid glass, water beading visible at the edge, 8k photorealistic, wide cinematic frame 16:9
```

---

## 4. СРАВНЕНИЕ ТОНИРОВКИ — 4 уровня (Тип B)

4 картинки одного и того же окна с разной степенью затемнения. Старайся генерировать последовательно, описывая ту же машину.

### Тонировка 5% (лимузинная)

КОПИРОВАТЬ:
```
Side view of dark luxury car in premium detailing studio, rear side window with extremely dark 5 percent limo tint, nearly opaque black glass, interior completely invisible through the window, hexagonal LED ceiling lights reflecting on the car body, 8k photorealistic, wide cinematic frame 16:9
```

### Тонировка 15%

КОПИРОВАТЬ:
```
Side view of same dark luxury car in same studio, rear side window with 15 percent tint, very dark but faint silhouette of headrest barely visible through the glass, hexagonal LED ceiling lights reflecting on the car body, 8k photorealistic, wide cinematic frame 16:9
```

### Тонировка 35%

КОПИРОВАТЬ:
```
Side view of same dark luxury car in same studio, rear side window with 35 percent medium tint, interior seats and headrests visible as dark shapes through the glass, hexagonal LED ceiling lights reflecting on the car body, 8k photorealistic, wide cinematic frame 16:9
```

### Тонировка 80% (светлая)

КОПИРОВАТЬ:
```
Side view of same dark luxury car in same studio, rear side window with 80 percent light tint, interior clearly visible through the glass with only slight darkening, hexagonal LED ceiling lights reflecting on the car body, 8k photorealistic, wide cinematic frame 16:9
```

---

## 5. ПОРТФОЛИО — Примеры работ (Тип B)

Вертикальные карточки. Добавляй "vertical portrait format 4:5" в конец.

### `/images/works/ppf-1.jpg` — BMW X5 PPF

КОПИРОВАТЬ:
```
Three-quarter front view of a dark BMW X5 in premium detailing studio, entire body wrapped in invisible PPF, the paint has extreme wet gloss depth, hexagonal LED ceiling lights create perfect rectangular reflections across the hood and fender, dramatic dark environment, professional automotive photography, 8k photorealistic, vertical portrait format 4:5
```

### `/images/works/polish-1.jpg` — Mercedes C-Class полировка + керамика

КОПИРОВАТЬ:
```
Three-quarter rear view of dark Mercedes C-Class in premium studio, paint polished to absolute mirror finish with ceramic coating, the body panels reflect the studio environment like dark liquid chrome, warm golden key light on the rear quarter panel, 8k photorealistic, vertical portrait format 4:5
```

### `/images/works/linz-1.jpg` — Kia Ceed Bi-LED линзы

КОПИРОВАТЬ:
```
Front view of Kia Ceed in dark detailing studio, both headlights upgraded with Bi-LED projector lenses emitting bright white beams, the new lens optics glow with precision, contrast between original halogen warmth and new LED clarity, 8k photorealistic, vertical portrait format 4:5
```

### `/images/works/antihrom-1.jpg` — BMW X3 антихром

КОПИРОВАТЬ:
```
Dramatic low-angle front three-quarter of BMW X3 with complete chrome-delete package, every trim piece matte or gloss black, murdered-out aesthetic, single dramatic side light creating long shadows, aggressive and stealthy mood, 8k photorealistic, vertical portrait format 4:5
```

### `/images/works/tonirovka-1.jpg` — Toyota Camry тонировка

КОПИРОВАТЬ:
```
Side profile of Toyota Camry in dark detailing studio, all windows freshly tinted with dark film, clean tint line visible at the top edge, the tinted glass creates a sleek unified look, hexagonal LEDs reflected on the roof, 8k photorealistic, vertical portrait format 4:5
```

### `/images/works/himchistka-1.jpg` — Toyota Camry химчистка

КОПИРОВАТЬ:
```
Interior shot through the open door of Toyota Camry, freshly detailed cabin with clean leather seats, spotless dashboard, detailed door panel, warm interior ambient lighting, the clean surfaces have a satin sheen, 8k photorealistic, vertical portrait format 4:5
```

### `/images/works/ceramic-1.jpg` — Porsche Cayenne керамика

КОПИРОВАТЬ:
```
Low front three-quarter of dark Porsche Cayenne with fresh ceramic coating, extreme wet-look gloss, the curved body panels act like a dark mirror reflecting the entire studio, water beads visible on the rear fender, premium atmosphere, 8k photorealistic, vertical portrait format 4:5
```

### `/images/works/shumo-1.jpg` — Audi A6 шумоизоляция

КОПИРОВАТЬ:
```
Interior shot of Audi A6 with door panel removed showing professionally installed sound deadening material, aluminum butyl mats covering every surface, clean professional installation, warm work light illuminating the cabin, 8k photorealistic, vertical portrait format 4:5
```

### `/images/works/ppf-ceramic-1.jpg` — Lexus RX PPF + керамика

КОПИРОВАТЬ:
```
Rear three-quarter of dark Lexus RX, PPF film edge subtly visible on the rear bumper, ceramic-coated paint creates mirror-like reflections, the tail lights glow warm red, premium studio lighting, 8k photorealistic, vertical portrait format 4:5
```

### `/images/works/full-detail-1.jpg` — Genesis G70 полный детейлинг

КОПИРОВАТЬ:
```
Dramatic front view of dark Genesis G70, fully detailed with polished paint, ceramic coating, tinted windows, blacked-out trim, the car looks showroom-perfect, centered in the dark studio bay, hero-car presentation, 8k photorealistic, vertical portrait format 4:5
```

---

## 6. СТУДИЯ — Страница «О нас» (Тип B)

### `/images/studio-1.jpg`

КОПИРОВАТЬ:
```
Wide architectural photograph of premium auto detailing studio interior, dark grey walls, black hexagonal LED ceiling light panels casting dramatic geometric shadows on the polished epoxy floor, two luxury dark cars in separate work bays, professional tool walls organized neatly, clean and modern industrial aesthetic, cinematic wide-angle, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/studio-2.jpg`

КОПИРОВАТЬ:
```
Medium shot of a single detailing work bay, dark car elevated on a professional lift, organized tool cart with polishing machines and chemicals, dramatic overhead hexagonal LED lighting creating pools of light on the car surface, the rest of the studio recedes into deep shadows, professional atmosphere, 8k photorealistic, wide cinematic frame 16:9
```

---

## 7. КОМАНДА — Портреты (Тип B)

Генерируй по одному. Все в одной студии, одно освещение.

### `/images/team-1.jpg` — Молодой специалист

КОПИРОВАТЬ:
```
Professional portrait of a young mid-20s male auto detailing specialist, lean build, short modern haircut, arms crossed, wearing a minimal black branded polo shirt, standing in a dimly lit premium garage, soft warm rim light from the right contouring the face and shoulders, hexagonal LED bokeh in the dark background, confident professional expression, subtle smile, dark moody color grading, shot on 85mm lens with shallow depth of field, 8k photorealistic, vertical portrait format 3:4
```

### `/images/team-2.jpg` — Опытный мастер

КОПИРОВАТЬ:
```
Professional portrait of a mid-30s male auto detailing specialist, medium build, short beard, holding a polishing machine casually at his side, wearing a minimal black branded polo shirt, standing in a dimly lit premium garage, soft warm rim light from the right contouring the face and shoulders, hexagonal LED bokeh in the dark background, confident professional expression, dark moody color grading, shot on 85mm lens with shallow depth of field, 8k photorealistic, vertical portrait format 3:4
```

### `/images/team-3.jpg` — Мастер по оклейке

КОПИРОВАТЬ:
```
Professional portrait of an early 30s male auto detailing specialist, athletic build, wearing nitrile gloves, hands at sides, wearing a minimal black branded polo shirt, standing in a dimly lit premium garage, soft warm rim light from the right contouring the face and shoulders, hexagonal LED bokeh in the dark background, focused professional expression, dark moody color grading, shot on 85mm lens with shallow depth of field, 8k photorealistic, vertical portrait format 3:4
```

### `/images/team-4.jpg` — Старший мастер

КОПИРОВАТЬ:
```
Professional portrait of a late 30s experienced male auto detailing specialist, slight grey at temples, warm expression, arms behind back, wearing a minimal black branded polo shirt, standing in a dimly lit premium garage, soft warm rim light from the right contouring the face and shoulders, hexagonal LED bokeh in the dark background, warm confident smile, dark moody color grading, shot on 85mm lens with shallow depth of field, 8k photorealistic, vertical portrait format 3:4
```

---

## 8. БЛОГ — Обложки статей (Тип B)

### `/images/blog/ppf-guide.jpg`

КОПИРОВАТЬ:
```
Two rolls of premium transparent PPF protection film standing upright on a dark glossy surface, dramatic single spotlight from above creating bright reflections on the film edges, one roll partially unrolled showing the film transparency, dark luxury product photography, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/blog/ceramic-guide.jpg`

КОПИРОВАТЬ:
```
Premium 9H ceramic coating bottle and applicator pad on dark slate surface, a small pool of the coating liquid reflects the overhead light like mercury, minimalist product photography, single key light, deep black background, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/blog/tint-laws.jpg`

КОПИРОВАТЬ:
```
Artistic flat-lay of tint film samples in varying darkness levels from very dark to light fanned out on a dark surface, a light meter tool beside them, clean geometric composition, overhead soft light, dark background, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/blog/polish-types.jpg`

КОПИРОВАТЬ:
```
Three professional polishing pads in orange white and black arranged in a row on dark surface, a bottle of polishing compound beside them, overhead dramatic lighting, clean product photography, deep black background, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/blog/sound-guide.jpg`

КОПИРОВАТЬ:
```
Rolled sheet of premium sound-deadening material partially unrolled showing the aluminum diamond-pattern surface, professional installation roller tool beside it, dark surface, single spotlight creating metallic reflections, product photography, 8k photorealistic, wide cinematic frame 16:9
```

### `/images/blog/maintenance-guide.jpg`

КОПИРОВАТЬ:
```
Curated collection of premium car care products including spray bottle, microfiber cloth, detailing brush and ceramic booster arranged on dark leather surface, warm overhead lighting, each product catches a highlight, editorial product photography, deep black background, 8k photorealistic, wide cinematic frame 16:9
```

---

## Сводная таблица

| # | Файл | Формат | Тип | Статус |
|---|------|--------|-----|--------|
| 1 | `/images/hero/home.jpg` | 16:9 | A | ✅ Сгенерировано |
| 2 | `/images/hero/ppf.jpg` | 16:9 | A | |
| 3 | `/images/hero/polirovka.jpg` | 16:9 | A | |
| 4 | `/images/hero/himchistka.jpg` | 16:9 | A | |
| 5 | `/images/hero/shumoizolyaciya.jpg` | 16:9 | A | |
| 6 | `/images/hero/antihrom.jpg` | 16:9 | A | |
| 7 | `/images/hero/tonirovka.jpg` | 16:9 | A | |
| 8 | `/images/hero/ustanovka-linz.jpg` | 16:9 | A | |
| 9 | `/images/hero/regulirovka-far.jpg` | 16:9 | A | |
| 10 | `/images/hero/polirovka-stekol.jpg` | 16:9 | A | |
| 11 | `/images/hero/polirovka-far.jpg` | 16:9 | A | |
| 12 | `/images/hero/antidozhd.jpg` | 16:9 | A | |
| 13 | `/images/hero/rusifikaciya-avto.jpg` | 16:9 | A | |
| 14 | `/images/hero/remont-vmyatin.jpg` | 16:9 | A | |
| 15 | `/images/hero/keramika.jpg` | 16:9 | A | |
| 16 | `/images/hero/ustanovka-signalizacii.jpg` | 16:9 | A | |
| 17–30 | До/После ×7 пар | 16:9 | B | |
| 31–34 | Тонировка ×4 уровня | 16:9 | B | |
| 35–44 | Портфолио ×10 | 4:5 | B | |
| 45–46 | Студия ×2 | 16:9 | B | |
| 47–50 | Команда ×4 | 3:4 | B | |
| 51–56 | Блог ×6 | 16:9 | B | |

**Итого: 56 изображений**

---

## Чеклист

- [ ] Hero главной — готово (golden texture)
- [ ] 15 hero услуг — проверить: видно ли картинку на сайте через оверлей
- [ ] 7 пар До/После — проверить: одинаковый ракурс в паре
- [ ] 4 уровня тонировки — проверить: одна и та же машина
- [ ] 10 портфолио — проверить: вертикальный формат
- [ ] 2 студии, 4 команды, 6 блога
- [ ] Все файлы в WebP, hero < 300KB, карточки < 200KB
- [ ] Названия файлов совпадают с путями в коде (slug, lowercase, дефисы)
