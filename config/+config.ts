import type { Config } from 'vike/types'
import type _ from 'vike-vue/config'

import type { DocsPageOptions } from './docs/+config'
import { docsRuntimeBasePlugin } from './docs/plugin'

const config = {
  name: 'vike-vue-content',
  require: {
    vike: '>=0.4.191',
  },
  vite: {
    plugins: [docsRuntimeBasePlugin()],
  },
  meta: {
    docs: {
      env: {
        config: true,
        server: true,
        client: true,
      },
      effect() {
        return {
          Page: 'import:vike-vue-content/components/docs-page:default',
          data: 'import:vike-vue-content/docs/data:data',
        }
      },
    },
  },
} satisfies Config

export default config

declare global {
  namespace Vike {
    interface Config {
      docs?: DocsPageOptions
    }
    interface ConfigResolved {
      docs?: DocsPageOptions
    }
  }
}
