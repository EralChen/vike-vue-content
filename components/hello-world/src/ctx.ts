import type { PropType } from "vue"
import type { Theme, ClickEvent } from "./types"

export const props = {
  name: {
    type: String,
    default: 'World'
  },

  theme: {
    type: String as PropType<Theme>,
    default: 'light'
  }
}

export const emits = {
  click: (e: ClickEvent) => true
}
