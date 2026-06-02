<template>
  <div class="vvc-theme-picker" v-bind="$attrs">
    <!-- Primary 颜色选择 -->
    <fieldset class="vvc-theme-picker-fieldset">
      <legend class="vvc-theme-picker-legend">
        Primary
        <span class="vvc-theme-picker-help" title="主题主色调，用于按钮、链接等元素">?</span>
      </legend>
      <div class="vvc-theme-picker-grid vvc-theme-picker-grid--3">
        <button
          class="vvc-theme-picker-button"
          :class="{ 'is-selected': blackAsPrimary }"
          @click="setBlackAsPrimary(true)"
        >
          <span class="vvc-theme-picker-dot" style="background-color: #000" />
          Black
        </button>
        <button
          v-for="color in primaryColors"
          :key="color"
          class="vvc-theme-picker-button"
          :class="{ 'is-selected': !blackAsPrimary && primary === color }"
          @click="primary = color"
        >
          <span
            class="vvc-theme-picker-dot"
            :style="{ backgroundColor: getColorValue(color) }"
          />
          {{ color }}
        </button>
      </div>
    </fieldset>

    <!-- Neutral 颜色选择 -->
    <fieldset class="vvc-theme-picker-fieldset">
      <legend class="vvc-theme-picker-legend">
        Neutral
        <span class="vvc-theme-picker-help" title="中性色，用于文本、边框等元素">?</span>
      </legend>
      <div class="vvc-theme-picker-grid vvc-theme-picker-grid--3">
        <button
          v-for="color in neutralColors"
          :key="color"
          class="vvc-theme-picker-button"
          :class="{ 'is-selected': neutral === color }"
          @click="neutral = color"
        >
          <span
            class="vvc-theme-picker-dot"
            :style="{ backgroundColor: getNeutralColorValue(color) }"
          />
          {{ color }}
        </button>
      </div>
    </fieldset>

    <!-- Radius 圆角选择 -->
    <fieldset class="vvc-theme-picker-fieldset">
      <legend class="vvc-theme-picker-legend">
        Radius
        <span class="vvc-theme-picker-help" title="元素圆角大小，单位 rem">?</span>
      </legend>
      <div class="vvc-theme-picker-grid vvc-theme-picker-grid--5">
        <button
          v-for="r in radiuses"
          :key="r"
          class="vvc-theme-picker-button vvc-theme-picker-button--center"
          :class="{ 'is-selected': radius === r }"
          @click="radius = r"
        >
          {{ r }}
        </button>
      </div>
    </fieldset>

    <!-- Font 字体选择 -->
    <fieldset class="vvc-theme-picker-fieldset">
      <legend class="vvc-theme-picker-legend">
        Font
        <span class="vvc-theme-picker-help" title="页面字体">?</span>
      </legend>
      <select
        class="vvc-theme-picker-select"
        :value="font"
        @change="font = ($event.target as HTMLSelectElement).value"
      >
        <option v-for="f in fonts" :key="f" :value="f">
          {{ f }}
        </option>
      </select>
    </fieldset>

    <!-- Color Mode 颜色模式 -->
    <fieldset class="vvc-theme-picker-fieldset">
      <legend class="vvc-theme-picker-legend">
        Color Mode
        <span class="vvc-theme-picker-help" title="切换浅色/深色/跟随系统">?</span>
      </legend>
      <div class="vvc-theme-picker-grid vvc-theme-picker-grid--3">
        <button
          v-for="m in modes"
          :key="m.label"
          class="vvc-theme-picker-button"
          :class="{ 'is-selected': mode === m.label }"
          @click="mode = m.label as 'light' | 'dark' | 'system'"
        >
          <span class="vvc-theme-picker-icon">{{ m.icon }}</span>
          {{ m.label }}
        </button>
      </div>
    </fieldset>

    <!-- Export 导出 -->
    <fieldset v-if="hasCSSChanges || hasConfigChanges" class="vvc-theme-picker-fieldset">
      <legend class="vvc-theme-picker-legend">Export</legend>
      <div class="vvc-theme-picker-export">
        <button
          v-if="hasCSSChanges"
          class="vvc-theme-picker-export-button"
          @click="handleExportCSS"
        >
          {{ copiedCSS ? '✓ Copied' : 'main.css' }}
        </button>
        <button
          v-if="hasConfigChanges"
          class="vvc-theme-picker-export-button"
          @click="handleExportConfig"
        >
          {{ copiedConfig ? '✓ Copied' : 'config.json' }}
        </button>
        <button
          class="vvc-theme-picker-reset"
          @click="resetTheme"
          title="重置主题"
        >
          ↺
        </button>
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  useTheme,
  primaryColors,
  neutralColors,
  radiusPresets,
  fontPresets,
  getColorValue,
  getNeutralColorValue
} from '@vike-vue-content/composables/theme'

