"use client";

interface AdminHeaderProps {
  title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  return (
    <header className="h-14 bg-[#1A1A1A] border-b border-[#333333] flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-[#F5F5F5]">{title}</h1>

      <div className="flex items-center gap-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#A0A0A0] hover:text-[#00F0FF] transition-colors"
        >
          На сайт
        </a>

        <div className="w-8 h-8 rounded-full bg-[#252525] border border-[#333333] flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A0A0A0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>
    </header>
  );
}
