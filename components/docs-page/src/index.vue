<template>
	<div>

		<!-- Mobile: sticky bar below header (outside grid, in normal flow) -->
		<div class="mobile-docs-bar">
			<button class="mobile-docs-bar__btn" @click="isMobileSidebarOpen = true"
				:class="{ 'active': isMobileSidebarOpen }" aria-label="Toggle menu">
				<svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor"><path d="M2 3h12a1 1 0 010 2H2a1 1 0 110-2zm0 4h12a1 1 0 010 2H2a1 1 0 010-2zm0 4h12a1 1 0 010 2H2a1 1 0 010-2z"/></svg>
				<span>Menu</span>
			</button>
			<button v-if="tocLinks.length" class="mobile-docs-bar__btn mobile-docs-bar__btn--right" @click="isMobileTocOpen = true"
				:class="{ 'active': isMobileTocOpen }" aria-label="Table of contents">
				<span>On this page</span>
				<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M6.5 3l4.25 4.25L6.5 11.5z"/></svg>
			</button>
		</div>

		<div class="vvc-docs-page" :class="{ 'has-page-outline': tocLinks.length }">

			<!-- Desktop sidebar -->
			<DocsAside position="left" class="vvc-docs-page-sidebar">
				<template #top>
					<SearchButton />
				</template>
				<DocsNav :items="navigation" :current-path="requestedPath" />
			</DocsAside>

			<!-- Desktop TOC -->
			<DocsAside v-if="page && tocLinks.length" position="right" class="vvc-docs-page-outline">
				<DocsToc :links="tocLinks" :active="activeHeadings" @select="scrollToHeading" />
			</DocsAside>

			<article class="vvc-docs-page-content">
				<template v-if="page">
					<header v-if="page.description" class="vvc-docs-page-meta">
						<p class="vvc-docs-page-description">
							{{ page.description }}
						</p>
					</header>

					<ContentRenderer :key="`${requestedPath}:${demosDir}`" :tree="contentTree" :components="contentComponents" :demos="contentDemos" :sources="contentSources" :parsedSources="contentParsedSources" @resolve="onContentResolve" />

					<DocsSurround :prev="prev" :next="next" />
				</template>

				<section v-else class="vvc-docs-page-not-found">
					<h1>404</h1>
					<p>{{ t('page.notFound', { path: requestedPath }) }}</p>
				</section>
			</article>

			<CommandPalette :items="searchItems" />
		</div>

		<!-- Mobile sidebar drawer -->
		<Drawer v-model:open="isMobileSidebarOpen" direction="left">
			<div class="mobile-drawer-header">
				<button class="mobile-drawer-close" @click="isMobileSidebarOpen = false" aria-label="Close">
					<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/></svg>
				</button>
			</div>
			<div class="mobile-drawer-body">
				<SearchButton />
				<DocsNav :items="navigation" :current-path="requestedPath" />
			</div>
		</Drawer>

		<!-- Mobile TOC drawer -->
		<Drawer v-if="tocLinks.length" v-model:open="isMobileTocOpen" direction="right">
			<div class="mobile-drawer-header">
				<span class="mobile-drawer-title">On this page</span>
				<button class="mobile-drawer-close" @click="isMobileTocOpen = false" aria-label="Close">
					<svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor"><path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/></svg>
				</button>
			</div>
			<div class="mobile-drawer-body">
				<DocsToc :links="tocLinks" :active="activeHeadings" @select="onTocDrawerSelect" />
			</div>
		</Drawer>

	</div>
</template>

<script setup lang="ts">
import type { ComarkTree } from 'comark'
import type { ContentComponents, ContentConfig, ContentTocLink, DocsPageData } from '@vike-vue-content/shared/types'
import { demosByDir as autoDemos } from 'virtual:vvc-demos'
import { sourcesByDir as autoSources } from 'virtual:vvc-demo-sources'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vike-vue/useData'
import { usePageContext } from 'vike-vue/usePageContext'

import DocsAside from '@vike-vue-content/components/docs-aside'
import ContentRenderer from '@vike-vue-content/components/content-renderer'
import CommandPalette from '@vike-vue-content/components/command-palette'
import DocsNav from '@vike-vue-content/components/docs-nav'
import DocsToc from '@vike-vue-content/components/docs-toc'
import DocsSurround from '@vike-vue-content/components/docs-surround'
import Drawer from '@vike-vue-content/components/drawer'
import SearchButton from '@vike-vue-content/components/search-button'
import { useCommandPalette } from '@vike-vue-content/composables/command-palette'
import { useLocale } from '@vike-vue-content/composables/locale'
import { useScrollspy } from '@vike-vue-content/composables/scrollspy'

