import type { PageContext } from 'vike/types'

import { resolveDocsBaseFromCaller } from '../utils/caller'
import { normalizeRoutePath, resolveDocsPageOptions } from '../config/options'
import { matchesDocsPath } from '../utils/paths'

const DOCS_BASE_ROUTE_PARAM = '__docsBase'
const DOCS_ROUTE_BASE_PROP = '__vikeVueContentDocsBase'

type DocsRoute = ((pageContext: PageContext) => false | {
	routeParams: Record<string, string>
}) & {
	[DOCS_ROUTE_BASE_PROP]?: string
}

export function createDocsRoute(base = '/docs'): DocsRoute {
	const options = resolveDocsPageOptions(
		undefined,
		'createDocsRoute()',
		resolveDocsBaseFromCaller(base, '/docs'),
	)

	const route = ((pageContext: PageContext) => {
		if (!matchesDocsPath(pageContext.urlPathname, options)) {
			return false
		}

		return {
			routeParams: {
				path: normalizeRoutePath(pageContext.urlPathname),
				[DOCS_BASE_ROUTE_PARAM]: options.base,
			},
		}
	}) as DocsRoute

	Object.defineProperty(route, DOCS_ROUTE_BASE_PROP, {
		value: options.base,
		enumerable: false,
		configurable: false,
		writable: false,
	})

	return route
}

export const route = createDocsRoute()
export default route

export function getDocsRouteBaseFromRouteParams(routeParams: Record<string, string> | undefined): string {
	return resolveDocsPageOptions(undefined, 'docs route', routeParams?.[DOCS_BASE_ROUTE_PARAM]).base
}

export function getDocsRouteBaseFromRouteValue(routeValue: unknown): string | null {
	if (typeof routeValue !== 'function') {
		return null
	}

	const docsBase = Reflect.get(routeValue as object, DOCS_ROUTE_BASE_PROP)
	if (typeof docsBase !== 'string') {
		return null
	}

	return resolveDocsPageOptions(undefined, 'docs route', docsBase).base
}