import type { Component } from 'vue'

export type ContentEntry = {
	id: string
	collection: string
	path: string
	stem: string
	title?: string
	description?: string
	toc?: ContentTocLink[]
	navigation?: ContentNavigationConfig
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

export type ContentComponents = Record<string, Component>

export type ContentDemos = Record<string, Component>

export type ContentSources = Record<string, string>

export type ContentConfig = {
	plugins?: unknown[]
	components?: ContentComponents
}

export type ContentBody = import('comark').ComarkTree

export type ContentData = Record<string, unknown>

