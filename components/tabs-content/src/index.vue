<script lang="ts" setup>
import { computed } from 'vue'
import { props as dprops, emits } from './ctx'
import { injectTabsRootContext } from '@vike-vue-content/components/tabs-root'

const props = defineProps(dprops)
const emit = defineEmits(emits)

const rootContext = injectTabsRootContext()

const isSelected = computed(() => props.value === rootContext.modelValue.value)

const shouldMount = computed(() => {
	if (rootContext.unmountOnHide.value) {
		return isSelected.value
	}
	return true
})

const shouldShow = computed(() => {
	if (rootContext.unmountOnHide.value) {
		return true
	}
	return isSelected.value
})
</script>

<template>
	<div
		role="tabpanel"
		:data-state="isSelected ? 'active' : 'inactive'"
		:hidden="!shouldShow"
		:style="!shouldMount ? { display: 'none' } : undefined"
	>
		<slot v-if="shouldMount" />
	</div>
</template>
