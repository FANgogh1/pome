<template>
  <div class="page">
    <section class="hero">
      <h1>诗词鉴赏平台</h1>
      <p>探索中国古典诗词之美，学习注释与赏析。</p>
    </section>

    <section class="carousel">
      <div class="slide" v-for="p in featured" :key="p.id" @click="$router.push('/poems/' + p.id)">
        <h3>{{ p.title }}</h3>
        <p class="meta">{{ p.author }} · {{ p.dynasty }}</p>
        <p class="excerpt">{{ p.content.join(' / ') }}</p>
      </div>
    </section>

    <section>
      <h2>热门诗词</h2>
      <div class="cards">
        <div class="card" v-for="p in hotPoems" :key="p.id" @click="$router.push('/poems/' + p.id)">
          <h3>{{ p.title }}</h3>
          <p class="meta">{{ p.author }} · {{ p.dynasty }}</p>
          <p class="excerpt">{{ p.content.slice(0,2).join(' / ') }}</p>
        </div>
      </div>
    </section>

    <section>
      <h2>最新诗词</h2>
      <div class="cards">
        <div class="card" v-for="p in latestPoems" :key="p.id" @click="$router.push('/poems/' + p.id)">
          <h3>{{ p.title }}</h3>
          <p class="meta">{{ p.author }} · {{ p.dynasty }}</p>
          <p class="excerpt">{{ p.content.slice(0,2).join(' / ') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { usePoemsStore } from '../stores/poems';

const store = usePoemsStore();

const featured = computed(() => store.poems.slice(0, 2));
const hotPoems = computed(() => [...store.poems].sort((a,b) => b.likes - a.likes).slice(0, 4));
const latestPoems = computed(() => [...store.poems].sort((a,b) => new Date(b.publishDate) - new Date(a.publishDate)).slice(0, 4));
</script>

<style scoped>
.page { padding: 16px; }
.hero { padding: 24px; background: #f6f9fc; border-radius: 12px; text-align: center; margin-bottom: 16px; }
.carousel { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; margin-bottom: 16px; }
.slide { padding: 16px; border: 1px solid #eee; border-radius: 12px; background: #fff; cursor: pointer; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.card { padding: 16px; border: 1px solid #eee; border-radius: 12px; background: #fff; cursor: pointer; }
.meta { color: #666; font-size: 13px; }
.excerpt { color: #333; margin-top: 6px; }
</style>