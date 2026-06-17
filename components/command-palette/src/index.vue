<template>
	<Teleport v-if="isMounted" to="body">
		<div v-if="open" class="vvc-cmd-overlay" @click.self="close" @keydown="onOverlayKeydown">
			<div class="vvc-cmd-modal" role="dialog" aria-modal="true" :aria-label="t('cmd.ariaLabel')">
				<div class="vvc-cmd-input-wrapper">
					<svg class="vvc-cmd-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="8" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					<input
						ref="inputRef"
						v-model="searchTerm"
						class="vvc-cmd-input"
						:placeholder="placeholder"
						@keydown="onInputKeydown"
					/>
					<kbd class="vvc-cmd-esc-kbd">Esc</kbd>
				</div>

				<div class="vvc-cmd-results" ref="resultsRef">
					<template v-if="flatResults.length">
						<template v-for="group in groupedResults" :key="group.label">
							<div class="vvc-cmd-group-label">{{ group.label }}</div>
							<Link
								v-for="(item, i) in group.items"
								:key="item.path + item.title"
								:href="item.path"
								class="vvc-cmd-item"
								:class="{ 'is-highlighted': highlightIndex === flatIndex(group, i) }"
								@mouseenter="highlightIndex = flatIndex(group, i)"
								@click="close"
							>
								<svg class="vvc-cmd-item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path v-if="item.prefix" d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" />
									<path v-else d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline v-if="!item.prefix" points="14 2 14 8 20 8" />
								</svg>
								<div class="vvc-cmd-item-body">
									<div class="vvc-cmd-item-content">
										<span v-if="item.prefix" class="vvc-cmd-item-prefix">{{ item.prefix }}</span>
										<span class="vvc-cmd-item-title" v-html="highlightMatch(item.title, item)" />
									</div>
									<span v-if="item.description" class="vvc-cmd-item-desc" v-html="highlightMatch(item.description, item, 'description')" />
								</div>
							</Link>
						</template>
					</template>
					<div v-else-if="searchTerm" class="vvc-cmd-empty">
						<svg class="vvc-cmd-empty-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
						<p>{{ noResultsText }}</p>
					</div>
					<div v-else class="vvc-cmd-empty">
						<p class="vvc-cmd-empty-hint">{{ t('cmd.emptyHint') }}</p>
					</div>
				</div>

				<div class="vvc-cmd-footer">
					<div class="vvc-cmd-footer-hints">
						<span class="vvc-cmd-footer-hint"><kbd>↑↓</kbd> {{ t('cmd.navHint') }}</span>
						<span class="vvc-cmd-footer-hint"><kbd>↵</kbd> {{ t('cmd.selectHint') }}</span>
						<span class="vvc-cmd-footer-hint"><kbd>Esc</kbd> {{ t('cmd.closeHint') }}</span>
					</div>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Fuse from 'fuse.js'
import type { FuseResult } from 'fuse.js'
import { props as dprops, emits } from './ctx'
import type { SearchItem, CommandPaletteGroup } from './types'
import { useCommandPalette } from '@vike-vue-content/composables/command-palette'
import { useLocale } from '@vike-vue-content/composables/locale'
import { Link } from '@vike-vue-content/components/link'

const props = defineProps(dprops)
defineEmits(emits)

const { open, searchTerm, close } = useCommandPalette()
const { t } = useLocale()

const isMounted = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const resultsRef = ref<HTMLElement | null>(null)
const highlightIndex = ref(0)

const fuse = computed(() => new Fuse(props.items, {
	keys: ['title', 'description', 'prefix'],
	threshold: 0.1,
	includeMatches: true,
	ignoreLocation: true,
	useExtendedSearch: false,
}))

const fuseResults = computed<FuseResult<SearchItem>[]>(() => {
	if (!searchTerm.value) return []
	return fuse.value.search(searchTerm.value, { limit: props.limit })
})

const flatResults = computed<SearchItem[]>(() => {
	if (!searchTerm.value) {
		return props.items.filter((item) => (item.level ?? 1) === 1).slice(0, 15)
	}
	return fuseResults.value.map(r => r.item)
})

