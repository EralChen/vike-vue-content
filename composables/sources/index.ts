import { inject } from 'vue'
import type { ContentSources } from '@vike-vue-content/shared/types'
import { contentSourcesKey } from '@vike-vue-content/shared/symbols'

export function useSources(): ContentSources {
	const sources = inject(contentSourcesKey, {})
	return sources ?? {}
}
