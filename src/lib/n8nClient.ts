/**
 * n8n Client
 * - 通过 POST 将对话上下文发送到 n8n 工作流（webhook/HTTP 节点）
 * - 默认读取 VITE_N8N_WEBHOOK_URL；如未配置，使用占位地址
 * - 返回非流式整段回复
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  // 可选：时间戳或其他元数据
  timestamp?: number;
}

export interface N8nChatRequest {
  clientId: string;
  messages: ChatMessage[];
  // 可扩展的额外字段，如模型、温度等
  meta?: Record<string, unknown>;
}

export interface N8nChatResponse {
  reply: string;
  // 可选：由 n8n 端返回的富信息
  data?: Record<string, unknown>;
}

const DEFAULT_WEBHOOK = 'https://fanan77.app.n8n.cloud/webhook/ai-chat';

// 运行时快速设置并持久化 Webhook URL
export function setN8nWebhookUrl(url: string) {
  try {
    (globalThis as any).__N8N_WEBHOOK_URL__ = url;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('N8N_WEBHOOK_URL', url);
    }
    console.info('[n8n] webhook url set:', url);
  } catch {}
}

function resolveWebhookUrl(): string {
  const winUrl = (globalThis as any).__N8N_WEBHOOK_URL__;
  const envUrl =
    typeof process !== 'undefined' && (process as any).env
      ? (process as any).env.VITE_N8N_WEBHOOK_URL
      : undefined;
  let lsUrl: string | undefined;
  try {
    lsUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('N8N_WEBHOOK_URL') ?? undefined : undefined;
  } catch {}
  return winUrl ?? envUrl ?? lsUrl ?? DEFAULT_WEBHOOK;
}

async function fetchJson(url: string, payload: any, signal?: AbortSignal) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal
  });
  const text = await res.text().catch(() => '');
  if (!res.ok) {
    const err = new Error(`n8n 请求失败: ${res.status} ${res.statusText}${text ? ' - ' + text : ''}`);
    (err as any).status = res.status;
    (err as any).body = text;
    throw err;
  }
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function sendToN8n(payload: N8nChatRequest, signal?: AbortSignal): Promise<N8nChatResponse> {
  const url = resolveWebhookUrl();
  console.info('[n8n] using webhook url:', url);

  // 将对话上下文转换为 n8n 所需的请求体：{ message }
  const msgs = Array.isArray(payload?.messages) ? payload.messages : [];
  const userMsgs = msgs.filter(m => m.role === 'user');
  const latestContent =
    userMsgs.length > 0
      ? userMsgs[userMsgs.length - 1]?.content ?? ''
      : msgs.length > 0
        ? msgs[msgs.length - 1]?.content ?? ''
        : '';

  const message = (latestContent ?? '').trim();
  if (!message) {
    throw new Error('请输入内容后再发送');
  }

  const body = { message };

  const data = await fetchJson(url, body, signal);
  // 工作流约定返回 { reply }, 若失败路径返回 { message: "Error in workflow" }
  if (data && typeof data.reply === 'string') {
    return { reply: data.reply, data };
  }
  const serverMsg = typeof data?.message === 'string' ? data.message : '';
  throw new Error(serverMsg || '工作流未返回有效的 reply');
}