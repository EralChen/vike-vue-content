import type { ContentEntry, ContentNavigationItem } from '@vike-vue-content/shared/types'

import { normalizeRoutePath, type ResolvedDocsPageOptions } from '../config/options'

export function matchesDocsPath(urlPathname: string, options: ResolvedDocsPageOptions): boolean {
	const normalized = normalizeRoutePath(urlPathname)
	if (options.base === '/') {
		return true
	}
	return normalized === options.base || normalized.startsWith(`${options.base}/`)
}

export function toCollectionPath(requestedPath: string, options: ResolvedDocsPageOptions): string {
	return remapRouteBase(requestedPath, options.base, options.collectionBase)
}

export function fromCollectionPath(collectionPath: string, options: ResolvedDocsPageOptions): string {
	return remapRouteBase(collectionPath, options.collectionBase, options.base)
}

export function mapContentEntryPath(entry: ContentEntry, options: ResolvedDocsPageOptions): ContentEntry {
	return {
		...entry,
		path: fromCollectionPath(entry.path, options),
	}
}

export function mapNavigationTree(
	items: ContentNavigationItem[],
	options: ResolvedDocsPageOptions,
): ContentNavigationItem[] {
	return items.map((item) => mapNavigationItemPath(item, options))
}

export function resolveNavigationItems(
	items: ContentNavigationItem[],
	currentPath: string,
): ContentNavigationItem[] {
	const targetPath = normalizeRoutePath(currentPath)
	return filterNavigationItems(items, targetPath)
}

export function mapNavigationItem(
	item: ContentNavigationItem | null,
	options: ResolvedDocsPageOptions,
): ContentNavigationItem | null {
	if (!item) {
		return null
	}

	return mapNavigationItemPath(item, options)
}

function mapNavigationItemPath(
	item: ContentNavigationItem,
	options: ResolvedDocsPageOptions,
): ContentNavigationItem {

	const mapped: ContentNavigationItem = {
		...item,
		path: fromCollectionPath(item.path, options),
	}

	if (item.children?.length) {
		mapped.children = mapNavigationTree(item.children, options)
	} else {
		delete mapped.children
	}

	return mapped
}

function filterNavigationItems(
	items: ContentNavigationItem[],
	targetPath: string,
): ContentNavigationItem[] {
	const filtered: ContentNavigationItem[] = []

	for (const item of items) {
		const children = item.children?.length
			? filterNavigationItems(item.children, targetPath)
			: undefined
		const shouldHide = item.navigation?.hidden && matchesNavigationScope(item.path, targetPath)
		const shouldFlatten = item.navigation?.flatten === true && Boolean(children?.length)

		if (shouldHide || shouldFlatten) {
			if (children?.length) {
				filtered.push(...children)
			}
			continue
		}

		const nextItem: ContentNavigationItem = {
			...item,
		}

		if (children?.length) {
			nextItem.children = children
		} else {
			delete nextItem.children
		}

		filtered.push(nextItem)
	}

	return filtered
}

function matchesNavigationScope(itemPath: string, targetPath: string): boolean {
	if (itemPath === '/') {
		return true
	}

	return targetPath === itemPath || targetPath.startsWith(`${itemPath}/`)
}

function remapRouteBase(value: string, fromBase: string, toBase: string): string {
	const normalized = normalizeRoutePath(value)
	if (fromBase === toBase) {
		return normalized
	}

	const suffix = getRouteSuffix(normalized, fromBase)
	if (suffix === null) {
		return normalized
	}

	return joinBaseAndSuffix(toBase, suffix)
}

function getRouteSuffix(value: string, base: string): string | null {
	if (base === '/') {
		return value === '/' ? '' : value
	}
	if (value === base) {
		return ''
	}
	if (value.startsWith(`${base}/`)) {
		return value.slice(base.length)
	}
	return null
}

function joinBaseAndSuffix(base: string, suffix: string): string {
	if (!suffix) {
		return base
	}
	if (base === '/') {
		return normalizeRoutePath(suffix)
	}
	return normalizeRoutePath(`${base}${suffix}`)
}