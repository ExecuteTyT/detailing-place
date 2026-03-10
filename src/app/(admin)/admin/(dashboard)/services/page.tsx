import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";

export default async function ServicesPage() {
  const rows = db
    .select({
      id: services.id,
      slug: services.slug,
      title: services.title,
      isActive: services.isActive,
      sortOrder: services.sortOrder,
      showOnHomepage: services.showOnHomepage,
    })
    .from(services)
    .orderBy(asc(services.sortOrder))
    .all();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Услуги</h1>
        <Link
          href="/admin/services/new"
          className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-[#0E0E0E] text-sm font-semibold hover:bg-[#b8e600] transition-colors"
        >
          Добавить
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#333333]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#252525]">
              <th className="text-left px-4 py-3 text-[#A0A0A0] font-medium border-b border-[#333333]">
                Название
              </th>
              <th className="text-left px-4 py-3 text-[#A0A0A0] font-medium border-b border-[#333333]">
                Slug
              </th>
              <th className="text-left px-4 py-3 text-[#A0A0A0] font-medium border-b border-[#333333]">
                Активна
              </th>
              <th className="text-left px-4 py-3 text-[#A0A0A0] font-medium border-b border-[#333333]">
                На главной
              </th>
              <th className="text-right px-4 py-3 text-[#A0A0A0] font-medium border-b border-[#333333]">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-[#A0A0A0]"
                >
                  Нет услуг
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-[#333333] last:border-b-0 hover:bg-[#252525]/50 transition-colors"
                >
                  <td className="px-4 py-3 text-[#F5F5F5] font-medium">
                    {row.title}
                  </td>
                  <td className="px-4 py-3 text-[#A0A0A0] font-mono text-xs">
                    {row.slug}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.isActive
                          ? "bg-[#00F0FF]/10 text-[#00F0FF]"
                          : "bg-[#FF4444]/10 text-[#FF4444]"
                      }`}
                    >
                      {row.isActive ? "Да" : "Нет"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        row.showOnHomepage
                          ? "bg-[#CCFF00]/10 text-[#CCFF00]"
                          : "bg-[#333333] text-[#A0A0A0]"
                      }`}
                    >
                      {row.showOnHomepage ? "Да" : "Нет"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/services/${row.id}`}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#333333] text-[#00F0FF] hover:bg-[#252525] transition-colors"
                    >
                      Изменить
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
