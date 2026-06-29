<template>
  <button
    ref="buttonRef"
    class="vvc-color-mode-button"
    @click="handleToggle"
    :title="isDark ? '浅色模式' : '深色模式'"
    :aria-label="isDark ? '浅色模式' : '深色模式'"
  >
    <span v-if="isDark" class="vvc-color-mode-icon">🌙</span>
    <span v-else class="vvc-color-mode-icon">☀️</span>
  </button>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { useTheme } from '@vike-vue-content/composables/theme'

const { isDark, mode } = useTheme()
const buttonRef = ref<HTMLButtonElement>()

function handleToggle() {
  // 检查是否支持 View Transitions API，且用户未开启减弱动画
  const supportsViewTransition =
    'startViewTransition' in document &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!supportsViewTransition) {
    // 不支持则直接切换
    toggle()
    return
  }

  // 支持则播放圆形展开动画
  const button = buttonRef.value!
  const rect = button.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  // 计算能覆盖整个视口的圆半径
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  // 转换为百分比，适配 clipPath
  const ratioX = (100 * x) / window.innerWidth
  const ratioY = (100 * y) / window.innerHeight
  const referR = Math.hypot(window.innerWidth, window.innerHeight) / Math.SQRT2
  const ratioR = (100 * endRadius) / referR


  const transition = document.startViewTransition(async () => {
    toggle()
    await nextTick()
  })

  transition.ready.then(() => {
    const clipPath = [
      `circle(0% at ${ratioX}% ${ratioY}%)`,
      `circle(${ratioR}% at ${ratioX}% ${ratioY}%)`,
    ]

    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-in',
        fill: 'both',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      }
    )
  })
}

function toggle() {
  mode.value = isDark.value ? 'light' : 'dark'
}
</script>

<style>
/* View Transitions: 明暗切换圆形展开动画 */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 2147483646;
}

.dark::view-transition-old(root) {
  z-index: 2147483646;
}

.dark::view-transition-new(root) {
  z-index: 1;
}

/* 按钮样式 */
.vvc-color-mode-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  transition: all 0.2s ease;
  color: var(--color-text-muted);
}

.vvc-color-mode-button:hover {
  background-color: var(--color-surface-elevated);
}

.vvc-color-mode-icon {
  font-size: 18px;
  line-height: 1;
}
</style>
