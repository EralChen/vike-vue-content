import { inject, computed, type ComputedRef } from 'vue'
import { contentDemosKey } from '@vike-vue-content/shared/symbols'

export function useDemos(): ComputedRef<Record<string, any>> {
	return inject(contentDemosKey, computed(() => ({})))!
}
