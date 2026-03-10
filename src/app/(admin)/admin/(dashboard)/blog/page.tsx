"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/app/(admin)/admin/_components/DataTable";
import ConfirmDialog from "@/app/(admin)/admin/_components/ConfirmDialog";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  isFeatured: boolean;
  image: string | null;
  [key: string]: unknown;
}

export default function BlogListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      setPosts(data);
    } catch {
      console.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/blog/${deleteTarget.id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      console.error("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    { key: "title", label: "Заголовок" },
    { key: "category", label: "Категория" },
    {
      key: "date",
      label: "Дата",
      render: (item: BlogPost) => (
        <span className="text-[#A0A0A0]">{item.date}</span>
      ),
    },
    {
      key: "isFeatured",
      label: "Избранное",
      render: (item: BlogPost) =>
        item.isFeatured ? (
          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-[#CCFF00]/20 text-[#CCFF00]">
            Featured
          </span>
        ) : (
          <span className="text-[#A0A0A0]">—</span>
        ),
    },
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#F5F5F5]">Блог</h1>
          <button
            onClick={() => router.push("/admin/blog/new")}
            className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-[#0E0E0E] text-sm font-semibold hover:bg-[#b8e600] transition-colors"
          >
            Добавить статью
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#A0A0A0]">Загрузка...</div>
        ) : (
          <DataTable
            columns={columns}
            data={posts}
            onEdit={(item) => router.push(`/admin/blog/${item.id}`)}
            onDelete={(item) => setDeleteTarget(item)}
          />
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Удалить статью"
        message={`Вы уверены, что хотите удалить "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
