import type { ContentEntry, ContentNavigationItem } from './content'

export type DocsPageOptions = {
	collection?: string
	contentDir?: string
	demosDir?: string
	title?: string
	searchIndex?: boolean
}

export type ResolvedDocsPageOptions = {
	base: string
	collection: string
	collectionBase: string
	contentDir: string
	demosDir: string
	title: string
	searchIndex: boolean
}

export type DocsPageData = {
	docsBase: string
	page: ContentEntry | null
	navigation: ContentNavigationItem[]
	prev: ContentNavigationItem | null
	next: ContentNavigationItem | null
	requestedPath: string
}
