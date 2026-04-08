import { db } from "./index";
import {
  settings,
  adminUsers,
  carClasses,
  services,
  servicePackages,
  packageClassPrices,
  packageFeatures,
  elementPrices,
  elementClassPrices,
  serviceKeywords,
  serviceProcessSteps,
  serviceFaq,
  serviceCrossSell,
  serviceBeforeAfter,
  works,
  workTags,
  workImages,
  blogPosts,
  reviews,
  teamMembers,
  navItems,
  quizCategories,
  trustBadges,
  partnerBrands,
  liveStatus,
  socialProof,
  seasonalOffer,
  stats,
} from "./schema";
import bcrypt from "bcryptjs";

// ══════════════════════════════════════
// SEED SCRIPT — migrates ALL source data into SQLite
// Run: npx tsx src/lib/db/seed.ts
// ══════════════════════════════════════

console.log("Seeding database...\n");

// ── 1. Delete all data (reverse dependency order) ──

db.delete(workImages).run();
db.delete(workTags).run();
db.delete(works).run();
db.delete(serviceBeforeAfter).run();
db.delete(serviceCrossSell).run();
db.delete(serviceFaq).run();
db.delete(serviceProcessSteps).run();
db.delete(serviceKeywords).run();
db.delete(elementClassPrices).run();
db.delete(elementPrices).run();
db.delete(packageFeatures).run();
db.delete(packageClassPrices).run();
db.delete(servicePackages).run();
db.delete(services).run();
db.delete(carClasses).run();
db.delete(adminUsers).run();
db.delete(settings).run();
db.delete(navItems).run();
db.delete(quizCategories).run();
db.delete(trustBadges).run();
db.delete(partnerBrands).run();
db.delete(liveStatus).run();
db.delete(socialProof).run();
db.delete(seasonalOffer).run();
db.delete(blogPosts).run();
db.delete(reviews).run();
db.delete(teamMembers).run();
db.delete(stats).run();

console.log("Cleared all tables.");

// ── 2. Settings ──

const SETTINGS_DATA: { key: string; value: string }[] = [
  { key: "phone", value: "+7 (919) 644-93-93" },
  { key: "phone_raw", value: "79196449393" },
  { key: "whatsapp_url", value: "https://wa.me/79196449393" },
  { key: "telegram_url", value: "https://t.me/+79196449393" },
  { key: "max_url", value: "https://max.ru/79196449393" },
  { key: "address", value: "пр-т Хусаина Ямашева, 7к1, Казань" },
  { key: "hours", value: "Ежедневно 10:00–20:00" },
  { key: "coordinates_lat", value: "55.8203" },
  { key: "coordinates_lng", value: "49.0993" },
  { key: "metrika_id", value: "108387254" },
];

for (const s of SETTINGS_DATA) {
  db.insert(settings).values(s).run();
}
console.log(`Settings: ${SETTINGS_DATA.length}`);

// ── 3. Admin user ──

const passwordHash = bcrypt.hashSync("admin123", 10);
db.insert(adminUsers)
  .values({ username: "admin", passwordHash, createdAt: new Date().toISOString() })
  .run();
console.log("Admin user: 1");

// ── 4. Car Classes ──

const CAR_CLASSES_DATA = [
  { label: "1 класс", example: "Kia Rio, Hyundai Solaris, Lada" },
  { label: "2 класс", example: "Kia K5, Toyota Camry, VW Tiguan" },
  { label: "3 класс", example: "BMW 3, Mercedes C, Audi A4" },
  { label: "4 класс", example: "BMW X5, Mercedes GLE, Audi Q7" },
  { label: "5 класс", example: "Bentley, Rolls-Royce, Maybach" },
];

const carClassIds: number[] = [];
for (let i = 0; i < CAR_CLASSES_DATA.length; i++) {
  const rows = db
    .insert(carClasses)
    .values({ ...CAR_CLASSES_DATA[i], sortOrder: i })
    .returning({ id: carClasses.id })
    .all();
  carClassIds.push(rows[0].id);
}
console.log(`Car classes: ${carClassIds.length}`);

// ── 5. Services + all sub-entities ──

interface SeedPackage {
  name: string;
  description: string;
  classPrices: (string | null)[];
  features: string[];
  isPopular?: boolean;
  duration?: string;
}

interface SeedElement {
  element: string;
  classPrices: (string | null)[];
}

interface SeedService {
  slug: string;
  title: string;
  h1: string;
  subtitle: string;
  badge?: string;
  keywords: string[];
  packages: SeedPackage[];
  elementPrices?: SeedElement[];
  process: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  crossSell?: { title: string; description: string; href: string; discount?: string };
  beforeAfter?: { before: string; after: string; beforeLabel: string; afterLabel: string };
  works: { image: string; car: string; tags: string[] }[];
  seoText: string;
  hasBeforeAfter: boolean;
  uniqueBlock?: string;
  showOnHomepage: boolean;
}

