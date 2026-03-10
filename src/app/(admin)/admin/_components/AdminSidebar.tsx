"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Услуги", href: "/admin/services" },
  { label: "Блог", href: "/admin/blog" },
  { label: "Портфолио", href: "/admin/portfolio" },
  { label: "Отзывы", href: "/admin/reviews" },
  { label: "Команда", href: "/admin/team" },
  { label: "Настройки", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#1A1A1A] border-r border-[#333333] flex flex-col z-40">
      <div className="px-6 py-5 border-b border-[#333333]">
        <span className="text-xl font-bold text-[#CCFF00]">DP Admin</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#252525] text-[#00F0FF]"
                  : "text-[#A0A0A0] hover:bg-[#252525] hover:text-[#F5F5F5]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#333333]">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-[#A0A0A0] hover:bg-[#252525] hover:text-[#FF4444] transition-colors disabled:opacity-50 text-left"
        >
          {loggingOut ? "Выход..." : "Выйти"}
        </button>
      </div>
    </aside>
  );
}
