<template>
	<aside
		class="vvc-docs-aside"
		:class="'vvc-docs-aside--' + position"
		:aria-label="resolvedAriaLabel"
	>
		<div v-if="$slots.top" class="vvc-docs-aside-top">
			<slot name="top" />
		</div>
		<div class="vvc-docs-aside-body">
			<slot />
		</div>
		<div v-if="$slots.bottom" class="vvc-docs-aside-bottom">
			<slot name="bottom" />
		</div>
	</aside>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { props as dprops, emits } from './ctx'

const props = defineProps(dprops)
defineEmits(emits)

const resolvedAriaLabel = computed(() => {
	if (props.ariaLabel) return props.ariaLabel
	return props.position === 'right' ? 'Table of contents' : 'Site navigation'
})
</script>

<style>
.vvc-docs-aside-top {
	margin-bottom: 16px;
}

.vvc-docs-aside-bottom {
	margin-top: 16px;
	padding-top: 16px;
	border-top: 1px solid var(--color-border, #e2e8f0);
}
</style>
