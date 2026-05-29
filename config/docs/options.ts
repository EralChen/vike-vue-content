export type DocsPageOptions = {
	base?: string
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

export function normalizeRoutePath(value: string): string {
	const normalized = value.replace(/\\/g, '/').trim()
	const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`
	const compact = withLeadingSlash.replace(/\/+/g, '/').replace(/\/$/, '')
	return compact || '/'
}

export function resolveDocsPageOptions(value: unknown, definedAt = 'docs'): ResolvedDocsPageOptions {
	if (value !== undefined && (value === null || typeof value !== 'object' || Array.isArray(value))) {
		throw new Error(`${definedAt} should be an object`)
	}

	const options = (value ?? {}) as DocsPageOptions
	const collection = normalizeCollection(options.collection ?? 'docs', definedAt)
	const base = normalizeRoutePath(options.base ?? `/${collection}`)
	const contentDir = normalizeContentDir(options.contentDir)
	const title = normalizeTitle(options.title)

	return {
		base,
		collection,
		collectionBase: normalizeRoutePath(`/${collection}`),
		contentDir,
		title,
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

function normalizeTitle(value: string | undefined): string {
	const normalized = value?.trim()
	return normalized || 'Docs'
}