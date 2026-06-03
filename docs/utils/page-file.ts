const PAGES_SEGMENT = '/pages/'
const ROUTE_FILE_RE = /\/\+route\.[cm]?[jt]sx?$/
const PRERENDER_FILE_RE = /\/\+onBeforePrerenderStart\.[cm]?[jt]sx?$/

export function normalizeDocsRuntimeFileId(id: string): string {
	return id.split('?')[0]?.split('#')[0]?.replace(/\\/g, '/') ?? id
}

export function isDocsRouteFile(id: string): boolean {
	return ROUTE_FILE_RE.test(id)
}

export function isDocsPrerenderFile(id: string): boolean {
	return PRERENDER_FILE_RE.test(id)
}

export function inferDocsBaseFromPageFile(filePath: string): string | null {
	const normalized = normalizeDocsRuntimeFileId(filePath)
	const pagesIndex = normalized.lastIndexOf(PAGES_SEGMENT)
	if (pagesIndex === -1) {
		return null
	}

	const pageFilePath = normalized.slice(pagesIndex + PAGES_SEGMENT.length)
	const plusFileIndex = pageFilePath.lastIndexOf('/+')
	if (plusFileIndex === -1) {
		return null
	}

	return routeLocationToBase(pageFilePath.slice(0, plusFileIndex))
}

function routeLocationToBase(routeLocation: string): string | null {
	const normalized = routeLocation.replace(/^\/+|\/+$/g, '')
	if (!normalized) {
		return '/'
	}

	const segments = normalized.split('/').filter(Boolean)
	if (segments[segments.length - 1] === 'index') {
		segments.pop()
	}

	if (segments.length === 0) {
		return '/'
	}

	return `/${segments.join('/')}`
}