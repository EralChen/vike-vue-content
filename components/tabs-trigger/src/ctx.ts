import type { PropType } from 'vue'
import type { StringOrNumber } from '@vike-vue-content/shared/types'
import type { TabsTriggerProps } from './types'

export const props = {
	value: {
		type: [String, Number] as PropType<StringOrNumber>,
		required: true,
		default: '0',
	},
	disabled: {
		type: Boolean as PropType<boolean>,
		default: false,
	},
}

export const emits = {}
