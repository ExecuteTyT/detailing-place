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
  return (digits.length === 10 || digits.length === 11) &&
    (digits.length === 10 || digits.startsWith("7") || digits.startsWith("8"));
}

/** Normalize phone to +7XXXXXXXXXX format (11 digits starting with 7) */
export function normalizePhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) digits = "7" + digits;
  if (digits.startsWith("8") && digits.length === 11) digits = "7" + digits.slice(1);
  return "+" + digits;
}

/** Format phone input as user types: +7 (XXX) XXX-XX-XX */
export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";

  let result = "+7";
  const d = digits.startsWith("7") || digits.startsWith("8") ? digits.slice(1) : digits;

  if (d.length > 0) result += " (" + d.slice(0, 3);
  if (d.length >= 3) result += ") " + d.slice(3, 6);
  if (d.length >= 6) result += "-" + d.slice(6, 8);
  if (d.length >= 8) result += "-" + d.slice(8, 10);

  return result;
}

/** Check if current Moscow time (UTC+3) is within working hours 10:00–20:00 */
export function isWorkingHours(): boolean {
  const now = new Date();
  const moscowHour = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" })).getHours();
  return moscowHour >= 10 && moscowHour < 20;
}
