import { NextResponse } from "next/server";

export async function GET() {
  const tgToken = process.env.TG_BOT_TOKEN;
  const tgChat = process.env.TG_CHAT_ID;
  const crmUrl = process.env.CRM_WEBHOOK_URL;

  const config = {
    tg_token: tgToken ? `...${tgToken.slice(-6)}` : "NOT SET",
    tg_chat: tgChat || "NOT SET",
    crm_url: crmUrl ? `${crmUrl.slice(0, 30)}...` : "NOT SET",
  };

  // Try sending a test message to Telegram
  let tgResult: { ok: boolean; error?: string } = { ok: false, error: "not configured" };
  if (tgToken && tgChat) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: tgChat,
          text: "✅ Тест: отправка заявок работает",
        }),
      });
      const body = await res.json();
      tgResult = { ok: body.ok, error: body.ok ? undefined : body.description };
    } catch (e) {
      tgResult = { ok: false, error: e instanceof Error ? e.message : "network error" };
    }
  }

  return NextResponse.json({ config, telegram_test: tgResult });
}
