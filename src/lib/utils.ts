import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("7")) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  return phone;
}

export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"));
}

/** Check if current Moscow time (UTC+3) is within working hours 10:00–20:00 */
export function isWorkingHours(): boolean {
  const now = new Date();
  const moscowHour = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" })).getHours();
  return moscowHour >= 10 && moscowHour < 20;
}
