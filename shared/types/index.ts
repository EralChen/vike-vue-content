export type ContentEntry = {
	id: string
	collection: string
	path: string
	stem: string
	title?: string
	description?: string
	body: unknown
	rawbody: string
	frontmatter: Record<string, unknown>
	meta: Record<string, unknown>
}

export type ContentNavigationConfig = {
	label?: string
	icon?: string
	hidden?: boolean
	flatten?: boolean
}

export type ContentDirectoryConfig = {
	navigation?: ContentNavigationConfig
	redirect?: string
}

export type ContentNavigationItem = {
	title: string
	path: string
	stem?: string
	children?: ContentNavigationItem[]
	page?: false
	config?: ContentDirectoryConfig
	navigation?: ContentNavigationConfig
	[key: string]: unknown
}

export type QueryOptions = {
	cwd?: string
	contentDir?: string
}

export type QueryBuilder = {
	path(value: string): QueryBuilder
	all(): Promise<ContentEntry[]>
	first(): Promise<ContentEntry | null>
}

export type DocsPageOptions = {
	collection?: string
	contentDir?: string
	title?: string
}

export type ResolvedDocsPageOptions = {
	base: string
	collection: string
	collectionBase: string
	contentDir: string
	title: string
}

export type DocsPageData = {
	docsBase: string
	page: ContentEntry | null
	navigation: ContentNavigationItem[]
	prev: ContentNavigationItem | null
	next: ContentNavigationItem | null
	requestedPath: string
}
