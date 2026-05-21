import type { VueComponentPropsType } from '@vunk/shared'
import type VkfConfirmInput from './index.vue'
import type { BasicSource } from '@vunk/form'

export interface Source<P extends string = string> extends VueComponentPropsType<typeof VkfConfirmInput>, BasicSource {
  templateType: 'VkfConfirmInput'
  prop: P
}