const SERVICES_DATA: SeedService[] = [
  // 1. PPF
  {
    slug: "ppf",
    title: "Антигравийная плёнка на авто в Казани — цены, оклейка кузова | Detailing Place",
    h1: "Антигравийная плёнка на автомобиль в Казани",
    subtitle: "Полиуретановая защита кузова от сколов, царапин и реагентов",
    keywords: ["антигравийная плёнка казань", "оклейка плёнкой казань", "защита кузова плёнкой", "ppf казань цена", "бронирование кузова казань"],
    packages: [
      {
        name: "КОМПЛЕКС 1",
        description: "Капот, фары, крылья, стойки, крыша (перед), ручки, пороги",
        classPrices: ["50 000₽", "55 000₽", "60 000₽", "65 000₽", null],
        features: ["Капот + фары + крылья", "Передние стойки + перед крыши", "Зона ручек + пороги", "Гарантия"],
      },
      {
        name: "КОМПЛЕКС 2",
        description: "Комплекс 1 + передний бампер + зеркала",
        classPrices: ["70 000₽", "75 000₽", "80 000₽", "85 000₽", null],
        features: ["Всё из Комплекса 1", "Передний бампер", "Зеркала", "Гарантия"],
        isPopular: true,
      },
      {
        name: "ПОЛНАЯ ОКЛЕЙКА",
        description: "Весь кузов",
        classPrices: ["от 180 000₽"],
        features: ["100% кузова", "Самозатягивание царапин", "Точная нарезка", "Гарантия"],
      },
    ],
    elementPrices: [
      { element: "Капот", classPrices: ["от 15 000₽", "от 17 000₽", "от 20 000₽", "от 20 000₽", null] },
      { element: "Бампер", classPrices: ["от 15 000₽", "от 17 000₽", "от 20 000₽", "от 20 000₽", null] },
      { element: "Крыло (1 шт.)", classPrices: ["от 6 000₽", "от 8 000₽", "от 9 000₽", "от 9 000₽", null] },
      { element: "Дверь (1 шт.)", classPrices: ["от 8 000₽", "от 10 000₽", "от 10 000₽", "от 10 000₽", null] },
      { element: "Фара (1 шт.)", classPrices: ["от 1 500₽", "от 2 000₽", "от 2 500₽", "от 2 500₽", null] },
      { element: "Зона ручек (1 шт.)", classPrices: ["от 400₽"] },
      { element: "Пороги (1 шт.)", classPrices: ["от 800₽"] },
      { element: "Погрузочная зона", classPrices: ["от 2 000₽"] },
      { element: "Зеркала (1 шт.)", classPrices: ["от 2 000₽"] },
      { element: "Стойка лобового (1 шт.)", classPrices: ["от 2 500₽"] },
      { element: "Лобовое стекло", classPrices: ["от 10 000₽"] },
    ],
    process: [
      { title: "Приёмка", description: "Осмотр, замер толщины ЛКП, фиксация дефектов" },
      { title: "Подготовка", description: "Мойка, чистка кузова, сушка" },
      { title: "Раскрой", description: "Нарезка плёнки по форме кузова" },
      { title: "Оклейка", description: "Нанесение с прогревом и выгонкой воды, заводка за края" },
      { title: "Контроль", description: "Осмотр под малярным светом, фотоотчёт" },
    ],
    faq: [
      { question: "Какую плёнку используете?", answer: "Премиальные полиуретановые плёнки с самозатягиванием царапин." },
      { question: "Сколько стоит полная оклейка?", answer: "От 150 000₽. Рассчитаем за 15 минут по фото." },
      { question: "Как долго служит?", answer: "Гарантия 5-10 лет. Реально до 12 лет." },
    ],
    crossSell: {
      title: "Добавьте керамику поверх плёнки",
      description: "Скидка 15% на комплекс полировка + керамика",
      href: "/polirovka",
      discount: "15%",
    },
    beforeAfter: {
      before: "/images/ppf-before.webp",
      after: "/images/ppf-after.webp",
      beforeLabel: "Без защиты",
      afterLabel: "С защитой",
    },
    works: [],
    seoText: "<h2>Антигравийная плёнка (PPF) в Казани</h2><p>Защитная антигравийная плёнка — это полиуретановое покрытие толщиной 150-200 микрон, которое защищает лакокрасочное покрытие автомобиля от сколов, царапин, песка и химических реагентов. Используем премиальные плёнки с функцией самозатягивания мелких царапин.</p><p>Плёнка нарезается точно под форму вашего автомобиля. Гарантия на работы — от 5 до 10 лет в зависимости от выбранного пакета.</p>",
    hasBeforeAfter: true,
    showOnHomepage: true,
  },

  // 2. Полировка
  {
    slug: "polirovka",
    title: "Полировка кузова и керамическое покрытие в Казани | Detailing Place",
    h1: "Полировка автомобиля и керамическое покрытие в Казани",
    subtitle: "Восстановительная полировка убирает царапины и «паутинку». Керамика защищает блеск на 1-3 года",
    badge: "Замеряем толщину ЛКП до и после",
    keywords: ["полировка авто казань", "керамическое покрытие казань", "полировка с керамикой казань"],
    packages: [
      {
        name: "ЛЁГКАЯ ПОЛИРОВКА",
        description: "Мягкая полировка для свежих авто",
        classPrices: ["16 000₽", "17 000₽", "18 000₽", "19 000₽", "21 000₽"],
        features: ["Мягкая полировка", "Удаление лёгких царапин", "Блеск"],
      },
      {
        name: "ВОССТАНОВИТЕЛЬНАЯ",
        description: "Глубокая полировка в 2 этапа",
        classPrices: ["19 000₽", "20 000₽", "21 000₽", "23 000₽", "26 000₽"],
        features: ["Восстановительная полировка 2 этапа", "Удаление паутинки и царапин"],
        isPopular: true,
      },
    ],
    elementPrices: [
      { element: "Химчистка кузова", classPrices: ["2 500₽", "2 700₽", "3 000₽", "3 500₽", "4 000₽"] },
      { element: "Полировка отдельного элемента", classPrices: ["от 500–2 000₽"] },
    ],
    process: [
      { title: "Замер", description: "Толщиномер по всем деталям" },
      { title: "Подготовка", description: "Мойка, чистка кузова, оклейка маскировочной лентой" },
      { title: "Полировка", description: "Грубая → финишная полировка" },
      { title: "Керамика", description: "Нанесение керамики" },
      { title: "Контроль", description: "Фотоотчёт" },
    ],
    faq: [
      { question: "Не сотрёт ли полировка лак?", answer: "Снимаем 2-3 микрона из 100. Это безопасно даже для тонкого ЛКП." },
      { question: "Сколько держится керамика?", answer: "От 12 до 36 месяцев в зависимости от пакета и условий эксплуатации." },
      { question: "Можно полировать новый автомобиль?", answer: "Да, пакет REFRESH идеально подходит для новых авто — убирает транспортировочные царапины." },
    ],
    crossSell: {
      title: "Полировка стёкол и антидождь",
      description: "Идеальная видимость в любую погоду",
      href: "/polirovka-stekol",
    },
    beforeAfter: {
      before: "/images/polirovka-before.webp",
      after: "/images/polirovka-after.webp",
      beforeLabel: "Паутинка царапин",
      afterLabel: "Зеркальный глянец",
    },
    works: [],
    seoText: "<h2>Полировка кузова в Казани</h2><p>Восстановительная полировка кузова автомобиля устраняет мелкие царапины, «паутинку» и потёртости, возвращая лакокрасочному покрытию заводской блеск. Керамическое покрытие создаёт защитный слой, который отталкивает грязь и воду на протяжении 1-3 лет.</p>",
    hasBeforeAfter: true,
    showOnHomepage: true,
  },

  // 3. Химчистка
  {
    slug: "himchistka",
    title: "Химчистка салона автомобиля в Казани — цены | Detailing Place",
    h1: "Химчистка салона автомобиля в Казани",
    subtitle: "Глубокая очистка кожи, текстиля и пластика. Гипоаллергенно",
    badge: "Сушка за 4 часа. Выдаём сухой автомобиль",
    keywords: ["химчистка салона казань", "химчистка авто казань", "чистка салона автомобиля"],
    packages: [
      {
        name: "ДЕТЕЙЛИНГ ХИМЧИСТКА",
        description: "Полная химчистка салона. В стоимость входит сушка",
        classPrices: ["15 000₽", "15 500₽", "16 000₽", "16 500₽", "18 500₽"],
        features: ["Полная химчистка", "Кондиционер кожи", "Озонация салона", "Сушка включена"],
        isPopular: true,
      },
    ],
    elementPrices: [
      { element: "Химчистка сидений", classPrices: ["10 000₽", "10 300₽", "10 500₽", "10 700₽", "11 000₽"] },
      { element: "Химчистка потолка", classPrices: ["9 500₽", "9 700₽", "10 000₽", "10 300₽", "10 500₽"] },
      { element: "Химчистка пола", classPrices: ["10 000₽", "10 200₽", "10 400₽", "10 500₽", "11 000₽"] },
      { element: "Обшивка двери (1 шт.)", classPrices: ["8 100₽", "8 200₽", "8 300₽", "8 400₽", "8 500₽"] },
    ],
    process: [
      { title: "Разбор", description: "Пластиковый инструмент, без повреждений" },
      { title: "Торнадор", description: "Продувка всех щелей и дефлекторов" },
      { title: "Чистка", description: "Кисти + пена, каждый элемент отдельно" },
      { title: "Сушка", description: "Профессиональная сушка, 4 часа" },
      { title: "Консервация", description: "Крем для кожи + гидрофоб для текстиля" },
    ],
    faq: [
      { question: "Не зальёте ли вы кнопки и электронику?", answer: "Используем сухую пену и точечное нанесение. Электроника в безопасности." },
      { question: "Сколько времени занимает?", answer: "4-8 часов в зависимости от пакета. Выдаём полностью сухой автомобиль." },
      { question: "Безопасно для аллергиков?", answer: "Да, используем гипоаллергенные составы Koch Chemie." },
    ],
    crossSell: {
      title: "Полировка стёкол",
      description: "Идеальная видимость после химчистки",
      href: "/polirovka-stekol",
    },
    beforeAfter: {
      before: "/images/himchistka-before.webp",
      after: "/images/himchistka-after.webp",
      beforeLabel: "Грязный салон",
      afterLabel: "После химчистки DETOX",
    },
    works: [],
    seoText: "<h2>Химчистка салона в Казани</h2><p>Профессиональная химчистка салона автомобиля с применением гипоаллергенных составов Koch Chemie. Глубокая очистка кожаных и текстильных поверхностей, пластиковых элементов. Выдаём полностью сухой автомобиль в день обращения.</p>",
    hasBeforeAfter: true,
    showOnHomepage: true,
  },

  // 4. Шумоизоляция
  {
    slug: "shumoizolyaciya",
    title: "Шумоизоляция автомобиля в Казани — цены и материалы | Detailing Place",
    h1: "Шумоизоляция автомобиля в Казани",
    subtitle: "Снижаем шум до 70%. Comfort Mat / STP. Гарантия от скрипов",
    badge: "Вес: всего +40 кг (один пассажир)",
    keywords: ["шумоизоляция авто казань", "шумка казань", "шумоизоляция автомобиля цена"],
    packages: [
      {
        name: "ШУМОИЗОЛЯЦИЯ",
        description: "От арок до полного комплекса",
        classPrices: ["от 10 000₽"],
        features: ["Виброизоляция", "Шумопоглотитель", "Антискрип", "Comfort Mat / STP"],
        isPopular: true,
      },
    ],
    process: [
      { title: "Разбор", description: "Аккуратный демонтаж обшивок" },
      { title: "Виброизоляция", description: "Фольгированный битум на металл" },
      { title: "Шумопоглотитель", description: "Второй слой — пористый материал" },
      { title: "Антискрип", description: "Обработка стыков и креплений" },
      { title: "Сборка", description: "Монтаж обшивок с контролем" },
    ],
    faq: [
      { question: "Есть ли гарантия от скрипов?", answer: "Да. Не вмешиваемся в электрику, все материалы сертифицированы." },
      { question: "Не провиснут ли двери?", answer: "Нет, добавляем всего +1.5 кг на дверь. Петли рассчитаны на это." },
      { question: "Какие материалы используете?", answer: "Comfort Mat, STP — лидеры рынка шумоизоляции." },
    ],
    works: [],
    seoText: "<h2>Шумоизоляция авто в Казани</h2><p>Профессиональная шумоизоляция автомобиля материалами Comfort Mat и STP. Снижаем уровень шума в салоне до 70%. Гарантия отсутствия скрипов после сборки.</p>",
    hasBeforeAfter: false,
    showOnHomepage: true,
  },

  // 5. Антихром
  {
    slug: "antihrom",
    title: "Антихром в Казани — покраска и оклейка хрома в чёрный | Detailing Place",
    h1: "Антихром в Казани — убираем хром, добавляем характер",
    subtitle: "Покраска и оклейка хромированных элементов в чёрный или любой другой цвет",
    keywords: ["антихром казань", "покраска хрома казань", "оклейка хрома в чёрный"],
    packages: [
      {
        name: "АНТИХРОМ",
        description: "Оклейка или покраска хромированных элементов",
        classPrices: ["от 2 000₽"],
        features: ["Оконные молдинги", "Решётка радиатора", "Шильдики", "Выбор финиша (глянец/мат/сатин)"],
        isPopular: true,
      },
    ],
    process: [
      { title: "Демонтаж", description: "Снятие хромированных элементов" },
      { title: "Подготовка", description: "Травление, обезжиривание" },
      { title: "Покраска/Оклейка", description: "Нанесение выбранного покрытия" },
      { title: "Сборка", description: "Монтаж элементов на место" },
    ],
    faq: [
      { question: "Что лучше — покраска или оклейка?", answer: "Покраска долговечнее, оклейка — обратимый вариант. Поможем выбрать." },
      { question: "Сколько времени занимает?", answer: "1-3 дня в зависимости от объёма работ." },
    ],
    crossSell: {
      title: "Полный Black Pack",
      description: "Антихром + тонировка — максимальный стиль",
      href: "/tonirovka",
    },
    beforeAfter: {
      before: "/images/antihrom-before.webp",
      after: "/images/antihrom-after.webp",
      beforeLabel: "Хромированные элементы",
      afterLabel: "Full Black пакет",
    },
    works: [],
    seoText: "<h2>Антихром в Казани</h2><p>Убираем хромированные элементы и заменяем их на стильный чёрный или любой другой цвет. Покраска или оклейка — на выбор.</p>",
    hasBeforeAfter: true,
    showOnHomepage: true,
  },

  // 6. Тонировка
  {
    slug: "tonirovka",
    title: "Тонировка автомобиля в Казани — цены | Detailing Place",
    h1: "Тонировка автомобиля в Казани",
    subtitle: "Тонировочные плёнки. Защита от солнца и посторонних глаз",
    keywords: ["тонировка казань", "тонировка авто казань", "тонировка стёкол казань"],
    packages: [
      {
        name: "ЗАДНЯЯ ЧАСТЬ",
        description: "5 стёкол",
        classPrices: ["7 000₽", "7 500₽", "8 500₽", "10 000₽", null],
        features: ["5 задних стёкол", "Гарантия"],
      },
      {
        name: "ЗАДНЯЯ ЧАСТЬ ПРЕМИУМ",
        description: "5 стёкол, премиум плёнка",
        classPrices: ["8 500₽", "9 000₽", "10 000₽", "11 500₽", null],
        features: ["5 задних стёкол", "Премиум плёнка", "УФ-защита", "Гарантия"],
        isPopular: true,
      },
    ],
    elementPrices: [
      { element: "Ремонт стекла (остановка трещины)", classPrices: ["от 500₽"] },
      { element: "Заливка трещины", classPrices: ["40₽/см"] },
      { element: "Ремонт сколов", classPrices: ["от 500₽"] },
    ],
    process: [
      { title: "Подготовка", description: "Мойка и очистка стёкол" },
      { title: "Раскрой", description: "Нарезка плёнки по размеру" },
      { title: "Нанесение", description: "Тонировка с выгонкой воздуха" },
      { title: "Контроль", description: "Проверка качества" },
    ],
    faq: [
      { question: "Законна ли тонировка?", answer: "Задние стёкла — без ограничений. Лобовое и передние — атермальная по ГОСТу (70%+ светопропускание)." },
      { question: "Какие плёнки используете?", answer: "Премиальные плёнки с УФ-защитой." },
    ],
    crossSell: {
      title: "Антидождь со скидкой 10%",
      description: "Идеальная видимость в дождь",
      href: "/antidozhd",
      discount: "10%",
    },
    works: [],
    seoText: "<h2>Тонировка авто в Казани</h2><p>Тонировка автомобиля премиальными плёнками. Защита от ультрафиолета, снижение нагрева салона, приватность.</p>",
    hasBeforeAfter: false,
    uniqueBlock: "PhotoComparison",
    showOnHomepage: true,
  },

  // 7. Установка Bi-LED линз
  {
    slug: "ustanovka-linz",
    title: "Установка Bi-LED линз в фары в Казани — цены | Detailing Place",
    h1: "Установка Bi-LED линз в фары в Казани",
    subtitle: "Яркий свет как на премиуме. Aozoom, GTR, Hella. Регулировка на стенде",
    badge: "Настраиваем на стенде. Не слепим встречных",
    keywords: ["установка линз казань", "би лед линзы казань", "тюнинг фар казань"],
    packages: [
      {
        name: "УСТАНОВКА ЛИНЗ",
        description: "Bi-LED модули + регулировка на стенде",
        classPrices: ["от 15 000₽"],
        features: ["Bi-LED модули Aozoom / GTR / Hella", "Регулировка на стенде", "Полировка фар"],
        isPopular: true,
      },
    ],
    process: [
      { title: "Разбор фар", description: "Термокамера для безопасного вскрытия" },
      { title: "Установка", description: "Монтаж Bi-LED модулей" },
      { title: "Сборка", description: "Герметизация фар" },
      { title: "Регулировка", description: "Настройка на профессиональном стенде" },
    ],
    faq: [
      { question: "Законно ли устанавливать Bi-LED линзы?", answer: "Да, если свет правильно отрегулирован. Настраиваем на сертифицированном стенде." },
      { question: "Какие модули устанавливаете?", answer: "Aozoom, GTR Bio, Hella — проверенные бренды." },
      { question: "Для каких автомобилей подходит?", answer: "Для всех марок. Подбираем модуль под вашу фару." },
      { question: "Сколько времени занимает?", answer: "4-8 часов в зависимости от сложности." },
    ],
    crossSell: {
      title: "Полировка фар",
      description: "Вернём прозрачность помутневшим фарам",
      href: "/polirovka-far",
    },
    works: [],
    seoText: "<h2>Установка Bi-LED линз в Казани</h2><p>Установка биледовых линз в штатные фары автомобиля. Используем модули Aozoom, GTR Bio, Hella. Обязательная регулировка на профессиональном стенде — не слепим встречных водителей.</p>",
    hasBeforeAfter: false,
    uniqueBlock: "CarBrandGrid",
    showOnHomepage: true,
  },

  // 8. Регулировка фар
  {
    slug: "regulirovka-far",
    title: "Регулировка фар в Казани — профессиональная настройка | Detailing Place",
    h1: "Регулировка фар в Казани — профессиональная настройка на стенде",
    subtitle: "Сертифицированный стенд регулировки. Правильный свет — ваша безопасность",
    badge: "Сертифицированный стенд регулировки",
    keywords: ["регулировка фар казань", "настройка фар казань", "регулировка света фар"],
    packages: [
      {
        name: "РЕГУЛИРОВКА",
        description: "Ближний/дальний на стенде",
        classPrices: ["от 1 500₽"],
        features: ["Регулировка ближнего света", "Регулировка дальнего света", "Стенд"],
      },
      {
        name: "+ ПОЛИРОВКА",
        description: "Регулировка + полировка фар",
        classPrices: ["от 3 500₽"],
        features: ["Регулировка ближнего/дальнего", "Полировка обеих фар", "Стенд"],
        isPopular: true,
      },
      {
        name: "КОМПЛЕКС",
        description: "Регулировка + полировка + бронирование",
        classPrices: ["от 5 000₽"],
        features: ["Регулировка", "Полировка фар", "Бронирование фар"],
      },
    ],
    process: [
      { title: "Диагностика", description: "Проверка текущих настроек на стенде" },
      { title: "Регулировка", description: "Настройка ближнего и дальнего света" },
      { title: "Контроль", description: "Проверка результата, протокол" },
    ],
    faq: [
      { question: "Зачем нужна регулировка?", answer: "Неправильная регулировка слепит встречных и ухудшает видимость. Это вопрос безопасности." },
      { question: "Сколько времени занимает?", answer: "15-30 минут." },
    ],
    crossSell: {
      title: "Свет тусклый?",
      description: "Установите Bi-LED линзы для яркого света",
      href: "/ustanovka-linz",
    },
    works: [],
    seoText: "<h2>Регулировка фар в Казани</h2><p>Профессиональная регулировка фар на сертифицированном стенде. Правильная настройка ближнего и дальнего света для безопасного вождения.</p>",
    hasBeforeAfter: false,
    showOnHomepage: true,
  },

  // 9. Полировка стёкол
  {
    slug: "polirovka-stekol",
    title: "Полировка стёкол автомобиля в Казани — цены | Detailing Place",
    h1: "Полировка стёкол автомобиля в Казани",
    subtitle: "Убираем затёртости и мелкие царапины. Дешевле замены стекла в 5-10 раз",
    badge: "Дешевле замены стекла в 5-10 раз",
    keywords: ["полировка стёкол казань", "полировка лобового стекла казань"],
    packages: [
      {
        name: "ПОЛИРОВКА СТЁКОЛ",
        description: "Полировка лобового и других стёкол",
        classPrices: ["от 2 000₽"],
        features: ["Полировка лобового стекла", "Удаление затёртостей от дворников", "Гидрофобное покрытие"],
        isPopular: true,
      },
    ],
    process: [
      { title: "Диагностика", description: "Оценка состояния стёкол" },
      { title: "Подготовка", description: "Очистка поверхности" },
      { title: "Полировка", description: "Фетровым кругом с пастой" },
      { title: "Контроль", description: "Проверка прозрачности" },
    ],
    faq: [
      { question: "Можно ли убрать глубокие царапины?", answer: "Мелкие и средние — да. Глубокие сколы от камней — нет, но можем отполировать вокруг." },
      { question: "Сколько времени?", answer: "1-3 часа в зависимости от объёма." },
    ],
    crossSell: {
      title: "Антидождь",
      description: "Гидрофобное покрытие после полировки",
      href: "/antidozhd",
    },
    beforeAfter: {
      before: "/images/steklo-before.webp",
      after: "/images/steklo-after.webp",
      beforeLabel: "Затёртости от дворников",
      afterLabel: "После полировки — как новое",
    },
    works: [],
    seoText: "<h2>Полировка стёкол в Казани</h2><p>Полировка лобового и боковых стёкол автомобиля. Убираем затёртости от дворников и мелкие царапины. Стоимость в 5-10 раз ниже замены стекла.</p>",
    hasBeforeAfter: true,
    showOnHomepage: true,
  },

  // 10. Полировка фар
  {
    slug: "polirovka-far",
    title: "Полировка фар автомобиля в Казани — цены | Detailing Place",
    h1: "Полировка фар автомобиля в Казани",
    subtitle: "Возвращаем прозрачность помутневшим фарам",
    keywords: ["полировка фар казань", "восстановление фар казань"],
    packages: [
      {
        name: "ПОЛИРОВКА ФАР",
        description: "2 фары + бронирование",
        classPrices: ["от 2 000₽"],
        features: ["Полировка 2 фар", "Удаление помутнения", "Бронирование"],
        isPopular: true,
      },
    ],
    process: [
      { title: "Оценка", description: "Степень помутнения" },
      { title: "Шлифовка", description: "Абразив P800-P3000" },
      { title: "Полировка", description: "Финишная полировальная паста" },
      { title: "Защита", description: "Бронирование фар плёнкой" },
    ],
    faq: [
      { question: "Надолго ли хватает?", answer: "Без бронирования — 6-12 мес, с бронированием — до 3 лет." },
      { question: "Подходит для всех фар?", answer: "Для пластиковых (поликарбонат). Стеклянные фары не мутнеют." },
    ],
    crossSell: {
      title: "Свет тусклый?",
      description: "Установите Bi-LED линзы для яркого света",
      href: "/ustanovka-linz",
    },
    beforeAfter: {
      before: "/images/far-before.webp",
      after: "/images/far-after.webp",
      beforeLabel: "Помутневшая фара",
      afterLabel: "После полировки + бронирование",
    },
    works: [],
    seoText: "<h2>Полировка фар в Казани</h2><p>Восстановление прозрачности помутневших фар автомобиля. Полировка и бронирование плёнкой для долговременного результата.</p>",
    hasBeforeAfter: true,
    showOnHomepage: true,
  },

  // 11. Антидождь
  {
    slug: "antidozhd",
    title: "Антидождь для автомобиля в Казани — цены | Detailing Place",
    h1: "Антидождь для автомобиля в Казани",
    subtitle: "Гидрофобное покрытие стёкол. Дождь скатывается на скорости от 60 км/ч",
    badge: "Держится 6-12 месяцев",
    keywords: ["антидождь казань", "гидрофоб для стёкол казань"],
    packages: [
      {
        name: "АНТИДОЖДЬ",
        description: "Гидрофобное покрытие стёкол",
        classPrices: ["от 1 500₽"],
        features: ["Гидрофоб на лобовое стекло", "Все стёкла", "Боковые зеркала"],
        isPopular: true,
      },
    ],
    process: [
      { title: "Очистка", description: "Тщательная мойка стёкол" },
      { title: "Обезжиривание", description: "Подготовка поверхности" },
      { title: "Нанесение", description: "Гидрофобный состав в 2 слоя" },
      { title: "Полимеризация", description: "Высыхание и закрепление" },
    ],
    faq: [
      { question: "Как долго держится?", answer: "6-12 месяцев при правильном уходе." },
      { question: "Можно с тонировкой?", answer: "Да, наносится на внешнюю сторону стекла." },
    ],
    beforeAfter: {
      before: "/images/antidozhd-before.webp",
      after: "/images/antidozhd-after.webp",
      beforeLabel: "Без гидрофоба — вода растекается",
      afterLabel: "С антидождём — капли скатываются",
    },
    works: [],
    seoText: "<h2>Антидождь в Казани</h2><p>Гидрофобное покрытие стёкол автомобиля. Вода и грязь скатываются со стекла на скорости от 60 км/ч. Улучшает видимость в дождь.</p>",
    hasBeforeAfter: true,
    showOnHomepage: true,
  },

  // 12. Русификация
  {
    slug: "rusifikaciya-avto",
    title: "Русификация китайских автомобилей в Казани — цены | Detailing Place",
    h1: "Русификация китайских автомобилей в Казани",
    subtitle: "Русский язык, метрическая система, навигация. Без потери гарантии",
    badge: "Без потери гарантии",
    keywords: ["русификация авто казань", "русификация китайских авто", "русский язык в haval"],
    packages: [
      {
        name: "РУСИФИКАЦИЯ",
        description: "Русский язык + метрическая система",
        classPrices: ["от 5 000₽"],
        features: ["Русский язык интерфейса", "Метрическая система"],
      },
      {
        name: "+ КАРТЫ",
        description: "Язык + навигация",
        classPrices: ["от 8 000₽"],
        features: ["Русский язык", "Навигация с картами РФ"],
        isPopular: true,
      },
      {
        name: "ПОЛНАЯ АДАПТАЦИЯ",
        description: "Язык + карты + голос + обновление ПО",
        classPrices: ["от 12 000₽"],
        features: ["Русский язык", "Навигация", "Голосовой помощник", "Обновление ПО"],
      },
    ],
    process: [
      { title: "Диагностика", description: "Определение версии ПО" },
      { title: "Резервное копирование", description: "Бэкап текущих настроек" },
      { title: "Прошивка", description: "Установка русского языка и карт" },
      { title: "Проверка", description: "Тестирование всех функций" },
    ],
    faq: [
      { question: "Не слетит ли гарантия?", answer: "Нет. Меняем только язык и карты, не затрагиваем критические системы." },
      { question: "Какие марки поддерживаете?", answer: "Haval, Chery, Geely, Exeed, Changan, Omoda, Jetour, Dongfeng." },
      { question: "Сколько времени?", answer: "1-3 часа." },
    ],
    crossSell: {
      title: "Только купили? Защитите кузов плёнкой",
      description: "Скидка 10% на PPF для новых авто",
      href: "/ppf",
      discount: "10%",
    },
    works: [],
    seoText: "<h2>Русификация китайских авто в Казани</h2><p>Русификация бортовой системы китайских автомобилей: Haval, Chery, Geely, Exeed, Changan, Omoda, Jetour, Dongfeng. Установка русского языка, навигации с картами России.</p>",
    hasBeforeAfter: false,
    uniqueBlock: "BrandsGrid",
    showOnHomepage: true,
  },

  // 13. Ремонт вмятин PDR
  {
    slug: "remont-vmyatin",
    title: "Ремонт вмятин без покраски в Казани (PDR) | Detailing Place",
    h1: "Ремонт вмятин без покраски в Казани (PDR)",
    subtitle: "Удаление вмятин с сохранением заводского ЛКП",
    badge: "Сохраняем заводское ЛКП",
    keywords: ["ремонт вмятин казань", "pdr казань", "удаление вмятин без покраски"],
    packages: [
      {
        name: "РЕМОНТ ВМЯТИН",
        description: "PDR — без покраски",
        classPrices: ["от 5 000₽"],
        features: ["Удаление вмятин без покраски", "Сохранение ЛКП", "Парковочные и градовые"],
        isPopular: true,
      },
    ],
    process: [
      { title: "Осмотр", description: "Оценка количества и глубины вмятин" },
      { title: "Доступ", description: "Подбор инструмента и точки доступа" },
      { title: "Выправка", description: "PDR-техника без покраски" },
      { title: "Контроль", description: "Проверка под малярным светом" },
    ],
    faq: [
      { question: "Какие вмятины можно убрать?", answer: "Любые без повреждения ЛКП: парковочные, градовые, незначительные." },
      { question: "Сохранится ли заводская краска?", answer: "Да, метод PDR не требует перекраски." },
    ],
    crossSell: {
      title: "После ремонта — защита PPF",
      description: "Защитите кузов от будущих повреждений",
      href: "/ppf",
    },
    works: [],
    seoText: "<h2>Ремонт вмятин без покраски (PDR) в Казани</h2><p>Профессиональное удаление вмятин методом PDR с сохранением заводского лакокрасочного покрытия. Подходит для парковочных и градовых повреждений.</p>",
    hasBeforeAfter: false,
    showOnHomepage: true,
  },

  // 14. Защитные покрытия
  {
    slug: "zashchitnye-pokrytiya",
    title: "Защитные покрытия автомобиля (керамика, воск) в Казани | Detailing Place",
    h1: "Защитные покрытия кузова в Казани",
    subtitle: "Керамический воск, жидкое стекло и многослойная керамика для защиты и блеска ЛКП",
    badge: "Зеркальный блеск и мощный гидрофоб",
    keywords: ["керамика кузова казань", "жидкое стекло казань", "керамический воск авто", "защитное покрытие автомобиля цена"],
    packages: [
      {
        name: "КЕРАМИЧЕСКИЙ ВОСК",
        description: "Глубокий цвет + водоотталкивающий эффект",
        classPrices: ["от 2 000₽"],
        features: ["Керамический воск", "Защита до 3 месяцев", "Усиление блеска", "Гидрофобный эффект"],
      },
      {
        name: "ЖИДКОЕ СТЕКЛО",
        description: "Защита от реагентов и мелких царапин",
        classPrices: ["от 4 000₽"],
        features: ["Жидкое стекло (1 слой)", "Защита до 6-8 месяцев", "Защита от UV-лучей", "Легкая мойка автомобиля"],
        isPopular: true,
      },
      {
        name: "КЕРАМИКА 2 СЛОЯ",
        description: "Максимальная защита и твердость 9H",
        classPrices: ["от 15 000₽"],
        features: ["Керамическое покрытие 2 слоя (9H)", "Защита 1-2 года", "Стойкость к химии на мойках", "Зеркальный глянец"],
      },
    ],
    process: [
      { title: "Мойка", description: "Тщательная трёхфазная мойка кузова" },
      { title: "Деконтаминация", description: "Удаление битума, металлических вкраплений и колодочной пыли" },
      { title: "Обезжиривание", description: "Полное удаление остатков старых восков и жиров" },
      { title: "Нанесение", description: "Ручное нанесение выбранного состава" },
      { title: "Полимеризация", description: "Выдержка состава в сухом боксе при нужной температуре" },
    ],
    faq: [
      { question: "В чём разница между воском и керамикой?", answer: "Воск даёт красивый блеск на 2-3 месяца, но смывается химией. Керамика создаёт твёрдый защитный слой, который держится годами и защищает от мелких царапин." },
      { question: "Нужно ли полировать авто перед керамикой?", answer: "Да, крайне рекомендуется. Керамика «запечатывает» состояние лака, поэтому перед нанесением нужно убрать всю паутинку и царапины с помощью полировки." },
      { question: "Как мыть машину после керамики?", answer: "Только двух- или трёхфазная детейлинг-мойка без агрессивных щелочных шампуней." },
    ],
    crossSell: {
      title: "Полировка кузова перед покрытием",
      description: "Идеальная основа для керамики",
      href: "/polirovka",
    },
    beforeAfter: {
      before: "/images/keramika-before.webp",
      after: "/images/keramika-after.webp",
      beforeLabel: "До нанесения керамики",
      afterLabel: "Керамика 9H — зеркальный блеск",
    },
    works: [],
    seoText: "<h2>Нанесение керамики и жидкого стекла в Казани</h2><p>Защитные покрытия создают прочный барьер между лакокрасочным покрытием автомобиля и агрессивной окружающей средой. Керамика 9H надежно защищает от выгорания на солнце, птичьего помёта, дорожных реагентов и мелких царапин от пескоструя на трассе. Автомобиль дольше остается чистым за счёт сильного гидрофобного эффекта.</p>",
    hasBeforeAfter: true,
    showOnHomepage: true,
  },

  // 15. Установка сигнализации
  {
    slug: "ustanovka-signalizacii",
    title: "Установка автосигнализации (StarLine, Pandora) в Казани | Detailing Place",
    h1: "Установка автосигнализации в Казани",
    subtitle: "Надёжные охранные комплексы, автозапуск с телефона и гарантия от угона",
    badge: "Сохранение дилерской гарантии",
    keywords: ["установка сигнализации казань", "автосигнализация с автозапуском цена", "старлайн казань", "пандора установка", "защита от угона"],
    packages: [
      {
        name: "БАЗОВАЯ ЗАЩИТА",
        description: "Система с управлением со штатного ключа",
        classPrices: ["от 15 000₽"],
        features: ["Цифровая блокировка двигателя", "Управление со штатного брелока", "Датчики удара и наклона", "Скрытая установка"],
      },
      {
        name: "С АВТОЗАПУСКОМ (GSM)",
        description: "Управление и прогрев автомобиля с телефона",
        classPrices: ["от 25 000₽"],
        features: ["Бесключевой автозапуск", "Управление через приложение", "GPS/ГЛОНАСС позиционирование", "Метка авторизации"],
        isPopular: true,
      },
      {
        name: "ОХРАННЫЙ КОМПЛЕКС",
        description: "Максимальная защита от интеллектуального угона",
        classPrices: ["от 45 000₽"],
        features: ["Сигнализация с автозапуском и GSM", "Дополнительный замок капота", "Радиореле блокировки", "Блокировка OBD-разъема", "Защита ретрансляции ключа (Keyless)"],
      },
    ],
    process: [
      { title: "Консультация", description: "Подбор системы под марку, модель и ваши задачи" },
      { title: "Разборка", description: "Аккуратный демонтаж панелей без царапин и поломанных клипс" },
      { title: "Монтаж", description: "Скрытая установка блоков, интеграция в цифровую шину CAN/LIN" },
      { title: "Настройка", description: "Программирование логики работы, автозапуска и датчиков" },
      { title: "Сборка и проверка", description: "Проверка всех функций и сдача работы клиенту" },
    ],
    faq: [
      { question: "Слетит ли машина с дилерской гарантии?", answer: "Нет. Установка производится сертифицированными специалистами, вмешательство в проводку минимально благодаря CAN-модулям." },
      { question: "Нужно ли оставлять второй ключ для автозапуска?", answer: "На 90% современных автомобилей второй ключ не нужен — обход иммобилайзера происходит программно (бесключевой обход)." },
      { question: "Что лучше — StarLine или Pandora?", answer: "Обе системы надёжны и современны. Выбор зависит от конкретной модели авто и ваших предпочтений к приложению. Мастер поможет определиться на месте." },
    ],
    crossSell: {
      title: "Шумоизоляция салона",
      description: "Совместите установку сигнализации с шумоизоляцией, пока салон разобран",
      href: "/shumoizolyaciya",
    },
    works: [],
    seoText: "<h2>Установка сигнализации с автозапуском в Казани</h2><p>Современная автосигнализация — это не просто пикалка от хулиганов, а сложный телематический комплекс. Управление автомобилем со смартфона, надежный прогрев двигателя зимой в любой мороз и уверенная защита от высокотехнологичных методов угона. Мы используем только оригинальные системы проверенных брендов StarLine и Pandora со скрытой установкой.</p>",
    hasBeforeAfter: false,
    showOnHomepage: true,
  },
];

