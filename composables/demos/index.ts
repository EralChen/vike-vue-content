import { inject } from 'vue'
import type { ContentDemos } from '@vike-vue-content/shared/types'
import { contentDemosKey } from '@vike-vue-content/shared/symbols'

export function useDemos(): ContentDemos {
	const demos = inject(contentDemosKey, {})
	return demos ?? {}
}
