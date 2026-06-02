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
	top: 32px;
	max-height: calc(100vh - 48px);
	overflow: auto;
}

.vvc-docs-page-content {
	grid-area: content;
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

.vvc-docs-page-not-found {
	color: #b00020;
}

.vvc-docs-page-content :is(h2, h3, h4, h5, h6) {
	scroll-margin-top: 96px;
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