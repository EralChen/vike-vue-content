import type { PropType } from 'vue'
import type { ContentBody, ContentComponents, ContentData } from './types'

export const props = {
  tree: {
    type: Object as PropType<ContentBody>,
    required: true,
  },
  components: {
    type: Object as PropType<ContentComponents>,
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