export interface DocsNavigationItem {
	title: string
	path: string
	children?: DocsNavigationItem[]
	page?: false
}