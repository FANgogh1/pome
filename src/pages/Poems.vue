<template>
  <div class="page">
    <h2>诗词列表</h2>

    <div class="filters">
      <select v-model="dynasty">
        <option value="">全部朝代</option>
        <option>唐</option>
        <option>宋</option>
        <option>元</option>
        <option>明</option>
        <option>清</option>
      </select>
      <select v-model="category">
        <option value="">全部题材</option>
        <option>思乡</option>
        <option>山水</option>
        <option>爱情</option>
        <option>友情</option>
      </select>
      <select v-model="sort">
        <option value="hot">按热度</option>
        <option value="time">按时间</option>
      </select>
    </div>

    <div class="cards">
      <div
        class="card"
        v-for="p in displayed"
        :key="p.id"
        @click="$router.push('/poems/' + p.id)"
      >
        <h3>{{ p.title }}</h3>
        <p class="meta">{{ p.author }} · {{ p.dynasty }}</p>
        <p class="excerpt">{{ p.content.slice(0,2).join(' / ') }}</p>
        <div class="stats">
          <span>👍 {{ p.likes }}</span>
          <span>⭐ {{ p.favorites }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePoemsStore } from '../stores/poems';

const store = usePoemsStore();
const dynasty = ref('');
const category = ref('');
const sort = ref('hot');

const filtered = computed(() => {
  let list = store.filteredPoems;
  if (dynasty.value) list = list.filter(p => p.dynasty === dynasty.value);
  if (category.value) list = list.filter(p => p.categories?.includes(category.value));
  return list;
});

const displayed = computed(() => {
  const list = [...filtered.value];
  if (sort.value === 'hot') list.sort((a,b) => b.likes - a.likes);
  else list.sort((a,b) => new Date(b.publishDate) - new Date(a.publishDate));
  return list;
});
</script>

<style scoped>
.page { padding: 16px; }
.filters { display: flex; gap: 12px; margin: 12px 0 16px; }
select {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.card { padding: 16px; border: 1px solid #eee; border-radius: 12px; background: #fff; cursor: pointer; }
.meta { color: #666; font-size: 13px; }
.excerpt { color: #333; margin-top: 6px; }
.stats { display: flex; gap: 12px; color: #555; margin-top: 8px; }
</style>