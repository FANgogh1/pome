<template>
  <div class="auth-page">
    <h2>登录</h2>
    <form class="form" @submit.prevent="onSubmit">
      <label>
        <span>邮箱</span>
        <input v-model="email" type="email" placeholder="请输入邮箱" required />
      </label>
      <label>
        <span>密码</span>
        <input v-model="password" type="password" placeholder="请输入密码" required />
      </label>
      <button class="btn-primary" type="submit" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </form>
    <div class="switch">
      还没有账号？
      <router-link to="/register">去注册</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');

onMounted(() => {
  if (!auth.ready) auth.init();
});

async function onSubmit() {
  loading.value = true;
  errorMsg.value = '';
  try {
    await auth.loginWithPassword({ email: email.value, password: password.value });
    const redirect = route.query.redirect || '/profile';
    router.push(String(redirect));
  } catch (err) {
    errorMsg.value = err.message || '登录失败';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  justify-items: center;
  align-content: center;
  padding: 16px;
}
.auth-page h2 { text-align: center; }
.form {
  width: 100%;
  max-width: 420px;
  display: grid;
  gap: 12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 16px;
}
label { display: grid; gap: 6px; }
.form { display: grid; gap: 12px; background: #fff; border: 1px solid #eee; border-radius: 12px; padding: 16px; }
label { display: grid; gap: 6px; }
input {
  padding: 10px 12px;
  border: 1px solid rgba(44,42,40,0.18);
  border-radius: 10px;
  outline: none;
  background: rgba(255,255,255,0.9);
}
input:focus {
  border-color: var(--poem-gold);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--poem-gold) 30%, transparent);
}
.btn-primary {
  padding: 10px 14px;
  border: 1px solid #2b6cb0;
  border-radius: 10px;
  background: #2b6cb0;
  color: #fff;
  cursor: pointer;
}
.switch { margin-top: 12px; color: #666; }
.switch a { margin-left: 6px; color: #2b6cb0; }
.error { color: #c53030; font-size: 13px; }
</style>