let totalPackages = 0;
let totalPackagePrices = 0;
let totalPackageFeatures = 0;
let totalElements = 0;
let totalElementPrices = 0;
let totalKeywords = 0;
let totalProcessSteps = 0;
let totalFaq = 0;
let totalCrossSell = 0;
let totalBeforeAfter = 0;
let totalServiceWorks = 0;
let totalWorkTags = 0;

for (let sIdx = 0; sIdx < SERVICES_DATA.length; sIdx++) {
  const s = SERVICES_DATA[sIdx];

  // Insert service
  const svcRows = db
    .insert(services)
    .values({
      slug: s.slug,
      title: s.title,
      h1: s.h1,
      subtitle: s.subtitle,
      badge: s.badge ?? null,
      seoText: s.seoText,
      hasBeforeAfter: s.hasBeforeAfter,
      uniqueBlock: s.uniqueBlock ?? null,
      sortOrder: sIdx,
      isActive: true,
      showOnHomepage: s.showOnHomepage,
      homepageSortOrder: sIdx,
    })
    .returning({ id: services.id })
    .all();

  const serviceId = svcRows[0].id;

  // ── Packages ──
  for (let pIdx = 0; pIdx < s.packages.length; pIdx++) {
    const pkg = s.packages[pIdx];
    const pkgRows = db
      .insert(servicePackages)
      .values({
        serviceId,
        name: pkg.name,
        description: pkg.description,
        isPopular: pkg.isPopular ?? false,
        duration: pkg.duration ?? null,
        sortOrder: pIdx,
      })
      .returning({ id: servicePackages.id })
      .all();

    const packageId = pkgRows[0].id;

    // ── Package class prices ──
    if (pkg.classPrices.length === 1) {
      // Flat price: single row, car_class_id = NULL
      db.insert(packageClassPrices)
        .values({
          packageId,
          carClassId: null,
          priceText: pkg.classPrices[0],
        })
        .run();
      totalPackagePrices++;
    } else {
      // Per-class prices
      for (let ci = 0; ci < pkg.classPrices.length; ci++) {
        db.insert(packageClassPrices)
          .values({
            packageId,
            carClassId: carClassIds[ci],
            priceText: pkg.classPrices[ci],
          })
          .run();
        totalPackagePrices++;
      }
    }

    // ── Package features ──
    for (let fi = 0; fi < pkg.features.length; fi++) {
      db.insert(packageFeatures)
        .values({ packageId, text: pkg.features[fi], sortOrder: fi })
        .run();
      totalPackageFeatures++;
    }

    totalPackages++;
  }

  // ── Element prices ──
  if (s.elementPrices) {
    for (let eIdx = 0; eIdx < s.elementPrices.length; eIdx++) {
      const el = s.elementPrices[eIdx];
      const elRows = db
        .insert(elementPrices)
        .values({ serviceId, elementName: el.element, sortOrder: eIdx })
        .returning({ id: elementPrices.id })
        .all();

      const elementPriceId = elRows[0].id;

      if (el.classPrices.length === 1) {
        db.insert(elementClassPrices)
          .values({ elementPriceId, carClassId: null, priceText: el.classPrices[0] })
          .run();
        totalElementPrices++;
      } else {
        for (let ci = 0; ci < el.classPrices.length; ci++) {
          db.insert(elementClassPrices)
            .values({
              elementPriceId,
              carClassId: carClassIds[ci],
              priceText: el.classPrices[ci],
            })
            .run();
          totalElementPrices++;
        }
      }

      totalElements++;
    }
  }

  // ── Keywords ──
  for (const kw of s.keywords) {
    db.insert(serviceKeywords).values({ serviceId, keyword: kw }).run();
    totalKeywords++;
  }

  // ── Process steps ──
  for (let psi = 0; psi < s.process.length; psi++) {
    db.insert(serviceProcessSteps)
      .values({ serviceId, title: s.process[psi].title, description: s.process[psi].description, sortOrder: psi })
      .run();
    totalProcessSteps++;
  }

  // ── FAQ ──
  for (let fi = 0; fi < s.faq.length; fi++) {
    db.insert(serviceFaq)
      .values({ serviceId, question: s.faq[fi].question, answer: s.faq[fi].answer, sortOrder: fi })
      .run();
    totalFaq++;
  }

  // ── Cross-sell ──
  if (s.crossSell) {
    db.insert(serviceCrossSell)
      .values({
        serviceId,
        title: s.crossSell.title,
        description: s.crossSell.description,
        href: s.crossSell.href,
        discount: s.crossSell.discount ?? null,
      })
      .run();
    totalCrossSell++;
  }

  // ── Before/After ──
  if (s.beforeAfter) {
    db.insert(serviceBeforeAfter)
      .values({
        serviceId,
        beforeImage: s.beforeAfter.before,
        afterImage: s.beforeAfter.after,
        beforeLabel: s.beforeAfter.beforeLabel,
        afterLabel: s.beforeAfter.afterLabel,
      })
      .run();
    totalBeforeAfter++;
  }

  // ── Works ──
  for (let wi = 0; wi < s.works.length; wi++) {
    const w = s.works[wi];
    const workRows = db
      .insert(works)
      .values({
        serviceId,
        slug: `${s.slug}-work-${wi + 1}`,
        car: w.car,
        serviceName: null,
        image: w.image,
        sortOrder: wi,
      })
      .returning({ id: works.id })
      .all();

    for (const tag of w.tags) {
      db.insert(workTags).values({ workId: workRows[0].id, tag }).run();
      totalWorkTags++;
    }
    totalServiceWorks++;
  }
}

