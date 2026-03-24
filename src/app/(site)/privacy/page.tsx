import type { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Политика конфиденциальности | Detailing Place",
  description: "Политика конфиденциальности и обработки персональных данных Detailing Place.",
  openGraph: {
    title: "Политика конфиденциальности | Detailing Place",
    description: "Политика конфиденциальности и обработки персональных данных Detailing Place.",
    url: "https://dpkzn.ru/privacy",
  },
  alternates: { canonical: "https://dpkzn.ru/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="section-padding">
      <div className="container-main max-w-3xl">
        <Breadcrumbs items={[{ label: "Политика конфиденциальности" }]} className="mb-6" />
        <h1 className="text-2xl md:text-3xl font-extrabold font-display text-text">
          Политика конфиденциальности
        </h1>

        <div className="mt-8 prose prose-invert prose-sm md:prose-base max-w-none prose-headings:font-display prose-p:text-text-secondary">
          <h2>1. Общие положения</h2>
          <p>
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты
            персональных данных пользователей сайта dpkzn.ru (далее — Сайт),
            управляемого ИП ________ (далее — Оператор).
          </p>
          <p>
            Оставляя свои данные на Сайте, Пользователь соглашается с условиями данной Политики.
          </p>

          <h2>2. Собираемые данные</h2>
          <p>Оператор собирает следующие данные:</p>
          <ul>
            <li>Номер телефона</li>
            <li>Имя (при указании)</li>
            <li>Марка и класс автомобиля (при указании)</li>
            <li>Данные об источнике перехода (UTM-метки)</li>
          </ul>

          <h2>3. Цели обработки</h2>
          <p>Персональные данные используются для:</p>
          <ul>
            <li>Обратной связи с пользователем</li>
            <li>Расчёта стоимости услуг</li>
            <li>Информирования об акциях и спецпредложениях</li>
          </ul>

          <h2>4. Защита данных</h2>
          <p>
            Оператор принимает необходимые организационные и технические меры для защиты
            персональных данных в соответствии с Федеральным законом №152-ФЗ «О персональных данных».
          </p>

          <h2>5. Права пользователя</h2>
          <p>
            Пользователь вправе запросить удаление своих персональных данных, направив запрос
            по телефону или через WhatsApp.
          </p>

          <h2>6. Срок действия</h2>
          <p>
            Политика действует бессрочно до замены новой версией. Актуальная версия размещена на данной странице.
          </p>
        </div>
      </div>
    </section>
  );
}
