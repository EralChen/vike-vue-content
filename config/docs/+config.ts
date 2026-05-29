import type { Config } from 'vike/types'

import { resolveDocsPageOptions } from './options'

export interface DocsPageOptions {
	base?: string
	collection?: string
	contentDir?: string
	title?: string
}

export function defineDocsPageConfig(options: DocsPageOptions = {}): Config {
	const resolvedOptions = resolveDocsPageOptions(options, 'defineDocsPageConfig()')

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
		docs: resolvedOptions,
		Page: 'import:vike-vue-content/components/docs-page:default',
		data: 'import:vike-vue-content/docs/data:data',
		onBeforePrerenderStart: 'import:vike-vue-content/docs/prerender:onBeforePrerenderStart',
	} as Config
}

export type { DocsPageData } from './data'
export default defineDocsPageConfig