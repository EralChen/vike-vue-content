import path from 'node:path'
import { queryCollectionPaths } from '@vike-vue-content/query'
import { getGlobalContext } from 'vike'

import { resolveDocsPageOptions } from '../options'
import { fromCollectionPath } from '../paths'


export async function onBeforePrerenderStart(): Promise<string[]> {
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

		const options = resolveServerDocsOptions(docsConfig)
		const paths = await queryCollectionPaths(options.collection, { contentDir: options.contentDir })
		for (const entryPath of paths) {
			urls.add(fromCollectionPath(entryPath, options))
		}
	}

	return [...urls]
}

export default onBeforePrerenderStart

function resolveServerDocsOptions(value: unknown) {
	const options = resolveDocsPageOptions(value, 'globalContext._pageConfigs.*.configValues.docs.value')
	return {
		...options,
		contentDir: path.isAbsolute(options.contentDir)
			? options.contentDir
			: path.join(process.cwd(), options.contentDir),
	}
}