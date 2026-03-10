"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={!loading ? onCancel : undefined}
      />

      <div className="relative bg-[#1A1A1A] border border-[#333333] rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-lg font-semibold text-[#F5F5F5] mb-2">{title}</h2>
        <p className="text-sm text-[#A0A0A0] mb-6">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-[#333333] text-[#A0A0A0] text-sm font-medium hover:bg-[#252525] transition-colors disabled:opacity-50"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[#FF4444] text-white text-sm font-semibold hover:bg-[#e03c3c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Удаление..." : "Подтвердить"}
          </button>
        </div>
      </div>
    </div>
  );
}
