<template>
  <div class="chat-widget" :class="{ open: isOpen }">
    <button class="chat-toggle" @click="toggleOpen" aria-label="打开聊天">
      <span v-if="!isOpen">💬</span>
      <span v-else>✕</span>
    </button>

    <transition name="chat-panel">
      <div v-if="isOpen" class="chat-panel" role="dialog" aria-label="AI 对话">
        <div class="chat-header">
          <div class="title">AI 助手</div>
          <button class="close-btn" @click="isOpen = false" aria-label="关闭">✕</button>
        </div>

        <div class="chat-body" ref="scrollEl">
          <div v-for="(m, idx) in messages" :key="idx" class="msg" :class="m.role">
            <div class="bubble">{{ m.content }}</div>
          </div>
          <div v-if="loading" class="msg assistant">
            <div class="bubble typing">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
          </div>
        </div>

        <form class="chat-input" @submit.prevent="handleSend">
          <input
            v-model="input"
            :disabled="loading"
            placeholder="输入消息，按 Enter 发送..."
            @keydown.enter.exact.prevent="handleSend"
            aria-label="输入消息"
          />
          <button type="submit" :disabled="loading || !input.trim()">发送</button>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { sendToN8n, type ChatMessage } from '@/lib/n8nClient';

const isOpen = ref(false);
const input = ref('');
const loading = ref(false);
const messages = ref<ChatMessage[]>([
  { role: 'assistant', content: '你好，我是你的 AI 助手，有什么可以帮你？', timestamp: Date.now() }
]);

const scrollEl = ref<HTMLDivElement | null>(null);

// 简单的 clientId：持久化到 localStorage
const CLIENT_ID_KEY = 'chat_client_id';
function getClientId() {
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}
const clientId = getClientId();

function toggleOpen() {
  isOpen.value = !isOpen.value;
}

async function handleSend() {
  const text = input.value.trim();
  if (!text || loading.value) return;

  // 推入用户消息
  messages.value.push({ role: 'user', content: text, timestamp: Date.now() });
  input.value = '';
  await nextTick();
  scrollToBottom();

  loading.value = true;
  try {
    const controller = new AbortController();
    const res = await sendToN8n(
      {
        clientId,
        messages: messages.value
      },
      controller.signal
    );
    const reply = res.reply || '（未收到应答）';
    messages.value.push({ role: 'assistant', content: reply, timestamp: Date.now() });
  } catch (err: any) {
    messages.value.push({
      role: 'assistant',
      content: `请求失败：${err?.message || String(err)}\n请稍后重试。`,
      timestamp: Date.now()
    });
  } finally {
    loading.value = false;
    await nextTick();
    scrollToBottom();
  }
}

function scrollToBottom() {
  const el = scrollEl.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

watch(isOpen, async (val) => {
  if (val) {
    await nextTick();
    scrollToBottom();
  }
});

onMounted(() => {
  // 若需要，打开时自动滚动
  if (isOpen.value) {
    scrollToBottom();
  }
});
</script>

<style scoped>
.chat-widget {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 1000;
}

.chat-toggle {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: none;
  background: #3b82f6;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.chat-panel-enter-active,
.chat-panel-leave-active {
  transition: all 0.18s ease;
}
.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
}

.chat-panel {
  position: fixed;
  right: 16px;
  bottom: 76px;
  width: 340px;
  max-height: 60vh;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #eef2f7;
}

.chat-header {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.chat-header .title {
  font-weight: 600;
  color: #0f172a;
}
.chat-header .close-btn {
  margin-left: auto;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #64748b;
}

.chat-body {
  padding: 12px;
  overflow: auto;
  flex: 1;
  background: #ffffff;
}

.msg {
  display: flex;
  margin-bottom: 10px;
}
.msg.user {
  justify-content: flex-end;
}
.msg.assistant {
  justify-content: flex-start;
}
.bubble {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 12px;
  line-height: 1.5;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}
.msg.user .bubble {
  background: #3b82f6;
  color: #fff;
  border-bottom-right-radius: 4px;
}
.msg.assistant .bubble {
  background: #f1f5f9;
  color: #0f172a;
  border-bottom-left-radius: 4px;
}

.chat-input {
  display: flex;
  gap: 8px;
  border-top: 1px solid #f1f5f9;
  padding: 10px;
  background: #fff;
}
.chat-input input {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
}
.chat-input input:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}
.chat-input button {
  border: none;
  background: #0ea5e9;
  color: #fff;
  border-radius: 8px;
  padding: 0 14px;
  cursor: pointer;
}

.typing {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}
.dot {
  width: 6px;
  height: 6px;
  background: #64748b;
  border-radius: 50%;
  animation: blink 1.2s infinite ease-in-out;
}
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
}
</style>