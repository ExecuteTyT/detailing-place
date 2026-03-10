"use client";

import { useEffect, useState, useCallback } from "react";

/* ───── Types ───── */

interface NavItem {
  id?: number;
  label: string;
  href: string;
  group: "service" | "info";
  isNew: boolean;
  sortOrder: number;
}

interface CarClass {
  id?: number;
  label: string;
  example: string;
  sortOrder: number;
}

interface QuizCategory {
  id?: number;
  label: string;
  sortOrder: number;
}

interface SeasonalOffer {
  title: string;
  description: string;
  discount: number;
  promoCode: string;
  endDate: string;
  isActive: boolean;
}

interface TrustBadge {
  id?: number;
  iconName: string;
  title: string;
  description: string;
  sortOrder: number;
}

interface Brand {
  id?: number;
  name: string;
  sortOrder: number;
}

interface LiveStatusItem {
  id?: number;
  car: string;
  service: string;
}

interface SocialProofItem {
  id?: number;
  name: string;
  car: string;
  service: string;
  minutesAgo: number;
}

interface StatItem {
  id?: number;
  iconName: string;
  value: string;
  label: string;
  sortOrder: number;
}

/* ───── Tab definitions ───── */

const TABS = [
  { key: "business", label: "Бизнес-данные" },
  { key: "nav", label: "Навигация" },
  { key: "car-classes", label: "Классы авто" },
  { key: "quiz", label: "Квиз" },
  { key: "seasonal", label: "Акция" },
  { key: "trust-badges", label: "Trust-бейджи" },
  { key: "brands", label: "Бренды" },
  { key: "live-status", label: "Live-статус" },
  { key: "social-proof", label: "Соц. доказательства" },
  { key: "stats", label: "Статистика" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ───── Reusable styles ───── */

const inputClass =
  "w-full px-3 py-2.5 rounded-lg bg-[#252525] border border-[#333333] text-[#F5F5F5] text-sm focus:border-[#00F0FF] focus:outline-none transition-colors";
const cardClass = "bg-[#1A1A1A] border border-[#333333] rounded-xl p-6";
const saveBtnClass =
  "px-5 py-2.5 rounded-lg bg-[#CCFF00] text-[#0E0E0E] text-sm font-semibold hover:bg-[#b8e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const deleteBtnClass =
  "px-3 py-1.5 text-xs rounded-lg bg-[#FF4444] text-white hover:bg-[#e03c3c] transition-colors";
const addBtnClass =
  "px-4 py-2 rounded-lg border border-[#333333] text-[#00F0FF] text-sm hover:bg-[#252525] transition-colors";

/* ───── Main component ───── */

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("business");

  return (
    <div>
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-[#F5F5F5]">Настройки</h1>

        {/* Tabs navigation */}
        <div className="flex flex-wrap gap-1 bg-[#1A1A1A] border border-[#333333] rounded-xl p-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[#252525] text-[#00F0FF]"
                  : "text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#252525]/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "business" && <BusinessTab />}
        {activeTab === "nav" && <NavTab />}
        {activeTab === "car-classes" && <CarClassesTab />}
        {activeTab === "quiz" && <QuizTab />}
        {activeTab === "seasonal" && <SeasonalTab />}
        {activeTab === "trust-badges" && <TrustBadgesTab />}
        {activeTab === "brands" && <BrandsTab />}
        {activeTab === "live-status" && <LiveStatusTab />}
        {activeTab === "social-proof" && <SocialProofTab />}
        {activeTab === "stats" && <StatsTab />}
      </div>
    </div>
  );
}

/* ───── Feedback banner ───── */

function StatusBanner({
  error,
  success,
}: {
  error: string;
  success: string;
}) {
  return (
    <>
      {error && (
        <div className="p-3 rounded-lg bg-[#FF4444]/10 border border-[#FF4444]/30 text-[#FF4444] text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-sm">
          {success}
        </div>
      )}
    </>
  );
}

/* ═════════════════════════════════
   1. Business settings
   ═════════════════════════════════ */

const BUSINESS_FIELDS = [
  { key: "phone", label: "Телефон", placeholder: "+7 (843) 000-00-00" },
  { key: "phone_raw", label: "Телефон (raw)", placeholder: "+78430000000" },
  { key: "whatsapp_url", label: "WhatsApp URL", placeholder: "https://wa.me/78430000000" },
  { key: "address", label: "Адрес", placeholder: "г. Казань, ул. ..." },
  { key: "hours", label: "Часы работы", placeholder: "Ежедневно 10:00–20:00" },
  { key: "coordinates", label: "Координаты", placeholder: "55.7558,49.1914" },
  { key: "metrika_id", label: "Яндекс.Метрика ID", placeholder: "00000000" },
];

function BusinessTab() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings");
        const data = await res.json();
        setSettings(data);
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Сохранено");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#A0A0A0] py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <StatusBanner error={error} success={success} />
      <div className={`${cardClass} space-y-4`}>
        {BUSINESS_FIELDS.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <label className="block text-sm text-[#A0A0A0]">{f.label}</label>
            <input
              type="text"
              value={settings[f.key] || ""}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, [f.key]: e.target.value }))
              }
              placeholder={f.placeholder}
              className={inputClass}
            />
          </div>
        ))}
        <div className="pt-2">
          <button onClick={handleSave} disabled={saving} className={saveBtnClass}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═════════════════════════════════
   2. Navigation
   ═════════════════════════════════ */

