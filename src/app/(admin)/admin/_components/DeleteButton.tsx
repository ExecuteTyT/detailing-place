"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "./ConfirmDialog";

interface DeleteButtonProps {
  endpoint: string;
  label?: string;
  confirmTitle?: string;
  confirmMessage?: string;
}

export default function DeleteButton({
  endpoint,
  label = "Удалить",
  confirmTitle = "Удаление",
  confirmMessage = "Вы уверены? Это действие нельзя отменить.",
}: DeleteButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setOpen(false);
      router.refresh();
    } catch {
      alert("Ошибка удаления");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#FF4444]/30 text-[#FF4444] hover:bg-[#FF4444]/10 transition-colors"
      >
        {label}
      </button>
      <ConfirmDialog
        open={open}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={handleDelete}
        onCancel={() => setOpen(false)}
        loading={loading}
      />
    </>
  );
}