interface SearchItem {
	title: string
	description?: string
	path: string
	group?: string
	prefix?: string
	level?: number
}

const docsData = useData<DocsPageData>() as DocsPageData
const pageContext = usePageContext()

const page = computed(() => docsData.page)
const navigation = computed(() => docsData.navigation)

function flattenNav(
	items: typeof navigation.value,
	group?: string,
	prefix?: string,
): SearchItem[] {
	return items.flatMap((item) => {
		if (item.children?.length) {
			return flattenNav(
				item.children,
				group || item.title,
				prefix ? `${prefix} > ${item.title}` : item.title,
			)
		}
		return [{
			title: item.title,
			description: (item as { description?: string }).description,
			path: item.path,
			group: group || item.title,
			prefix: prefix ? `${prefix} >` : undefined,
				level: 1,
		}]
	})
}

const searchIndexMap = (pageContext as any)._searchIndexMap as Record<string, SearchItem[]> | undefined
const { searchTerm } = useCommandPalette()
const { t } = useLocale()

const searchItems = computed<SearchItem[]>(() => {
	if (searchTerm.value) {
		const docsBase = docsData.docsBase
		const index = searchIndexMap?.[docsBase]
		if (index?.length) return index
	}
	return flattenNav(navigation.value)
})

const prev = computed(() => docsData.prev)
const next = computed(() => docsData.next)
const requestedPath = computed(() => docsData.requestedPath)
const contentTree = computed<ComarkTree | undefined>(() => page.value?.body as ComarkTree | undefined)
const tocLinks = computed<ContentTocLink[]>(() => page.value?.toc ?? [])
const contentComponents = computed<ContentComponents | undefined>(() => {
	const config = pageContext.config as { content?: ContentConfig }
	return config?.content?.components
})

const demosDir = computed(() => docsData.demosDir || '')

const contentDemos = computed(() => {
	const dir = demosDir.value
	return autoDemos[dir]
})
const contentSources = computed(() => {
	const dir = demosDir.value
	return autoSources[dir]
})
const contentParsedSources = computed(() => docsData.parsedSources ?? {})

const { activeHeadings, updateHeadings } = useScrollspy()

// Mobile drawer state
const isMobileSidebarOpen = ref(false)
const isMobileTocOpen = ref(false)

function onTocDrawerSelect(id: string) {
	scrollToHeading(id)
	isMobileTocOpen.value = false
}

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
	position: sticky;
	top: var(--vvc-toc-sticky-top, 80px);
	max-height: calc(100vh - var(--vvc-toc-sticky-top, 80px) - 16px);
	display: flex;
	flex-direction: column;
	overflow: hidden;
	scrollbar-width: thin;
	scrollbar-color: var(--color-border, #e2e8f0) transparent;
}

