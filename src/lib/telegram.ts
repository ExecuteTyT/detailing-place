import { ProxyAgent } from "undici";

let cachedProxyAgent: ProxyAgent | null = null;
let cachedProxyUrl: string | undefined = undefined;

function getProxyAgent() {
  const url = process.env.BOT_API_PROXY;
  if (!url) return undefined;

  if (cachedProxyAgent && cachedProxyUrl === url) {
    return cachedProxyAgent;
  }

  cachedProxyAgent = new ProxyAgent(url);
  cachedProxyUrl = url;
  return cachedProxyAgent;
}

export interface TelegramSendOptions {
  chatId: string;
  text: string;
  parseMode?: "HTML" | "MarkdownV2";
}

export interface TelegramSendResult {
  ok: boolean;
  status?: number;
  error?: string;
}

export async function sendTelegramMessage(
  token: string,
  options: TelegramSendOptions,
): Promise<TelegramSendResult> {
  const dispatcher = getProxyAgent();
  try {
    const init: RequestInit & { dispatcher?: ProxyAgent } = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: options.chatId,
        text: options.text,
        ...(options.parseMode ? { parse_mode: options.parseMode } : {}),
      }),
    };
    if (dispatcher) init.dispatcher = dispatcher;

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      init,
    );

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as
        | { description?: string }
        | null;
      return {
        ok: false,
        status: res.status,
        error: body?.description ?? `HTTP ${res.status}`,
      };
    }

    return { ok: true, status: res.status };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "network error",
    };
  }
}
