<!-- https://vike.dev/Layout -->

<template>
  <ConfigProvider :locale="currentContentLocale">
    <div class="layout">
      <header class="layout-header">
        <div class="layout-header-inner">
          <a href="/" class="layout-header-brand">
            <img src="../assets/logo.svg" alt="logo" class="layout-header-logo" />
            <span class="layout-header-title">vike-vue-content</span>
          </a>
          <div class="layout-header-actions">

            <LanguageSwitcher />
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
            <ThemeToggle />

            <a href="https://github.com/EralChen/vike-vue-content" target="_blank" rel="noopener noreferrer"
              class="github-link" title="GitHub" aria-label="GitHub">
              <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
        </div>
      </header>
      <main class="layout-main">
        <slot></slot>
      </main>
    </div>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import 'element-plus/dist/index.css';
import 'vike-vue-content/index.css';
import { ConfigProvider } from 'vike-vue-content/components/config-provider';
import { ThemeToggle } from 'vike-vue-content/components/theme-toggle';
import { ThemeSettings } from 'vike-vue-content/components/theme-settings';
import { useTheme } from 'vike-vue-content/composables/theme';
import LanguageSwitcher from '../components/LanguageSwitcher.vue';
import { type DefineLocaleMessage } from 'vue-i18n'
import { useI18n } from 'vue-i18n'
import { type Locale, localeMap } from '../api/locale'

const { locale } = useI18n<DefineLocaleMessage, Locale>()


const currentContentLocale = computed(() => {
  return localeMap[locale.value].contentLocale
})

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

.layout-header-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: inherit;
}

.layout-header-logo {
  width: 32px;
  height: 32px;
}

.layout-header-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vvc-text);
}

.github-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: var(--vvc-radius);
  color: var(--vvc-text-muted);
  transition: color 0.2s ease, background-color 0.2s ease;
}

.github-link:hover {
  color: var(--vvc-text);
  background-color: var(--vvc-bg-elevated);
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
