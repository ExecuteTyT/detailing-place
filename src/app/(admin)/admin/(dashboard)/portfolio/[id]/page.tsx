"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/app/(admin)/admin/_components/FormField";
import FormActions from "@/app/(admin)/admin/_components/FormActions";
import ImageUpload from "@/app/(admin)/admin/_components/ImageUpload";

export default function PortfolioEditPage({
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
    slug: "",
    car: "",
    serviceName: "",
    image: "",
    tags: "",
    sortOrder: 0,
  });

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`/api/admin/portfolio/${id}`);
        if (!res.ok) {
          setError("Работа не найдена");
          return;
        }
        const data = await res.json();
        setForm({
          slug: data.slug || "",
          car: data.car || "",
          serviceName: data.serviceName || "",
          image: data.image || "",
          tags: data.tags?.map((t: { tag: string }) => t.tag).join(", ") || "",
          sortOrder: data.sortOrder || 0,
        });
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  function updateField(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.slug || !form.car || !form.image) {
      setError("Заполните обязательные поля: slug, автомобиль, изображение");
      return;
    }

    setSaving(true);
    setError("");

    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug,
          car: form.car,
          serviceName: form.serviceName || null,
          image: form.image,
          tags: tagsArray,
          sortOrder: form.sortOrder,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка сохранения");
        return;
      }

      router.push("/admin/portfolio");
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
            onClick={() => router.push("/admin/portfolio")}
            className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors text-sm"
          >
            &larr; Назад
          </button>
          <h1 className="text-2xl font-bold text-[#F5F5F5]">
            Редактировать работу
          </h1>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#FF4444]/10 border border-[#FF4444]/30 text-[#FF4444] text-sm">
            {error}
          </div>
        )}

        <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 space-y-5">
          <FormField label="Slug *">
            <input
              type="text"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="bmw-x5-ppf"
              className={inputClass}
            />
          </FormField>

          <FormField label="Автомобиль *">
            <input
              type="text"
              value={form.car}
              onChange={(e) => updateField("car", e.target.value)}
              placeholder="BMW X5 G05"
              className={inputClass}
            />
          </FormField>

          <FormField label="Услуга">
            <input
              type="text"
              value={form.serviceName}
              onChange={(e) => updateField("serviceName", e.target.value)}
              placeholder="Оклейка PPF"
              className={inputClass}
            />
          </FormField>

          <ImageUpload
            label="Изображение *"
            value={form.image}
            onChange={(url) => updateField("image", url)}
            folder="portfolio"
          />

          <FormField label="Теги (через запятую)">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              placeholder="PPF, керамика, детейлинг"
              className={inputClass}
            />
          </FormField>

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
            onCancel={() => router.push("/admin/portfolio")}
            loading={saving}
          />
        </div>
      </div>
    </div>
  );
}
