import type { Config } from 'vike/types'

import type { DocsPageOptions } from '@vike-vue-content/shared/types'

export function defineDocsPageConfig(options: DocsPageOptions = {}): Config {
	return {
		docs: options,
	} as Config
}

export type { DocsPageData, DocsPageOptions } from '@vike-vue-content/shared/types'
export default defineDocsPageConfig