console.log(`Services: ${SERVICES_DATA.length}`);
console.log(`  Packages: ${totalPackages}`);
console.log(`  Package prices: ${totalPackagePrices}`);
console.log(`  Package features: ${totalPackageFeatures}`);
console.log(`  Element prices: ${totalElements}`);
console.log(`  Element class prices: ${totalElementPrices}`);
console.log(`  Keywords: ${totalKeywords}`);
console.log(`  Process steps: ${totalProcessSteps}`);
console.log(`  FAQ: ${totalFaq}`);
console.log(`  Cross-sell: ${totalCrossSell}`);
console.log(`  Before/After: ${totalBeforeAfter}`);
console.log(`  Works: ${totalServiceWorks}`);
console.log(`  Work tags: ${totalWorkTags}`);

// ── 6. Nav Items ──

const NAV_ITEMS_DATA = [
  { label: "Антигравийная плёнка", href: "/ppf", isNew: false },
  { label: "Полировка и керамика", href: "/polirovka", isNew: false },
  { label: "Химчистка салона", href: "/himchistka", isNew: false },
  { label: "Шумоизоляция", href: "/shumoizolyaciya", isNew: false },
  { label: "Антихром", href: "/antihrom", isNew: false },
  { label: "Тонировка", href: "/tonirovka", isNew: false },
  { label: "Установка Bi-LED линз", href: "/ustanovka-linz", isNew: true },
  { label: "Регулировка фар", href: "/regulirovka-far", isNew: true },
  { label: "Полировка стёкол", href: "/polirovka-stekol", isNew: true },
  { label: "Полировка фар", href: "/polirovka-far", isNew: true },
  { label: "Антидождь", href: "/antidozhd", isNew: true },
  { label: "Русификация авто", href: "/rusifikaciya-avto", isNew: true },
  { label: "Ремонт вмятин (PDR)", href: "/remont-vmyatin", isNew: true },
  { label: "Портфолио", href: "/portfolio", isNew: false },
  { label: "О студии", href: "/about", isNew: false },
  { label: "Блог", href: "/blog", isNew: false },
  { label: "Контакты", href: "/contacts", isNew: false },
];

