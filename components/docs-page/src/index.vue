<template>
	<div class="vvc-docs-page" :class="{ 'has-page-outline': tocLinks.length }">
		<aside class="vvc-docs-page-sidebar">
			<DocsNav :items="navigation" :current-path="requestedPath" />
		</aside>

		<aside v-if="page && tocLinks.length" class="vvc-docs-page-outline">
			<DocsToc :links="tocLinks" :active="activeHeadings" @select="scrollToHeading" />
		</aside>

		<article class="vvc-docs-page-content">
			<template v-if="page">
				<header v-if="page.description" class="vvc-docs-page-meta">
					<p class="vvc-docs-page-description">
						{{ page.description }}
					</p>
				</header>

				<ContentRenderer :key="requestedPath" :tree="contentTree" @resolve="onContentResolve" />

				<DocsSurround :prev="prev" :next="next" />
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
import { computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useData } from 'vike-vue/useData'

import ContentRenderer from '@vike-vue-content/components/content-renderer'
import DocsNav from '@vike-vue-content/components/docs-nav'
import DocsToc from '@vike-vue-content/components/docs-toc'
import DocsSurround from '@vike-vue-content/components/docs-surround'
import { useScrollspy } from '@vike-vue-content/composables/scrollspy'

const docsData = useData<DocsPageData>() as DocsPageData

const page = computed(() => docsData.page)
const navigation = computed(() => docsData.navigation)
const prev = computed(() => docsData.prev)
const next = computed(() => docsData.next)
const requestedPath = computed(() => docsData.requestedPath)
const contentTree = computed<ComarkTree | undefined>(() => page.value?.body as ComarkTree | undefined)
const tocLinks = computed<ContentTocLink[]>(() => page.value?.toc ?? [])

const { activeHeadings, updateHeadings } = useScrollspy()

function collectHeadingIds(items: ContentTocLink[]): string[] {
	return items.flatMap((item) => [item.id, ...collectHeadingIds(item.children ?? [])])
}

function getHeadingElements(): HTMLElement[] {
	if (typeof document === 'undefined') {
		return []
	}

	return collectHeadingIds(tocLinks.value)
		.map((id) => document.getElementById(id))
		.filter((element): element is HTMLElement => Boolean(element))
}

function refreshScrollspy() {
	updateHeadings(getHeadingElements())
}

// 内容由 <Suspense> 异步渲染，标题要等渲染进 DOM 后才能被观察。
// content-renderer 转发的 resolve 事件等价于 Nuxt 的 page:loading:end。
function onContentResolve() {
	refreshScrollspy()
	syncWithHash()
}

function scrollToHeading(id: string, behavior: ScrollBehavior = 'smooth', updateHash = true) {
	if (typeof window === 'undefined') {
		return
	}

	if (updateHash) {
		const nextUrl = `${window.location.pathname}${window.location.search}#${id}`
		window.history.replaceState(window.history.state, '', nextUrl)
	}

	document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
}

