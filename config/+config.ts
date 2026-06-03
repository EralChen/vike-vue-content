import type { Config } from 'vike/types'
import type _ from 'vike-vue/config'

import type { DocsPageOptions } from '@vike-vue-content/docs/config'
import { collectWorkspaceDocsRedirects } from '@vike-vue-content/docs/redirects'
import { docsRuntimeBasePlugin } from '@vike-vue-content/docs/plugin'
import { generateThemeInitScript } from '@vike-vue-content/composables/theme'

const config = {
  name: 'vike-vue-content',
  require: {
    vike: '>=0.4.191',
  },
  redirects: collectWorkspaceDocsRedirects(),
  vite: {
    plugins: [docsRuntimeBasePlugin()],
  },
  // 在 head 开始位置注入主题初始化脚本，防止 FOUC
  headHtmlBegin: generateThemeInitScript(),
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