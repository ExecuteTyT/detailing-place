import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram";

export async function GET() {
  const tgToken = process.env.TG_BOT_TOKEN;
  const tgChat = process.env.TG_CHAT_ID;
  const crmUrl = process.env.CRM_WEBHOOK_URL;
  const proxy = process.env.BOT_API_PROXY;

  const config = {
    tg_token: tgToken ? `...${tgToken.slice(-6)}` : "NOT SET",
    tg_chat: tgChat || "NOT SET",
    crm_url: crmUrl ? `${crmUrl.slice(0, 30)}...` : "NOT SET",
    bot_api_proxy: proxy || "NOT SET (direct)",
  };

  let tgResult: { ok: boolean; error?: string } = { ok: false, error: "not configured" };
  if (tgToken && tgChat) {
    const result = await sendTelegramMessage(tgToken, {
      chatId: tgChat,
      text: "✅ Тест: отправка заявок работает",
    });
    tgResult = { ok: result.ok, ...(result.error ? { error: result.error } : {}) };
  }

  return NextResponse.json({ config, telegram_test: tgResult });
}
