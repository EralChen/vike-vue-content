import type { Config } from 'vike/types'
import type _ from 'vike-vue/config'

import type { ContentConfig, DocsPageOptions } from '@vike-vue-content/shared/types'
import { collectWorkspaceDocsRedirects } from '@vike-vue-content/docs/redirects'
import { docsRuntimeBasePlugin, demoAutoCollectPlugin } from '@vike-vue-content/docs/plugin'
import { defaultTheme } from '@vike-vue-content/theme'
import type { ThemesConfigValue } from '@vike-vue-content/theme'

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
  headHtmlBegin: 'import:vike-vue-content/theme/headHtmlBegin:headHtmlBegin',
  theme: defaultTheme.name,
  themes: defaultTheme,
  appearance: 'system',
  meta: {
    theme: {
      env: {
        config: true,
        server: true,
        client: true,
      },
    },
    themes: {
      env: {
        config: true,
        server: true,
        client: true,
      },
      cumulative: true,
    },
    appearance: {
      env: {
        config: true,
        server: true,
        client: true,
      },
    },
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
      theme?: string
      themes?: ThemesConfigValue
      appearance?: 'light' | 'dark' | 'system'
    }
    interface ConfigResolved {
      content?: ContentConfig
      docs?: DocsPageOptions
      themes?: ThemesConfigValue[]
    }
  }
}
