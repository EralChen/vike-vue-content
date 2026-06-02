<template>
	<nav class="vvc-docs-page-toc" aria-label="本页目录" ref="tocRef">
		<p class="vvc-docs-page-toc-heading">On this page</p>
		<div class="vvc-docs-page-toc-content">
			<div
				class="vvc-docs-page-toc-indicator"
				:style="{ ...(indicatorStyle ?? {}), ...(circuitMaskStyle ?? {}) }"
			>
				<div class="vvc-docs-page-toc-indicator-line" />
				<div v-if="indicatorStyle" class="vvc-docs-page-toc-indicator-active" />
			</div>
			<DocsTocTree :links="links" :active="active" :level="0" @select="emit('select', $event)" />
		</div>
	</nav>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { props as dprops, emits } from './ctx'
import type { ContentTocLink } from './types'
import DocsTocTree from './DocsTocTree.vue'

const props = defineProps(dprops)
const emit = defineEmits(emits)

const tocRef = ref<HTMLElement | null>(null)

type FlattenedTocItem = {
	link: ContentTocLink
	level: number
}

// rem — text-sm line-height (1.25rem) + py-1 (0.5rem)，与 SVG 折线逐行对齐
const LINK_HEIGHT = 1.75

function flattenLinks(items: ContentTocLink[]): ContentTocLink[] {
	return items.flatMap((item) => [item, ...(item.children ? flattenLinks(item.children) : [])])
}

function flattenLinksWithLevel(items: ContentTocLink[], level = 0): FlattenedTocItem[] {
	return items.flatMap((item) => [
		{ link: item, level },
		...(item.children ? flattenLinksWithLevel(item.children, level + 1) : [])
	])
}

const flatLinks = computed(() => flattenLinks(props.links))
const flatLinksWithLevel = computed(() => flattenLinksWithLevel(props.links))

// 绿色 active 段的尺寸/位移：照搬 Nuxt UI ContentToc indicatorStyle
const indicatorStyle = computed(() => {
	if (!props.active?.length) {
		return undefined
	}

	const activeIndex = flatLinks.value.findIndex((item) => props.active.includes(item.id))

	return {
		'--vvc-toc-indicator-size': `${LINK_HEIGHT * props.active.length}rem`,
		'--vvc-toc-indicator-position': activeIndex >= 0 ? `${activeIndex * LINK_HEIGHT}rem` : '0rem',
	}
})

// 折线遮罩：逐字节照搬 Nuxt UI ContentToc circuitMaskStyle 的 SVG path 生成算法
const circuitMaskStyle = computed(() => {
	const links = flatLinksWithLevel.value
	if (!links.length) {
		return undefined
	}

	const svgUnit = 16 // SVG viewBox units per rem
	const svgLinkHeight = LINK_HEIGHT * svgUnit
	const svgHeight = links.length * svgLinkHeight
	const x0 = 0.5
	const x1 = 10.5

	let path = ''
	let currentX = x0
	let y = 0

	links.forEach((item, index) => {
		const targetX = item.level > 0 ? x1 : x0
		const nextY = y + svgLinkHeight

		if (index === 0) {
			path += `M${targetX} ${y}`
			currentX = targetX
		}

		if (targetX !== currentX) {
			path += ` L${targetX} ${y + 6}`
			currentX = targetX
		}

		path += ` L${currentX} ${nextY - (index < links.length - 1 && links[index + 1]?.level !== item.level ? 6 : 0)}`
		y = nextY
	})

	const svgPath = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 ${svgHeight}'><path d='${path}' stroke='black' stroke-width='1' fill='none'/></svg>`)

	return {
		'--vvc-toc-mask': `url("data:image/svg+xml,${svgPath}")`,
		height: `${links.length * LINK_HEIGHT}rem`,
	}
})
</script>

<style>
.vvc-docs-page-toc {
	padding-left: 16px;
}

.vvc-docs-page-toc-heading {
	margin: 0 0 12px;
	font-size: 14px;
	font-weight: 600;
	line-height: 1.4;
	color: var(--vvc-text, #0f172a);
}

.vvc-docs-page-toc-content {
	position: relative;
}

/* 折线指示器容器：绝对定位，整段折线被 SVG mask 裁剪成形 */
.vvc-docs-page-toc-indicator {
	position: absolute;
	left: 0.625rem;
	top: 0;
	width: 0.75rem;
	mask-image: var(--vvc-toc-mask);
	mask-repeat: no-repeat;
	mask-size: 100% 100%;
	-webkit-mask-image: var(--vvc-toc-mask);
	-webkit-mask-repeat: no-repeat;
	-webkit-mask-size: 100% 100%;
	pointer-events: none;
}

/* 灰色底线（完整折线） */
.vvc-docs-page-toc-indicator-line {
	position: absolute;
	inset: 0;
	background: var(--vvc-border, rgba(15, 23, 42, 0.16));
}

/* 绿色 active 段：高度随 active 项数、位移随首个 active 项移动 */
.vvc-docs-page-toc-indicator-active {
	position: absolute;
	inset-inline: 0;
	height: var(--vvc-toc-indicator-size, 0);
	transform: translateY(var(--vvc-toc-indicator-position, 0));
	background: var(--vvc-color-primary, #22c55e);
	transition: transform 0.2s ease, height 0.2s ease;
}

.vvc-docs-page-toc-list {
	list-style: none;
	margin: 0;
	padding: 0;
	min-width: 0;
}

.vvc-docs-page-toc-list--root {
	padding-left: 1.625rem;
}

.vvc-docs-page-toc-list--nested {
	margin-left: 0.75rem;
}

.vvc-docs-page-toc-item {
	min-width: 0;
	margin-left: -1px;
}

.vvc-docs-page-toc-item--with-children {
	padding-left: 1px;
}

.vvc-docs-page-toc-link {
	display: flex;
	align-items: center;
	min-width: 0;
	height: 1.75rem;
	font-size: 14px;
	line-height: 1.45;
	color: var(--vvc-text-muted, rgba(15, 23, 42, 0.64));
	text-decoration: none;
	transition: color 0.2s ease;
}

.vvc-docs-page-toc-link-text {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.vvc-docs-page-toc-link:hover,
.vvc-docs-page-toc-link.is-active {
	color: var(--vvc-text, #111827);
}

.vvc-docs-page-toc-link.is-active {
	color: var(--vvc-color-primary, #16a34a);
	font-weight: 600;
}

@media (max-width: 1100px) {
	.vvc-docs-page-toc {
		padding-left: 0;
	}
}
</style>