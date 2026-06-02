<template>
	<nav class="vvc-docs-page-surround">
		<a
			v-if="prev"
			class="vvc-docs-page-surround-link vvc-docs-page-surround-link-prev"
			:href="prev.path"
		>
			<span class="vvc-docs-page-surround-label">上一页</span>
			<span class="vvc-docs-page-surround-title">{{ prev.title }}</span>
		</a>
		<span v-else />
		<a
			v-if="next"
			class="vvc-docs-page-surround-link vvc-docs-page-surround-link-next"
			:href="next.path"
		>
			<span class="vvc-docs-page-surround-label">下一页</span>
			<span class="vvc-docs-page-surround-title">{{ next.title }}</span>
		</a>
	</nav>
</template>

<script lang="ts" setup>
import { props as dprops, emits } from './ctx'

const props = defineProps(dprops)
const emit = defineEmits(emits)
</script>

<style>
.vvc-docs-page-surround {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-top: 48px;
	border-top: 1px solid rgba(0, 0, 0, 0.1);
	padding-top: 16px;
}

.vvc-docs-page-surround-link {
	display: flex;
	flex-direction: column;
	padding: 12px 16px;
	border: 1px solid rgba(0, 0, 0, 0.12);
	border-radius: 8px;
	color: inherit;
	text-decoration: none;
}

.vvc-docs-page-surround-link-next {
	text-align: right;
}

.vvc-docs-page-surround-label {
	font-size: 12px;
	opacity: 0.6;
}

.vvc-docs-page-surround-title {
	font-weight: 600;
}
</style>