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

      <div class="auth-wrap">
        <template v-if="auth.isLoggedIn">
          <div class="user">
            <div class="avatar">
              <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
              <span v-else>{{ (displayName || 'U').slice(0,1) }}</span>
            </div>
            <span class="nickname">{{ displayName }}</span>
          </div>
          <button class="btn-outline" @click="handleLogout">退出</button>
        </template>
        <template v-else>
          <button class="btn-outline" @click="handleLogin">登录</button>
        </template>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { usePoemsStore } from '../stores/poems';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = usePoemsStore();
const auth = useAuthStore();
const q = ref(store.query);

const displayName = computed(() => auth.profile?.full_name || auth.user?.email || '用户');
const avatarUrl = computed(() => auth.getPublicAvatarUrl(auth.profile?.avatar_url));

onMounted(() => {
  if (!auth.ready) auth.init();
});

function search() {
  store.setQuery(q.value);
  if (router.currentRoute.value.path !== '/poems') {
    router.push('/poems');
  }
}

watch(q, (val) => store.setQuery(val));

function handleLogin() {
  router.push('/login');
}

async function handleLogout() {
  await auth.signOut();
  router.push('/');
}
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(44,42,40,0.18);
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
  backdrop-filter: blur(4px);
}
.logo {
  font-weight: 700;
  font-size: 20px;
  cursor: pointer;
  color: var(--poem-ink);
  letter-spacing: 2px;
  position: relative;
  padding-bottom: 4px;
}
.logo::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--poem-gold), transparent);
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
  padding: 9px 12px;
  border: 1px solid rgba(44,42,40,0.18);
  border-radius: 999px;
  outline: none;
  background: rgba(255,255,255,0.9);
  transition: box-shadow .2s ease, border-color .2s ease;
}
.search:focus {
  border-color: var(--poem-gold);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--poem-gold) 30%, transparent);
}
.btn {
  padding: 9px 14px;
  border: 1px solid rgba(44,42,40,0.18);
  border-radius: 999px;
  background: linear-gradient(180deg, #3b3a37, #2c2a28);
  color: #fff;
  cursor: pointer;
  transition: transform .08s ease, filter .2s ease, box-shadow .2s ease;
  box-shadow: 0 2px 0 rgba(0,0,0,0.08);
}
.btn:hover { filter: brightness(1.05); }
.btn:active { transform: translateY(1px); }

.auth-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
}

.user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--poem-ink) 14%, white);
  color: var(--poem-ink);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 14px;
  overflow: hidden;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nickname {
  color: var(--poem-ink-2);
  font-size: 14px;
}

.btn-outline {
  padding: 7px 12px;
  border: 1px solid rgba(44,42,40,0.18);
  border-radius: 999px;
  background: rgba(255,255,255,0.75);
  color: var(--poem-ink-2);
  cursor: pointer;
  transition: background-color .2s ease, color .2s ease, box-shadow .2s ease;
}
.btn-outline:hover {
  background-color: color-mix(in srgb, var(--poem-ink) 6%, white);
  color: var(--poem-ink);
  box-shadow: 0 2px 0 rgba(0,0,0,0.06);
}

.nav-right a {
  margin-left: 12px;
  color: var(--poem-ink-2);
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background-color .2s ease, color .2s ease;
}
.nav-right a:hover {
  background-color: color-mix(in srgb, var(--poem-ink) 8%, transparent);
}
.nav-right a.router-link-active {
  color: var(--poem-emerald);
  font-weight: 600;
}
</style>