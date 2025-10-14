<script setup>
import NavBar from './components/NavBar.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="layout">
    <NavBar />
    <main class="container">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  background: #f5f7fa;
}
.container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 12px 24px;
}
</style>