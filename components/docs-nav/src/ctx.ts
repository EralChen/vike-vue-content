import type { PropType } from 'vue'
import type { DocsNavigationItem } from './types'

export const props = {
	items: {
		type: Array as PropType<DocsNavigationItem[]>,
		default: () => []
	},
	currentPath: {
		type: String,
		default: ''
	}
}

export const emits = {}