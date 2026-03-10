interface FormActionsProps {
  onSave: () => void;
  onCancel?: () => void;
  loading?: boolean;
  saveLabel?: string;
}

export default function FormActions({
  onSave,
  onCancel,
  loading = false,
  saveLabel = "Сохранить",
}: FormActionsProps) {
  return (
    <div className="flex items-center gap-3 pt-4">
      <button
        type="button"
        onClick={onSave}
        disabled={loading}
        className="px-5 py-2.5 rounded-lg bg-[#CCFF00] text-[#0E0E0E] text-sm font-semibold hover:bg-[#b8e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Сохранение..." : saveLabel}
      </button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2.5 rounded-lg border border-[#333333] text-[#A0A0A0] text-sm font-medium hover:bg-[#252525] transition-colors disabled:opacity-50"
        >
          Отмена
        </button>
      )}
    </div>
  );
}
