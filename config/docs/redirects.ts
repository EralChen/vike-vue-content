import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { parse as parseYaml } from 'yaml'

import {
	type DocsPageOptions,
	normalizeRoutePath,
	resolveDocsPageOptions,
	type ResolvedDocsPageOptions,
} from './options'
import { inferDocsBaseFromPageFile } from './page-file'
import { fromCollectionPath } from './paths'

const CONTENT_DIRECTORY_CONFIG_FILE = '.config.yml'
const FRONTMATTER_RE = /^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
const PAGE_CONFIG_FILE_RE = /\/\+config\.[cm]?[jt]sx?$/
const DEFINE_DOCS_PAGE_CONFIG_OBJECT_RE = /defineDocsPageConfig\s*\(\s*(\{[\s\S]*?\})\s*\)/
const DEFINE_DOCS_PAGE_CONFIG_EMPTY_RE = /defineDocsPageConfig\s*\(\s*\)/
const DOCS_OBJECT_RE = /\bdocs\s*:\s*(\{[\s\S]*?\})/
const STRING_OPTION_RE = /(collection|contentDir|title)\s*:\s*(['"`])([^'"`]+)\2/g

export function collectDocsRedirects(options: ResolvedDocsPageOptions): Record<string, string> {
	const redirects: Record<string, string> = {}
	const contentRoot = path.isAbsolute(options.contentDir)
		? options.contentDir
		: path.join(process.cwd(), options.contentDir)

	visit(contentRoot)
	return redirects

	function visit(directoryPath: string): void {
		let items
		try {
			items = readdirSync(directoryPath, { withFileTypes: true })
		} catch {
			return
		}

		for (const item of items) {
			const itemPath = path.join(directoryPath, item.name)
			if (item.isDirectory()) {
				visit(itemPath)
				continue
			}

			if (item.isFile() && item.name === CONTENT_DIRECTORY_CONFIG_FILE) {
				const routePath = toDirectoryRoutePath(contentRoot, directoryPath)
				const redirectValue = readDirectoryRedirect(itemPath, routePath)
				if (redirectValue && belongsToCollection(routePath, options.collection)) {
					assignRedirect(redirects, fromCollectionPath(routePath, options), redirectValue, options.base)
				}
				continue
			}

			if (item.isFile() && item.name.endsWith('.md')) {
				const routePath = toMarkdownRoutePath(contentRoot, itemPath)
				const redirectValue = readMarkdownRedirect(itemPath, routePath)
				if (redirectValue && belongsToCollection(routePath, options.collection)) {
					assignRedirect(redirects, fromCollectionPath(routePath, options), redirectValue, options.base)
				}
			}
		}
	}
}

export function collectWorkspaceDocsRedirects(rootDir = process.cwd()): Record<string, string> {
	const redirects: Record<string, string> = {}
	const pagesRoot = path.join(rootDir, 'pages')

	visitPages(pagesRoot)
	return redirects

	function visitPages(directoryPath: string): void {
		let items
		try {
			items = readdirSync(directoryPath, { withFileTypes: true })
		} catch {
			return
		}

		for (const item of items) {
			const itemPath = path.join(directoryPath, item.name)
			if (item.isDirectory()) {
				visitPages(itemPath)
				continue
			}

			if (!item.isFile() || !PAGE_CONFIG_FILE_RE.test(toPosix(itemPath))) {
				continue
			}

			const docsOptions = readDocsPageOptions(itemPath)
			if (!docsOptions) {
				continue
			}

			const docsBase = inferDocsBaseFromPageFile(itemPath)
			if (!docsBase) {
				continue
			}

			const resolvedOptions = resolveDocsPageOptions(
				docsOptions,
				`Docs page config at ${toPosix(itemPath)}`,
				docsBase,
			)
			const contentDir = path.isAbsolute(resolvedOptions.contentDir)
				? resolvedOptions.contentDir
				: path.join(rootDir, resolvedOptions.contentDir)
			const pageRedirects = collectDocsRedirects({
				...resolvedOptions,
				contentDir,
			})

			for (const [sourcePath, targetPath] of Object.entries(pageRedirects)) {
				mergeRedirect(redirects, sourcePath, targetPath)
			}
		}
	}
}

function readDirectoryRedirect(filePath: string, routePath: string): string | null {
	const raw = readFileSync(filePath, 'utf8')
	const value = parseYamlFile(raw, filePath, routePath)
	if (!value) {
		return null
	}

	const redirectValue = value.redirect
	if (redirectValue === undefined) {
		return null
	}
	if (typeof redirectValue !== 'string') {
		throw new Error(`Invalid ${CONTENT_DIRECTORY_CONFIG_FILE} at ${routePath}: redirect should be a string`)
	}

	const normalized = redirectValue.trim()
	return normalized || null
}

function readMarkdownRedirect(filePath: string, routePath: string): string | null {
	const raw = readFileSync(filePath, 'utf8')
	const match = raw.match(FRONTMATTER_RE)
	if (!match) {
		return null
	}

	const value = parseYamlFile(match[1] ?? '', filePath, routePath)
	if (!value) {
		return null
	}

	const redirectValue = value.redirect
	if (redirectValue === undefined) {
		return null
	}
	if (typeof redirectValue !== 'string') {
		throw new Error(`Invalid markdown frontmatter at ${routePath}: redirect should be a string`)
	}

	const normalized = redirectValue.trim()
	return normalized || null
}

function parseYamlFile(
	raw: string,
	filePath: string,
	routePath: string,
): Record<string, unknown> | null {
	let value: unknown
	try {
		value = parseYaml(raw)
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error)
		throw new Error(`Invalid YAML at ${routePath} (${toPosix(filePath)}): ${reason}`)
	}

	if (value === null || value === undefined) {
		return null
	}
	if (typeof value !== 'object' || Array.isArray(value)) {
		throw new Error(`Invalid YAML at ${routePath} (${toPosix(filePath)}): expected an object`)
	}

	return value as Record<string, unknown>
}

function assignRedirect(
	redirects: Record<string, string>,
	sourcePath: string,
	targetValue: string,
	docsBase: string,
): void {
	const targetPath = resolveRedirectTarget(targetValue, docsBase)
	if (sourcePath === targetPath) {
		return
	}

	const existing = redirects[sourcePath]
	if (existing && existing !== targetPath) {
		throw new Error(`Conflicting docs redirects for ${sourcePath}: ${existing} vs ${targetPath}`)
	}

	redirects[sourcePath] = targetPath
}

function mergeRedirect(
	redirects: Record<string, string>,
	sourcePath: string,
	targetPath: string,
): void {
	const existing = redirects[sourcePath]
	if (existing && existing !== targetPath) {
		throw new Error(`Conflicting docs redirects for ${sourcePath}: ${existing} vs ${targetPath}`)
	}

	redirects[sourcePath] = targetPath
}

function resolveRedirectTarget(value: string, docsBase: string): string {
	if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(value)) {
		return value
	}

	const normalized = normalizeRoutePath(value)
	if (docsBase === '/') {
		return normalized
	}
	if (normalized === docsBase || normalized.startsWith(`${docsBase}/`)) {
		return normalized
	}
	if (normalized === '/') {
		return docsBase
	}

	return normalizeRoutePath(`${docsBase}${normalized}`)
}

