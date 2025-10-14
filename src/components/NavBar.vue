<template>
  <header class="nav">
    <div class="nav-left" @click="$router.push('/')">
      <span class="logo">诗词鉴赏</span>
    </div>
    <div class="nav-center">
      <input
        v-model="q"
        @keyup.enter="search"
        type="text"
        class="search"
        placeholder="搜索：标题 / 作者 / 内容"
      />
      <button class="btn" @click="search">搜索</button>
    </div>
    <nav class="nav-right">
      <router-link to="/">首页</router-link>
      <router-link to="/poems">诗词列表</router-link>
      <router-link to="/profile">个人中心</router-link>
    </nav>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { usePoemsStore } from '../stores/poems';

const store = usePoemsStore();
const q = ref(store.query);

function search() {
  store.setQuery(q.value);
  if (location.pathname !== '/poems') {
    // 跳到列表页展示搜索结果
    window.history.pushState({}, '', '/poems');
    // 触发路由跳转
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

watch(q, (val) => store.setQuery(val));
</script>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  background: #fff;
}
.logo {
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
}
.nav-center {
  display: flex;
  gap: 8px;
  flex: 1;
  max-width: 560px;
  margin: 0 16px;
}
.search {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
}
.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: #2b6cb0;
  color: #fff;
  cursor: pointer;
}
.nav-right a {
  margin-left: 12px;
  color: #333;
  text-decoration: none;
}
.nav-right a.router-link-active {
  color: #2b6cb0;
  font-weight: 600;
}
</style>