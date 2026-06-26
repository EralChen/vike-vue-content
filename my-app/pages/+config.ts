import type { Config } from 'vike/types'
import vikeVue from 'vike-vue/config'
import vikeVueContent from 'vike-vue-content/config'

export default {
  prerender: true,
  extends: [vikeVue, vikeVueContent],
} satisfies Config