function NavTab() {
  const [items, setItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings/nav");
        const data = await res.json();
        setItems(data);
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { label: "", href: "", group: "service", isNew: false, sortOrder: prev.length },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof NavItem, value: string | boolean | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/nav", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item, i) => ({
            label: item.label,
            href: item.href,
            group: item.group,
            isNew: item.isNew,
            sortOrder: i,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Сохранено");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#A0A0A0] py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <StatusBanner error={error} success={success} />
      <div className="flex justify-end">
        <button onClick={addItem} className={addBtnClass}>
          + Добавить пункт
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className={`${cardClass} space-y-3`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#A0A0A0]">#{index + 1}</span>
              <button onClick={() => removeItem(index)} className={deleteBtnClass}>
                Удалить
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Label</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(index, "label", e.target.value)}
                  placeholder="Полировка"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Href</label>
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => updateItem(index, "href", e.target.value)}
                  placeholder="/polirovka"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Группа</label>
                <select
                  value={item.group}
                  onChange={(e) => updateItem(index, "group", e.target.value)}
                  className={inputClass}
                >
                  <option value="service">service</option>
                  <option value="info">info</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Порядок</label>
                <input
                  type="number"
                  value={item.sortOrder}
                  onChange={(e) => updateItem(index, "sortOrder", Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.isNew}
                onChange={(e) => updateItem(index, "isNew", e.target.checked)}
                className="w-4 h-4 accent-[#CCFF00]"
              />
              <span className="text-sm text-[#A0A0A0]">Пометить как &quot;Новое&quot;</span>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-8 text-[#A0A0A0]">Нет пунктов навигации</div>
      )}
      <button onClick={handleSave} disabled={saving} className={saveBtnClass}>
        {saving ? "Сохранение..." : "Сохранить навигацию"}
      </button>
    </div>
  );
}

/* ═════════════════════════════════
   3. Car classes
   ═════════════════════════════════ */

