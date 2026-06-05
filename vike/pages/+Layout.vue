<!-- https://vike.dev/Layout -->

<template>
  <div class="layout">
    <header class="layout-header">
      <div class="layout-header-inner">
        <h1 class="layout-header-title">vike-vue-content</h1>
        <div class="layout-header-actions">
          <!-- 语言切换 -->
          <LanguageSwitcher />
          <!-- 主题设置按钮 -->
          <div class="theme-picker-wrapper" ref="pickerRef">
            <button class="theme-picker-trigger" @click="isPickerOpen = !isPickerOpen"
              :class="{ 'is-open': isPickerOpen }" title="主题设置" aria-label="主题设置">
              🎨
            </button>
            <Transition name="picker-panel">
              <div v-if="isPickerOpen" class="theme-picker-panel">
                <ThemeSettings />
              </div>
            </Transition>
          </div>
          <!-- 颜色模式切换 -->
          <ThemeToggle />
        </div>
      </div>
    </header>
    <main class="layout-main">
      <slot></slot>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import 'element-plus/dist/index.css';
import 'vike-vue-content/index.css';
import { ThemeToggle } from 'vike-vue-content/components/theme-toggle';
import { ThemeSettings } from 'vike-vue-content/components/theme-settings';
import { useTheme } from 'vike-vue-content/composables/theme';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';

// 初始化主题
useTheme();

// 主题设置面板
const isPickerOpen = ref(false)
const pickerRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    isPickerOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: color-mix(in srgb, var(--vvc-bg) 75%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--vvc-border);
}

.layout-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.layout-header-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vvc-text);
}

.layout-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.theme-picker-wrapper {
  position: relative;
}

.theme-picker-trigger {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--vvc-radius);
  transition: all 0.2s ease;
  font-size: 18px;
  line-height: 1;
  color: var(--vvc-text-muted);
}

.theme-picker-trigger:hover,
.theme-picker-trigger.is-open {
  background-color: var(--vvc-bg-elevated);
}

.theme-picker-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 50;
}

/* 过渡动画 */
.picker-panel-enter-active,
.picker-panel-leave-active {
  transition: all 0.2s ease;
}

.picker-panel-enter-from,
.picker-panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.layout-main {
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}



</style>

