import type { Config } from 'vike/types'
import type _ from 'vike-vue/config'

import type { ContentConfig, DocsPageOptions } from '@vike-vue-content/shared/types'
import { collectWorkspaceDocsRedirects } from '@vike-vue-content/docs/redirects'
import { docsRuntimeBasePlugin, demoAutoCollectPlugin } from '@vike-vue-content/docs/plugin'
import { generateThemeInitScript } from '@vike-vue-content/composables/theme'

const config = {
  name: 'vike-vue-content',
  require: {
    vike: '>=0.4.191',
  },
  redirects: collectWorkspaceDocsRedirects(),
  vite: {
    plugins: [docsRuntimeBasePlugin(), demoAutoCollectPlugin()],
    ssr: {
      noExternal: ['vike-vue-content'],
    },
  },
  onAfterRenderHtml: 'import:vike-vue-content/docs/search:onAfterRenderHtml',
  passToClient: ['_searchIndexMap'],
  headHtmlBegin: generateThemeInitScript(),
  meta: {
    content: {
      env: {
        config: true,
        server: true,
        client: true,
      },
    },
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
          title: 'import:vike-vue-content/docs/title:title',
        }
      },
    },
  },
} satisfies Config 

export default config

declare global {
  namespace Vike {
    interface Config {
      content?: ContentConfig
      docs?: DocsPageOptions
    }
    interface ConfigResolved {
      content?: ContentConfig
      docs?: DocsPageOptions
    }
  }
}
