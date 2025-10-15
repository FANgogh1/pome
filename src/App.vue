<script setup>
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const showNav = computed(() => !route.meta?.hideNav)
const showFooter = computed(() => !route.meta?.hideFooter)

const auth = useAuthStore()
onMounted(() => {
  if (!auth.ready) auth.init()
})
</script>

<template>
  <div class="layout poem-theme">
    <NavBar v-if="showNav" />
    <main class="container">
      <router-view />
    </main>
    <AppFooter v-if="showFooter" />
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  /* 背景交由全局宣纸主题 */
  background: transparent;
}
.container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 12px 24px;
}
</style>