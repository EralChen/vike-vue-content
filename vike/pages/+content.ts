import highlight from "vike-vue-content/comark/highlight";
import mermaid, { Mermaid } from '@comark/vue/plugins/mermaid'

export default {
  plugins: [
    highlight,
    mermaid(),
  ],
  components: {
    mermaid: Mermaid,
  }
};
