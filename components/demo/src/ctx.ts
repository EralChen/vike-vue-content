import type { PropType } from 'vue'

export const props = {
	preview: {
		type: String as PropType<string>,
		default: undefined,
	},
	source: {
		type: [String, Array] as PropType<string | string[]>,
		default: undefined,
	},
}