.vvc-docs-page-sidebar .vvc-docs-aside-body {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	scrollbar-width: thin;
	scrollbar-color: var(--color-border, #e2e8f0) transparent;
}

.vvc-docs-page-outline {
	grid-area: outline;
	position: sticky;
	top: var(--vvc-toc-sticky-top, 80px);
	max-height: calc(100vh - var(--vvc-toc-sticky-top, 80px) - 16px);
	overflow: auto;
	scrollbar-width: thin;
	scrollbar-color: var(--color-border, #e2e8f0) transparent;
}

.vvc-docs-page-content {
	grid-area: content;
	min-width: 0;
}

.vvc-docs-page-meta {
	margin-bottom: 24px;
	padding-bottom: 20px;
	border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.vvc-docs-page-description {
	margin: 0 0 16px;
	font-size: 15px;
	line-height: 1.7;
	color: var(--color-text-muted, #64748b);
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
	color: var(--color-text, #0f172a);
}

.vvc-docs-page-content h2 {
	font-size: 1.5rem;
	font-weight: 600;
	margin-top: 2rem;
	margin-bottom: 0.75rem;
	color: var(--color-text, #0f172a);
	border-bottom: 1px solid var(--color-border, #e2e8f0);
	padding-bottom: 0.5rem;
}

.vvc-docs-page-content h3 {
	font-size: 1.25rem;
	font-weight: 600;
	margin-top: 1.5rem;
	margin-bottom: 0.5rem;
	color: var(--color-text, #0f172a);
}

.vvc-docs-page-content p {
	margin-bottom: 1rem;
	line-height: 1.7;
	color: var(--color-text-muted, #64748b);
}

.vvc-docs-page-content a {
	color: var(--color-primary, #3b82f6);
	text-decoration: none;
}

.vvc-docs-page-content a:hover {
	text-decoration: underline;
}

.vvc-docs-page-content code {
	background-color: var(--color-surface-elevated, #f1f5f9);
	padding: 0.125rem 0.375rem;
	border-radius: 0.25rem;
	font-size: 0.875rem;
	color: var(--color-primary-dark, #2563eb);
}


.vvc-docs-page-content ul,
.vvc-docs-page-content ol {
	margin-bottom: 1rem;
	padding-left: 1.5rem;
}

.vvc-docs-page-content li {
	margin-bottom: 0.25rem;
	line-height: 1.7;
	color: var(--color-text-muted, #64748b);
}

.vvc-docs-page-content blockquote {
	border-left: 4px solid var(--color-primary, #3b82f6);
	padding-left: 1rem;
	margin: 1rem 0;
	color: var(--color-text-muted, #64748b);
	font-style: italic;
}

.vvc-docs-page-content img {
	max-width: 100%;
	border-radius: var(--radius, 0.25rem);
}

.vvc-docs-page-content hr {
	border: none;
	border-top: 1px solid var(--color-border, #e2e8f0);
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
	border: 1px solid var(--color-border, #e2e8f0);
	text-align: left;
}

.vvc-docs-page-content th {
	background-color: var(--color-surface, #f8fafc);
	font-weight: 600;
	color: var(--color-text, #0f172a);
}

/* ==================== Mobile Docs Bar ==================== */

.mobile-docs-bar {
	display: none;
}

/* ==================== Mobile Drawer Slot Styles ==================== */

.mobile-drawer-header {
	display: flex;
	align-items: center;
	justify-content: flex-end;
	padding: 12px 16px;
	border-bottom: 1px solid var(--color-border, #e2e8f0);
	min-height: 48px;
}

.mobile-drawer-title {
	font-size: 14px;
	font-weight: 600;
	color: var(--color-text, #0f172a);
	margin-right: auto;
}

.mobile-drawer-close {
	background: none;
	border: none;
	padding: 4px;
	border-radius: 6px;
	color: var(--color-text-muted, #64748b);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background-color 0.15s;
}

.mobile-drawer-close:hover {
	background-color: var(--color-surface-elevated, #f1f5f9);
}

.mobile-drawer-body {
	padding: 12px 16px 24px;
}

/* ==================== Responsive ==================== */

@media (max-width: 1100px) {
	.vvc-docs-page,
	.vvc-docs-page.has-page-outline {
		grid-template-columns: 1fr;
		grid-template-areas: 'content';
	}
}

@media (max-width: 768px) {
	/* Show mobile bar */
	.mobile-docs-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: var(--vvc-header-height, 57px);
		z-index: 20;
		margin: 0 -1rem;
		padding: 8px 1rem;
		border-bottom: 1px dashed var(--color-border, #e2e8f0);
		background-color: color-mix(in srgb, var(--color-bg, #fff) 75%, transparent);
		backdrop-filter: blur(8px);
	}

	.mobile-docs-bar__btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		background: none;
		border: none;
		color: var(--color-text-muted, #64748b);
		border-radius: 6px;
		padding: 7px 12px;
		font-size: 14px;
		cursor: pointer;
		transition: background-color 0.15s;
	}

	.mobile-docs-bar__btn:hover,
	.mobile-docs-bar__btn.active {
		background-color: var(--color-surface-elevated, #f1f5f9);
		color: var(--color-text, #0f172a);
	}

	.mobile-docs-bar__btn--right {
		gap: 2px;
	}

	.mobile-docs-bar__btn--right svg {
		margin-left: 2px;
	}

	/* Hide desktop sidebar / outline on mobile */
	.vvc-docs-page-sidebar {
		display: none !important;
	}

	.vvc-docs-page-outline {
		display: none !important;
	}
}
</style>