function syncWithHash() {
	if (typeof window === 'undefined') {
		return
	}

	const hash = window.location.hash.replace(/^#/, '')
	if (hash) {
		scrollToHeading(hash, 'auto', false)
	}
}

onMounted(async () => {
	if (typeof window !== 'undefined') {
		window.addEventListener('hashchange', syncWithHash)
	}

	await nextTick()
	refreshScrollspy()
	syncWithHash()
})

onBeforeUnmount(() => {
	if (typeof window !== 'undefined') {
		window.removeEventListener('hashchange', syncWithHash)
	}
})

watch([requestedPath, tocLinks], async () => {
	await nextTick()
	refreshScrollspy()
}, { flush: 'post' })
</script>

<style>
.vvc-docs-page {
	display: grid;
	grid-template-columns: 220px minmax(0, 1fr);
	grid-template-areas: 'sidebar content';
	gap: 32px;
	align-items: start;
}

.vvc-docs-page.has-page-outline {
	grid-template-columns: 220px minmax(0, 1fr) 220px;
	grid-template-areas: 'sidebar content outline';
}

.vvc-docs-page-sidebar {
	grid-area: sidebar;
}

.vvc-docs-page-outline {
	grid-area: outline;
	position: sticky;
	top: var(--vvc-toc-sticky-top, 80px);
	max-height: calc(100vh - var(--vvc-toc-sticky-top, 80px) - 16px);
	overflow: auto;
	scrollbar-width: thin;
	scrollbar-color: var(--vvc-border, #e2e8f0) transparent;
}

.vvc-docs-page-content {
	grid-area: content;
	min-width: 0;
}

.vvc-docs-page-meta {
	margin-bottom: 24px;
	padding-bottom: 20px;
	border-bottom: 1px solid var(--vvc-border, #e2e8f0);
}

.vvc-docs-page-description {
	margin: 0 0 16px;
	font-size: 15px;
	line-height: 1.7;
	color: var(--vvc-text-muted, #64748b);
}

.vvc-docs-page-not-found {
	color: #ef4444;
}

.vvc-docs-page-content :is(h2, h3, h4, h5, h6) {
	scroll-margin-top: 96px;
}

/* 内容区域样式 */
.vvc-docs-page-content h1 {
	font-size: 2rem;
	font-weight: 700;
	margin-bottom: 1rem;
	color: var(--vvc-text, #0f172a);
}

.vvc-docs-page-content h2 {
	font-size: 1.5rem;
	font-weight: 600;
	margin-top: 2rem;
	margin-bottom: 0.75rem;
	color: var(--vvc-text, #0f172a);
	border-bottom: 1px solid var(--vvc-border, #e2e8f0);
	padding-bottom: 0.5rem;
}

.vvc-docs-page-content h3 {
	font-size: 1.25rem;
	font-weight: 600;
	margin-top: 1.5rem;
	margin-bottom: 0.5rem;
	color: var(--vvc-text, #0f172a);
}

.vvc-docs-page-content p {
	margin-bottom: 1rem;
	line-height: 1.7;
	color: var(--vvc-text-muted, #64748b);
}

.vvc-docs-page-content a {
	color: var(--vvc-color-primary, #3b82f6);
	text-decoration: none;
}

.vvc-docs-page-content a:hover {
	text-decoration: underline;
}

.vvc-docs-page-content code {
	background-color: var(--vvc-bg-elevated, #f1f5f9);
	padding: 0.125rem 0.375rem;
	border-radius: 0.25rem;
	font-size: 0.875rem;
	color: var(--vvc-color-primary-dark, #2563eb);
}


.vvc-docs-page-content ul,
.vvc-docs-page-content ol {
	margin-bottom: 1rem;
	padding-left: 1.5rem;
}

.vvc-docs-page-content li {
	margin-bottom: 0.25rem;
	line-height: 1.7;
	color: var(--vvc-text-muted, #64748b);
}

.vvc-docs-page-content blockquote {
	border-left: 4px solid var(--vvc-color-primary, #3b82f6);
	padding-left: 1rem;
	margin: 1rem 0;
	color: var(--vvc-text-muted, #64748b);
	font-style: italic;
}

.vvc-docs-page-content img {
	max-width: 100%;
	border-radius: var(--vvc-radius, 0.25rem);
}

.vvc-docs-page-content hr {
	border: none;
	border-top: 1px solid var(--vvc-border, #e2e8f0);
	margin: 2rem 0;
}

.vvc-docs-page-content table {
	width: 100%;
	border-collapse: collapse;
	margin-bottom: 1rem;
}

.vvc-docs-page-content th,
.vvc-docs-page-content td {
	padding: 0.75rem;
	border: 1px solid var(--vvc-border, #e2e8f0);
	text-align: left;
}

.vvc-docs-page-content th {
	background-color: var(--vvc-bg-muted, #f8fafc);
	font-weight: 600;
	color: var(--vvc-text, #0f172a);
}

@media (max-width: 1100px) {
	.vvc-docs-page,
	.vvc-docs-page.has-page-outline {
		grid-template-columns: 1fr;
		grid-template-areas:
			'sidebar'
			'outline'
			'content';
	}

	.vvc-docs-page-outline {
		position: static;
		max-height: none;
		overflow: visible;
		padding-top: 0;
	}
}
</style>