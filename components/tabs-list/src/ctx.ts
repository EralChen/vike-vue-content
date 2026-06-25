import type { PropType } from 'vue'
import type { TabsListProps } from './types'

export const props = {
	loop: {
		type: Boolean as PropType<boolean>,
		default: true,
	},
}

export const emits = {}
