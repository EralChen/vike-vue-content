<script lang="ts">
import type { ComputedRef, InjectionKey } from 'vue'
import { provide, inject } from 'vue'
import type { StringOrNumber } from '@vike-vue-content/shared/types'

export interface TabsRootContext {
	modelValue: ComputedRef<StringOrNumber | undefined>
	changeModelValue: (value: StringOrNumber) => void
	unmountOnHide: ComputedRef<boolean>
}

const tabsRootKey: InjectionKey<TabsRootContext> = Symbol('TabsRoot')

export function provideTabsRootContext(context: TabsRootContext) {
	provide(tabsRootKey, context)
}

export function injectTabsRootContext(): TabsRootContext {
	const ctx = inject(tabsRootKey)
	if (!ctx) {
		throw new Error('injectTabsRootContext must be used within TabsRoot')
	}
	return ctx
}
</script>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { props as dprops, emits } from './ctx'

const props = defineProps(dprops)
const emit = defineEmits(emits)

defineSlots<{
	default?: () => any
}>()

const internalValue = ref<StringOrNumber | undefined>(props.defaultValue)

const resolvedModelValue = computed<StringOrNumber | undefined>({
	get() {
		return props.modelValue !== undefined ? props.modelValue : internalValue.value
	},
	set(value: StringOrNumber | undefined) {
		if (props.modelValue === undefined) {
			internalValue.value = value
		}
		emit('update:modelValue', value!)
	},
})

provideTabsRootContext({
	modelValue: resolvedModelValue,
	changeModelValue: (value: StringOrNumber) => {
		resolvedModelValue.value = value
	},
	unmountOnHide: computed(() => props.unmountOnHide),
})
</script>

<template>
	<div data-orientation="horizontal">
		<slot />
	</div>
</template>
