import type { PropType } from 'vue'
import type { ContentNavigationItem } from './types'

export const props = {
	prev: {
		type: Object as PropType<ContentNavigationItem | null>,
		default: null
	},
	next: {
		type: Object as PropType<ContentNavigationItem | null>,
		default: null
	}
}

export const emits = {}