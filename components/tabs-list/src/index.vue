<script lang="ts" setup>
import { props as dprops, emits } from './ctx'
import { injectTabsRootContext } from '@vike-vue-content/components/tabs-root'

const props = defineProps(dprops)
const emit = defineEmits(emits)

const rootContext = injectTabsRootContext()
</script>

<template>
	<div
		role="tablist"
		aria-orientation="horizontal"
	>
		<slot />
	</div>
</template>
