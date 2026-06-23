import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import type { ComarkElement, ComarkNode, ComarkTree } from 'comark'

import { getContentIndex } from '@vike-vue-content/query'
import { resolveDocsPageOptions } from '../config/options'
import { inferDocsBaseFromPageFile } from '../utils/page-file'
import { fromCollectionPath } from '../utils/paths'
import type { ResolvedDocsPageOptions } from '@vike-vue-content/shared/types'

// -- Types --

export interface SearchSection {
	title: string
	description?: string
	path: string
	group?: string
	prefix?: string
	level?: number
}

// -- AST-based section splitter (mirrors Nuxt Content's splitPageIntoSections) --

const HEADING_RE = /^h([1-6])$/

function headingLevel(tag: string): number {
	return Number(tag.match(HEADING_RE)?.[1] ?? 0)
}

function extractText(node: ComarkNode, ignoredTags: string[] = []): string {
	if (typeof node === 'string') return node
	if (node[0] === null) return '' // comment
	const [tag, , ...children] = node as ComarkElement
	if (ignoredTags.includes(tag)) return ''
	return children.map(c => extractText(c, ignoredTags)).join('')
}

export function splitMarkdownSections(
	body: ComarkTree | undefined,
	pagePath: string,
	pageTitle?: string,
	pageDescription?: string,
): SearchSection[] {
	type RawSection = { title: string; path: string; titles: string[]; content: string; level: number; group?: string; prefix?: string }
	const sections: RawSection[] = [{
		title: pageTitle || '',
		path: pagePath,
		titles: [],
		content: (pageDescription || '').trim(),
		level: 1,
		prefix: undefined,
		group: pageTitle || 'Pages',
	}]

	if (!body?.nodes?.length) return sections

	const titles: string[] = [pageTitle || '']
	let previousHeadingLevel = 0
	let sectionIndex = 0

	for (const node of body.nodes) {
		if (typeof node !== 'string' && node[0] !== null) {
			const tag = (node as ComarkElement)[0]
			const level = headingLevel(tag)

			if (level > 0) {
				const title = extractText(node as ComarkNode).trim()

				// H1 represents the page itself. The page section (sections[0],
				// level 1) already stands for the whole page, so absorb the H1
				// instead of pushing a duplicate level-1 entry — otherwise the
				// command palette's level-1 default list shows two rows per page.
				// If the page section has no title yet (no frontmatter title),
				// adopt the H1 text as the page title.
				if (level === 1) {
					if (!sections[0]!.title) {
						sections[0]!.title = title
						sections[0]!.group = title
					}
					titles.splice(0, titles.length)
					titles.push(sections[0]!.title)
					previousHeadingLevel = level
					continue
				}

				if (level < previousHeadingLevel) {
					titles.splice(level - 1, titles.length - 1)
				} else if (level === previousHeadingLevel) {
					titles.pop()
				}

				const prefixTitles = [...titles]
				sections.push({
					title,
					path: `${pagePath}#${(node as ComarkElement)[1]?.id || ''}`,
					titles: [...titles],
					content: '',
					level,
					prefix: prefixTitles.length > 1
						? prefixTitles.slice(0, -1).join(' > ') + ' >'
						: prefixTitles.length === 1
							? prefixTitles[0] + ' >'
							: undefined,
					group: titles[0] || pageTitle || 'Pages',
				})

				titles.push(title)
				previousHeadingLevel = level
				sectionIndex += 1
				continue
			}
		}

		const content = extractText(node as ComarkNode, ['style', 'script']).trim()
		if (sectionIndex === 0 && sections[0]?.content === content) continue
		if (content) {
			sections[sectionIndex]!.content = `${sections[sectionIndex]!.content} ${content}`.trim()
		}
	}

	// Truncate content and map to final format
	return sections.map(s => ({
		title: s.title,
		path: s.path,
		group: s.group,
		prefix: s.prefix,
		description: s.content.slice(0, 200),
		level: s.level,
	}))
}

// -- Config scanner (minimal, mirrors redirects.ts pattern) --

