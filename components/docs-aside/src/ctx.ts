import type { PropType } from 'vue'
import type { DocsAsidePosition } from './types'

export const props = {
	position: {
		type: String as PropType<DocsAsidePosition>,
		default: 'left'
	},
	ariaLabel: {
		type: String,
		default: undefined
	}
}

export const emits = {}
