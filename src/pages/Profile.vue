<template>
  <div class="page">
    <h2>个人中心</h2>
    <div class="layout">
      <aside class="aside">
        <button :class="{active: tab==='fav'}" @click="tab='fav'">我的收藏</button>
        <button :class="{active: tab==='like'}" @click="tab='like'">我的点赞</button>
        <button :class="{active: tab==='info'}" @click="tab='info'">个人资料</button>
      </aside>
      <main class="main">
        <section v-if="tab==='fav'">
          <h3>我的收藏</h3>
          <div v-if="favorites.length === 0" class="empty">暂无收藏</div>
          <ul v-else>
            <li v-for="p in favoritePoems" :key="p.id" @click="$router.push('/poems/' + p.id)">
              {{ p.title }} - {{ p.author }}
            </li>
          </ul>
        </section>
        <section v-else-if="tab==='like'">
          <h3>我的点赞</h3>
          <div v-if="likes.length === 0" class="empty">暂无点赞</div>
          <ul v-else>
            <li v-for="p in likedPoems" :key="p.id" @click="$router.push('/poems/' + p.id)">
              {{ p.title }} - {{ p.author }}
            </li>
          </ul>
        </section>
        <section v-else>
          <h3>个人资料（演示占位）</h3>
          <p>昵称：诗词爱好者</p>
          <p>简介：热爱传统文化</p>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePoemsStore } from '../stores/poems';

const tab = ref('fav');
const store = usePoemsStore();
const favorites = computed(() => store.favorites);
const likes = computed(() => store.likes);
const favoritePoems = computed(() => store.poems.filter(p => favorites.value.includes(p.id)));
const likedPoems = computed(() => store.poems.filter(p => likes.value.includes(p.id)));
</script>

<style scoped>
.page { padding: 16px; }
.layout { display: grid; grid-template-columns: 180px 1fr; gap: 16px; }
.aside { display: grid; gap: 8px; }
.aside button {
  padding: 10px;
  border: 1px solid #eee;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}
.aside button.active {
  background: #2b6cb0;
  color: #fff;
  border-color: #2b6cb0;
}
.main section { background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 12px; }
ul { list-style: none; padding: 0; margin: 0; }
li { padding: 8px; border-bottom: 1px dashed #eee; cursor: pointer; }
li:last-child { border-bottom: none; }
.empty { color: #666; }
</style>