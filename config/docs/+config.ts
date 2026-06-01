import type { Config } from 'vike/types'

import type { DocsPageOptions } from './options'

export function defineDocsPageConfig(options: DocsPageOptions = {}): Config {
	return {
		meta: {
			docs: {
				env: {
					config: true,
					server: true,
					client: true,
				},
			},
		},
		docs: options,
		Page: 'import:vike-vue-content/components/docs-page:default',
		data: 'import:vike-vue-content/docs/data:data',
		onBeforePrerenderStart: 'import:vike-vue-content/docs/prerender:onBeforePrerenderStart',
	} as Config
}

export type { DocsPageData } from './data'
export type { DocsPageOptions } from './options'
export default defineDocsPageConfig