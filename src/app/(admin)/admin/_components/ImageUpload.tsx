"use client";

import { useState, useRef, useCallback } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  /** Label shown above the upload area */
  label?: string;
  /** Subfolder in /uploads/ (hero, works, blog, team, studio, before-after, portfolio, misc) */
  folder?: string;
  /** Exact filename without extension. E.g. "ppf" → saves as "ppf.webp". For hero images. */
  targetName?: string;
  /** Preview height class (default h-48) */
  previewHeight?: string;
  /** Hint text shown below the upload area */
  hint?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  folder = "misc",
  targetName,
  previewHeight = "h-48",
  hint,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [savings, setSavings] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");
      setSavings(null);
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        if (targetName) formData.append("targetName", targetName);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Ошибка загрузки");
          return;
        }

        onChange(data.url);
        if (data.savings > 0) {
          setSavings(data.savings);
          setTimeout(() => setSavings(null), 4000);
        }
      } catch {
        setError("Ошибка сети");
      } finally {
        setUploading(false);
      }
    },
    [onChange, folder, targetName],
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm text-[#A0A0A0]">{label}</label>
      )}

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          dragOver
            ? "border-[#00F0FF] bg-[#00F0FF]/5"
            : "border-[#333333] hover:border-[#A0A0A0]"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt="Preview"
              className={`w-full ${previewHeight} object-cover rounded-xl`}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
              <span className="text-sm text-[#F5F5F5] bg-black/50 px-3 py-1.5 rounded-lg">
                Заменить
              </span>
              <button
                onClick={handleClear}
                className="text-sm text-[#FF4444] bg-black/50 px-3 py-1.5 rounded-lg hover:bg-[#FF4444]/20 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A0A0A0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p className="mt-2 text-sm text-[#A0A0A0]">
              {uploading
                ? "Загрузка и конвертация в WebP..."
                : "Нажмите или перетащите изображение"}
            </p>
            <p className="mt-1 text-xs text-[#A0A0A0]/50">
              JPEG, PNG, WebP, AVIF · до 10 МБ · автоконвертация в WebP
            </p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {uploading && (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#A0A0A0]">Конвертация в WebP...</span>
        </div>
      )}

      {savings !== null && (
        <p className="text-xs text-[#CCFF00]">
          Сжато на {savings}% при конвертации в WebP
        </p>
      )}

      {error && <p className="text-xs text-[#FF4444]">{error}</p>}

      {hint && !error && !savings && (
        <p className="text-xs text-[#A0A0A0]/60">{hint}</p>
      )}

      {value && (
        <p className="text-xs text-[#A0A0A0]/40 truncate">{value}</p>
      )}
    </div>
  );
}
