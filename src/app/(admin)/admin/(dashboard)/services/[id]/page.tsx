"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import FormField from "@/app/(admin)/admin/_components/FormField";
import FormActions from "@/app/(admin)/admin/_components/FormActions";
import PriceMatrix from "@/app/(admin)/admin/_components/PriceMatrix";
import ImageUpload from "@/app/(admin)/admin/_components/ImageUpload";

// ── Style tokens ──

const INPUT_CLS =
  "w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-2.5 text-[#F5F5F5] text-sm focus:outline-none focus:border-[#00F0FF] transition-colors placeholder:text-[#A0A0A0]/50";
const CHECKBOX_CLS =
  "w-4 h-4 rounded border-[#333333] bg-[#252525] accent-[#00F0FF]";

// ── Types ──

interface ServiceData {
  id: number;
  slug: string;
  title: string;
  h1: string;
  subtitle: string;
  badge: string | null;
  seoText: string;
  hasBeforeAfter: boolean;
  uniqueBlock: string | null;
  sortOrder: number;
  isActive: boolean;
  showOnHomepage: boolean;
  homepageSortOrder: number;
}

interface CarClass {
  id: number;
  label: string;
  example: string;
}

interface PriceEntry {
  carClassId: number | null;
  priceText: string | null;
}

interface Feature {
  text: string;
  sortOrder: number;
}

interface PackageData {
  name: string;
  description: string;
  isPopular: boolean;
  duration: string;
  sortOrder: number;
  features: Feature[];
  prices: PriceEntry[];
  expanded: boolean;
}

interface ElementData {
  elementName: string;
  sortOrder: number;
  prices: PriceEntry[];
}

interface StepData {
  title: string;
  description: string;
  sortOrder: number;
}

interface FaqData {
  question: string;
  answer: string;
  sortOrder: number;
}

interface CrossSellData {
  title: string;
  description: string;
  href: string;
  discount: string;
}

interface BeforeAfterData {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
}

const TABS = [
  "Основное",
  "Пакеты",
  "Элементы",
  "Этапы",
  "FAQ",
  "Ключевые слова",
  "Cross-sell",
  "До/После",
] as const;
type Tab = (typeof TABS)[number];

