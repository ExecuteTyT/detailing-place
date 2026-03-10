"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/app/(admin)/admin/_components/DataTable";
import ConfirmDialog from "@/app/(admin)/admin/_components/ConfirmDialog";

interface PortfolioItem {
  id: number;
  slug: string;
  car: string;
  serviceName: string | null;
  image: string;
  sortOrder: number;
  tags: Array<{ id: number; workId: number; tag: string }>;
  [key: string]: unknown;
}

export default function PortfolioListPage() {
  const router = useRouter();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch("/api/admin/portfolio");
      const data = await res.json();
      setItems(data);
    } catch {
      console.error("Failed to fetch portfolio");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/portfolio/${deleteTarget.id}`, {
        method: "DELETE",
      });
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      console.error("Failed to delete portfolio item");
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    { key: "car", label: "Автомобиль" },
    {
      key: "tags",
      label: "Теги",
      render: (item: PortfolioItem) => (
        <div className="flex flex-wrap gap-1">
          {item.tags?.map((t) => (
            <span
              key={t.id}
              className="inline-block px-2 py-0.5 text-xs rounded bg-[#252525] text-[#A0A0A0] border border-[#333333]"
            >
              {t.tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "image",
      label: "Изображение",
      render: (item: PortfolioItem) =>
        item.image ? (
          <img
            src={item.image}
            alt={item.car}
            className="w-16 h-12 object-cover rounded-lg border border-[#333333]"
          />
        ) : (
          <span className="text-[#A0A0A0]">—</span>
        ),
    },
    {
      key: "sortOrder",
      label: "Порядок",
      render: (item: PortfolioItem) => (
        <span className="text-[#A0A0A0]">{item.sortOrder}</span>
      ),
    },
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#F5F5F5]">Портфолио</h1>
          <button
            onClick={() => router.push("/admin/portfolio/new")}
            className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-[#0E0E0E] text-sm font-semibold hover:bg-[#b8e600] transition-colors"
          >
            Добавить работу
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#A0A0A0]">Загрузка...</div>
        ) : (
          <DataTable
            columns={columns}
            data={items}
            onEdit={(item) => router.push(`/admin/portfolio/${item.id}`)}
            onDelete={(item) => setDeleteTarget(item)}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Удалить работу"
        message={`Вы уверены, что хотите удалить "${deleteTarget?.car}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
