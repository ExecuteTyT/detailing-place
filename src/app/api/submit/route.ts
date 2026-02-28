import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const submitSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone is required")
    .refine(
      (val) => val.replace(/\D/g, "").length >= 11,
      "Invalid phone number"
    ),
  name: z.string().optional(),
  carClass: z.string().optional(),
  carBrand: z.string().optional(),
  service: z.string().optional(),
  source: z.string().optional(),
  page: z.string().optional(),
  utm: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_content: z.string().optional(),
      utm_term: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const result = submitSchema.safeParse(raw);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const body = result.data;

    // Send to CRM webhook
    const crmUrl = process.env.CRM_WEBHOOK_URL;
    if (crmUrl) {
      try {
        await fetch(crmUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (e) {
        console.error("CRM webhook error:", e);
      }
    }

    // Send to Telegram (optional)
    const tgToken = process.env.TG_BOT_TOKEN;
    const tgChat = process.env.TG_CHAT_ID;
    if (tgToken && tgChat) {
      const text = [
        "📋 Новая заявка с сайта",
        `📱 Телефон: ${body.phone}`,
        body.name ? `👤 Имя: ${body.name}` : "",
        body.carClass ? `🚗 Класс: ${body.carClass}` : "",
        body.carBrand ? `🚗 Марка: ${body.carBrand}` : "",
        body.service ? `🔧 Услуга: ${body.service}` : "",
        body.source ? `📍 Источник: ${body.source}` : "",
        body.page ? `📄 Страница: ${body.page}` : "",
        body.utm?.utm_source
          ? `📊 UTM: ${body.utm.utm_source} / ${body.utm.utm_medium || ""} / ${body.utm.utm_campaign || ""}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");

      try {
        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: tgChat, text, parse_mode: "HTML" }),
        });
      } catch (e) {
        console.error("Telegram notify error:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
