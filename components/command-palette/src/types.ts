export interface SearchItem {
	title: string
	description?: string
	path: string
	group?: string
	prefix?: string
	level?: number
}

export interface CommandPaletteGroup {
	label: string
	items: SearchItem[]
}