function belongsToCollection(routePath: string, collection: string): boolean {
	return routePath.split('/').filter(Boolean)[0] === collection
}

function toDirectoryRoutePath(contentRoot: string, directoryPath: string): string {
	const relativePath = toPosix(path.relative(contentRoot, directoryPath))
	return normalizeRoutePath(`/${relativePath}`)
}

function toMarkdownRoutePath(contentRoot: string, filePath: string): string {
	const relativePath = toPosix(path.relative(contentRoot, filePath))
	const stem = relativePath.replace(/\.md$/i, '')
	return normalizeRoutePath('/' + stem.replace(/\/index$/i, ''))
}

function toPosix(value: string): string {
	return value.replace(/\\/g, '/')
}

function readDocsPageOptions(filePath: string): DocsPageOptions | null {
	const source = readFileSync(filePath, 'utf8')
	const helperMatch = source.match(DEFINE_DOCS_PAGE_CONFIG_OBJECT_RE)
	if (helperMatch) {
		return readStaticDocsOptions(helperMatch[1])
	}
	if (DEFINE_DOCS_PAGE_CONFIG_EMPTY_RE.test(source)) {
		return {}
	}

	const docsMatch = source.match(DOCS_OBJECT_RE)
	if (docsMatch) {
		return readStaticDocsOptions(docsMatch[1])
	}

	return null
}

function readStaticDocsOptions(objectLiteral: string | undefined): DocsPageOptions {
	if (!objectLiteral) {
		return {}
	}

	const options: DocsPageOptions = {}
	for (const match of objectLiteral.matchAll(STRING_OPTION_RE)) {
		const key = match[1]
		const value = match[3]
		if (!key || value === undefined) {
			continue
		}

		options[key as keyof DocsPageOptions] = value
	}

	return options
}