const INFO_PAGES = ["/portfolio", "/about", "/blog", "/contacts"];

for (let i = 0; i < NAV_ITEMS_DATA.length; i++) {
  const n = NAV_ITEMS_DATA[i];
  const group = INFO_PAGES.includes(n.href) ? "info" : "service";
  db.insert(navItems)
    .values({ label: n.label, href: n.href, group, isNew: n.isNew, sortOrder: i })
    .run();
}
console.log(`Nav items: ${NAV_ITEMS_DATA.length}`);

// ── 7. Quiz Categories ──

const QUIZ_CATEGORIES_DATA = [
  "Антигравийная плёнка (PPF)",
  "Керамическое покрытие",
  "Антидождь",
  "Полировка кузова",
  "Полировка фар",
  "Полировка стёкол",
  "Тонировка",
  "Антихром",
  "Шумоизоляция",
  "Оптика (линзы, регулировка фар)",
  "Химчистка салона",
  "Ремонт вмятин (PDR)",
];

for (let i = 0; i < QUIZ_CATEGORIES_DATA.length; i++) {
  db.insert(quizCategories).values({ label: QUIZ_CATEGORIES_DATA[i], sortOrder: i }).run();
}
console.log(`Quiz categories: ${QUIZ_CATEGORIES_DATA.length}`);

