import type { Config } from 'vike/types'

import type { DocsPageOptions } from './options'

export function defineDocsPageConfig(options: DocsPageOptions = {}): Config {
	return {
		docs: options,
	} as Config
}

export type { DocsPageData } from './data'
export type { DocsPageOptions } from './options'
export default defineDocsPageConfig