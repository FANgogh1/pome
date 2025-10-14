<template>
  <div class="page" v-if="poem">
    <h1>{{ poem.title }}</h1>
    <p class="meta">{{ poem.author }} · {{ poem.dynasty }}</p>

    <section class="content">
      <p v-for="(line, i) in poem.content" :key="i" class="line">{{ line }}</p>
    </section>

    <div class="actions">
      <button class="btn" @click="toggleLike">👍 点赞</button>
      <button class="btn" @click="toggleFav">⭐ 收藏</button>
      <button class="btn" @click="share">分享</button>
    </div>

    <details class="block">
      <summary>注释</summary>
      <ul>
        <li v-for="(n, i) in poem.notes" :key="i">{{ n.keyword }}：{{ n.explanation }}</li>
      </ul>
    </details>

    <details class="block">
      <summary>译文</summary>
      <p>{{ poem.translation }}</p>
    </details>

    <details class="block">
      <summary>赏析</summary>
      <p>{{ poem.analysis }}</p>
    </details>

    <details class="block">
      <summary>作者介绍</summary>
      <p>{{ poem.authorIntro }}</p>
    </details>

    <section class="comments">
      <h3>评论（示例占位）</h3>
      <input class="input" placeholder="输入你的评论（前端占位，不保存）" />
      <div class="comment-list">
        <div class="comment">很有意境！</div>
        <div class="comment">读来令人回味。</div>
      </div>
    </section>
  </div>

  <div v-else class="page">
    <p>未找到该诗词。</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { usePoemsStore } from '../stores/poems';

const route = useRoute();
const store = usePoemsStore();
const id = Number(route.params.id);
const poem = computed(() => store.poems.find(p => p.id === id));

function toggleLike() { store.toggleLike(id); }
function toggleFav() { store.toggleFavorite(id); }
function share() { alert('分享功能暂未实现（前端演示）。'); }
</script>

<style scoped>
.page { padding: 16px; }
.meta { color: #666; margin-bottom: 8px; }
.content { background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 12px; }
.line { margin: 4px 0; }
.actions { display: flex; gap: 8px; margin: 12px 0; }
.btn { padding: 8px 12px; border: none; border-radius: 8px; background: #2b6cb0; color: #fff; cursor: pointer; }
.block { margin-top: 10px; background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 12px; }
.input { width: 100%; padding: 8px 10px; border: 1px solid #ddd; border-radius: 8px; margin-top: 8px; }
.comment-list { margin-top: 8px; display: grid; gap: 8px; }
.comment { padding: 8px; background: #f7f7f7; border-radius: 8px; }
</style>