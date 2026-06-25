import type { PropType } from 'vue'

export const props = {
	preview: {
		type: String,
		required: true as const,
	},
	source: {
		type: [String, Array] as PropType<string | string[]>,
		default: undefined,
	},
}