const {
  primary,
  neutral,
  radius,
  font,
  blackAsPrimary,
  setBlackAsPrimary,
  modes,
  mode,
  hasCSSChanges,
  hasConfigChanges,
  exportCSS,
  exportConfig,
  resetTheme
} = useTheme()

const copiedCSS = ref(false)
const copiedConfig = ref(false)

// 重命名以保持模板兼容
const radiuses = radiusPresets
const fonts = fontPresets

async function handleExportCSS() {
  try {
    await navigator.clipboard.writeText(exportCSS())
    copiedCSS.value = true
    setTimeout(() => {
      copiedCSS.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy CSS:', err)
  }
}

async function handleExportConfig() {
  try {
    await navigator.clipboard.writeText(exportConfig())
    copiedConfig.value = true
    setTimeout(() => {
      copiedConfig.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy config:', err)
  }
}
</script>

<style>
.vvc-theme-picker {
  width: 288px;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 5rem);
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dark .vvc-theme-picker {
  background-color: #1e293b;
}

.vvc-theme-picker-fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

.vvc-theme-picker-legend {
  font-size: 11px;
  line-height: 1;
  font-weight: 600;
  margin-bottom: 8px;
  color: #475569;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dark .vvc-theme-picker-legend {
  color: #94a3b8;
}

.vvc-theme-picker-help {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #e2e8f0;
  color: #64748b;
  font-size: 10px;
  cursor: help;
}

.dark .vvc-theme-picker-help {
  background-color: #475569;
  color: #94a3b8;
}

.vvc-theme-picker-grid {
  display: grid;
  gap: 4px;
  margin: 0 -8px;
}

.vvc-theme-picker-grid--3 {
  grid-template-columns: repeat(3, 1fr);
}

.vvc-theme-picker-grid--5 {
  grid-template-columns: repeat(5, 1fr);
}

.vvc-theme-picker-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background-color: transparent;
  font-size: 11px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}

.dark .vvc-theme-picker-button {
  border-color: #475569;
  color: #94a3b8;
}

.vvc-theme-picker-button:hover {
  background-color: rgba(241, 245, 249, 0.5);
}

.dark .vvc-theme-picker-button:hover {
  background-color: rgba(51, 65, 85, 0.5);
}

.vvc-theme-picker-button.is-selected {
  background-color: #f1f5f9;
}

.dark .vvc-theme-picker-button.is-selected {
  background-color: #334155;
}

.vvc-theme-picker-button--center {
  justify-content: center;
}

.vvc-theme-picker-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.vvc-theme-picker-icon {
  font-size: 14px;
}

.vvc-theme-picker-select {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background-color: transparent;
  font-size: 11px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 -8px;
  width: calc(100% + 16px);
}

.dark .vvc-theme-picker-select {
  border-color: #475569;
  color: #94a3b8;
  background-color: #1e293b;
}

.vvc-theme-picker-select:hover {
  background-color: rgba(241, 245, 249, 0.5);
}

.dark .vvc-theme-picker-select:hover {
  background-color: rgba(51, 65, 85, 0.5);
}

.vvc-theme-picker-export {
  display: flex;
  gap: 8px;
  margin: 0 -8px;
}

.vvc-theme-picker-export-button {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background-color: #f1f5f9;
  font-size: 11px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .vvc-theme-picker-export-button {
  border-color: #475569;
  background-color: #334155;
  color: #94a3b8;
}

.vvc-theme-picker-export-button:hover {
  background-color: #e2e8f0;
}

.dark .vvc-theme-picker-export-button:hover {
  background-color: #475569;
}

.vvc-theme-picker-reset {
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background-color: transparent;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .vvc-theme-picker-reset {
  border-color: #475569;
  color: #94a3b8;
}

.vvc-theme-picker-reset:hover {
  background-color: #f1f5f9;
}

.dark .vvc-theme-picker-reset:hover {
  background-color: #334155;
}
</style>