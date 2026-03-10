import Link from "next/link";
import { db } from "@/lib/db";
import { services, blogPosts, reviews, works } from "@/lib/db/schema";
import { count } from "drizzle-orm";

const statCards = [
  { label: "Услуги", href: "/admin/services", key: "services" },
  { label: "Блог", href: "/admin/blog", key: "blog" },
  { label: "Отзывы", href: "/admin/reviews", key: "reviews" },
  { label: "Портфолио", href: "/admin/portfolio", key: "portfolio" },
] as const;

const quickActions = [
  { label: "Добавить услугу", href: "/admin/services/new" },
  { label: "Написать статью", href: "/admin/blog/new" },
  { label: "Добавить отзыв", href: "/admin/reviews/new" },
  { label: "Добавить работу", href: "/admin/portfolio/new" },
];

export default async function AdminDashboardPage() {
  const [servicesCount, blogCount, reviewsCount, portfolioCount] =
    await Promise.all([
      db.select({ value: count() }).from(services).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(blogPosts).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(reviews).then((r) => r[0]?.value ?? 0),
      db.select({ value: count() }).from(works).then((r) => r[0]?.value ?? 0),
    ]);

  const counts: Record<string, number> = {
    services: servicesCount,
    blog: blogCount,
    reviews: reviewsCount,
    portfolio: portfolioCount,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#F5F5F5] mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="bg-[#1A1A1A] rounded-xl border border-[#333333] p-6 hover:border-[#555555] transition-colors group"
          >
            <p className="text-3xl font-bold text-[#CCFF00]">{counts[card.key]}</p>
            <p className="text-[#A0A0A0] mt-1 group-hover:text-[#F5F5F5] transition-colors">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4">
        Быстрые действия
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-[#1A1A1A] rounded-xl border border-[#333333] px-5 py-4 text-sm font-medium text-[#A0A0A0] hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors"
          >
            + {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
