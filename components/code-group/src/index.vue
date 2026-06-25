<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { props as dprops } from './ctx'
import TabsRoot from '@vike-vue-content/components/tabs-root'
import TabsList from '@vike-vue-content/components/tabs-list'
import TabsTrigger from '@vike-vue-content/components/tabs-trigger'
import TabsContent from '@vike-vue-content/components/tabs-content'

const props = defineProps(dprops)
const slots = useSlots()

interface TabItem {
	label: string
	vnode: any
}

const tabs = computed<TabItem[]>(() => {
	const items = slots.default?.()?.flatMap(transformSlot) ?? []
	return items.filter((item): item is TabItem => item !== null)
})

function transformSlot(slot: any, index: number): TabItem | (TabItem | null)[] | null {
	if (typeof slot.type === 'symbol') {
		const children = (slot.children || []).map((child: any) => transformSlot(child, index))
		return children.filter((item: TabItem | null): item is TabItem => item !== null)
	}
	if (!slot || !slot.type) return null
	return {
		label: slot.props?.filename || slot.props?.label || `Tab ${index + 1}`,
		vnode: slot,
	}
}
</script>

<template>
	<div class="vvc-code-group">
		<TabsRoot :default-value="props.defaultValue" :unmount-on-hide="false">
			<TabsList class="vvc-code-group-tabs">
				<TabsTrigger
					v-for="(tab, index) in tabs"
					:key="tab.label"
					:value="String(index)"
					class="vvc-code-group-tab"
				>
					{{ tab.label }}
				</TabsTrigger>
			</TabsList>
			<div class="vvc-code-group-content">
				<TabsContent
					v-for="(tab, index) in tabs"
					:key="tab.label"
					:value="String(index)"
				>
					<component :is="tab.vnode"  />
				</TabsContent>
			</div>
		</TabsRoot>
	</div>
</template>

<style>

/* 已经在 Tab 中展示 */
.vvc-code-group-content .vvc-prose-code-header{
	display: none;
}

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

.vvc-code-group-tab[data-state="active"] {
	color: var(--vvc-text, #1e293b);
	background-color: var(--vvc-bg, #fff);
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.dark .vvc-code-group-tab[data-state="active"] {
	color: var(--vvc-text, #e2e8f0);
	background-color: var(--vvc-bg-elevated, #334155);
}

.vvc-code-group-content .vvc-prose-code-wrapper {
	margin: 0;
	border: none;
	border-radius: 0;
}
</style>
