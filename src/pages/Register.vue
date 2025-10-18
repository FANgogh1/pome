<template>
  <div class="auth-page">
    <h2>注册</h2>
    <form class="form" @submit.prevent="onSubmit">
      <label>
        <span>昵称</span>
        <input v-model="nickname" type="text" placeholder="填写昵称" required />
      </label>
      <label>
        <span>邮箱</span>
        <input v-model="email" type="email" placeholder="设置邮箱" required />
      </label>
      <label>
        <span>密码</span>
        <input v-model="password" type="password" placeholder="设置密码" required />
      </label>
      <button class="btn-primary" type="submit" :disabled="loading">{{ loading ? '注册中...' : '注册' }}</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <p v-if="doneMsg" class="success">{{ doneMsg }}</p>
    </form>
    <div class="switch">
      已有账号？
      <router-link to="/login">去登录</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();
const nickname = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const doneMsg = ref('');
const errorMsg = ref('');

onMounted(() => {
  if (!auth.ready) auth.init();
});

async function onSubmit() {
  loading.value = true;
  errorMsg.value = '';
  doneMsg.value = '';
  try {
    const res = await auth.signUp({ email: email.value, password: password.value, nickname: nickname.value });
    if (res?.session) {
      doneMsg.value = '注册并已登录';
      router.push('/profile');
    } else {
      doneMsg.value = '注册成功，请前往邮箱完成确认后再登录';
      // 不跳转，用户可点击“去登录”链接
    }
  } catch (err) {
    errorMsg.value = err.message || '注册失败';
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
.success { color: #2f855a; font-size: 13px; }
</style>