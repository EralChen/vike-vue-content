import type { PropType } from 'vue'

export const props = {
  primaryColors: {
    type: Array as PropType<string[]>,
    default: () => [
      'black',
      'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
      'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
    ]
  },
  neutralColors: {
    type: Array as PropType<string[]>,
    default: () => ['slate', 'gray', 'zinc', 'neutral', 'stone']
  },
  radiusPresets: {
    type: Array as PropType<number[]>,
    default: () => [0, 0.125, 0.25, 0.375, 0.5, 0.75, 1]
  },
  fontPresets: {
    type: Array as PropType<string[]>,
    default: () => ['Inter', 'system-ui', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 'Raleway', 'Lato']
  }
}

export const emits = {
  change: () => true,
  reset: () => true
}
