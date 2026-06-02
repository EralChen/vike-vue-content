import type { PropType } from 'vue'
import type { ContentTocLink } from './types'

export const props = {
	links: {
		type: Array as PropType<ContentTocLink[]>,
		default: () => []
	},
	active: {
		type: Array as PropType<string[]>,
		default: () => []
	}
}

export const emits = {
	select: (id: string) => true
}