const groupedResults = computed<CommandPaletteGroup[]>(() => {
	const map = new Map<string, SearchItem[]>()
	for (const item of flatResults.value) {
		const group = item.group || 'Pages'
		let list = map.get(group)
		if (!list) {
			list = []
			map.set(group, list)
		}
		list.push(item)
	}
	return Array.from(map.entries()).map(([label, items]) => ({ label, items }))
})

function flatIndex(group: CommandPaletteGroup, itemIndex: number): number {
	let offset = 0
	for (const g of groupedResults.value) {
		if (g === group) return offset + itemIndex
		offset += g.items.length
	}
	return 0
}

function highlightMatch(text: string | undefined, item: SearchItem, key = 'title'): string {
	if (!text) return ''
	const escaped = escapeHtml(text)

	if (!searchTerm.value) return escaped

	const result = fuseResults.value.find(r => r.item === item)
	if (!result?.matches) return escaped

	const match = result.matches.find(m => m.key === key)
	if (!match?.indices?.length) return escaped

	const sorted = [...match.indices].sort((a, b) => a[0] - b[0])
	let html = ''
	let lastEnd = 0
	for (const [start, end] of sorted) {
		if (start >= text.length) break
		const clampedEnd = Math.min(end + 1, text.length)
		if (start > lastEnd) {
			html += escapeHtml(text.slice(lastEnd, start))
		}
		html += `<mark>${escapeHtml(text.slice(start, clampedEnd))}</mark>`
		lastEnd = clampedEnd
	}
	if (lastEnd < text.length) {
		html += escapeHtml(text.slice(lastEnd))
	}
	return html
}

function escapeHtml(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function scrollHighlightedIntoView() {
	nextTick(() => {
		const el = resultsRef.value?.querySelector('.is-highlighted')
		el?.scrollIntoView({ block: 'nearest' })
	})
}

function onInputKeydown(e: KeyboardEvent) {
	if (e.key === 'ArrowDown') {
		e.preventDefault()
		highlightIndex.value = Math.min(highlightIndex.value + 1, flatResults.value.length - 1)
		scrollHighlightedIntoView()
	} else if (e.key === 'ArrowUp') {
		e.preventDefault()
		highlightIndex.value = Math.max(highlightIndex.value - 1, 0)
		scrollHighlightedIntoView()
	} else if (e.key === 'Enter') {
		e.preventDefault()
		const el = resultsRef.value?.querySelector('.is-highlighted') as HTMLAnchorElement | null
		if (el) {
			el.click()
			close()
		}
	}
}

function onOverlayKeydown(e: KeyboardEvent) {
	if (e.key === 'Escape') {
		e.preventDefault()
		close()
	}
}

function onGlobalKeydown(e: KeyboardEvent) {
	if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
		e.preventDefault()
		open.value = !open.value
	}
}

watch(open, (val) => {
	if (val) {
		highlightIndex.value = 0
		nextTick(() => inputRef.value?.focus())
	}
})

watch(searchTerm, () => {
	highlightIndex.value = 0
})

onMounted(() => {
	isMounted.value = true
	if (typeof window !== 'undefined') {
		window.addEventListener('keydown', onGlobalKeydown)
	}
})

onBeforeUnmount(() => {
	if (typeof window !== 'undefined') {
		window.removeEventListener('keydown', onGlobalKeydown)
	}
})
</script>

<style>
.vvc-cmd-overlay {
	position: fixed;
	inset: 0;
	z-index: 100;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding-top: 12vh;
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(4px);
}

