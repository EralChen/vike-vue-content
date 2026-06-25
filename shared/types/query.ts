import type { ContentEntry, ContentNavigationItem } from './content'

export type QueryOptions = {
	cwd?: string
	contentDir?: string
	plugins?: unknown[]
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
