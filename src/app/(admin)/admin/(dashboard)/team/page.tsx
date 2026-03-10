"use client";

import { useEffect, useState } from "react";
import FormActions from "@/app/(admin)/admin/_components/FormActions";
import ImageUpload from "@/app/(admin)/admin/_components/ImageUpload";

interface TeamMember {
  id?: number;
  name: string;
  role: string;
  image: string;
  sortOrder: number;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      const res = await fetch("/api/admin/team");
      const data = await res.json();
      setMembers(data);
    } catch {
      setError("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }

  function addMember() {
    setMembers((prev) => [
      ...prev,
      { name: "", role: "", image: "", sortOrder: prev.length },
    ]);
  }

  function removeMember(index: number) {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  }

  function updateMember(index: number, field: keyof TeamMember, value: string | number) {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  }

  function moveMember(index: number, direction: "up" | "down") {
    const newMembers = [...members];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newMembers.length) return;
    [newMembers[index], newMembers[targetIndex]] = [
      newMembers[targetIndex],
      newMembers[index],
    ];
    newMembers.forEach((m, i) => (m.sortOrder = i));
    setMembers(newMembers);
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          members: members.map((m, i) => ({
            name: m.name,
            role: m.role,
            image: m.image,
            sortOrder: i,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Ошибка сохранения");
        return;
      }

      const updated = await res.json();
      setMembers(updated);
      setSuccess("Команда сохранена");
      setTimeout(() => setSuccess(""), 3000);
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
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#F5F5F5]">Команда</h1>
          <button
            onClick={addMember}
            className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-[#0E0E0E] text-sm font-semibold hover:bg-[#b8e600] transition-colors"
          >
            Добавить участника
          </button>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A] border border-[#333333] rounded-xl p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveMember(index, "up")}
                    disabled={index === 0}
                    className="w-7 h-7 rounded flex items-center justify-center text-[#A0A0A0] hover:bg-[#252525] disabled:opacity-30 transition-colors text-xs"
                  >
                    &#9650;
                  </button>
                  <button
                    onClick={() => moveMember(index, "down")}
                    disabled={index === members.length - 1}
                    className="w-7 h-7 rounded flex items-center justify-center text-[#A0A0A0] hover:bg-[#252525] disabled:opacity-30 transition-colors text-xs"
                  >
                    &#9660;
                  </button>
                </div>
                <button
                  onClick={() => removeMember(index)}
                  className="px-2 py-1 text-xs rounded text-[#FF4444] hover:bg-[#FF4444]/10 transition-colors"
                >
                  Удалить
                </button>
              </div>

              <ImageUpload
                value={member.image}
                onChange={(url) => updateMember(index, "image", url)}
                folder="team"
                previewHeight="h-32"
              />

              <input
                type="text"
                value={member.name}
                onChange={(e) => updateMember(index, "name", e.target.value)}
                placeholder="Имя"
                className={inputClass}
              />

              <input
                type="text"
                value={member.role}
                onChange={(e) => updateMember(index, "role", e.target.value)}
                placeholder="Должность"
                className={inputClass}
              />
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-12 text-[#A0A0A0] bg-[#1A1A1A] border border-[#333333] rounded-xl">
            Нет участников. Нажмите &quot;Добавить участника&quot; чтобы начать.
          </div>
        )}

        <FormActions onSave={handleSave} loading={saving} />
      </div>
    </div>
  );
}