// ── 8. Trust Badges ──

const TRUST_BADGES_DATA = [
  {
    iconName: "ShieldCheck",
    title: "Охраняемый периметр 24/7",
    description: "Ваш автомобиль ночует в тёплом боксе под видеонаблюдением",
  },
  {
    iconName: "ScanBarcode",
    title: "Только оригиналы",
    description: "Пробиваем рулон плёнки при вас. Никакого Китая под видом бренда",
  },
  {
    iconName: "MessageCircle",
    title: "Фотоотчёты",
    description: "Отправляем фото каждого этапа. Контролируете процесс удалённо",
  },
];

for (let i = 0; i < TRUST_BADGES_DATA.length; i++) {
  db.insert(trustBadges)
    .values({ ...TRUST_BADGES_DATA[i], sortOrder: i })
    .run();
}
console.log(`Trust badges: ${TRUST_BADGES_DATA.length}`);

// ── 9. Partner Brands ──

const PARTNER_BRANDS_DATA: string[] = [];

for (let i = 0; i < PARTNER_BRANDS_DATA.length; i++) {
  db.insert(partnerBrands).values({ name: PARTNER_BRANDS_DATA[i], sortOrder: i }).run();
}
console.log(`Partner brands: ${PARTNER_BRANDS_DATA.length}`);

