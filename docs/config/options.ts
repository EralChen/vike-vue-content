import type { DocsPageOptions, ResolvedDocsPageOptions } from '@vike-vue-content/shared/types'

export type { DocsPageOptions, ResolvedDocsPageOptions } from '@vike-vue-content/shared/types'

export const DEFAULT_DOCS_BASE = '/docs'

export function normalizeRoutePath(value: string): string {
	const normalized = value.replace(/\\/g, '/').trim()
	const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`
	const compact = withLeadingSlash.replace(/\/+/g, '/').replace(/\/$/, '')
	return compact || '/'
}

export function resolveDocsPageOptions(
	value: unknown,
	definedAt = 'docs',
	base = DEFAULT_DOCS_BASE,
): ResolvedDocsPageOptions {
	if (value !== undefined && (value === null || typeof value !== 'object' || Array.isArray(value))) {
		throw new Error(`${definedAt} should be an object`)
	}

	const options = (value ?? {}) as DocsPageOptions
	const collection = normalizeCollection(options.collection ?? 'docs', definedAt)
	const contentDir = normalizeContentDir(options.contentDir)
	const demosDir = normalizeDemosDir(options.demosDir)
	const title = normalizeTitle(options.title)

	return {
		base: normalizeRoutePath(base),
		collection,
		collectionBase: normalizeRoutePath(`/${collection}`),
		contentDir,
		demosDir,
		title,
		searchIndex: options.searchIndex ?? false,
	}
}

function normalizeCollection(value: string, definedAt: string): string {
	const normalized = value.replace(/\\/g, '/').trim().replace(/^\/+|\/+$/g, '')
	if (!normalized) {
		throw new Error(`${definedAt}.collection should be a non-empty string`)
	}
	return normalized
}

function normalizeContentDir(value: string | undefined): string {
	return value?.trim() || 'content'
}

function normalizeDemosDir(value: string | undefined): string {
	return value?.trim() || ''
}

function normalizeTitle(value: string | undefined): string {
	const normalized = value?.trim()
	return normalized || 'Docs'
}