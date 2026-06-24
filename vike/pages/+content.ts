import type { ContentConfig } from '@vike-vue-content/shared/types'
import highlight from "vike-vue-content/comark/highlight";
import mermaid, { Mermaid } from '@comark/vue/plugins/mermaid'
import Alert from '../components/Alert.vue'
import Badge from '../components/Badge.vue'
import Demo from 'vike-vue-content/components/demo'

export default {
  plugins: [
    highlight(),
    mermaid(),
  ],
  components: {
    mermaid: Mermaid,
    Alert,
    Badge,
    demo: Demo,
  },
} satisfies ContentConfig
