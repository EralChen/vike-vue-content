import { inject, computed, type ComputedRef } from 'vue'
import type { ContentSources } from '@vike-vue-content/shared/types'
import { contentSourcesKey } from '@vike-vue-content/shared/symbols'

export function useSources(): ComputedRef<ContentSources> {
	return inject(contentSourcesKey, computed(() => ({})))!
}
