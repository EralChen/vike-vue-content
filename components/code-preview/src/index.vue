<script lang="ts" setup>
import { useSlots } from 'vue'

const slots = useSlots()
</script>

<template>
	<div class="vvc-code-preview">
		<div class="vvc-code-preview-render">
			<slot />
		</div>
		<div v-if="!!slots.code" class="vvc-code-preview-code">
			<slot name="code" />
		</div>
	</div>
</template>

<style>
.vvc-code-preview {
	margin: 1.25rem 0;
}

.vvc-code-preview-render {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1.5rem;
	border: 1px solid var(--vvc-border, #e2e8f0);
	border-radius: var(--vvc-radius, 8px);
	background-color: var(--vvc-bg, #fff);
}

.dark .vvc-code-preview-render {
	background-color: var(--vvc-bg-muted, #1e293b);
	border-color: var(--vvc-border, #334155);
}

.vvc-code-preview:has(.vvc-code-preview-code) .vvc-code-preview-render {
	border-bottom: none;
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
}

.vvc-code-preview-code .vvc-prose-code-wrapper {
	margin: 0;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
}
</style>