// ── 10. Live Status ──

const LIVE_STATUS_DATA = [
  { car: "BMW X5", service: "Оклейка PPF" },
  { car: "Kia Ceed", service: "Установка Bi-LED" },
  { car: "Zeekr 001", service: "Керамика" },
  { car: "Toyota Camry", service: "Тонировка" },
  { car: "Haval Jolion", service: "Русификация" },
];

for (const ls of LIVE_STATUS_DATA) {
  db.insert(liveStatus).values(ls).run();
}
console.log(`Live status: ${LIVE_STATUS_DATA.length}`);

// ── 11. Social Proof ──

const SOCIAL_PROOF_DATA = [
  { name: "Ильнар", car: "BMW X5", service: "оклейку PPF", minutesAgo: 12 },
  { name: "Артём", car: "Kia Ceed", service: "установку Bi-LED линз", minutesAgo: 23 },
  { name: "Марат", car: "Zeekr 001", service: "керамику", minutesAgo: 34 },
  { name: "Алексей", car: "Toyota Camry", service: "тонировку", minutesAgo: 45 },
  { name: "Дамир", car: "VW Polo", service: "полировку фар", minutesAgo: 8 },
  { name: "Руслан", car: "Hyundai Creta", service: "шумоизоляцию", minutesAgo: 55 },
  { name: "Тимур", car: "Haval Jolion", service: "русификацию", minutesAgo: 18 },
  { name: "Ренат", car: "Lada Vesta", service: "полировку стёкол", minutesAgo: 29 },
  { name: "Эдуард", car: "Skoda Rapid", service: "химчистку", minutesAgo: 41 },
  { name: "Айрат", car: "Porsche Cayenne", service: "антихром Full Black", minutesAgo: 7 },
  { name: "Вадим", car: "Mercedes C-Class", service: "полировку + керамику", minutesAgo: 33 },
  { name: "Олег", car: "Chery Tiggo 7", service: "русификацию + тонировку", minutesAgo: 52 },
  { name: "Денис", car: "Ford Focus", service: "регулировку фар", minutesAgo: 15 },
  { name: "Рамиль", car: "Geely Monjaro", service: "антидождь", minutesAgo: 27 },
  { name: "Фарид", car: "Exeed VX", service: "полную оклейку", minutesAgo: 44 },
];

for (const sp of SOCIAL_PROOF_DATA) {
  db.insert(socialProof).values(sp).run();
}
console.log(`Social proof: ${SOCIAL_PROOF_DATA.length}`);

// ── 12. Seasonal Offer ──

db.insert(seasonalOffer)
  .values({
    title: "Весенний детокс",
    description: "Химчистка + полировка + керамика — скидка 15%",
    discount: 15,
    promoCode: null,
    endDate: "2026-04-30T23:59:59",
    isActive: true,
  })
  .run();
console.log("Seasonal offer: 1");

// ── 13. Blog Posts ──

const BLOG_POSTS_DATA = [
  {
    slug: "kak-vybrat-ppf-plenku",
    title: "Как выбрать антигравийную плёнку: на что обратить внимание",
    excerpt: "Разбираемся в ключевых параметрах PPF-плёнок: толщина, самозатягивание, гарантия, цена. Что важно при выборе.",
    image: "/images/blog/ppf-guide.webp",
    category: "Защита кузова",
    date: "2026-02-15",
    isFeatured: true,
  },
  {
    slug: "zachem-nuzhna-keramika",
    title: "Зачем нужно керамическое покрытие и стоит ли оно своих денег",
    excerpt: "Разбираемся, что даёт керамика автомобилю и когда она действительно нужна.",
    image: "/images/blog/ceramic-guide.webp",
    category: "Полировка",
    date: "2026-02-10",
    isFeatured: false,
  },
  {
    slug: "bi-led-linzy-guide",
    title: "Установка Bi-LED линз: всё, что нужно знать",
    excerpt: "Какие модули выбрать, законно ли это и сколько стоит тюнинг фар в 2026 году.",
    image: "/images/blog/biled-guide.webp",
    category: "Тюнинг оптики",
    date: "2026-02-05",
    isFeatured: false,
  },
  {
    slug: "tonirovka-procenty",
    title: "Тонировка: какой процент выбрать и что говорит закон",
    excerpt: "Разбираем проценты светопропускания, штрафы и лучшие варианты для Казани.",
    image: "/images/blog/tint-guide.webp",
    category: "Тонировка",
    date: "2026-01-28",
    isFeatured: false,
  },
  {
    slug: "himchistka-salona-sovety",
    title: "Химчистка салона: как часто делать и зачем",
    excerpt: "Когда пора делать химчистку и почему это важно для здоровья и стоимости авто.",
    image: "/images/blog/cleaning-guide.webp",
    category: "Уход за салоном",
    date: "2026-01-20",
    isFeatured: false,
  },
  {
    slug: "shumoizolyaciya-mify",
    title: "5 мифов о шумоизоляции автомобиля",
    excerpt: "Провиснут ли двери, сколько весит шумка и стоит ли делать — развеиваем мифы.",
    image: "/images/blog/shumka-guide.webp",
    category: "Шумоизоляция",
    date: "2026-01-15",
    isFeatured: false,
  },
];

for (const bp of BLOG_POSTS_DATA) {
  db.insert(blogPosts).values(bp).run();
}
console.log(`Blog posts: ${BLOG_POSTS_DATA.length}`);

// ── 14. Reviews ──

const REVIEWS_DATA = [
  {
    author: "Ильнар М.",
    rating: 5,
    text: "Оклеили весь перёд антигравийной плёнкой. Прошло полгода — ни одного скола. Рекомендую.",
    car: "BMW X5",
  },
  {
    author: "Артём К.",
    rating: 5,
    text: "Установили Bi-LED линзы — разница колоссальная. Свет как на новом немце. Регулировка на стенде — не слепят.",
    car: "Kia Ceed",
  },
  {
    author: "Марат Ш.",
    rating: 5,
    text: "Керамика + полировка — машина как из салона. Через 3 месяца всё ещё гидрофоб работает идеально.",
    car: "Zeekr 001",
  },
  {
    author: "Руслан А.",
    rating: 5,
    text: "Шумоизоляция КОМФОРТ — в салоне стало реально тише. Двери закрываются с приятным звуком.",
    car: "Hyundai Creta",
  },
  {
    author: "Тимур Г.",
    rating: 5,
    text: "Русифицировали Haval Jolion за 2 часа. Всё работает, карты на месте. Спасибо!",
    car: "Haval Jolion",
  },
];

