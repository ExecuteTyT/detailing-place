"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка входа");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-[#1A1A1A] rounded-xl border border-[#333333] p-8">
          <h1 className="text-2xl font-bold text-[#F5F5F5] mb-2 text-center">
            Detailing Place
          </h1>
          <p className="text-[#A0A0A0] text-sm text-center mb-8">
            Панель управления
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm text-[#A0A0A0] mb-1"
              >
                Логин
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-3 text-[#F5F5F5] text-base focus:outline-none focus:border-[#00F0FF] transition-colors"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm text-[#A0A0A0] mb-1"
              >
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#252525] border border-[#333333] rounded-lg px-4 py-3 text-[#F5F5F5] text-base focus:outline-none focus:border-[#00F0FF] transition-colors"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="text-[#FF4444] text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#CCFF00] text-[#0E0E0E] font-semibold rounded-lg py-3 hover:bg-[#b8e600] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
