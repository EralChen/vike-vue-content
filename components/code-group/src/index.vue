<script lang="ts" setup>
import { ref, computed, useSlots, cloneVNode } from 'vue'
import { props as dprops } from './ctx'

const props = defineProps(dprops)
const slots = useSlots()

const activeIndex = ref(parseInt(props.defaultValue) || 0)

interface TabItem {
	label: string
	vnode: any
}

const tabs = computed<TabItem[]>(() => {
	const children = slots.default?.() || []
	return children
		.flatMap((child: any) => {
			if (child.type?.toString?.() === 'Symbol(Fragment)' || child.type === Symbol.for('v-fgt')) {
				return child.children || []
			}
			return [child]
		})
		.filter((child: any) => child && child.type)
		.map((child: any, index: number) => ({
			label: child.props?.filename || child.props?.label || `Tab ${index + 1}`,
			vnode: child,
		}))
})

function selectTab(index: number) {
	activeIndex.value = index
}
</script>

<template>
	<div class="vvc-code-group">
		<div class="vvc-code-group-tabs" role="tablist">
			<button
				v-for="(tab, index) in tabs"
				:key="index"
				role="tab"
				class="vvc-code-group-tab"
				:class="{ 'is-active': activeIndex === index }"
				:aria-selected="activeIndex === index"
				@click="selectTab(index)"
			>
				{{ tab.label }}
			</button>
		</div>
		<div class="vvc-code-group-content">
			<component
				v-if="tabs[activeIndex]"
				:is="cloneVNode(tabs[activeIndex].vnode, { hideHeader: true, tabindex: '-1' })"
				:key="activeIndex"
			/>
		</div>
	</div>
</template>

<style>
.vvc-code-group {
	border: 1px solid var(--vvc-border, #e2e8f0);
	border-radius: var(--vvc-radius, 8px);
	margin: 1.25rem 0;
	overflow: hidden;
}

.dark .vvc-code-group {
	border-color: var(--vvc-border, #334155);
}

.vvc-code-group-tabs {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 8px;
	background-color: var(--vvc-bg-elevated, #f1f5f9);
	border-bottom: 1px solid var(--vvc-border, #e2e8f0);
	overflow-x: auto;
}

.dark .vvc-code-group-tabs {
	background-color: var(--vvc-bg-muted, #1e293b);
	border-bottom-color: var(--vvc-border, #334155);
}

.vvc-code-group-tab {
	padding: 6px 12px;
	font-size: 13px;
	color: var(--vvc-text-muted, #64748b);
	background: transparent;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	transition: all 0.2s;
	white-space: nowrap;
	font-family: monospace;
}

.vvc-code-group-tab:hover {
	color: var(--vvc-text, #1e293b);
	background-color: var(--vvc-bg, #fff);
}

.dark .vvc-code-group-tab:hover {
	color: var(--vvc-text, #e2e8f0);
	background-color: var(--vvc-bg-elevated, #334155);
}

.vvc-code-group-tab.is-active {
	color: var(--vvc-text, #1e293b);
	background-color: var(--vvc-bg, #fff);
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .vvc-code-group-tab.is-active {
	color: var(--vvc-text, #e2e8f0);
	background-color: var(--vvc-bg-elevated, #334155);
}

.vvc-code-group-content .vvc-prose-code-wrapper {
	margin: 0;
	border: none;
	border-radius: 0;
}
</style>
