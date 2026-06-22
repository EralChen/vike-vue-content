import {
	flattenNavigation,
	normalizeRoutePath,
	queryCollection,
	queryCollectionNavigation,
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

	const [page, navigation] = await Promise.all([
		queryCollection(options.collection, { contentDir: options.contentDir, plugins })
			.path(collectionPath)
			.first(),
		queryCollectionNavigation(options.collection, { contentDir: options.contentDir, plugins }),
	])

	// 从已构建的导航树直接计算 prev/next，避免重复扫描+解析
	const flat = flattenNavigation(navigation)
	const target = normalizeRoutePath(collectionPath)
	const index = flat.findIndex((item) => item.path === target)
	const prevRaw = index > 0 ? flat[index - 1] ?? null : null
	const nextRaw = index >= 0 ? flat[index + 1] ?? null : null

	config({
		title: page?.title ?? options.title,
	})

	const mappedNavigation = mapNavigationTree(navigation, options)

	return {
		docsBase: options.base,
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
