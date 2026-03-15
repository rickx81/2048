<template>
  <div class="game-board" ref="boardRef">
    <div class="grid-container">
      <Tile
        v-for="tile in tiles"
        :key="tile.id"
        :value="tile.value"
        :row="tile.row"
        :col="tile.col"
        class="grid-item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import Tile from './Tile.vue'
import { useGameControls } from '@/composables/useGameControls'

const store = useGameStore()

// 游戏板容器的 ref（用于触摸滑动检测）
const boardRef = ref<HTMLElement>()

// 启用游戏控制（键盘 + 触摸）
useGameControls(boardRef)

// 将 4x4 网格展平为一维数组，便于 v-for 渲染
const tiles = computed(() => {
  const result: Array<{ value: number; row: number; col: number; id: string }> = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      result.push({
        value: store.grid[row][col],
        row,
        col,
        id: `tile-${row}-${col}` // 唯一标识，用于 Vue key
      })
    }
  }
  return result
})
</script setup>

<style scoped>
.game-board {
  width: 100%;
  aspect-ratio: 1; /* 保持正方形比例 */
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 0.9375rem; /* 15px 方格之间固定间距 */
  width: 100%;
  height: 100%;
  background-color: var(--theme-bg-secondary);
  border-radius: 6px;
  padding: 0.9375rem;
  box-sizing: border-box;
}

.grid-item {
  width: 100%;
  height: 100%;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .grid-container {
    gap: 0.625rem; /* 10px 移动端间距 */
    padding: 0.625rem;
  }
}
</style>
