<template>
	<button class="vvc-search-button" @click="toggle" aria-label="搜索文档">
		<svg class="vvc-search-button-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
		<span class="vvc-search-button-label">搜索文档...</span>
		<kbd v-if="isMounted" class="vvc-search-button-kbd">{{ shortcutLabel }}</kbd>
	</button>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useCommandPalette } from '@vike-vue-content/composables/command-palette'

const { toggle } = useCommandPalette()

const isMounted = ref(false)
const shortcutLabel = ref('Ctrl+K')

onMounted(() => {
	isMounted.value = true
	if (typeof navigator !== 'undefined') {
		const mac = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
		shortcutLabel.value = mac ? '⌘K' : 'Ctrl+K'
	}
})
</script>

<style>
.vvc-search-button {
	display: flex;
	align-items: center;
	gap: 8px;
	width: 100%;
	padding: 6px 10px;
	border: 1px solid var(--vvc-border, #e2e8f0);
	border-radius: var(--vvc-radius, 4px);
	background: var(--vvc-bg-elevated, #f8fafc);
	color: var(--vvc-text-muted, #94a3b8);
	font-size: 14px;
	cursor: pointer;
	transition: border-color 0.2s, background 0.2s;
}

.vvc-search-button:hover {
	border-color: var(--vvc-color-primary, #3b82f6);
	background: var(--vvc-bg, #fff);
}

.vvc-search-button-icon {
	flex-shrink: 0;
}

.vvc-search-button-label {
	flex: 1;
	text-align: left;
}

.vvc-search-button-kbd {
	flex-shrink: 0;
	padding: 1px 5px;
	border: 1px solid var(--vvc-border, #e2e8f0);
	border-radius: 3px;
	font-size: 11px;
	font-family: inherit;
	color: var(--vvc-text-muted, #94a3b8);
	background: var(--vvc-bg, #fff);
}
</style>
