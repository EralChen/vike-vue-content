export type ContentEntry = {
	id: string
	collection: string
	path: string
	stem: string
	title?: string
	description?: string
	toc?: ContentTocLink[]
	navigation?: boolean | ContentNavigationConfig
	body: unknown
	rawbody: string
	frontmatter: Record<string, unknown>
	meta: Record<string, unknown>
}

export type ContentTocLink = {
	id: string
	text: string
	depth: number
	children?: ContentTocLink[]
}

export type ContentNavigationConfig = {
	title?: string
	label?: string
	description?: string
	icon?: string
	hidden?: boolean
	flatten?: boolean
	[key: string]: unknown
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

export type QueryOrderDirection = 'ASC' | 'DESC'

export type NavigationQueryBuilder = Promise<ContentNavigationItem[]> & {
	order(field: string, direction?: QueryOrderDirection): NavigationQueryBuilder
}

export type QueryBuilder = {
	path(value: string): QueryBuilder
	order(field: string, direction?: QueryOrderDirection): QueryBuilder
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
