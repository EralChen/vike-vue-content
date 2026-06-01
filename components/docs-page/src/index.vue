<template>
	<div class="vvc-docs-page">
		<aside class="vvc-docs-page-sidebar">
			<DocsNav :items="navigation" :current-path="requestedPath" />
		</aside>

		<article class="vvc-docs-page-content">
			<template v-if="page">
				<header v-if="page.description || tocItems.length" class="vvc-docs-page-meta">
					<p v-if="page.description" class="vvc-docs-page-description">
						{{ page.description }}
					</p>

					<nav v-if="tocItems.length" class="vvc-docs-page-toc" aria-label="本页目录">
						<p class="vvc-docs-page-toc-heading">本页目录</p>
						<ul class="vvc-docs-page-toc-list">
							<li v-for="item in tocItems" :key="item.id" class="vvc-docs-page-toc-item">
								<a
									class="vvc-docs-page-toc-link"
									:href="`#${item.id}`"
									:style="{ '--vvc-docs-page-toc-indent': `${item.indent}px` }"
								>
									{{ item.text }}
								</a>
							</li>
						</ul>
					</nav>
				</header>

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
import type { ContentTocLink, DocsPageData } from '@vike-vue-content/shared/types'
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
const tocItems = computed(() => flattenToc(page.value?.toc ?? []))

type FlattenedTocItem = {
	id: string
	text: string
	indent: number
}

function flattenToc(items: ContentTocLink[], baseDepth?: number): FlattenedTocItem[] {
	const rootDepth = baseDepth ?? items[0]?.depth ?? 2
	return items.flatMap((item) => [{
		id: item.id,
		text: item.text,
		indent: Math.max(item.depth - rootDepth, 0) * 12,
	}, ...flattenToc(item.children ?? [], rootDepth)])
}
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

.vvc-docs-page-meta {
	margin-bottom: 24px;
	padding-bottom: 20px;
	border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.vvc-docs-page-description {
	margin: 0 0 16px;
	font-size: 15px;
	line-height: 1.7;
	color: rgba(0, 0, 0, 0.68);
}

.vvc-docs-page-toc {
	padding: 16px;
	border: 1px solid rgba(0, 0, 0, 0.08);
	border-radius: 12px;
	background: rgba(0, 0, 0, 0.02);
}

.vvc-docs-page-toc-heading {
	margin: 0 0 8px;
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 0.04em;
	text-transform: uppercase;
	opacity: 0.7;
}

.vvc-docs-page-toc-list {
	list-style: none;
	margin: 0;
	padding: 0;
}

.vvc-docs-page-toc-item + .vvc-docs-page-toc-item {
	margin-top: 6px;
}

.vvc-docs-page-toc-link {
	display: block;
	padding-left: var(--vvc-docs-page-toc-indent, 0px);
	color: inherit;
	text-decoration: none;
	opacity: 0.8;
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