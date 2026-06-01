<template>
	<div class="vvc-docs-page">
		<aside class="vvc-docs-page-sidebar">
			<DocsNav :items="navigation" :current-path="requestedPath" />
		</aside>

		<article class="vvc-docs-page-content">
			<template v-if="page">
				<ContentRenderer :key="requestedPath" :tree="contentTree" />

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

			<section v-else class="vvc-docs-page-not-found">
				<h1>404</h1>
				<p>找不到内容：{{ requestedPath }}</p>
			</section>
		</article>
	</div>
</template>

<script setup lang="ts">
import type { ComarkTree } from 'comark'
import type { DocsPageData } from '@vike-vue-content/shared/types'
import { computed } from 'vue'
import { useData } from 'vike-vue/useData'

import ContentRenderer from '../../content-renderer'
import DocsNav from './DocsNav.vue'

const docsData = useData<DocsPageData>() as DocsPageData

const docsBase = computed(() => docsData.docsBase)
const page = computed(() => docsData.page)
const navigation = computed(() => docsData.navigation)
const prev = computed(() => docsData.prev)
const next = computed(() => docsData.next)
const requestedPath = computed(() => docsData.requestedPath)
const contentTree = computed<ComarkTree | undefined>(() => page.value?.body as ComarkTree | undefined)
</script>

<style>
.vvc-docs-page {
	display: grid;
	grid-template-columns: 220px 1fr;
	gap: 32px;
	align-items: start;
}

.vvc-docs-page-content {
	min-width: 0;
}

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

.vvc-docs-page-not-found {
	color: #b00020;
}
</style>