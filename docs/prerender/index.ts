import path from 'node:path'
import { queryCollectionPaths } from '@vike-vue-content/query'
import { getGlobalContext } from 'vike'

import { resolveDocsBaseFromCaller } from '../utils/caller'
import { resolveDocsPageOptions } from '../config/options'
import { fromCollectionPath } from '../utils/paths'
import { getDocsRouteBaseFromRouteValue } from '../route'


export function createDocsPrerender(routeOrBase?: unknown) {
	const docsBase = resolveDocsPrerenderBase(routeOrBase)

	return async function onBeforePrerenderStart(): Promise<string[]> {
		const globalContext = await getGlobalContext()
		const urls = new Set<string>()
		// Public globalContext.pages omits custom page config values such as docs.
		const pageConfigs = globalContext.dangerouslyUseInternals._pageConfigs as Array<{
			configValues?: Record<string, { value: unknown }>
		}>

		for (const pageConfig of pageConfigs) {
			const docsConfig = pageConfig.configValues?.docs?.value
			if (!docsConfig) {
				continue
			}

			const routeBase = getDocsRouteBaseFromRouteValue(pageConfig.configValues?.route?.value)
			if (routeBase !== docsBase) {
				continue
			}

			const options = resolveServerDocsOptions(docsConfig, docsBase)
			const paths = await queryCollectionPaths(options.collection, { contentDir: options.contentDir })
			for (const entryPath of paths) {
				urls.add(fromCollectionPath(entryPath, options))
			}
		}

		return [...urls]
	}
}

export const onBeforePrerenderStart = createDocsPrerender()
export default onBeforePrerenderStart

function resolveDocsPrerenderBase(routeOrBase: unknown): string {
	const routeBase = getDocsRouteBaseFromRouteValue(routeOrBase)
	if (routeBase) {
		return routeBase
	}

	const base = typeof routeOrBase === 'string' ? routeOrBase : undefined
	return resolveDocsPageOptions(
		undefined,
		'createDocsPrerender()',
		resolveDocsBaseFromCaller(base, '/docs'),
	).base
}

function resolveServerDocsOptions(value: unknown, docsBase: string) {
	const options = resolveDocsPageOptions(
		value,
		'globalContext._pageConfigs.*.configValues.docs.value',
		docsBase,
	)
	return {
		...options,
		contentDir: path.isAbsolute(options.contentDir)
			? options.contentDir
			: path.join(process.cwd(), options.contentDir),
	}
}