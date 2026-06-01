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

<script setup lang="ts">
type DocsNavigationItem = {
	title: string
	path: string
	children?: DocsNavigationItem[]
	page?: false
}

defineProps<{
	items: DocsNavigationItem[]
	currentPath: string
}>()
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
	border-radius: 4px;
	color: inherit;
	text-decoration: none;
}

.vvc-docs-nav-link.is-active {
	background-color: rgba(0, 0, 0, 0.08);
	font-weight: 600;
}

.vvc-docs-nav-group {
	display: block;
	padding: 4px 8px;
	font-size: 12px;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	opacity: 0.6;
}
</style>