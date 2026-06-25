import type { PropType } from 'vue'
import type { StringOrNumber } from '@vike-vue-content/shared/types'
import type { TabsRootProps } from './types'

export const props = {
	defaultValue: {
		type: [String, Number] as PropType<StringOrNumber>,
		default: undefined,
	},
	modelValue: {
		type: [String, Number] as PropType<StringOrNumber>,
		default: undefined,
	},
	unmountOnHide: {
		type: Boolean as PropType<boolean>,
		default: true,
	},
}

export const emits = {
	'update:modelValue': (value: StringOrNumber) => true,
}
