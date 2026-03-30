import { App } from 'vue'
import VkfTemplatesLayout from './src/index.vue'
export * as __VkfTemplatesLayout from './src/types'

VkfTemplatesLayout.install = (app: App): void => {
  app.component(VkfTemplatesLayout.name, VkfTemplatesLayout)
}
export {
  VkfTemplatesLayout,
}
export default VkfTemplatesLayout
