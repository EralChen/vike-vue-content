import type { PropType } from 'vue'
import type { SearchItem } from './types'

export const props = {
	items: {
		type: Array as PropType<SearchItem[]>,
		default: () => []
	},
	placeholder: {
		type: String,
		default: '搜索文档...'
	},
	noResultsText: {
		type: String,
		default: '没有匹配结果'
	},
	limit: {
		type: Number,
		default: 20
	}
}

export const emits = {}
