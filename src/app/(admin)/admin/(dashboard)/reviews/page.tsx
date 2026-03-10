"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/app/(admin)/admin/_components/DataTable";
import ConfirmDialog from "@/app/(admin)/admin/_components/ConfirmDialog";

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  car: string | null;
  date: string | null;
  isVisible: boolean;
  sortOrder: number;
  [key: string]: unknown;
}

export default function ReviewsListPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(data);
    } catch {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/reviews/${deleteTarget.id}`, {
        method: "DELETE",
      });
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      console.error("Failed to delete review");
    } finally {
      setDeleting(false);
    }
  }

  function renderStars(rating: number) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-[#CCFF00]" : "text-[#333333]"}
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  }

  const columns = [
    { key: "author", label: "Автор" },
    {
      key: "rating",
      label: "Рейтинг",
      render: (item: Review) => renderStars(item.rating),
    },
    {
      key: "car",
      label: "Автомобиль",
      render: (item: Review) => (
        <span className="text-[#A0A0A0]">{item.car || "—"}</span>
      ),
    },
    {
      key: "isVisible",
      label: "Видимость",
      render: (item: Review) =>
        item.isVisible ? (
          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-[#CCFF00]/20 text-[#CCFF00]">
            Видим
          </span>
        ) : (
          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-[#FF4444]/20 text-[#FF4444]">
            Скрыт
          </span>
        ),
    },
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#F5F5F5]">Отзывы</h1>
          <button
            onClick={() => router.push("/admin/reviews/new")}
            className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-[#0E0E0E] text-sm font-semibold hover:bg-[#b8e600] transition-colors"
          >
            Добавить отзыв
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#A0A0A0]">Загрузка...</div>
        ) : (
          <DataTable
            columns={columns}
            data={reviews}
            onEdit={(item) => router.push(`/admin/reviews/${item.id}`)}
            onDelete={(item) => setDeleteTarget(item)}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Удалить отзыв"
        message={`Вы уверены, что хотите удалить отзыв от "${deleteTarget?.author}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
