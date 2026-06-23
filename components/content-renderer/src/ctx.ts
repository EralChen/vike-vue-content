import type { PropType } from 'vue'
import type { ContentBody, ContentComponents, ContentDemos, ContentSources, ContentData } from './types'

export const props = {
  tree: {
    type: Object as PropType<ContentBody>,
    required: true,
  },
  components: {
    type: Object as PropType<ContentComponents>,
    default: () => ({}),
  },
  demos: {
    type: Object as PropType<ContentDemos>,
    default: () => ({}),
  },
  sources: {
    type: Object as PropType<ContentSources>,
    default: () => ({}),
  },
  data: {
    type: Object as PropType<ContentData>,
    default: () => ({}),
  },
}

export const emits = {
  resolve: () => true,
}