.vvc-cmd-modal {
	width: 100%;
	max-width: 640px;
	max-height: 70vh;
	background: var(--vvc-bg, #fff);
	border-radius: 12px;
	box-shadow:
		0 0 0 1px var(--vvc-border, rgba(0, 0, 0, 0.08)),
		0 16px 70px rgba(0, 0, 0, 0.2);
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.vvc-cmd-input-wrapper {
	display: flex;
	align-items: center;
	padding: 0 16px;
	border-bottom: 1px solid var(--vvc-border, #e2e8f0);
}

.vvc-cmd-search-icon {
	flex-shrink: 0;
	color: var(--vvc-text-muted, #94a3b8);
}

.vvc-cmd-input {
	flex: 1;
	padding: 14px 12px;
	border: none;
	background: transparent;
	font-size: 16px;
	color: var(--vvc-text, #0f172a);
	outline: none;
}

.vvc-cmd-input::placeholder {
	color: var(--vvc-text-muted, #94a3b8);
}

.vvc-cmd-esc-kbd {
	flex-shrink: 0;
	padding: 2px 6px;
	border: 1px solid var(--vvc-border, #e2e8f0);
	border-radius: 4px;
	font-size: 11px;
	font-family: inherit;
	color: var(--vvc-text-muted, #94a3b8);
	background: var(--vvc-bg-elevated, #f1f5f9);
}

.vvc-cmd-results {
	flex: 1;
	overflow-y: auto;
	padding: 8px;
	scrollbar-width: thin;
}

.vvc-cmd-group-label {
	padding: 10px 12px 6px;
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	color: var(--vvc-text-muted, #94a3b8);
}

.vvc-cmd-group-label:not(:first-child) {
	margin-top: 4px;
	border-top: 1px solid var(--vvc-border, rgba(0, 0, 0, 0.06));
	padding-top: 12px;
}

.vvc-cmd-item {
	display: flex;
	align-items: flex-start;
	gap: 10px;
	padding: 8px 12px;
	border-radius: 8px;
	text-decoration: none;
	color: var(--vvc-text, #0f172a);
	cursor: pointer;
	transition: background 0.1s;
}

.vvc-cmd-item:hover,
.vvc-cmd-item.is-highlighted {
	background: var(--vvc-bg-elevated, #f1f5f9);
}

.vvc-cmd-item-icon {
	flex-shrink: 0;
	margin-top: 2px;
	color: var(--vvc-text-muted, #94a3b8);
	opacity: 0.6;
}

.vvc-cmd-item.is-highlighted .vvc-cmd-item-icon {
	opacity: 1;
	color: var(--vvc-color-primary, #3b82f6);
}

.vvc-cmd-item-body {
	flex: 1;
	min-width: 0;
}

.vvc-cmd-item-content {
	display: flex;
	align-items: center;
	gap: 4px;
	min-width: 0;
}

.vvc-cmd-item-prefix {
	font-size: 13px;
	color: var(--vvc-text-muted, #94a3b8);
	flex-shrink: 0;
}

.vvc-cmd-item-title {
	font-size: 14px;
	font-weight: 500;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.vvc-cmd-item-title mark,
.vvc-cmd-item-desc mark {
	color: var(--vvc-color-primary, #3b82f6);
	background: transparent;
	font-weight: 600;
}

.vvc-cmd-item-desc {
	display: block;
	font-size: 12px;
	color: var(--vvc-text-muted, #64748b);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	margin-top: 2px;
	line-height: 1.4;
}

.vvc-cmd-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 32px 24px;
	text-align: center;
}

.vvc-cmd-empty p {
	margin: 0;
	font-size: 14px;
	color: var(--vvc-text-muted, #94a3b8);
}

.vvc-cmd-empty-icon {
	color: var(--vvc-text-muted, #cbd5e1);
	margin-bottom: 8px;
}

.vvc-cmd-empty-hint {
	font-size: 13px;
}

.vvc-cmd-footer {
	padding: 8px 16px;
	border-top: 1px solid var(--vvc-border, #e2e8f0);
	background: var(--vvc-bg-elevated, #f8fafc);
}

.vvc-cmd-footer-hints {
	display: flex;
	gap: 16px;
}

.vvc-cmd-footer-hint {
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	color: var(--vvc-text-muted, #94a3b8);
}

.vvc-cmd-footer-hint kbd {
	padding: 1px 5px;
	border: 1px solid var(--vvc-border, #e2e8f0);
	border-radius: 3px;
	font-size: 11px;
	font-family: inherit;
	background: var(--vvc-bg, #fff);
}

@media (max-width: 640px) {
	.vvc-cmd-overlay {
		padding: 16px;
		padding-top: 8vh;
	}

	.vvc-cmd-modal {
		max-height: 80vh;
	}

	.vvc-cmd-footer-hints {
		gap: 10px;
	}
}
</style>
