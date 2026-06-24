import {
	configureContentPlugins,
	getContentIndex,
} from '@vike-vue-content/query'
import type { DocsPageData } from '@vike-vue-content/shared/types'
import path from 'node:path'
import type { PageContextServer } from 'vike/types'
import { useConfig } from 'vike-vue/useConfig'

import { resolveDocsPageOptions } from '../config/options'
import { getDocsRouteBaseFromRouteParams } from '../route'
import {
	mapContentEntryPath,
	mapNavigationItem,
	mapNavigationTree,
	resolveNavigationItems,
	toCollectionPath,
} from '../utils/paths'

export type { DocsPageData } from '@vike-vue-content/shared/types'

export async function data(pageContext: PageContextServer): Promise<DocsPageData> {
	const config = useConfig()
	const docsBase = getDocsRouteBaseFromRouteParams(pageContext.routeParams)
	const options = resolveServerDocsOptions(readDocsConfig(pageContext.config), docsBase)
	const plugins = readContentPlugins(pageContext.config)
	const requestedPath = pageContext.routeParams.path ?? options.base
	const collectionPath = toCollectionPath(requestedPath, options)

	configureContentPlugins(plugins)
	const index = await getContentIndex(options.contentDir)

	const page = index.getByPath(collectionPath) ?? null
	const navigation = index.getNavigationTree(options.collection)
	const [prevRaw, nextRaw] = index.getSurroundings(options.collection, collectionPath)

	config({
		title: page?.title ?? options.title,
	})

	const mappedNavigation = mapNavigationTree(navigation, options)

	return {
		docsBase: options.base,
		demosDir: options.demosDir,
		page: page ? mapContentEntryPath(page, options) : null,
		navigation: resolveNavigationItems(mappedNavigation, requestedPath),
		prev: mapNavigationItem(prevRaw, options),
		next: mapNavigationItem(nextRaw, options),
		requestedPath,
	}
}

export default data

function resolveServerDocsOptions(value: unknown, docsBase: string) {
	const options = resolveDocsPageOptions(value, 'pageContext.config.docs', docsBase)
	return {
		...options,
		contentDir: path.isAbsolute(options.contentDir)
			? options.contentDir
			: path.join(process.cwd(), options.contentDir),
	}
}

function readDocsConfig(config: PageContextServer['config']): unknown {
	return (config as { docs?: unknown }).docs
}

function readContentPlugins(config: PageContextServer['config']): unknown[] {
	const content = (config as { content?: { plugins?: unknown[] } }).content
	return content?.plugins ?? []
}
