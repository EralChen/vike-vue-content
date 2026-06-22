import type { PropType } from 'vue'

export const props = {
	code: {
		type: String as PropType<string>,
		default: undefined,
	},
	language: {
		type: String as PropType<string>,
		default: undefined,
	},
	filename: {
		type: String as PropType<string>,
		default: undefined,
	},
	highlights: {
		type: Array as PropType<number[]>,
		default: () => [],
	},
	meta: {
		type: String as PropType<string>,
		default: undefined,
	},
	class: {
		type: [String, Object, Array] as PropType<any>,
		default: undefined,
	},
	hideHeader: {
		type: Boolean as PropType<boolean>,
		default: false,
	},
}

export const emits = {
	copy: (code: string) => true,
}
