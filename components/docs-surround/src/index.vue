<template>
	<nav class="vvc-docs-page-surround">
		<Link
			v-if="prev"
			class="vvc-docs-page-surround-link vvc-docs-page-surround-link-prev"
			:href="prev.path"
		>
			<span class="vvc-docs-page-surround-label">{{ t('surround.prev') }}</span>
			<span class="vvc-docs-page-surround-title">{{ prev.title }}</span>
		</Link>
		<span v-else />
		<Link
			v-if="next"
			class="vvc-docs-page-surround-link vvc-docs-page-surround-link-next"
			:href="next.path"
		>
			<span class="vvc-docs-page-surround-label">{{ t('surround.next') }}</span>
			<span class="vvc-docs-page-surround-title">{{ next.title }}</span>
		</Link>
	</nav>
</template>

<script lang="ts" setup>
import { props as dprops, emits } from './ctx'
import { Link } from '@vike-vue-content/components/link'
import { useLocale } from '@vike-vue-content/composables/locale'

const props = defineProps(dprops)
const emit = defineEmits(emits)
const { t } = useLocale()
</script>

<style>
.vvc-docs-page-surround {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-top: 48px;
	border-top: 1px solid var(--color-border, rgba(0, 0, 0, 0.1));
	padding-top: 16px;
}

.vvc-docs-page-surround-link {
	display: flex;
	flex-direction: column;
	padding: 12px 16px;
	border: 1px solid var(--color-border, rgba(0, 0, 0, 0.12));
	border-radius: var(--radius, 8px);
	color: var(--color-text, inherit);
	text-decoration: none;
	transition: all 0.2s;
}

.vvc-docs-page-surround-link:hover {
	background-color: var(--color-surface, #f8fafc);
	border-color: var(--color-primary, #3b82f6);
}

.vvc-docs-page-surround-link-next {
	text-align: right;
}

.vvc-docs-page-surround-label {
	font-size: 12px;
	color: var(--color-text-dimmed, #94a3b8);
}

.vvc-docs-page-surround-title {
	font-weight: 600;
	color: var(--color-text, #0f172a);
}
</style>