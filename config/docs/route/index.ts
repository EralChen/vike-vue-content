import type { PageContext } from 'vike/types'

import { normalizeRoutePath, resolveDocsPageOptions } from '../options'
import { matchesDocsPath } from '../paths'


export function route(pageContext: PageContext) {
	const options = resolveDocsPageOptions(readDocsConfig(pageContext.config), 'pageContext.config.docs')
	if (!matchesDocsPath(pageContext.urlPathname, options)) {
		return false
	}

	return {
		routeParams: {
			path: normalizeRoutePath(pageContext.urlPathname),
		},
	}
}

export default route

function readDocsConfig(config: PageContext['config']): unknown {
	return (config as { docs?: unknown }).docs
}