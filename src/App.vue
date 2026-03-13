<template>
  <div id="app" class="app">
    <GameContainer />
  </div>
</template>

<script setup lang="ts">
import GameContainer from '@/components/GameContainer.vue'
</script>

<style>
/* 全局样式 */
.app {
  width: 100%;
  min-height: 100vh;
  /* 暗色/霓虹风格背景 */
  background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
}
</style>
