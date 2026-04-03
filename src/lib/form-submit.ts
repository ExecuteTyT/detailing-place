export interface FormData {
  name?: string;
  phone: string;
  service?: string;
  carClass?: string;
  services?: string[];
  urgency?: string;
  source?: string;
  [key: string]: unknown;
}

function getUTMParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

export async function submitForm(data: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    // Normalize phone before sending
    let phone = data.phone.replace(/\D/g, "");
    if (phone.length === 10) phone = "7" + phone;
    if (phone.startsWith("8") && phone.length === 11) phone = "7" + phone.slice(1);

    const payload = {
      ...data,
      phone: "+" + phone,
      utm: getUTMParams(),
      page: typeof window !== "undefined" ? window.location.pathname : "",
      timestamp: new Date().toISOString(),
    };

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const msg = body?.details?.fieldErrors?.phone?.[0] || body?.error || `Ошибка ${response.status}`;
      throw new Error(msg);
    }

    // Mark form as submitted in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("dp_form_submitted", "true");
      localStorage.setItem("dp_form_submitted_at", new Date().toISOString());
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ошибка отправки",
    };
  }
}

export function isFormSubmitted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("dp_form_submitted") === "true";
}
