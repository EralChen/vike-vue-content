<template>
  <button
    class="vvc-color-mode-button"
    @click="toggleDarkMode"
    :title="isDark ? '浅色模式' : '深色模式'"
    :aria-label="isDark ? '浅色模式' : '深色模式'"
  >
    <span v-if="isDark" class="vvc-color-mode-icon">🌙</span>
    <span v-else class="vvc-color-mode-icon">☀️</span>
  </button>
</template>

<script lang="ts" setup>
import { useTheme } from '@vike-vue-content/composables/theme'

const { isDark, theme } = useTheme()

function toggleDarkMode() {
  theme.value.colorMode = isDark.value ? 'light' : 'dark'
}
</script>

<style>
.vvc-color-mode-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  color: #475569;
}

.dark .vvc-color-mode-button {
  color: #94a3b8;
}

.vvc-color-mode-button:hover {
  background-color: #f1f5f9;
}

.dark .vvc-color-mode-button:hover {
  background-color: #334155;
}

.vvc-color-mode-icon {
  font-size: 18px;
  line-height: 1;
}
</style>