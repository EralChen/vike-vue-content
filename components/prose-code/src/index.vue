<script lang="ts" setup>
import { useTemplateRef } from 'vue'
import { useClipboard } from '@vueuse/core'
import { props as dprops, emits } from './ctx'

const props = defineProps(dprops)
const emit = defineEmits(emits)

const { copy, copied } = useClipboard({
	legacy: true,
})
const preRef = useTemplateRef('preRef')

function copyCode() {
	const text = props.code ?? preRef.value?.textContent ?? ''
	copy(text)
	emit('copy', text)
}
</script>

<template>
	<div class="vvc-prose-code-wrapper group">
		<div v-if="props.filename" class="vvc-prose-code-header">
			<span class="vvc-prose-code-filename">{{ props.filename }}</span>
		</div>

		<button class="vvc-prose-code-copy" :class="{ 'is-copied': copied }" @click="copyCode">
			<span v-if="copied" class="vvc-prose-code-copy-icon">✅</span>
			<span v-else class="vvc-prose-code-copy-icon">📋</span>
		</button>

		<pre
			ref="preRef"
			class="vvc-prose-code-pre"
			:class="[props.class, props.language ? `language-${props.language}` : '']"
		><slot /></pre>
	</div>
</template>

<style>
.vvc-prose-code-wrapper {
	background-color: var(--vvc-bg-elevated, #f1f5f9);
	border: 1px solid var(--vvc-border, #e2e8f0);
	border-radius: var(--vvc-radius, 8px);
	margin: 1.25rem 0;
	position: relative;
	overflow: hidden;
}

.dark .vvc-prose-code-wrapper {
	background-color: var(--vvc-bg-muted, #1e293b);
	border-color: var(--vvc-border, #334155);
}

.vvc-prose-code-header {
	border-bottom: 1px solid var(--vvc-border, #e2e8f0);
	align-items: center;
	gap: 8px;
	padding: 8px 16px;
	display: flex;
}

.dark .vvc-prose-code-header {
	border-color: var(--vvc-border, #334155);
}

.vvc-prose-code-filename {
	color: var(--vvc-text-muted, #64748b);
	font-family: monospace;
	font-size: 12px;
}

.vvc-prose-code-copy {
	opacity: 0;
	cursor: pointer;
	background-color: var(--vvc-bg, #fff);
	border: 1px solid var(--vvc-border, #e2e8f0);
	border-radius: 6px;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
	transition: opacity 0.2s;
	display: flex;
	position: absolute;
	top: 8px;
	right: 8px;
	z-index: 10;
}

.dark .vvc-prose-code-copy {
	background-color: var(--vvc-bg-elevated, #334155);
	border-color: var(--vvc-border, #334155);
}

.vvc-prose-code-wrapper:hover .vvc-prose-code-copy,
.vvc-prose-code-copy.is-copied {
	opacity: 1;
}

.vvc-prose-code-pre {
	margin: 0;
	padding: 16px;
	font-size: 14px;
	line-height: 1.6;
	overflow-x: auto;
}

.vvc-prose-code-pre code {
	background-color: transparent !important;
	border-radius: 0 !important;
	padding: 0 !important;
	font-family: inherit !important;
	font-size: inherit !important;
}
.vvc-prose-code-copy-icon {
	font-size: 14px;
	line-height: 1;
}
</style>
