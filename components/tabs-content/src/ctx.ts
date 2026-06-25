import type { PropType } from 'vue'
import type { StringOrNumber } from '@vike-vue-content/shared/types'
import type { TabsContentProps } from './types'

export const props = {
	value: {
		type: [String, Number] as PropType<StringOrNumber>,
		required: true,
		default: '0',
	},
}

export const emits = {}
