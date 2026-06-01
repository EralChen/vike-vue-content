<template>
	<div class="docs-layout">
		<aside class="docs-sidebar">
			<DocsNav :items="navigation" :current-path="requestedPath" />
		</aside>

		<article class="docs-content">
			<template v-if="page">
				<ContentRenderer :key="requestedPath" :tree="contentTree" />

				<nav class="docs-surround">
					<a v-if="prev" class="docs-surround-link prev" :href="prev.path">
						<span class="label">上一页</span>
						<span class="title">{{ prev.title }}</span>
					</a>
					<span v-else />
					<a v-if="next" class="docs-surround-link next" :href="next.path">
						<span class="label">下一页</span>
						<span class="title">{{ next.title }}</span>
					</a>
				</nav>
			</template>

			<section v-else class="docs-not-found">
				<h1>404</h1>
				<p>找不到内容：{{ requestedPath }}</p>
			</section>
		</article>
	</div>
</template>

<script setup lang="ts">
import type { ComarkTree } from 'comark'
import { computed } from 'vue'
import { useData } from 'vike-vue/useData'

import ContentRenderer from '../../content-renderer'
import DocsNav from './DocsNav.vue'

type DocsPageData = {
	docsBase: string
	page: {
		body: ComarkTree
	} | null
	navigation: Array<{
		title: string
		path: string
		children?: DocsPageData['navigation']
		page?: false
	}>
	prev: {
		title: string
		path: string
	} | null
	next: {
		title: string
		path: string
	} | null
	requestedPath: string
}

const docsData = useData<DocsPageData>() as DocsPageData

const docsBase = computed(() => docsData.docsBase)
const page = computed(() => docsData.page)
const navigation = computed(() => docsData.navigation)
const prev = computed(() => docsData.prev)
const next = computed(() => docsData.next)
const requestedPath = computed(() => docsData.requestedPath)
const contentTree = computed<ComarkTree | undefined>(() => page.value?.body)
</script>

<style scoped>
.docs-layout {
	display: grid;
	grid-template-columns: 220px 1fr;
	gap: 32px;
	align-items: start;
}

.docs-content {
	min-width: 0;
}

.docs-surround {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
	margin-top: 48px;
	border-top: 1px solid rgba(0, 0, 0, 0.1);
	padding-top: 16px;
}

.docs-surround-link {
	display: flex;
	flex-direction: column;
	padding: 12px 16px;
	border: 1px solid rgba(0, 0, 0, 0.12);
	border-radius: 8px;
	color: inherit;
	text-decoration: none;
}

.docs-surround-link.next {
	text-align: right;
}

.docs-surround-link .label {
	font-size: 12px;
	opacity: 0.6;
}

.docs-surround-link .title {
	font-weight: 600;
}

.docs-not-found {
	color: #b00020;
}
</style>