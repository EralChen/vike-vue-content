import type { ContentEntry, ContentNavigationItem } from '@vike-vue-content/query'
import {
	queryCollection,
	queryCollectionItemSurroundings,
	queryCollectionNavigation,
} from '@vike-vue-content/query'
import path from 'node:path'
import type { PageContextServer } from 'vike/types'
import { useConfig } from 'vike-vue/useConfig'

import { resolveDocsPageOptions } from '../options'
import { getDocsRouteBaseFromRouteParams } from '../route'
import {
	mapContentEntryPath,
	mapNavigationItem,
	mapNavigationTree,
	toCollectionPath,
} from '../paths'

export type DocsPageData = {
	docsBase: string
	page: ContentEntry | null
	navigation: ContentNavigationItem[]
	prev: ContentNavigationItem | null
	next: ContentNavigationItem | null
	requestedPath: string
}

export async function data(pageContext: PageContextServer): Promise<DocsPageData> {
	const config = useConfig()
	const docsBase = getDocsRouteBaseFromRouteParams(pageContext.routeParams)
	const options = resolveServerDocsOptions(readDocsConfig(pageContext.config), docsBase)
	const requestedPath = pageContext.routeParams.path ?? options.base
	const collectionPath = toCollectionPath(requestedPath, options)

	const page = await queryCollection(options.collection, { contentDir: options.contentDir })
		.path(collectionPath)
		.first()

	const [navigation, surroundings] = await Promise.all([
		queryCollectionNavigation(options.collection, { contentDir: options.contentDir }),
		queryCollectionItemSurroundings(options.collection, collectionPath, {
			contentDir: options.contentDir,
		}),
	])

	config({
		title: page?.title ?? options.title,
	})

	return {
		docsBase: options.base,
		page: page ? mapContentEntryPath(page, options) : null,
		navigation: mapNavigationTree(navigation, options),
		prev: mapNavigationItem(surroundings[0], options),
		next: mapNavigationItem(surroundings[1], options),
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