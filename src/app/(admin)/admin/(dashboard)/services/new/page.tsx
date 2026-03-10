"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/app/(admin)/admin/_components/FormField";
import FormActions from "@/app/(admin)/admin/_components/FormActions";

const INPUT_CLS =
  "w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2.5 text-[#F5F5F5] text-sm focus:outline-none focus:border-[#00F0FF] transition-colors placeholder:text-[#A0A0A0]/50";
const CHECKBOX_CLS =
  "w-4 h-4 rounded border-[#333333] bg-[#252525] accent-[#00F0FF]";

interface ServiceForm {
  slug: string;
  title: string;
  h1: string;
  subtitle: string;
  badge: string;
  seoText: string;
  hasBeforeAfter: boolean;
  uniqueBlock: string;
  sortOrder: number;
  isActive: boolean;
  showOnHomepage: boolean;
  homepageSortOrder: number;
}

const defaultForm: ServiceForm = {
  slug: "",
  title: "",
  h1: "",
  subtitle: "",
  badge: "",
  seoText: "",
  hasBeforeAfter: false,
  uniqueBlock: "",
  sortOrder: 0,
  isActive: true,
  showOnHomepage: true,
  homepageSortOrder: 0,
};

export default function NewServicePage() {
  const router = useRouter();
  const [form, setForm] = useState<ServiceForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setError("");
    if (!form.slug || !form.title || !form.h1 || !form.subtitle) {
      setError("Заполните обязательные поля: slug, title, h1, subtitle");
      return;
    }

    setLoading(true);
    try {
      const body = {
        ...form,
        badge: form.badge || null,
        uniqueBlock: form.uniqueBlock || null,
      };

      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка сохранения");
        return;
      }

      router.push("/admin/services");
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#F5F5F5]">Новая услуга</h1>

      {error && (
        <div className="p-3 rounded-lg bg-[#FF4444]/10 border border-[#FF4444]/30 text-sm text-[#FF4444]">
          {error}
        </div>
      )}

      <div className="space-y-5 bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        <FormField label="Slug *">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="ppf"
            className={INPUT_CLS}
          />
        </FormField>

        <FormField label="Title *">
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Защита плёнкой PPF"
            className={INPUT_CLS}
          />
        </FormField>

        <FormField label="H1 *">
          <input
            type="text"
            value={form.h1}
            onChange={(e) => set("h1", e.target.value)}
            className={INPUT_CLS}
          />
        </FormField>

        <FormField label="Subtitle *">
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            className={INPUT_CLS}
          />
        </FormField>

        <FormField label="Badge">
          <input
            type="text"
            value={form.badge}
            onChange={(e) => set("badge", e.target.value)}
            placeholder="Хит"
            className={INPUT_CLS}
          />
        </FormField>

        <FormField label="SEO Text">
          <textarea
            value={form.seoText}
            onChange={(e) => set("seoText", e.target.value)}
            rows={4}
            className={INPUT_CLS}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Unique Block">
            <select
              value={form.uniqueBlock}
              onChange={(e) => set("uniqueBlock", e.target.value)}
              className={INPUT_CLS}
            >
              <option value="">Нет</option>
              <option value="PhotoComparison">PhotoComparison</option>
              <option value="CarBrandGrid">CarBrandGrid</option>
              <option value="BrandsGrid">BrandsGrid</option>
            </select>
          </FormField>

          <FormField label="Порядок сортировки">
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", Number(e.target.value))}
              className={INPUT_CLS}
            />
          </FormField>
        </div>

        <FormField label="Порядок на главной">
          <input
            type="number"
            value={form.homepageSortOrder}
            onChange={(e) => set("homepageSortOrder", Number(e.target.value))}
            className={INPUT_CLS}
          />
        </FormField>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.hasBeforeAfter}
              onChange={(e) => set("hasBeforeAfter", e.target.checked)}
              className={CHECKBOX_CLS}
            />
            <span className="text-sm text-[#A0A0A0]">До/После</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className={CHECKBOX_CLS}
            />
            <span className="text-sm text-[#A0A0A0]">Активна</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.showOnHomepage}
              onChange={(e) => set("showOnHomepage", e.target.checked)}
              className={CHECKBOX_CLS}
            />
            <span className="text-sm text-[#A0A0A0]">На главной</span>
          </label>
        </div>

        <FormActions
          onSave={handleSave}
          onCancel={() => router.push("/admin/services")}
          loading={loading}
          saveLabel="Создать"
        />
      </div>
    </div>
  );
}
