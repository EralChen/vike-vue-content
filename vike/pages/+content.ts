import highlight from "vike-vue-content/comark/highlight";
import mermaid, { Mermaid } from '@comark/vue/plugins/mermaid'
import Alert from '../components/Alert.vue'
import Badge from '../components/Badge.vue'

export default {
  plugins: [
    highlight(),
    mermaid(),
  ],
  components: {
    mermaid: Mermaid,
    Alert,
    Badge,
  }
};
