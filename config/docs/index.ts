export { defineDocsPageConfig as default, defineDocsPageConfig } from './+config'
export { DocsPage } from '@vike-vue-content/components/docs-page'
export { data } from './data'
export { createDocsPrerender, onBeforePrerenderStart } from './prerender'
export { createDocsRoute, route } from './route'
export type {
	ContentDirectoryConfig,
	ContentEntry,
	ContentNavigationConfig,
	ContentNavigationItem,
	DocsPageData,
	DocsPageOptions,
	QueryBuilder,
	QueryOptions,
	ResolvedDocsPageOptions,
} from '@vike-vue-content/shared/types'