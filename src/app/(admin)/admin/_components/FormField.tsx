interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm text-[#A0A0A0]">{label}</label>
      {children}
      {error && <p className="text-xs text-[#FF4444]">{error}</p>}
    </div>
  );
}
