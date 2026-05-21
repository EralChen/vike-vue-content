

import { _VkfInputCtx } from '@vunk/form/components/input'
import type { PropType } from 'vue'

export const props = {
  ..._VkfInputCtx.props,
  disabled: {
    type: Boolean,
    default: undefined,
  },
  validateUpdate: {
    type: Function as PropType<(v?: any) => boolean | undefined>,
    default: () => (() => true),
  },
}


export const emits = {
  ..._VkfInputCtx.emits,
  'update:disabled': (e: boolean) => e || true,
}