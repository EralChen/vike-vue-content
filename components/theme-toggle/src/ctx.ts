import type { PropType } from 'vue'
import type { ColorMode } from './types'

export const props = {
  mode: {
    type: String as PropType<ColorMode>,
    default: 'system'
  }
}

export const emits = {
  change: (mode: ColorMode) => true
}