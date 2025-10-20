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
  output: string;
  // 兼容旧字段：别名（可选）
  reply?: string;
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

  // 验证输入数据
  const msgs = Array.isArray(payload?.messages) ? payload.messages : [];
  if (msgs.length === 0) {
    throw new Error('消息列表不能为空');
  }

  // 构建请求体，直接发送完整的对话上下文
  const body: any = {
    clientId: payload.clientId,
    messages: msgs
  };

  // 添加可选参数
  const meta = (payload as any)?.meta || {};
  if (typeof meta.model === 'string') body.model = meta.model;
  if (typeof meta.temperature === 'number') body.temperature = meta.temperature;
  if (typeof meta.system === 'string') body.system = meta.system;

  console.info('[n8n] sending request:', { url, body });

  try {
    const data = await fetchJson(url, body, signal);
    console.info('[n8n] received response:', data);

    // 检查响应状态 - 兼容不同的响应格式
    if (data.ok === false) {
      const errorMsg = data.error || '工作流处理失败';
      throw new Error(`n8n 工作流错误: ${errorMsg}`);
    }

    // 提取回复内容 - 支持多种响应格式（优先 output）
    let output = '';
    if (typeof data?.output === 'string') {
      output = data.output;
    } else if (typeof data?.reply === 'string') {
      output = data.reply;
    } else if (typeof data?.content === 'string') {
      output = data.content;
    } else if (typeof data?.text === 'string') {
      output = data.text;
    } else if (typeof data === 'string') {
      output = data;
    }

    if (typeof output !== 'string' || !output.trim()) {
      throw new Error('工作流未返回有效的回复内容');
    }

    return {
      output: output.trim(),
      // 兼容旧字段：同步同一内容
      reply: output.trim(),
      data: {
        sessionId: data.sessionId,
        model: data.model,
        timestamp: data.timestamp
      }
    };
  } catch (error: any) {
    console.error('[n8n] request failed:', error);
    
    // 重新抛出更友好的错误信息
    if (error.name === 'AbortError') {
      throw new Error('请求已取消');
    } else if (error.status === 500) {
      throw new Error('服务器内部错误，请稍后重试');
    } else if (error.status === 404) {
      throw new Error('工作流地址不存在，请检查配置');
    } else if (error.status === 401) {
      throw new Error('认证失败，请检查API密钥');
    } else if (error.status === 429) {
      throw new Error('请求过于频繁，请稍后重试');
    } else {
      throw new Error(error.message || '网络请求失败');
    }
  }
}