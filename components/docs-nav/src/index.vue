<template>
	<ul class="vvc-docs-nav-list">
		<li v-for="item in items" :key="item.path" class="vvc-docs-nav-item">
			<a
				v-if="item.page !== false"
				:href="item.path"
				:aria-current="item.path === currentPath ? 'page' : undefined"
				class="vvc-docs-nav-link"
				:class="{ 'is-active': item.path === currentPath }"
			>
				{{ item.title }}
			</a>
			<span v-else class="vvc-docs-nav-group">{{ item.title }}</span>

			<DocsNav
				v-if="item.children && item.children.length"
				:items="item.children"
				:current-path="currentPath"
			/>
		</li>
	</ul>
</template>

<script lang="ts" setup>
import { props as dprops, emits } from './ctx'
import DocsNav from './index.vue'

const props = defineProps(dprops)
const emit = defineEmits(emits)
</script>

<style>
.vvc-docs-nav-list {
	list-style: none;
	margin: 0;
	padding: 0;
}

.vvc-docs-nav-list .vvc-docs-nav-list {
	padding-left: 12px;
}

.vvc-docs-nav-item {
	margin: 4px 0;
}

.vvc-docs-nav-link {
	display: block;
	padding: 4px 8px;
	border-radius: var(--vvc-radius, 4px);
	color: var(--vvc-text-muted, #64748b);
	text-decoration: none;
	transition: all 0.2s;
}

.vvc-docs-nav-link:hover {
	color: var(--vvc-text, #0f172a);
	background-color: var(--vvc-bg-elevated, #f1f5f9);
}

.vvc-docs-nav-link.is-active {
	color: var(--vvc-color-primary, #3b82f6);
	background-color: var(--vvc-bg-muted, #f8fafc);
	font-weight: 600;
}

.dark .vvc-docs-nav-link:hover {
	color: var(--vvc-text, #f1f5f9);
}

.vvc-docs-nav-group {
	display: block;
	padding: 4px 8px;
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: var(--vvc-text-dimmed, #94a3b8);
}
</style>