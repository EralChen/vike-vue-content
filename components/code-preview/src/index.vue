<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue'
import { useLocale } from '@vike-vue-content/composables/locale'

const slots = useSlots()
const { t } = useLocale()
const sourceVisible = ref(false)

const hasSource = computed(() => !!slots.source)
const toggleLabel = computed(() => (sourceVisible.value ? t('codePreview.hideSource') : t('codePreview.showSource')))

function toggleSource() {
	if (!hasSource.value) return
	sourceVisible.value = !sourceVisible.value
}
</script>

<template>
	<div class="vvc-code-preview">
		<div class="vvc-code-preview-render">
			<slot />
		</div>

		<div v-if="hasSource" class="vvc-code-preview-toolbar">
			<button
				type="button"
				class="vvc-code-preview-toggle"
				:title="toggleLabel"
				:aria-label="toggleLabel"
				@click="toggleSource"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="16 18 22 12 16 6" />
					<polyline points="8 6 2 12 8 18" />
				</svg>
			</button>
		</div>

		<div v-if="hasSource" class="vvc-code-preview-source-grid" :class="{ 'is-open': sourceVisible }">
			<div class="vvc-code-preview-source-wrapper">
				<div class="vvc-code-preview-source">
					<slot name="source" />
				</div>
			</div>
		</div>

		<div v-if="hasSource && sourceVisible" class="vvc-code-preview-float-control" @click="toggleSource">
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<polyline points="18 15 12 9 6 15" />
			</svg>
			<span>{{ t('codePreview.hideSource') }}</span>
		</div>
	</div>
</template>

<style>
.vvc-code-preview {
	border: 1px solid var(--color-border, #e2e8f0);
	border-radius: var(--radius, 8px);
	margin: 1.25rem 0;
}

.dark .vvc-code-preview {
	border-color: var(--color-border, #334155);
}

.vvc-code-preview-render {
	padding: 1.5rem;
	background-color: var(--color-bg, #fff);
	overflow: auto;
}

.dark .vvc-code-preview-render {
	background-color: var(--color-surface-elevated, #1e293b);
}

.vvc-code-preview-toolbar {
	padding: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	height: 2.5rem;
	border-top: 1px solid var(--color-border, #e2e8f0);
}

.dark .vvc-code-preview-toolbar {
	border-top-color: var(--color-border, #334155);
}

.vvc-code-preview-toggle {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 4px;
	cursor: pointer;
	color: var(--color-text-muted, #94a3b8);
	background: transparent;
	border: none;
	border-radius: 4px;
	transition: color 0.2s;
}

.vvc-code-preview-toggle:hover {
	color: var(--color-text, #1e293b);
}

.dark .vvc-code-preview-toggle:hover {
	color: var(--color-text, #e2e8f0);
}

.vvc-code-preview-source-grid {
	display: grid;
	grid-template-rows: 0fr;
	transition: grid-template-rows 0.3s ease;
}

.vvc-code-preview-source-grid.is-open {
	grid-template-rows: 1fr;
}

.vvc-code-preview-source-wrapper {
	overflow: hidden;
}

.vvc-code-preview-source .vvc-prose-code-wrapper.vvc-prose-code-wrapper {
	margin: 0;
	border: none;
	border-radius: 0;
}

.vvc-code-preview-source .vvc-prose-code-pre.vvc-prose-code-pre {
	margin: 0;
	border-radius: 0;
}

.vvc-code-preview-source .vvc-code-group.vvc-code-group {
	margin: 0;
	border: none;
	border-radius: 0;
}

.vvc-code-preview-source .vvc-code-group-tabs.vvc-code-group-tabs {
	border-bottom-color: var(--color-border, #e2e8f0);
}

.vvc-code-preview-float-control {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	height: 44px;
	margin-top: -1px;
	border-top: 1px solid var(--color-border, #e2e8f0);
	background-color: var(--color-bg, #fff);
	color: var(--color-text-muted, #94a3b8);
	cursor: pointer;
	font-size: 14px;
	position: sticky;
	bottom: 0;
	z-index: 10;
	transition: color 0.2s;
}

.dark .vvc-code-preview-float-control {
	border-top-color: var(--color-border, #334155);
	background-color: var(--color-surface-elevated, #1e293b);
}

.vvc-code-preview-float-control:hover {
	color: var(--color-primary, #3b82f6);
}

.dark .vvc-code-preview-float-control:hover {
	color: var(--color-primary, #60a5fa);
}
</style>