<template>
  <div class="page">
    <h2>个人中心</h2>
    <div class="account-bar">
      <template v-if="auth.isLoggedIn">
        <div class="user">
          <div class="avatar">
            <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
            <span v-else>{{ (auth.profile?.full_name || 'U').slice(0,1) }}</span>
          </div>
          <div class="info">
            <div class="nickname">{{ auth.profile?.full_name || auth.user?.email }}</div>
            <div class="desc">已登录 · 可管理收藏与点赞</div>
          </div>
        </div>
        <button class="btn-outline" @click="auth.signOut()">退出登录</button>
      </template>
      <template v-else>
        <div class="tip">当前为未登录状态。登录后可保存收藏与点赞。</div>
        <router-link class="btn-primary" to="/login">登录</router-link>
      </template>
    </div>
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
          <h3>个人资料</h3>
          <form class="profile-form" @submit.prevent="saveProfile">
            <label>
              <span>昵称</span>
              <input v-model="form.full_name" type="text" placeholder="填写昵称" />
            </label>
            <label>
              <span>用户名</span>
              <input v-model="form.username" type="text" placeholder="设置用户名" />
            </label>
            <label>
              <span>个人网站</span>
              <input v-model="form.website" type="url" placeholder="https://example.com" />
            </label>
            <div class="actions">
              <button class="btn-primary" type="submit">保存</button>
              <label class="btn-outline" style="cursor:pointer;">
                上传头像
                <input type="file" accept="image/*" @change="onAvatarChange" style="display:none;" />
              </label>
            </div>
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { usePoemsStore } from '../stores/poems';
import { useAuthStore } from '../stores/auth';

const tab = ref('fav');
const store = usePoemsStore();
const auth = useAuthStore();

const favorites = computed(() => store.favorites);
const likes = computed(() => store.likes);
const favoritePoems = computed(() => store.poems.filter(p => favorites.value.includes(p.id)));
const likedPoems = computed(() => store.poems.filter(p => likes.value.includes(p.id)));

const form = ref({
  full_name: '',
  username: '',
  website: ''
});
const avatarUrl = computed(() => auth.getPublicAvatarUrl(auth.profile?.avatar_url));

onMounted(async () => {
  if (!auth.ready) await auth.init();
  if (auth.profile) {
    form.value.full_name = auth.profile.full_name || '';
    form.value.username = auth.profile.username || '';
    form.value.website = auth.profile.website || '';
  }
});

watch(() => auth.profile, (p) => {
  if (!p) return;
  form.value.full_name = p.full_name || '';
  form.value.username = p.username || '';
  form.value.website = p.website || '';
});

async function saveProfile() {
  try {
    await auth.updateProfile(form.value);
    alert('资料已更新');
  } catch (e) {
    alert(e.message || '更新失败');
  }
}

async function onAvatarChange(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    await auth.uploadAvatar(file);
  } catch (e) {
    alert(e.message || '上传失败');
  }
}
</script>

<style scoped>
.page { padding: 16px; }
.account-bar {
  margin: 12px 0 16px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.tip { color: #666; }

.user {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--poem-ink) 14%, white);
  color: var(--poem-ink);
  display: grid;
  place-items: center;
  font-weight: 700;
}
.info .nickname { font-weight: 600; color: var(--poem-ink); }
.info .desc { font-size: 12px; color: var(--poem-ink-2); }

.btn-outline {
  padding: 8px 12px;
  border: 1px solid rgba(44,42,40,0.18);
  border-radius: 10px;
  background: rgba(255,255,255,0.85);
  color: var(--poem-ink-2);
  cursor: pointer;
}
.btn-outline:hover { background: color-mix(in srgb, var(--poem-ink) 6%, white); color: var(--poem-ink); }

.btn-primary {
  padding: 8px 14px;
  border: 1px solid #2b6cb0;
  border-radius: 10px;
  background: #2b6cb0;
  color: #fff;
  cursor: pointer;
}
.btn-primary:hover { filter: brightness(1.05); }

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
.profile-form { display: grid; gap: 10px; max-width: 520px; }
.profile-form label { display: grid; gap: 6px; }
.profile-form input { padding: 10px 12px; border: 1px solid rgba(44,42,40,0.18); border-radius: 10px; }
.profile-form .actions { display: flex; gap: 8px; align-items: center; }
.avatar img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
ul { list-style: none; padding: 0; margin: 0; }
li { padding: 8px; border-bottom: 1px dashed #eee; cursor: pointer; }
li:last-child { border-bottom: none; }
.empty { color: #666; }
</style>