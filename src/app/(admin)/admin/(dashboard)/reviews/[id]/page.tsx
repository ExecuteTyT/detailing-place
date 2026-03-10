"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/app/(admin)/admin/_components/FormField";
import FormActions from "@/app/(admin)/admin/_components/FormActions";

export default function ReviewEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    author: "",
    rating: 5,
    text: "",
    car: "",
    date: "",
    isVisible: true,
    sortOrder: 0,
  });

  useEffect(() => {
    async function fetchReview() {
      try {
        const res = await fetch(`/api/admin/reviews/${id}`);
        if (!res.ok) {
          setError("Отзыв не найден");
          return;
        }
        const data = await res.json();
        setForm({
          author: data.author || "",
          rating: data.rating || 5,
          text: data.text || "",
          car: data.car || "",
          date: data.date || "",
          isVisible: data.isVisible ?? true,
          sortOrder: data.sortOrder || 0,
        });
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    }
    fetchReview();
  }, [id]);

  function updateField(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.author || !form.text) {
      setError("Заполните обязательные поля: автор, текст");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: form.author,
          rating: form.rating,
          text: form.text,
          car: form.car || null,
          date: form.date || null,
          isVisible: form.isVisible,
          sortOrder: form.sortOrder,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка сохранения");
        return;
      }

      router.push("/admin/reviews");
    } catch {
      setError("Ошибка сети");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-[#333333] text-[#F5F5F5] text-sm focus:border-[#00F0FF] focus:outline-none transition-colors";

  if (loading) {
    return (
      <div>
        <div className="text-center py-12 text-[#A0A0A0]">Загрузка...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/reviews")}
            className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors text-sm"
          >
            &larr; Назад
          </button>
          <h1 className="text-2xl font-bold text-[#F5F5F5]">
            Редактировать отзыв
          </h1>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#FF4444]/10 border border-[#FF4444]/30 text-[#FF4444] text-sm">
            {error}
          </div>
        )}

        <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 space-y-5">
          <FormField label="Автор *">
            <input
              type="text"
              value={form.author}
              onChange={(e) => updateField("author", e.target.value)}
              placeholder="Имя автора"
              className={inputClass}
            />
          </FormField>

          <FormField label="Рейтинг *">
            <select
              value={form.rating}
              onChange={(e) => updateField("rating", Number(e.target.value))}
              className={inputClass}
            >
              {[5, 4, 3, 2, 1].map((v) => (
                <option key={v} value={v}>
                  {v} {v === 1 ? "звезда" : v < 5 ? "звезды" : "звёзд"}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Текст отзыва *">
            <textarea
              value={form.text}
              onChange={(e) => updateField("text", e.target.value)}
              placeholder="Текст отзыва..."
              rows={5}
              className={inputClass}
            />
          </FormField>

          <FormField label="Автомобиль">
            <input
              type="text"
              value={form.car}
              onChange={(e) => updateField("car", e.target.value)}
              placeholder="BMW X5"
              className={inputClass}
            />
          </FormField>

          <FormField label="Дата">
            <input
              type="date"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
              className={inputClass}
            />
          </FormField>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isVisible"
              checked={form.isVisible}
              onChange={(e) => updateField("isVisible", e.target.checked)}
              className="w-4 h-4 rounded border-[#333333] bg-[#252525] accent-[#CCFF00]"
            />
            <label htmlFor="isVisible" className="text-sm text-[#A0A0A0]">
              Видим на сайте
            </label>
          </div>

          <FormField label="Порядок сортировки">
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => updateField("sortOrder", Number(e.target.value))}
              className={inputClass}
            />
          </FormField>

          <FormActions
            onSave={handleSave}
            onCancel={() => router.push("/admin/reviews")}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
}