const PAGE_CONFIG_RE = /\/\+config\.[cm]?[jt]sx?$/
const DEFINE_PAGE_CONFIG_RE = /defineDocsPageConfig\s*\(\s*(\{[\s\S]*?\})\s*\)/
const DOCS_OBJECT_RE = /\bdocs\s*:\s*(\{[\s\S]*?\})/
const STRING_OPTION_RE = /(collection|contentDir|title)\s*:\s*(['"`])([^'"`]+)\2/g
const BOOL_OPTION_RE = /(searchIndex)\s*:\s*(true|false)/g

function readDocsPageOptions(filePath: string): Record<string, string | boolean> | null {
	const source = readFileSync(filePath, 'utf8')

	const helperMatch = source.match(DEFINE_PAGE_CONFIG_RE)
	const objectLiteral = helperMatch?.[1] ?? source.match(DOCS_OBJECT_RE)?.[1]
	if (!objectLiteral) return null

	const options: Record<string, string | boolean> = {}
	for (const match of objectLiteral.matchAll(STRING_OPTION_RE)) {
		if (match[1] && match[3]) {
			options[match[1]] = match[3]
		}
	}
	for (const match of objectLiteral.matchAll(BOOL_OPTION_RE)) {
		if (match[1] && match[2]) {
			options[match[1]] = match[2] === 'true'
		}
	}
	return options
}

function scanDocsConfigs(rootDir: string): { options: ResolvedDocsPageOptions; contentDir: string }[] {
	const results: { options: ResolvedDocsPageOptions; contentDir: string }[] = []
	const pagesRoot = path.join(rootDir, 'pages')

	function visit(dir: string) {
		let items
		try { items = readdirSync(dir, { withFileTypes: true }) } catch { return }
		for (const item of items) {
			const itemPath = path.join(dir, item.name)
			if (item.isDirectory()) { visit(itemPath); continue }
			if (!item.isFile() || !PAGE_CONFIG_RE.test(itemPath.replace(/\\/g, '/'))) continue

			const raw = readDocsPageOptions(itemPath)
			if (!raw || !raw.searchIndex) continue
			const docsBase = inferDocsBaseFromPageFile(itemPath)
			if (!docsBase) continue

			const resolved = resolveDocsPageOptions(raw, itemPath, docsBase)
			const contentDir = path.isAbsolute(resolved.contentDir)
				? resolved.contentDir
				: path.join(rootDir, resolved.contentDir)
			results.push({ options: resolved, contentDir })
		}
	}

	visit(pagesRoot)
	return results
}

// -- Build-time index generator --

export async function buildSearchIndex(rootDir = process.cwd()): Promise<SearchSection[]> {
	const configs = scanDocsConfigs(rootDir)
	const allSections: SearchSection[] = []

	for (const { options, contentDir } of configs) {
		const index = await getContentIndex(contentDir)
		const entries = index.getByCollection(options.collection)
		for (const entry of entries) {
			const urlPath = fromCollectionPath(entry.path, options)
			const sections = splitMarkdownSections(
				entry.body as ComarkTree | undefined,
				urlPath,
				entry.title,
				entry.description,
			)
			allSections.push(...sections)
		}
	}

	return allSections
}

// -- onAfterRenderHtml hook (server-only) --

let cachedMap: Record<string, SearchSection[]> | null = null

export async function onAfterRenderHtml(pageContext: any) {
	try {
		if (!cachedMap) {
			cachedMap = await buildAllSearchIndexes()
		}

		if (Object.keys(cachedMap).length) {
			pageContext._searchIndexMap = cachedMap
		}
	} catch {
		// Search index generation is non-fatal
	}
}

async function buildAllSearchIndexes(): Promise<Record<string, SearchSection[]>> {
	const configs = scanDocsConfigs(process.cwd())
	const result: Record<string, SearchSection[]> = {}

	for (const { options, contentDir } of configs) {
		const index = await getContentIndex(contentDir)
		const entries = index.getByCollection(options.collection)
		const sections: SearchSection[] = []
		for (const entry of entries) {
			const urlPath = fromCollectionPath(entry.path, options)
			sections.push(...splitMarkdownSections(entry.body as ComarkTree | undefined, urlPath, entry.title, entry.description))
		}
		result[options.base] = sections
	}

	return result
}