function CarClassesTab() {
  const [items, setItems] = useState<CarClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings/car-classes");
        const data = await res.json();
        setItems(data);
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function updateItem(index: number, field: keyof CarClass, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/car-classes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Сохранено");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#A0A0A0] py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <StatusBanner error={error} success={success} />
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id ?? index} className={`${cardClass} space-y-3`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Класс</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(index, "label", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Пример</label>
                <input
                  type="text"
                  value={item.example}
                  onChange={(e) => updateItem(index, "example", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Порядок</label>
                <input
                  type="number"
                  value={item.sortOrder}
                  onChange={(e) => updateItem(index, "sortOrder", Number(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-8 text-[#A0A0A0]">Нет классов</div>
      )}
      <button onClick={handleSave} disabled={saving} className={saveBtnClass}>
        {saving ? "Сохранение..." : "Сохранить классы"}
      </button>
    </div>
  );
}

/* ═════════════════════════════════
   4. Quiz categories
   ═════════════════════════════════ */

function QuizTab() {
  const [items, setItems] = useState<QuizCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings/quiz-categories");
        const data = await res.json();
        setItems(data);
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function addItem() {
    setItems((prev) => [...prev, { label: "", sortOrder: prev.length }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof QuizCategory, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/quiz-categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item, i) => ({ label: item.label, sortOrder: i })),
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Сохранено");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#A0A0A0] py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <StatusBanner error={error} success={success} />
      <div className="flex justify-end">
        <button onClick={addItem} className={addBtnClass}>
          + Добавить категорию
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className={`${cardClass} flex items-center gap-3`}>
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateItem(index, "label", e.target.value)}
              placeholder="Название категории"
              className={`${inputClass} flex-1`}
            />
            <button onClick={() => removeItem(index)} className={deleteBtnClass}>
              Удалить
            </button>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-8 text-[#A0A0A0]">Нет категорий</div>
      )}
      <button onClick={handleSave} disabled={saving} className={saveBtnClass}>
        {saving ? "Сохранение..." : "Сохранить категории"}
      </button>
    </div>
  );
}

/* ═════════════════════════════════
   5. Seasonal offer
   ═════════════════════════════════ */

function SeasonalTab() {
  const [form, setForm] = useState<SeasonalOffer>({
    title: "",
    description: "",
    discount: 0,
    promoCode: "",
    endDate: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings/seasonal");
        const data = await res.json();
        if (data) {
          setForm({
            title: data.title || "",
            description: data.description || "",
            discount: data.discount || 0,
            promoCode: data.promoCode || "",
            endDate: data.endDate || "",
            isActive: data.isActive ?? true,
          });
        }
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function updateField(field: keyof SeasonalOffer, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/seasonal", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSuccess("Сохранено");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#A0A0A0] py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <StatusBanner error={error} success={success} />
      <div className={`${cardClass} space-y-4`}>
        <div className="space-y-1">
          <label className="text-sm text-[#A0A0A0]">Заголовок</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Весенняя акция"
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-[#A0A0A0]">Описание</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Описание акции..."
            rows={3}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-[#A0A0A0]">Скидка (%)</label>
            <input
              type="number"
              value={form.discount}
              onChange={(e) => updateField("discount", Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-[#A0A0A0]">Промокод</label>
            <input
              type="text"
              value={form.promoCode}
              onChange={(e) => updateField("promoCode", e.target.value)}
              placeholder="SPRING2026"
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-[#A0A0A0]">Дата окончания</label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => updateField("isActive", e.target.checked)}
            className="w-4 h-4 accent-[#CCFF00]"
          />
          <span className="text-sm text-[#A0A0A0]">Активна</span>
        </div>
        <button onClick={handleSave} disabled={saving} className={saveBtnClass}>
          {saving ? "Сохранение..." : "Сохранить акцию"}
        </button>
      </div>
    </div>
  );
}

/* ═════════════════════════════════
   6. Trust badges
   ═════════════════════════════════ */

function TrustBadgesTab() {
  const [items, setItems] = useState<TrustBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings/trust-badges");
        const data = await res.json();
        setItems(data);
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { iconName: "", title: "", description: "", sortOrder: prev.length },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof TrustBadge, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/trust-badges", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item, i) => ({
            iconName: item.iconName,
            title: item.title,
            description: item.description,
            sortOrder: i,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Сохранено");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }, [items]);

  if (loading) return <div className="text-[#A0A0A0] py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <StatusBanner error={error} success={success} />
      <div className="flex justify-end">
        <button onClick={addItem} className={addBtnClass}>
          + Добавить бейдж
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className={`${cardClass} space-y-3`}>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#A0A0A0]">#{index + 1}</span>
              <button onClick={() => removeItem(index)} className={deleteBtnClass}>
                Удалить
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Иконка (Lucide)</label>
                <input
                  type="text"
                  value={item.iconName}
                  onChange={(e) => updateItem(index, "iconName", e.target.value)}
                  placeholder="Shield"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Заголовок</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, "title", e.target.value)}
                  placeholder="Гарантия"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Описание</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="5 лет на PPF"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-8 text-[#A0A0A0]">Нет бейджей</div>
      )}
      <button onClick={handleSave} disabled={saving} className={saveBtnClass}>
        {saving ? "Сохранение..." : "Сохранить бейджи"}
      </button>
    </div>
  );
}

/* ═════════════════════════════════
   7. Brands
   ═════════════════════════════════ */

function BrandsTab() {
  const [items, setItems] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings/brands");
        const data = await res.json();
        setItems(data);
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function addItem() {
    setItems((prev) => [...prev, { name: "", sortOrder: prev.length }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof Brand, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item, i) => ({ name: item.name, sortOrder: i })),
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Сохранено");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#A0A0A0] py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <StatusBanner error={error} success={success} />
      <div className="flex justify-end">
        <button onClick={addItem} className={addBtnClass}>
          + Добавить бренд
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className={`${cardClass} flex items-center gap-3`}>
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              placeholder="Название бренда"
              className={`${inputClass} flex-1`}
            />
            <button onClick={() => removeItem(index)} className={deleteBtnClass}>
              Удалить
            </button>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-8 text-[#A0A0A0]">Нет брендов</div>
      )}
      <button onClick={handleSave} disabled={saving} className={saveBtnClass}>
        {saving ? "Сохранение..." : "Сохранить бренды"}
      </button>
    </div>
  );
}

/* ═════════════════════════════════
   8. Live status
   ═════════════════════════════════ */

function LiveStatusTab() {
  const [items, setItems] = useState<LiveStatusItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings/live-status");
        const data = await res.json();
        setItems(data);
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function addItem() {
    setItems((prev) => [...prev, { car: "", service: "" }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof LiveStatusItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/live-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ car: item.car, service: item.service })),
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Сохранено");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#A0A0A0] py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <StatusBanner error={error} success={success} />
      <div className="flex justify-end">
        <button onClick={addItem} className={addBtnClass}>
          + Добавить запись
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className={`${cardClass} flex items-center gap-3`}>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={item.car}
                onChange={(e) => updateItem(index, "car", e.target.value)}
                placeholder="BMW X5"
                className={inputClass}
              />
              <input
                type="text"
                value={item.service}
                onChange={(e) => updateItem(index, "service", e.target.value)}
                placeholder="Оклейка PPF"
                className={inputClass}
              />
            </div>
            <button onClick={() => removeItem(index)} className={deleteBtnClass}>
              Удалить
            </button>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-8 text-[#A0A0A0]">Нет записей</div>
      )}
      <button onClick={handleSave} disabled={saving} className={saveBtnClass}>
        {saving ? "Сохранение..." : "Сохранить статус"}
      </button>
    </div>
  );
}

/* ═════════════════════════════════
   9. Social proof
   ═════════════════════════════════ */

function SocialProofTab() {
  const [items, setItems] = useState<SocialProofItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings/social-proof");
        const data = await res.json();
        setItems(data);
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { name: "", car: "", service: "", minutesAgo: 5 },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(
    index: number,
    field: keyof SocialProofItem,
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/social-proof", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            car: item.car,
            service: item.service,
            minutesAgo: item.minutesAgo,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Сохранено");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#A0A0A0] py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <StatusBanner error={error} success={success} />
      <div className="flex justify-end">
        <button onClick={addItem} className={addBtnClass}>
          + Добавить запись
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className={`${cardClass} space-y-3`}>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#A0A0A0]">#{index + 1}</span>
              <button onClick={() => removeItem(index)} className={deleteBtnClass}>
                Удалить
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Имя</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                  placeholder="Алексей"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Авто</label>
                <input
                  type="text"
                  value={item.car}
                  onChange={(e) => updateItem(index, "car", e.target.value)}
                  placeholder="BMW X5"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Услуга</label>
                <input
                  type="text"
                  value={item.service}
                  onChange={(e) => updateItem(index, "service", e.target.value)}
                  placeholder="Полировка"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Мин. назад</label>
                <input
                  type="number"
                  value={item.minutesAgo}
                  onChange={(e) =>
                    updateItem(index, "minutesAgo", Number(e.target.value))
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-8 text-[#A0A0A0]">Нет записей</div>
      )}
      <button onClick={handleSave} disabled={saving} className={saveBtnClass}>
        {saving ? "Сохранение..." : "Сохранить"}
      </button>
    </div>
  );
}

/* ═════════════════════════════════
   10. Stats
   ═════════════════════════════════ */

function StatsTab() {
  const [items, setItems] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings/stats");
        const data = await res.json();
        setItems(data);
      } catch {
        setError("Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { iconName: "", value: "", label: "", sortOrder: prev.length },
    ]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof StatItem, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/admin/settings/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item, i) => ({
            iconName: item.iconName,
            value: item.value,
            label: item.label,
            sortOrder: i,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Сохранено");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-[#A0A0A0] py-8 text-center">Загрузка...</div>;

  return (
    <div className="space-y-4">
      <StatusBanner error={error} success={success} />
      <div className="flex justify-end">
        <button onClick={addItem} className={addBtnClass}>
          + Добавить статистику
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className={`${cardClass} space-y-3`}>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#A0A0A0]">#{index + 1}</span>
              <button onClick={() => removeItem(index)} className={deleteBtnClass}>
                Удалить
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Иконка (Lucide)</label>
                <input
                  type="text"
                  value={item.iconName}
                  onChange={(e) => updateItem(index, "iconName", e.target.value)}
                  placeholder="Trophy"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Значение</label>
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateItem(index, "value", e.target.value)}
                  placeholder="1500+"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#A0A0A0]">Подпись</label>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(index, "label", e.target.value)}
                  placeholder="Авто обработано"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center py-8 text-[#A0A0A0]">Нет статистики</div>
      )}
      <button onClick={handleSave} disabled={saving} className={saveBtnClass}>
        {saving ? "Сохранение..." : "Сохранить статистику"}
      </button>
    </div>
  );
}
