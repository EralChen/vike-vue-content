import type { PropType } from 'vue'
import type { DrawerDirection } from './types'

export const props = {
  open: {
    type: Boolean,
    default: false
  },
  direction: {
    type: String as PropType<DrawerDirection>,
    default: 'left'
  },
  to: {
    type: String,
    default: 'body'
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: '75vw'
  }
}

export const emits = {
  'update:open': (open: boolean) => true
}
