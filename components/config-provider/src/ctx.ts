import type { PropType } from 'vue'
import type { Language } from './types'

export const props = {
	locale: {
		type: Object as PropType<Language>,
		default: undefined,
	},
}

export const emits = {}
