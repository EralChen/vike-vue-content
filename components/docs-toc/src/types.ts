export interface ContentTocLink {
	id: string
	text: string
	depth: number
	children?: ContentTocLink[]
}