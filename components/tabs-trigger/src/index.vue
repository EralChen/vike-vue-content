<script lang="ts" setup>
import { computed } from 'vue'
import { props as dprops, emits } from './ctx'
import { injectTabsRootContext } from '@vike-vue-content/components/tabs-root'

const props = defineProps(dprops)
const emit = defineEmits(emits)

const rootContext = injectTabsRootContext()

const isSelected = computed(() => props.value === rootContext.modelValue.value)

function handleClick() {
	if (!props.disabled) {
		rootContext.changeModelValue(props.value)
	}
}
</script>

<template>
	<button
		role="tab"
		type="button"
		:aria-selected="isSelected ? 'true' : 'false'"
		:data-state="isSelected ? 'active' : 'inactive'"
		:data-disabled="props.disabled ? '' : undefined"
		:disabled="props.disabled"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