// ── Main component ──

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<Tab>("Основное");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Data state
  const [service, setService] = useState<ServiceData | null>(null);
  const [carClasses, setCarClasses] = useState<CarClass[]>([]);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [elements, setElements] = useState<ElementData[]>([]);
  const [steps, setSteps] = useState<StepData[]>([]);
  const [faqItems, setFaqItems] = useState<FaqData[]>([]);
  const [keywords, setKeywords] = useState("");
  const [crossSell, setCrossSell] = useState<CrossSellData>({
    title: "",
    description: "",
    href: "",
    discount: "",
  });
  const [beforeAfter, setBeforeAfter] = useState<BeforeAfterData>({
    beforeImage: "",
    afterImage: "",
    beforeLabel: "До",
    afterLabel: "После",
  });

  // ── Flash messages ──

  function flash(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  function flashError(msg: string) {
    setError(msg);
    setTimeout(() => setError(""), 5000);
  }

  // ── Initial data fetch ──

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [svcRes, ccRes, pkgRes, elRes, stRes, faqRes, kwRes, csRes, baRes] =
        await Promise.all([
          fetch(`/api/admin/services/${id}`),
          fetch("/api/admin/settings/car-classes"),
          fetch(`/api/admin/services/${id}/packages`),
          fetch(`/api/admin/services/${id}/elements`),
          fetch(`/api/admin/services/${id}/process`),
          fetch(`/api/admin/services/${id}/faq`),
          fetch(`/api/admin/services/${id}/keywords`),
          fetch(`/api/admin/services/${id}/cross-sell`),
          fetch(`/api/admin/services/${id}/before-after`),
        ]);

      if (!svcRes.ok) {
        router.push("/admin/services");
        return;
      }

      const svcData = await svcRes.json();
      setService(svcData);

      const ccData: CarClass[] = await ccRes.json();
      setCarClasses(ccData);

      const pkgData = await pkgRes.json();
      setPackages(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pkgData.map((p: any) => ({
          name: p.name,
          description: p.description || "",
          isPopular: p.isPopular || false,
          duration: p.duration || "",
          sortOrder: p.sortOrder,
          features: (p.features || []).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (f: any) => ({ text: f.text, sortOrder: f.sortOrder }),
          ),
          prices: (p.prices || []).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (pr: any) => ({
              carClassId: pr.carClassId,
              priceText: pr.priceText,
            }),
          ),
          expanded: false,
        })),
      );

      const elData = await elRes.json();
      setElements(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        elData.map((e: any) => ({
          elementName: e.elementName,
          sortOrder: e.sortOrder,
          prices: (e.prices || []).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (pr: any) => ({
              carClassId: pr.carClassId,
              priceText: pr.priceText,
            }),
          ),
        })),
      );

      const stData = await stRes.json();
      setSteps(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stData.map((s: any) => ({
          title: s.title,
          description: s.description,
          sortOrder: s.sortOrder,
        })),
      );

      const faqData = await faqRes.json();
      setFaqItems(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        faqData.map((f: any) => ({
          question: f.question,
          answer: f.answer,
          sortOrder: f.sortOrder,
        })),
      );

      const kwData = await kwRes.json();
      setKeywords(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        kwData.map((k: any) => k.keyword).join("\n"),
      );

      const csData = await csRes.json();
      if (csData) {
        setCrossSell({
          title: csData.title || "",
          description: csData.description || "",
          href: csData.href || "",
          discount: csData.discount || "",
        });
      }

      const baData = await baRes.json();
      if (baData) {
        setBeforeAfter({
          beforeImage: baData.beforeImage || "",
          afterImage: baData.afterImage || "",
          beforeLabel: baData.beforeLabel || "До",
          afterLabel: baData.afterLabel || "После",
        });
      }
    } catch {
      flashError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Generic save helper ──

  async function apiSave(url: string, method: string, body: unknown) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        flashError(data.error || "Ошибка сохранения");
        return false;
      }
      flash("Сохранено");
      return true;
    } catch {
      flashError("Ошибка сети");
      return false;
    } finally {
      setSaving(false);
    }
  }

  // ── Tab save handlers ──

  async function saveBasic() {
    if (!service) return;
    const ok = await apiSave(`/api/admin/services/${id}`, "PUT", {
      slug: service.slug,
      title: service.title,
      h1: service.h1,
      subtitle: service.subtitle,
      badge: service.badge || null,
      seoText: service.seoText,
      hasBeforeAfter: service.hasBeforeAfter,
      uniqueBlock: service.uniqueBlock || null,
      sortOrder: service.sortOrder,
      isActive: service.isActive,
      showOnHomepage: service.showOnHomepage,
      homepageSortOrder: service.homepageSortOrder,
    });
    if (ok) {
      const res = await fetch(`/api/admin/services/${id}`);
      if (res.ok) setService(await res.json());
    }
  }

  async function savePackages() {
    const payload = packages.map((p, idx) => ({
      name: p.name,
      description: p.description,
      isPopular: p.isPopular,
      duration: p.duration || null,
      sortOrder: idx,
      features: p.features.map((f, fi) => ({ text: f.text, sortOrder: fi })),
      prices: p.prices,
    }));
    await apiSave(`/api/admin/services/${id}/packages`, "PUT", {
      packages: payload,
    });
  }

  async function saveElements() {
    const payload = elements.map((e, idx) => ({
      elementName: e.elementName,
      sortOrder: idx,
      prices: e.prices,
    }));
    await apiSave(`/api/admin/services/${id}/elements`, "PUT", {
      elements: payload,
    });
  }

  async function saveSteps() {
    const payload = steps.map((s, idx) => ({
      title: s.title,
      description: s.description,
      sortOrder: idx,
    }));
    await apiSave(`/api/admin/services/${id}/process`, "PUT", {
      steps: payload,
    });
  }

  async function saveFaq() {
    const payload = faqItems.map((f, idx) => ({
      question: f.question,
      answer: f.answer,
      sortOrder: idx,
    }));
    await apiSave(`/api/admin/services/${id}/faq`, "PUT", { items: payload });
  }

  async function saveKeywords() {
    const list = keywords
      .split("\n")
      .map((k) => k.trim())
      .filter(Boolean);
    await apiSave(`/api/admin/services/${id}/keywords`, "PUT", {
      keywords: list,
    });
  }

  async function saveCrossSell() {
    await apiSave(`/api/admin/services/${id}/cross-sell`, "PUT", crossSell);
  }

  async function saveBeforeAfter() {
    await apiSave(`/api/admin/services/${id}/before-after`, "PUT", beforeAfter);
  }

  // ── Service field setter ──

  function setField<K extends keyof ServiceData>(key: K, value: ServiceData[K]) {
    setService((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  // ── Package helpers ──

  function addPackage() {
    setPackages((prev) => [
      ...prev,
      {
        name: "",
        description: "",
        isPopular: false,
        duration: "",
        sortOrder: prev.length,
        features: [],
        prices: carClasses.map((cc) => ({
          carClassId: cc.id,
          priceText: null,
        })),
        expanded: true,
      },
    ]);
  }

  function removePackage(idx: number) {
    setPackages((prev) => prev.filter((_, i) => i !== idx));
  }

  function updatePackage<K extends keyof PackageData>(
    idx: number,
    key: K,
    value: PackageData[K],
  ) {
    setPackages((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [key]: value } : p)),
    );
  }

  function togglePackage(idx: number) {
    setPackages((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, expanded: !p.expanded } : p)),
    );
  }

  function addFeature(pkgIdx: number) {
    setPackages((prev) =>
      prev.map((p, i) =>
        i === pkgIdx
          ? {
              ...p,
              features: [
                ...p.features,
                { text: "", sortOrder: p.features.length },
              ],
            }
          : p,
      ),
    );
  }

  function removeFeature(pkgIdx: number, fIdx: number) {
    setPackages((prev) =>
      prev.map((p, i) =>
        i === pkgIdx
          ? { ...p, features: p.features.filter((_, fi) => fi !== fIdx) }
          : p,
      ),
    );
  }

  function updateFeature(pkgIdx: number, fIdx: number, text: string) {
    setPackages((prev) =>
      prev.map((p, i) =>
        i === pkgIdx
          ? {
              ...p,
              features: p.features.map((f, fi) =>
                fi === fIdx ? { ...f, text } : f,
              ),
            }
          : p,
      ),
    );
  }

  function movePackage(idx: number, dir: -1 | 1) {
    setPackages((prev) => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  }

  // ── Element helpers ──

  function addElement() {
    setElements((prev) => [
      ...prev,
      {
        elementName: "",
        sortOrder: prev.length,
        prices: carClasses.map((cc) => ({
          carClassId: cc.id,
          priceText: null,
        })),
      },
    ]);
  }

  function removeElement(idx: number) {
    setElements((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateElementName(idx: number, name: string) {
    setElements((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, elementName: name } : e)),
    );
  }

  function updateElementPrices(idx: number, prices: PriceEntry[]) {
    setElements((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, prices } : e)),
    );
  }

  // ── Step helpers ──

  function addStep() {
    setSteps((prev) => [
      ...prev,
      { title: "", description: "", sortOrder: prev.length },
    ]);
  }

  function removeStep(idx: number) {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateStep<K extends keyof StepData>(
    idx: number,
    key: K,
    value: StepData[K],
  ) {
    setSteps((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [key]: value } : s)),
    );
  }

  function moveStep(idx: number, dir: -1 | 1) {
    setSteps((prev) => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  }

  // ── FAQ helpers ──

  function addFaq() {
    setFaqItems((prev) => [
      ...prev,
      { question: "", answer: "", sortOrder: prev.length },
    ]);
  }

  function removeFaq(idx: number) {
    setFaqItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateFaq<K extends keyof FaqData>(
    idx: number,
    key: K,
    value: FaqData[K],
  ) {
    setFaqItems((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [key]: value } : f)),
    );
  }

  // ── Loading state ──

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#A0A0A0] text-sm">Загрузка...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[#FF4444] text-sm">Услуга не найдена</div>
      </div>
    );
  }

  // ── Render ──

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F5F5]">
            {service.title}
          </h1>
          <p className="text-sm text-[#A0A0A0] mt-1">ID: {service.id}</p>
        </div>
        <button
          onClick={() => router.push("/admin/services")}
          className="px-4 py-2 rounded-lg border border-[#333333] text-[#A0A0A0] text-sm font-medium hover:bg-[#252525] transition-colors"
        >
          Назад к списку
        </button>
      </div>

      {/* Flash messages */}
      {error && (
        <div className="p-3 rounded-lg bg-[#FF4444]/10 border border-[#FF4444]/30 text-sm text-[#FF4444]">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-sm text-[#CCFF00]">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-[#333333] pb-px">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors ${
              activeTab === tab
                ? "bg-[#1A1A1A] text-[#00F0FF] border border-[#333333] border-b-[#1A1A1A] -mb-px"
                : "text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#252525]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-6">
        {/* ═══ Tab 1: Основное ═══ */}
        {activeTab === "Основное" && (
          <div className="space-y-5 max-w-3xl">
            <FormField label="Slug *">
              <input
                type="text"
                value={service.slug}
                onChange={(e) => setField("slug", e.target.value)}
                className={INPUT_CLS}
              />
            </FormField>

            <FormField label="Title *">
              <input
                type="text"
                value={service.title}
                onChange={(e) => setField("title", e.target.value)}
                className={INPUT_CLS}
              />
            </FormField>

            <FormField label="H1 *">
              <input
                type="text"
                value={service.h1}
                onChange={(e) => setField("h1", e.target.value)}
                className={INPUT_CLS}
              />
            </FormField>

            <FormField label="Subtitle *">
              <input
                type="text"
                value={service.subtitle}
                onChange={(e) => setField("subtitle", e.target.value)}
                className={INPUT_CLS}
              />
            </FormField>

            <FormField label="Badge">
              <input
                type="text"
                value={service.badge ?? ""}
                onChange={(e) => setField("badge", e.target.value || null)}
                placeholder="Хит"
                className={INPUT_CLS}
              />
            </FormField>

            <ImageUpload
              label="Hero-фон страницы услуги"
              value={`/images/hero/${service.slug}.webp`}
              onChange={() => flash("Hero-изображение загружено")}
              folder="hero"
              targetName={service.slug}
              previewHeight="h-32"
              hint={`Сохранится как /images/hero/${service.slug}.webp`}
            />

            <FormField label="SEO Text">
              <textarea
                value={service.seoText}
                onChange={(e) => setField("seoText", e.target.value)}
                rows={4}
                className={INPUT_CLS}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Unique Block">
                <select
                  value={service.uniqueBlock ?? ""}
                  onChange={(e) =>
                    setField("uniqueBlock", e.target.value || null)
                  }
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
                  value={service.sortOrder}
                  onChange={(e) => setField("sortOrder", Number(e.target.value))}
                  className={INPUT_CLS}
                />
              </FormField>
            </div>

            <FormField label="Порядок на главной">
              <input
                type="number"
                value={service.homepageSortOrder}
                onChange={(e) =>
                  setField("homepageSortOrder", Number(e.target.value))
                }
                className={INPUT_CLS}
              />
            </FormField>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={service.hasBeforeAfter}
                  onChange={(e) =>
                    setField("hasBeforeAfter", e.target.checked)
                  }
                  className={CHECKBOX_CLS}
                />
                <span className="text-sm text-[#A0A0A0]">До/После</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={service.isActive}
                  onChange={(e) => setField("isActive", e.target.checked)}
                  className={CHECKBOX_CLS}
                />
                <span className="text-sm text-[#A0A0A0]">Активна</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={service.showOnHomepage}
                  onChange={(e) =>
                    setField("showOnHomepage", e.target.checked)
                  }
                  className={CHECKBOX_CLS}
                />
                <span className="text-sm text-[#A0A0A0]">На главной</span>
              </label>
            </div>

            <FormActions onSave={saveBasic} loading={saving} />
          </div>
        )}

        {/* ═══ Tab 2: Пакеты ═══ */}
        {activeTab === "Пакеты" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">
                Пакеты услуг
              </h2>
              <button
                onClick={addPackage}
                className="px-4 py-2 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] text-sm font-medium hover:bg-[#00F0FF]/20 transition-colors"
              >
                + Добавить пакет
              </button>
            </div>

            {packages.length === 0 && (
              <p className="text-sm text-[#A0A0A0] py-8 text-center">
                Нет пакетов. Нажмите &quot;Добавить пакет&quot; для создания.
              </p>
            )}

            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className="border border-[#333333] rounded-xl overflow-hidden"
              >
                {/* Package header */}
                <div
                  className="flex items-center justify-between px-4 py-3 bg-[#252525] cursor-pointer select-none"
                  onClick={() => togglePackage(idx)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[#A0A0A0] text-xs">
                      {pkg.expanded ? "▼" : "▶"}
                    </span>
                    <span className="text-sm font-medium text-[#F5F5F5]">
                      {pkg.name || `Пакет ${idx + 1}`}
                    </span>
                    {pkg.isPopular && (
                      <span className="px-2 py-0.5 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] text-xs font-medium">
                        Популярный
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePackage(idx, -1);
                      }}
                      disabled={idx === 0}
                      className="px-2 py-1 text-xs text-[#A0A0A0] hover:text-[#F5F5F5] disabled:opacity-30 transition-colors"
                      title="Вверх"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePackage(idx, 1);
                      }}
                      disabled={idx === packages.length - 1}
                      className="px-2 py-1 text-xs text-[#A0A0A0] hover:text-[#F5F5F5] disabled:opacity-30 transition-colors"
                      title="Вниз"
                    >
                      ↓
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePackage(idx);
                      }}
                      className="px-2 py-1 text-xs text-[#FF4444] hover:text-[#FF4444]/80 transition-colors"
                      title="Удалить"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Package body */}
                {pkg.expanded && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Название *">
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) =>
                            updatePackage(idx, "name", e.target.value)
                          }
                          placeholder="Базовый"
                          className={INPUT_CLS}
                        />
                      </FormField>
                      <FormField label="Длительность">
                        <input
                          type="text"
                          value={pkg.duration}
                          onChange={(e) =>
                            updatePackage(idx, "duration", e.target.value)
                          }
                          placeholder="2-3 часа"
                          className={INPUT_CLS}
                        />
                      </FormField>
                    </div>

                    <FormField label="Описание">
                      <textarea
                        value={pkg.description}
                        onChange={(e) =>
                          updatePackage(idx, "description", e.target.value)
                        }
                        rows={2}
                        className={INPUT_CLS}
                      />
                    </FormField>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={pkg.isPopular}
                        onChange={(e) =>
                          updatePackage(idx, "isPopular", e.target.checked)
                        }
                        className={CHECKBOX_CLS}
                      />
                      <span className="text-sm text-[#A0A0A0]">
                        Популярный пакет
                      </span>
                    </label>

                    {/* Features */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-[#A0A0A0]">
                          Что входит
                        </label>
                        <button
                          onClick={() => addFeature(idx)}
                          className="text-xs text-[#00F0FF] hover:text-[#00F0FF]/80 transition-colors"
                        >
                          + Добавить
                        </button>
                      </div>
                      {pkg.features.map((feat, fi) => (
                        <div key={fi} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feat.text}
                            onChange={(e) =>
                              updateFeature(idx, fi, e.target.value)
                            }
                            placeholder="Описание пункта"
                            className={INPUT_CLS}
                          />
                          <button
                            onClick={() => removeFeature(idx, fi)}
                            className="px-2 py-2 text-[#FF4444] hover:text-[#FF4444]/80 text-sm flex-shrink-0 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Price matrix */}
                    <div>
                      <label className="block text-sm text-[#A0A0A0] mb-2">
                        Цены
                      </label>
                      <PriceMatrix
                        carClasses={carClasses}
                        prices={pkg.prices}
                        onChange={(prices) =>
                          updatePackage(idx, "prices", prices)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {packages.length > 0 && (
              <FormActions onSave={savePackages} loading={saving} />
            )}
          </div>
        )}

        {/* ═══ Tab 3: Элементы ═══ */}
        {activeTab === "Элементы" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">
                Элементы (поэлементная оценка)
              </h2>
              <button
                onClick={addElement}
                className="px-4 py-2 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] text-sm font-medium hover:bg-[#00F0FF]/20 transition-colors"
              >
                + Добавить элемент
              </button>
            </div>

            {elements.length === 0 && (
              <p className="text-sm text-[#A0A0A0] py-8 text-center">
                Нет элементов. Нажмите &quot;Добавить элемент&quot; для
                создания.
              </p>
            )}

            {elements.map((el, idx) => (
              <div
                key={idx}
                className="border border-[#333333] rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <FormField label={`Элемент ${idx + 1}`}>
                      <input
                        type="text"
                        value={el.elementName}
                        onChange={(e) =>
                          updateElementName(idx, e.target.value)
                        }
                        placeholder="Капот"
                        className={INPUT_CLS}
                      />
                    </FormField>
                  </div>
                  <button
                    onClick={() => removeElement(idx)}
                    className="px-3 py-2 text-[#FF4444] hover:text-[#FF4444]/80 text-sm transition-colors mt-5"
                  >
                    ✕ Удалить
                  </button>
                </div>

                <PriceMatrix
                  carClasses={carClasses}
                  prices={el.prices}
                  onChange={(prices) => updateElementPrices(idx, prices)}
                />
              </div>
            ))}

            {elements.length > 0 && (
              <FormActions onSave={saveElements} loading={saving} />
            )}
          </div>
        )}

        {/* ═══ Tab 4: Этапы ═══ */}
        {activeTab === "Этапы" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">
                Этапы работы
              </h2>
              <button
                onClick={addStep}
                className="px-4 py-2 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] text-sm font-medium hover:bg-[#00F0FF]/20 transition-colors"
              >
                + Добавить этап
              </button>
            </div>

            {steps.length === 0 && (
              <p className="text-sm text-[#A0A0A0] py-8 text-center">
                Нет этапов. Нажмите &quot;Добавить этап&quot; для создания.
              </p>
            )}

            {steps.map((step, idx) => (
              <div
                key={idx}
                className="border border-[#333333] rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#A0A0A0]">
                    Этап {idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveStep(idx, -1)}
                      disabled={idx === 0}
                      className="px-2 py-1 text-xs text-[#A0A0A0] hover:text-[#F5F5F5] disabled:opacity-30 transition-colors"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveStep(idx, 1)}
                      disabled={idx === steps.length - 1}
                      className="px-2 py-1 text-xs text-[#A0A0A0] hover:text-[#F5F5F5] disabled:opacity-30 transition-colors"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => removeStep(idx)}
                      className="px-2 py-1 text-xs text-[#FF4444] hover:text-[#FF4444]/80 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <FormField label="Заголовок">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) =>
                      updateStep(idx, "title", e.target.value)
                    }
                    placeholder="Подготовка"
                    className={INPUT_CLS}
                  />
                </FormField>

                <FormField label="Описание">
                  <textarea
                    value={step.description}
                    onChange={(e) =>
                      updateStep(idx, "description", e.target.value)
                    }
                    rows={2}
                    className={INPUT_CLS}
                  />
                </FormField>
              </div>
            ))}

            {steps.length > 0 && (
              <FormActions onSave={saveSteps} loading={saving} />
            )}
          </div>
        )}

        {/* ═══ Tab 5: FAQ ═══ */}
        {activeTab === "FAQ" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">
                Часто задаваемые вопросы
              </h2>
              <button
                onClick={addFaq}
                className="px-4 py-2 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] text-sm font-medium hover:bg-[#00F0FF]/20 transition-colors"
              >
                + Добавить вопрос
              </button>
            </div>

            {faqItems.length === 0 && (
              <p className="text-sm text-[#A0A0A0] py-8 text-center">
                Нет вопросов. Нажмите &quot;Добавить вопрос&quot; для создания.
              </p>
            )}

            {faqItems.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#333333] rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#A0A0A0]">
                    Вопрос {idx + 1}
                  </span>
                  <button
                    onClick={() => removeFaq(idx)}
                    className="px-2 py-1 text-xs text-[#FF4444] hover:text-[#FF4444]/80 transition-colors"
                  >
                    ✕ Удалить
                  </button>
                </div>

                <FormField label="Вопрос">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) =>
                      updateFaq(idx, "question", e.target.value)
                    }
                    className={INPUT_CLS}
                  />
                </FormField>

                <FormField label="Ответ">
                  <textarea
                    value={faq.answer}
                    onChange={(e) =>
                      updateFaq(idx, "answer", e.target.value)
                    }
                    rows={3}
                    className={INPUT_CLS}
                  />
                </FormField>
              </div>
            ))}

            {faqItems.length > 0 && (
              <FormActions onSave={saveFaq} loading={saving} />
            )}
          </div>
        )}

        {/* ═══ Tab 6: Ключевые слова ═══ */}
        {activeTab === "Ключевые слова" && (
          <div className="space-y-5 max-w-3xl">
            <h2 className="text-lg font-semibold text-[#F5F5F5]">
              SEO ключевые слова
            </h2>
            <p className="text-sm text-[#A0A0A0]">
              Введите по одному ключевому слову на строку
            </p>

            <FormField label="Ключевые слова">
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                rows={10}
                placeholder={"детейлинг казань\nполировка авто\nppf плёнка"}
                className={INPUT_CLS}
              />
            </FormField>

            <div className="text-xs text-[#A0A0A0]">
              Всего:{" "}
              {
                keywords
                  .split("\n")
                  .map((k) => k.trim())
                  .filter(Boolean).length
              }{" "}
              ключевых слов
            </div>

            <FormActions onSave={saveKeywords} loading={saving} />
          </div>
        )}

        {/* ═══ Tab 7: Cross-sell ═══ */}
        {activeTab === "Cross-sell" && (
          <div className="space-y-5 max-w-3xl">
            <h2 className="text-lg font-semibold text-[#F5F5F5]">
              Cross-sell баннер
            </h2>
            <p className="text-sm text-[#A0A0A0]">
              Баннер рекомендации сопутствующей услуги
            </p>

            <FormField label="Заголовок">
              <input
                type="text"
                value={crossSell.title}
                onChange={(e) =>
                  setCrossSell((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Добавьте полировку кузова"
                className={INPUT_CLS}
              />
            </FormField>

            <FormField label="Описание">
              <textarea
                value={crossSell.description}
                onChange={(e) =>
                  setCrossSell((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className={INPUT_CLS}
              />
            </FormField>

            <FormField label="Ссылка (href)">
              <input
                type="text"
                value={crossSell.href}
                onChange={(e) =>
                  setCrossSell((prev) => ({ ...prev, href: e.target.value }))
                }
                placeholder="/polirovka"
                className={INPUT_CLS}
              />
            </FormField>

            <FormField label="Скидка">
              <input
                type="text"
                value={crossSell.discount}
                onChange={(e) =>
                  setCrossSell((prev) => ({
                    ...prev,
                    discount: e.target.value,
                  }))
                }
                placeholder="-15%"
                className={INPUT_CLS}
              />
            </FormField>

            <FormActions onSave={saveCrossSell} loading={saving} />
          </div>
        )}

        {/* ═══ Tab 8: До/После ═══ */}
        {activeTab === "До/После" && (
          <div className="space-y-5 max-w-3xl">
            <h2 className="text-lg font-semibold text-[#F5F5F5]">
              До/После изображения
            </h2>
            <p className="text-sm text-[#A0A0A0]">
              Изображения для слайдера сравнения до и после
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <ImageUpload
                  label="Изображение &laquo;До&raquo;"
                  value={beforeAfter.beforeImage}
                  onChange={(url) =>
                    setBeforeAfter((prev) => ({
                      ...prev,
                      beforeImage: url,
                    }))
                  }
                  folder="before-after"
                />
                <div className="mt-2">
                  <FormField label="Подпись">
                    <input
                      type="text"
                      value={beforeAfter.beforeLabel}
                      onChange={(e) =>
                        setBeforeAfter((prev) => ({
                          ...prev,
                          beforeLabel: e.target.value,
                        }))
                      }
                      className={INPUT_CLS}
                    />
                  </FormField>
                </div>
              </div>

              <div>
                <ImageUpload
                  label="Изображение &laquo;После&raquo;"
                  value={beforeAfter.afterImage}
                  onChange={(url) =>
                    setBeforeAfter((prev) => ({
                      ...prev,
                      afterImage: url,
                    }))
                  }
                  folder="before-after"
                />
                <div className="mt-2">
                  <FormField label="Подпись">
                    <input
                      type="text"
                      value={beforeAfter.afterLabel}
                      onChange={(e) =>
                        setBeforeAfter((prev) => ({
                          ...prev,
                          afterLabel: e.target.value,
                        }))
                      }
                      className={INPUT_CLS}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            <FormActions onSave={saveBeforeAfter} loading={saving} />
          </div>
        )}
      </div>
    </div>
  );
}
