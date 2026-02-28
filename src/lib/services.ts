// ===== INTERFACES =====

export interface ServicePackage {
  name: string;
  description: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  duration?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface CrossSell {
  title: string;
  description: string;
  href: string;
  discount?: string;
}

export interface WorkExample {
  image: string;
  car: string;
  tags: string[];
}

export interface ServiceData {
  slug: string;
  url: string;
  title: string;
  h1: string;
  subtitle: string;
  badge?: string;
  keywords: string[];
  packages: ServicePackage[];
  process: ProcessStep[];
  faq: FAQItem[];
  crossSell?: CrossSell;
  beforeAfter?: {
    before: string;
    after: string;
    beforeLabel: string;
    afterLabel: string;
  };
  works: WorkExample[];
  seoText: string;
  hasBeforeAfter: boolean;
  uniqueBlock?: string; // "PhotoComparison" | "CarBrandGrid" | "BrandsGrid"
}

// ===== SERVICE DATA =====

const services: ServiceData[] = [
  // 1. PPF
  {
    slug: "ppf",
    url: "/ppf",
    title: "Антигравийная плёнка на авто в Казани — цены, оклейка кузова | Detailing Place",
    h1: "Антигравийная плёнка на автомобиль в Казани",
    subtitle: "Полиуретановая защита кузова от сколов, царапин и реагентов. Режем лекала на плоттере — без ножей на кузове",
    badge: "Режем на плоттере. Без ножей на кузове",
    keywords: ["антигравийная плёнка казань", "оклейка плёнкой казань", "защита кузова плёнкой", "ppf казань цена", "бронирование кузова казань"],
    packages: [
      {
        name: "ЗОНЫ РИСКА",
        description: "Капот+бампер+зеркала+фары",
        price: "от 45 000₽",
        features: ["Защита уязвимых зон", "LLumar/SunTek", "Гарантия 5 лет"],
      },
      {
        name: "ФРОНТ",
        description: "Полный перёд",
        price: "от 85 000₽",
        features: ["Капот+бампер+крылья+фары+зеркала+стойки", "Плоттерная нарезка", "Заводка за края", "Гарантия 7 лет"],
        isPopular: true,
      },
      {
        name: "ПОЛНАЯ ОКЛЕЙКА",
        description: "Весь кузов",
        price: "от 150 000₽",
        features: ["100% кузова", "Самозатягивание царапин", "Гарантия 10 лет"],
      },
    ],
    process: [
      { title: "Приёмка", description: "Осмотр, замер толщины ЛКП, фиксация дефектов" },
      { title: "Подготовка", description: "Мойка, деконтаминация, сушка" },
      { title: "Раскрой", description: "Нарезка лекал на плоттере, без ножей на кузове" },
      { title: "Оклейка", description: "Нанесение с прогревом и выгонкой воды, заводка за края" },
      { title: "Контроль", description: "Осмотр под малярным светом, фотоотчёт" },
    ],
    faq: [
      { question: "Порежете ли вы лак ножом?", answer: "Нет. Режем на плоттере заранее. Нож не касается кузова." },
      { question: "Какую плёнку используете?", answer: "LLumar PPF, SunTek PPF — самозатягивание царапин." },
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
      before: "/images/ppf-before.jpg",
      after: "/images/ppf-after.jpg",
      beforeLabel: "47 сколов на бампере BMW",
      afterLabel: "После оклейки PPF LLumar",
    },
    works: [
      { image: "/images/works/ppf-1.jpg", car: "BMW X5", tags: ["PPF", "Полная оклейка"] },
      { image: "/images/works/ppf-2.jpg", car: "Mercedes GLE", tags: ["PPF", "Фронт"] },
      { image: "/images/works/ppf-3.jpg", car: "Porsche Cayenne", tags: ["PPF", "Зоны риска"] },
    ],
    seoText: "<h2>Антигравийная плёнка (PPF) в Казани</h2><p>Защитная антигравийная плёнка — это полиуретановое покрытие толщиной 150-200 микрон, которое защищает лакокрасочное покрытие автомобиля от сколов, царапин, песка и химических реагентов. В студии Detailing Place мы используем премиальные плёнки LLumar и SunTek с функцией самозатягивания мелких царапин.</p><p>Все лекала нарезаются на плоттере — нож не касается кузова вашего автомобиля. Это исключает риск повреждения заводского ЛКП. Гарантия на работы — от 5 до 10 лет в зависимости от выбранного пакета.</p>",
    hasBeforeAfter: true,
  },

  // 2. Полировка
  {
    slug: "polirovka",
    url: "/polirovka",
    title: "Полировка кузова и керамическое покрытие в Казани | Detailing Place",
    h1: "Полировка автомобиля и керамическое покрытие в Казани",
    subtitle: "Восстановительная полировка убирает царапины и «паутинку». Керамика защищает блеск на 1-3 года",
    badge: "Замеряем толщину ЛКП до и после",
    keywords: ["полировка авто казань", "керамическое покрытие казань", "полировка с керамикой казань"],
    packages: [
      {
        name: "REFRESH",
        description: "Мягкая полировка + кварц. Для новых авто",
        price: "от 15 000₽",
        features: ["Мягкая полировка", "Кварцевое покрытие", "Защита 6 мес"],
        duration: "6 мес",
      },
      {
        name: "MIRROR",
        description: "Восстановительная 2 этапа + керамика 2 слоя + гидрофоб",
        price: "от 35 000₽",
        features: ["Восстановительная полировка 2 этапа", "Керамика 2 слоя", "Гидрофоб", "Защита 12-18 мес"],
        isPopular: true,
        duration: "12-18 мес",
      },
      {
        name: "EXHIBITION",
        description: "Детейлинг-полировка + 9H 4 слоя + антидождь + диски",
        price: "от 60 000₽",
        features: ["Детейлинг-полировка", "Керамика 9H 4 слоя", "Антидождь", "Керамика на диски", "Защита до 3 лет"],
        duration: "до 3 лет",
      },
    ],
    process: [
      { title: "Замер", description: "Толщиномер по всем деталям" },
      { title: "Подготовка", description: "Мойка, деконтаминация, оклейка маскировочной лентой" },
      { title: "Полировка", description: "Грубая → финишная, свет Scangrip" },
      { title: "Керамика", description: "Нанесение 2-4 слоёв керамики" },
      { title: "Контроль", description: "Глосс-метр, фотоотчёт" },
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
      before: "/images/polirovka-before.jpg",
      after: "/images/polirovka-after.jpg",
      beforeLabel: "Паутинка царапин",
      afterLabel: "Зеркальный глянец",
    },
    works: [
      { image: "/images/works/polish-1.jpg", car: "Mercedes C-Class", tags: ["Полировка", "Керамика"] },
      { image: "/images/works/polish-2.jpg", car: "BMW 5 Series", tags: ["EXHIBITION", "9H"] },
    ],
    seoText: "<h2>Полировка кузова в Казани</h2><p>Восстановительная полировка кузова автомобиля устраняет мелкие царапины, «паутинку» и потёртости, возвращая лакокрасочному покрытию заводской блеск. Керамическое покрытие создаёт защитный слой, который отталкивает грязь и воду на протяжении 1-3 лет.</p>",
    hasBeforeAfter: true,
  },

  // 3. Химчистка
  {
    slug: "himchistka",
    url: "/himchistka",
    title: "Химчистка салона автомобиля в Казани — цены | Detailing Place",
    h1: "Химчистка салона автомобиля в Казани",
    subtitle: "Глубокая очистка кожи, текстиля и пластика. Гипоаллергенно",
    badge: "Сушка за 4 часа. Выдаём сухой автомобиль",
    keywords: ["химчистка салона казань", "химчистка авто казань", "чистка салона автомобиля"],
    packages: [
      {
        name: "LIGHT",
        description: "Пылесос + влажная уборка + стёкла",
        price: "от 5 000₽",
        features: ["Пылесос", "Влажная уборка", "Мойка стёкол"],
      },
      {
        name: "STANDARD",
        description: "Полная химчистка + кондиционер кожи + озонация",
        price: "от 12 000₽",
        features: ["Полная химчистка", "Кондиционер кожи", "Озонация салона"],
        isPopular: true,
      },
      {
        name: "DETOX",
        description: "+ демонтаж сидений + потолок + багажник",
        price: "от 20 000₽",
        features: ["Демонтаж сидений", "Чистка потолка", "Чистка багажника", "Полная химчистка", "Озонация"],
      },
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
      before: "/images/himchistka-before.jpg",
      after: "/images/himchistka-after.jpg",
      beforeLabel: "Грязный салон",
      afterLabel: "После химчистки DETOX",
    },
    works: [
      { image: "/images/works/himchistka-1.jpg", car: "Toyota Camry", tags: ["Химчистка", "STANDARD"] },
    ],
    seoText: "<h2>Химчистка салона в Казани</h2><p>Профессиональная химчистка салона автомобиля с применением гипоаллергенных составов Koch Chemie. Глубокая очистка кожаных и текстильных поверхностей, пластиковых элементов. Выдаём полностью сухой автомобиль в день обращения.</p>",
    hasBeforeAfter: true,
  },

  // 4. Шумоизоляция
  {
    slug: "shumoizolyaciya",
    url: "/shumoizolyaciya",
    title: "Шумоизоляция автомобиля в Казани — цены и материалы | Detailing Place",
    h1: "Шумоизоляция автомобиля в Казани",
    subtitle: "Снижаем шум до 70%. Comfort Mat / STP. Гарантия от скрипов",
    badge: "Вес: всего +40 кг (один пассажир)",
    keywords: ["шумоизоляция авто казань", "шумка казань", "шумоизоляция автомобиля цена"],
    packages: [
      {
        name: "АРКИ",
        description: "Колёсные арки",
        price: "от 8 000₽",
        features: ["Виброизоляция арок", "Шумопоглотитель", "Антискрип"],
      },
      {
        name: "КОМФОРТ",
        description: "Арки + двери + пол",
        price: "от 35 000₽",
        features: ["Арки", "4 двери", "Пол", "Comfort Mat / STP"],
        isPopular: true,
      },
      {
        name: "МАКСИМУМ",
        description: "Арки + двери + пол + крыша + торпедо",
        price: "от 60 000₽",
        features: ["Полная шумоизоляция", "Арки + двери + пол + крыша + торпедо", "Comfort Mat / STP", "Антискрип"],
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
  },

  // 5. Антихром
  {
    slug: "antihrom",
    url: "/antihrom",
    title: "Антихром в Казани — покраска и оклейка хрома в чёрный | Detailing Place",
    h1: "Антихром в Казани — убираем хром, добавляем характер",
    subtitle: "Покраска и оклейка хромированных элементов в чёрный или любой другой цвет",
    badge: undefined,
    keywords: ["антихром казань", "покраска хрома казань", "оклейка хрома в чёрный"],
    packages: [
      {
        name: "МОЛДИНГИ",
        description: "Оконные молдинги + рейлинги",
        price: "от 10 000₽",
        features: ["Оконные молдинги", "Рейлинги", "Оклейка или покраска"],
      },
      {
        name: "FULL BLACK",
        description: "Решётка + молдинги + шильдики + насадки",
        price: "от 25 000₽",
        features: ["Решётка радиатора", "Молдинги", "Шильдики", "Насадки глушителя"],
        isPopular: true,
      },
      {
        name: "CUSTOM",
        description: "Любые элементы + выбор финиша",
        price: "от 30 000₽",
        features: ["Любые хромированные элементы", "Выбор финиша (глянец/мат/сатин)", "Индивидуальный проект"],
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
      before: "/images/antihrom-before.jpg",
      after: "/images/antihrom-after.jpg",
      beforeLabel: "Хромированные элементы",
      afterLabel: "Full Black пакет",
    },
    works: [
      { image: "/images/works/antihrom-1.jpg", car: "BMW X3", tags: ["Антихром", "Full Black"] },
    ],
    seoText: "<h2>Антихром в Казани</h2><p>Убираем хромированные элементы и заменяем их на стильный чёрный или любой другой цвет. Покраска или оклейка — на выбор.</p>",
    hasBeforeAfter: true,
  },

  // 6. Тонировка
  {
    slug: "tonirovka",
    url: "/tonirovka",
    title: "Тонировка автомобиля в Казани — цены, плёнки США | Detailing Place",
    h1: "Тонировка автомобиля в Казани",
    subtitle: "Тонировочные плёнки из США. Защита от солнца и посторонних глаз",
    badge: undefined,
    keywords: ["тонировка казань", "тонировка авто казань", "тонировка стёкол казань"],
    packages: [
      {
        name: "ЗАДНИЙ ПОЛУКРУГ",
        description: "5 стёкол",
        price: "от 6 000₽",
        features: ["5 задних стёкол", "Плёнки США", "Гарантия"],
      },
      {
        name: "ПОЛНЫЙ КРУГ",
        description: "Все стёкла + атермальная на лобовое",
        price: "от 15 000₽",
        features: ["Все стёкла", "Атермальная на лобовое", "Плёнки США"],
        isPopular: true,
      },
      {
        name: "ХАМЕЛЕОН",
        description: "Атермальная хамелеон по ГОСТу",
        price: "от 20 000₽",
        features: ["Атермальная плёнка-хамелеон", "Соответствие ГОСТу", "Премиум качество"],
      },
    ],
    process: [
      { title: "Подготовка", description: "Мойка и очистка стёкол" },
      { title: "Раскрой", description: "Нарезка плёнки по лекалам" },
      { title: "Нанесение", description: "Тонировка с выгонкой воздуха" },
      { title: "Контроль", description: "Проверка качества, замер светопропускания" },
    ],
    faq: [
      { question: "Законна ли тонировка?", answer: "Задние стёкла — без ограничений. Лобовое и передние — атермальная по ГОСТу (70%+ светопропускание)." },
      { question: "Какие плёнки используете?", answer: "Премиальные плёнки из США с УФ-защитой." },
    ],
    crossSell: {
      title: "Антидождь со скидкой 10%",
      description: "Идеальная видимость в дождь",
      href: "/antidozhd",
      discount: "10%",
    },
    beforeAfter: {
      before: "/images/tonirovka-before.jpg",
      after: "/images/tonirovka-after.jpg",
      beforeLabel: "До тонировки",
      afterLabel: "После тонировки",
    },
    works: [
      { image: "/images/works/tonirovka-1.jpg", car: "Toyota Camry", tags: ["Тонировка", "Полный круг"] },
    ],
    seoText: "<h2>Тонировка авто в Казани</h2><p>Тонировка автомобиля премиальными плёнками из США. Защита от ультрафиолета, снижение нагрева салона, приватность.</p>",
    hasBeforeAfter: true,
    uniqueBlock: "PhotoComparison",
  },

  // 7. Установка Bi-LED линз
  {
    slug: "ustanovka-linz",
    url: "/ustanovka-linz",
    title: "Установка Bi-LED линз в фары в Казани — цены | Detailing Place",
    h1: "Установка Bi-LED линз в фары в Казани",
    subtitle: "Яркий свет как на премиуме. Aozoom, GTR, Hella. Регулировка на стенде",
    badge: "Настраиваем на стенде. Не слепим встречных",
    keywords: ["установка линз казань", "би лед линзы казань", "тюнинг фар казань"],
    packages: [
      {
        name: "МОДУЛЬ",
        description: "1 модуль в штатную фару",
        price: "от 10 000₽",
        features: ["1 Bi-LED модуль", "Установка в штатную фару", "Регулировка"],
      },
      {
        name: "КОМПЛЕКТ",
        description: "2 модуля + регулировка + полировка фар",
        price: "от 18 000₽",
        features: ["2 Bi-LED модуля", "Регулировка на стенде", "Полировка фар"],
        isPopular: true,
      },
      {
        name: "PREMIUM",
        description: "Hella/GTR + ангельские глазки + регулировка + полировка",
        price: "от 30 000₽",
        features: ["Hella или GTR Bio", "Ангельские глазки", "Регулировка на стенде", "Полировка фар"],
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
    beforeAfter: {
      before: "/images/linz-before.jpg",
      after: "/images/linz-after.jpg",
      beforeLabel: "Тусклый жёлтый галоген",
      afterLabel: "Яркий белый Bi-LED с чёткой границей",
    },
    works: [
      { image: "/images/works/linz-1.jpg", car: "Kia Ceed", tags: ["Bi-LED", "Комплект"] },
      { image: "/images/works/linz-2.jpg", car: "Hyundai Solaris", tags: ["Bi-LED", "Premium"] },
    ],
    seoText: "<h2>Установка Bi-LED линз в Казани</h2><p>Установка биледовых линз в штатные фары автомобиля. Используем модули Aozoom, GTR Bio, Hella. Обязательная регулировка на профессиональном стенде — не слепим встречных водителей.</p>",
    hasBeforeAfter: true,
    uniqueBlock: "CarBrandGrid",
  },

  // 8. Регулировка фар
  {
    slug: "regulirovka-far",
    url: "/regulirovka-far",
    title: "Регулировка фар в Казани — профессиональная настройка | Detailing Place",
    h1: "Регулировка фар в Казани — профессиональная настройка на стенде",
    subtitle: "Сертифицированный стенд регулировки. Правильный свет — ваша безопасность",
    badge: "Сертифицированный стенд регулировки",
    keywords: ["регулировка фар казань", "настройка фар казань", "регулировка света фар"],
    packages: [
      {
        name: "РЕГУЛИРОВКА",
        description: "Ближний/дальний на стенде",
        price: "от 1 500₽",
        features: ["Регулировка ближнего света", "Регулировка дальнего света", "Стенд"],
      },
      {
        name: "+ ПОЛИРОВКА",
        description: "Регулировка + полировка фар",
        price: "от 3 500₽",
        features: ["Регулировка ближнего/дальнего", "Полировка обеих фар", "Стенд"],
        isPopular: true,
      },
      {
        name: "КОМПЛЕКС",
        description: "Регулировка + полировка + антидождь",
        price: "от 5 000₽",
        features: ["Регулировка", "Полировка фар", "Антидождь на фары"],
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
  },

  // 9. Полировка стёкол
  {
    slug: "polirovka-stekol",
    url: "/polirovka-stekol",
    title: "Полировка стёкол автомобиля в Казани — цены | Detailing Place",
    h1: "Полировка стёкол автомобиля в Казани",
    subtitle: "Убираем затёртости и мелкие царапины. Дешевле замены стекла в 5-10 раз",
    badge: "Дешевле замены стекла в 5-10 раз",
    keywords: ["полировка стёкол казань", "полировка лобового стекла казань"],
    packages: [
      {
        name: "ЛОБОВОЕ",
        description: "Лобовое стекло",
        price: "от 3 000₽",
        features: ["Полировка лобового стекла", "Удаление затёртостей от дворников"],
      },
      {
        name: "ВСЕ СТЁКЛА",
        description: "Лобовое + боковые + заднее",
        price: "от 7 000₽",
        features: ["Лобовое стекло", "Боковые стёкла", "Заднее стекло"],
        isPopular: true,
      },
      {
        name: "СТЁКЛА + АНТИДОЖДЬ",
        description: "Полировка + гидрофоб",
        price: "от 9 000₽",
        features: ["Полировка всех стёкол", "Гидрофобное покрытие"],
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
    works: [],
    seoText: "<h2>Полировка стёкол в Казани</h2><p>Полировка лобового и боковых стёкол автомобиля. Убираем затёртости от дворников и мелкие царапины. Стоимость в 5-10 раз ниже замены стекла.</p>",
    hasBeforeAfter: false,
  },

  // 10. Полировка фар
  {
    slug: "polirovka-far",
    url: "/polirovka-far",
    title: "Полировка фар автомобиля в Казани — цены | Detailing Place",
    h1: "Полировка фар автомобиля в Казани",
    subtitle: "Возвращаем прозрачность помутневшим фарам",
    badge: undefined,
    keywords: ["полировка фар казань", "восстановление фар казань"],
    packages: [
      {
        name: "ПОЛИРОВКА",
        description: "2 фары",
        price: "от 2 000₽",
        features: ["Полировка 2 фар", "Удаление помутнения"],
      },
      {
        name: "+ ЗАЩИТА",
        description: "Полировка + лак",
        price: "от 3 500₽",
        features: ["Полировка 2 фар", "Защитный лак"],
        isPopular: true,
      },
      {
        name: "ФАРЫ + ЛИНЗЫ",
        description: "Полировка + Bi-LED",
        price: "от 12 000₽",
        features: ["Полировка фар", "Установка Bi-LED линз"],
      },
    ],
    process: [
      { title: "Оценка", description: "Степень помутнения" },
      { title: "Шлифовка", description: "Абразив P800-P3000" },
      { title: "Полировка", description: "Финишная полировальная паста" },
      { title: "Защита", description: "Нанесение защитного лака (опционально)" },
    ],
    faq: [
      { question: "Надолго ли хватает?", answer: "Без лака — 6-12 мес, с лаком — до 3 лет." },
      { question: "Подходит для всех фар?", answer: "Для пластиковых (поликарбонат). Стеклянные фары не мутнеют." },
    ],
    crossSell: {
      title: "Свет тусклый?",
      description: "Установите Bi-LED линзы для яркого света",
      href: "/ustanovka-linz",
    },
    beforeAfter: {
      before: "/images/far-before.jpg",
      after: "/images/far-after.jpg",
      beforeLabel: "Помутневшая фара",
      afterLabel: "После полировки + лак",
    },
    works: [],
    seoText: "<h2>Полировка фар в Казани</h2><p>Восстановление прозрачности помутневших фар автомобиля. Полировка и защита лаком для долговременного результата.</p>",
    hasBeforeAfter: true,
  },

  // 11. Антидождь
  {
    slug: "antidozhd",
    url: "/antidozhd",
    title: "Антидождь для автомобиля в Казани — цены | Detailing Place",
    h1: "Антидождь для автомобиля в Казани",
    subtitle: "Гидрофобное покрытие стёкол. Дождь скатывается на скорости от 60 км/ч",
    badge: "Держится 6-12 месяцев",
    keywords: ["антидождь казань", "гидрофоб для стёкол казань"],
    packages: [
      {
        name: "ЛОБОВОЕ",
        description: "Лобовое стекло",
        price: "от 1 500₽",
        features: ["Гидрофоб на лобовое стекло"],
      },
      {
        name: "ВСЕ СТЁКЛА",
        description: "Все стёкла + зеркала",
        price: "от 3 000₽",
        features: ["Все стёкла", "Боковые зеркала"],
        isPopular: true,
      },
      {
        name: "+ ПОЛИРОВКА",
        description: "Полировка стёкол + антидождь",
        price: "от 9 000₽",
        features: ["Полировка всех стёкол", "Гидрофобное покрытие"],
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
    works: [],
    seoText: "<h2>Антидождь в Казани</h2><p>Гидрофобное покрытие стёкол автомобиля. Вода и грязь скатываются со стекла на скорости от 60 км/ч. Улучшает видимость в дождь.</p>",
    hasBeforeAfter: false,
  },

  // 12. Русификация
  {
    slug: "rusifikaciya-avto",
    url: "/rusifikaciya-avto",
    title: "Русификация китайских автомобилей в Казани — цены | Detailing Place",
    h1: "Русификация китайских автомобилей в Казани",
    subtitle: "Русский язык, метрическая система, навигация. Без потери гарантии",
    badge: "Без потери гарантии",
    keywords: ["русификация авто казань", "русификация китайских авто", "русский язык в haval"],
    packages: [
      {
        name: "РУСИФИКАЦИЯ",
        description: "Русский язык + метрическая система",
        price: "от 5 000₽",
        features: ["Русский язык интерфейса", "Метрическая система"],
      },
      {
        name: "+ КАРТЫ",
        description: "Язык + навигация",
        price: "от 8 000₽",
        features: ["Русский язык", "Навигация с картами РФ"],
        isPopular: true,
      },
      {
        name: "ПОЛНАЯ АДАПТАЦИЯ",
        description: "Язык + карты + голос + обновление ПО",
        price: "от 12 000₽",
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
  },

  // 13. Ремонт вмятин PDR (SEO-заглушка)
  {
    slug: "remont-vmyatin",
    url: "/remont-vmyatin",
    title: "Ремонт вмятин без покраски в Казани (PDR) | Detailing Place",
    h1: "Ремонт вмятин без покраски в Казани (PDR)",
    subtitle: "Удаление вмятин с сохранением заводского ЛКП",
    badge: "Сохраняем заводское ЛКП",
    keywords: ["ремонт вмятин казань", "pdr казань", "удаление вмятин без покраски"],
    packages: [
      {
        name: "МЕЛКИЕ",
        description: "До 3 см",
        price: "от 2 000₽/шт",
        features: ["Вмятины до 3 см", "Без покраски", "Сохранение ЛКП"],
      },
      {
        name: "СРЕДНИЕ",
        description: "3-10 см",
        price: "от 5 000₽",
        features: ["Вмятины 3-10 см", "Без покраски", "Сохранение ЛКП"],
        isPopular: true,
      },
      {
        name: "ГРАДОВЫЕ",
        description: "Множественные от града",
        price: "от 15 000₽",
        features: ["Множественные вмятины", "Устранение последствий града", "Без покраски"],
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
  },
];

// ===== HELPERS =====

export function getService(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}

export function getAllServices(): ServiceData[] {
  return services;
}

// Homepage grid: main services (excluding PDR SEO placeholder)
export const HOMEPAGE_SERVICES = services
  .filter((s) => s.slug !== "remont-vmyatin")
  .map((s) => ({
    slug: s.slug,
    url: s.url,
    title: s.h1.replace(/ в Казани.*/, "").replace(/ — .*/, ""),
    tagline: s.subtitle.includes(". ") ? s.subtitle.split(". ")[0] : s.subtitle,
    price: s.packages[0]?.price || "",
    isNew: ["ustanovka-linz", "regulirovka-far", "polirovka-stekol", "polirovka-far", "antidozhd", "rusifikaciya-avto", "remont-vmyatin"].includes(s.slug),
  }));
