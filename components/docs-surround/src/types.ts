export interface ContentNavigationItem {
	title: string
	path: string
	children?: ContentNavigationItem[]
	page?: false
}