for (let i = 0; i < REVIEWS_DATA.length; i++) {
  db.insert(reviews)
    .values({ ...REVIEWS_DATA[i], isVisible: true, sortOrder: i })
    .run();
}
console.log(`Reviews: ${REVIEWS_DATA.length}`);

// ── 15. Team Members ──

const TEAM_DATA = [
  { name: "Руслан", role: "Основатель, мастер PPF", image: "/images/team-1.webp" },
  { name: "Марат", role: "Мастер полировки", image: "/images/team-2.webp" },
  { name: "Артём", role: "Электрика, Bi-LED", image: "/images/team-3.webp" },
  { name: "Дамир", role: "Шумоизоляция", image: "/images/team-4.webp" },
];

for (let i = 0; i < TEAM_DATA.length; i++) {
  db.insert(teamMembers).values({ ...TEAM_DATA[i], sortOrder: i }).run();
}
console.log(`Team members: ${TEAM_DATA.length}`);

// ── 16. Stats ──

const STATS_DATA = [
  { iconName: "ShieldCheck", value: "1200+", label: "Автомобилей обслужено" },
  { iconName: "Award", value: "5 лет", label: "Опыт работы" },
  { iconName: "Users", value: "97%", label: "Клиентов рекомендуют" },
  { iconName: "Camera", value: "100%", label: "Фотоотчёт каждой работы" },
];

for (let i = 0; i < STATS_DATA.length; i++) {
  db.insert(stats).values({ ...STATS_DATA[i], sortOrder: i }).run();
}
console.log(`Stats: ${STATS_DATA.length}`);

// ── 17. Portfolio works (standalone, not linked to a service) ──

const PORTFOLIO_DATA = [
  { slug: "lamborghini-urus-ppf", car: "Lamborghini Urus", serviceName: "PPF + Детейлинг", image: "/images/portfolio/IMG_4975.webp", tags: ["PPF", "Детейлинг"], gallery: ["/images/portfolio/gallery/lamborghini-urus-IMG_4972.webp", "/images/portfolio/gallery/lamborghini-urus-IMG_4973.webp", "/images/portfolio/gallery/lamborghini-urus-IMG_4974.webp"] },
  { slug: "rolls-royce-cullinan-ppf", car: "Rolls-Royce Cullinan", serviceName: "Оклейка PPF", image: "/images/portfolio/gallery/rolls-royce-IMG_3865.webp", tags: ["PPF", "Премиум"], gallery: ["/images/portfolio/IMG_3857.webp", "/images/portfolio/gallery/rolls-royce-IMG_3858.webp", "/images/portfolio/gallery/rolls-royce-IMG_3861.webp"] },
  { slug: "porsche-cayenne-polish", car: "Porsche Cayenne", serviceName: "Полировка + Керамика", image: "/images/portfolio/IMG_4450.webp", tags: ["Полировка", "Керамика"], gallery: ["/images/portfolio/gallery/porsche-cayenne-IMG_4453.webp", "/images/portfolio/gallery/porsche-cayenne-IMG_4455.webp", "/images/portfolio/gallery/porsche-cayenne-IMG_4458.webp"] },
  { slug: "bmw-420d-detailing", car: "BMW 420d", serviceName: "Комплексный детейлинг", image: "/images/portfolio/IMG_0941.webp", tags: ["Полировка", "Детейлинг"], gallery: ["/images/portfolio/gallery/bmw-420d-IMG_0942.webp", "/images/portfolio/gallery/bmw-420d-IMG_0943.webp", "/images/portfolio/gallery/bmw-420d-IMG_0950.webp"] },
  { slug: "mercedes-gla-polish", car: "Mercedes-Benz GLA", serviceName: "Полировка кузова", image: "/images/portfolio/IMG_8627.webp", tags: ["Полировка"], gallery: ["/images/portfolio/gallery/mercedes-gla-IMG_8630.webp", "/images/portfolio/gallery/mercedes-gla-IMG_8631.webp", "/images/portfolio/gallery/mercedes-gla-IMG_8636.webp"] },
  { slug: "porsche-cayenne-coupe-ppf", car: "Porsche Cayenne Coupe", serviceName: "PPF + Керамика", image: "/images/portfolio/IMG_9045.webp", tags: ["PPF", "Керамика"], gallery: ["/images/portfolio/gallery/porsche-coupe-IMG_9041.webp", "/images/portfolio/gallery/porsche-coupe-IMG_9042.webp", "/images/portfolio/gallery/porsche-coupe-IMG_9050.webp"] },
  { slug: "toyota-camry-toning", car: "Toyota Camry", serviceName: "Полировка + Тонировка", image: "/images/portfolio/IMG_6322.webp", tags: ["Полировка", "Тонировка"], gallery: ["/images/portfolio/gallery/toyota-camry-IMG_6323.webp", "/images/portfolio/gallery/toyota-camry-IMG_6324.webp", "/images/portfolio/gallery/toyota-camry-IMG_6325.webp"] },
  { slug: "audi-detailing", car: "Audi", serviceName: "PPF + Детейлинг", image: "/images/portfolio/IMG_4705.webp", tags: ["PPF", "Детейлинг"], gallery: ["/images/portfolio/gallery/audi-IMG_4706.webp", "/images/portfolio/gallery/audi-IMG_4707.webp", "/images/portfolio/gallery/audi-IMG_4710.webp"] },
  { slug: "bmw-x5-ppf", car: "BMW X5", serviceName: "Полная оклейка PPF", image: "/images/portfolio/IMG_3910.webp", tags: ["PPF"], gallery: ["/images/portfolio/gallery/bmw-x5-IMG_3882.webp", "/images/portfolio/gallery/bmw-x5-IMG_3885.webp", "/images/portfolio/gallery/bmw-x5-IMG_3890.webp"] },
  { slug: "mercedes-interior", car: "Mercedes-Benz", serviceName: "Химчистка салона", image: "/images/portfolio/IMG_5122.webp", tags: ["Химчистка"], gallery: ["/images/portfolio/gallery/mercedes-interior-IMG_5123.webp", "/images/portfolio/gallery/mercedes-interior-IMG_5124.webp", "/images/portfolio/gallery/mercedes-interior-IMG_5130.webp"] },
  { slug: "ppf-process-hands", car: "Процесс оклейки", serviceName: "Оклейка PPF", image: "/images/portfolio/IMG_4694.webp", tags: ["PPF", "Процесс"], gallery: ["/images/portfolio/gallery/ppf-hands-IMG_4690.webp", "/images/portfolio/gallery/ppf-hands-IMG_4691.webp", "/images/portfolio/gallery/ppf-hands-IMG_4693.webp"] },
  { slug: "ppf-process-master", car: "Процесс работы", serviceName: "Оклейка PPF", image: "/images/portfolio/IMG_3893.webp", tags: ["PPF", "Процесс"], gallery: ["/images/portfolio/gallery/ppf-master-IMG_3884.webp", "/images/portfolio/gallery/ppf-master-IMG_3886.webp", "/images/portfolio/gallery/ppf-master-IMG_3888.webp"] },
];

let portfolioWorksCount = 0;
let portfolioTagsCount = 0;
let portfolioImagesCount = 0;

for (let i = 0; i < PORTFOLIO_DATA.length; i++) {
  const p = PORTFOLIO_DATA[i];
  const pWorkRows = db
    .insert(works)
    .values({
      serviceId: null,
      slug: p.slug,
      car: p.car,
      serviceName: p.serviceName,
      image: p.image,
      sortOrder: 1000 + i, // offset so they sort after service works
    })
    .returning({ id: works.id })
    .all();

  for (const tag of p.tags) {
    db.insert(workTags).values({ workId: pWorkRows[0].id, tag }).run();
    portfolioTagsCount++;
  }
  if (p.gallery) {
    for (let gi = 0; gi < p.gallery.length; gi++) {
      db.insert(workImages).values({ workId: pWorkRows[0].id, image: p.gallery[gi], sortOrder: gi }).run();
      portfolioImagesCount++;
    }
  }
  portfolioWorksCount++;
}
console.log(`Portfolio works: ${portfolioWorksCount}`);
console.log(`Portfolio work tags: ${portfolioTagsCount}`);
console.log(`Portfolio work images: ${portfolioImagesCount}`);

// ── Done ──

console.log("\nSeeding complete!");
