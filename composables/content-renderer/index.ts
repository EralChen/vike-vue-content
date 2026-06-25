import { inject, ref, type ComputedRef } from 'vue'
import { contentParsedSourcesKey, contentComponentsKey, contentDemosKey, contentSourcesKey } from '@vike-vue-content/shared/symbols'
import type { ComarkTree } from 'comark'

export function useContentRenderer () {
  const empty = ref({}) as never

  const parsedSources: ComputedRef<Record<string, ComarkTree>> = inject(contentParsedSourcesKey, empty)
  const demos: ComputedRef<Record<string, any>> = inject(contentDemosKey, empty)
  const sources = inject(contentSourcesKey, null)
  const components: ComputedRef<Record<string, any>> = inject(contentComponentsKey, empty)
  
  return {
    parsedSources,
    demos,
    sources,
    components,
  }
}
