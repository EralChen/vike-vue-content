import path from 'node:path'
import type {
  NavigationQueryBuilder,
  QueryBuilder,
  QueryOptions,
} from '@vike-vue-content/shared/types'

export type {
  ContentDirectoryConfig,
  ContentEntry,
  ContentNavigationConfig,
  ContentNavigationItem,
  ContentTocLink,
  NavigationQueryBuilder,
  QueryBuilder,
  QueryOrderDirection,
  QueryOptions,
} from '@vike-vue-content/shared/types'

import {
  filterDirectoryConfigsByCollection,
  hasEntryRedirect,
  normalizeRoutePath,
  readContentEntry,
  scanContentRoot,
} from './content'
import { buildNavigationTree, createNavigationQuery, flattenNavigation } from './navigation'
import { compareEntries, type QueryOrder } from './order'

export {
  scanContentRoot,
  readContentEntry,
  hasEntryRedirect,
  filterDirectoryConfigsByCollection,
  normalizeRoutePath,
  type ContentScanResult,
} from './content'
export {
  buildNavigationTree,
  flattenNavigation,
} from './navigation'
export {
  compareEntries,
} from './order'
export {
  extractTitleFromMarkdown,
  extractDescriptionFromMarkdown,
  extractHeadingMetadata,
  buildToc,
  attachContentMetadata,
} from './metadata'

export function queryCollection(collection: string, options: QueryOptions = {}): QueryBuilder {
  const cwd = options.cwd ?? process.cwd()
  const contentRoot = path.resolve(cwd, options.contentDir ?? 'content')
  const plugins = options.plugins
  const targetCollection = collection.trim()
  let selectedPath: string | null = null
  const orders: QueryOrder[] = []

  const load = async () => {
    const { markdownFiles } = await scanContentRoot(contentRoot)
    const entries = await Promise.all(
      markdownFiles.map((filePath) => readContentEntry(contentRoot, filePath, plugins)),
    )

    return entries
      .filter((entry) => entry.collection === targetCollection)
      .filter((entry) => !selectedPath || entry.path === selectedPath)
      .sort((left, right) => compareEntries(left, right, orders))
  }

  const api: QueryBuilder = {
    path(value: string) {
      selectedPath = normalizeRoutePath(value)
      return api
    },
    order(field, direction = 'ASC') {
      const normalizedField = field.trim()
      if (normalizedField) {
        orders.push({
          field: normalizedField,
          direction,
        })
      }
      return api
    },
    async all() {
      return load()
    },
    async first() {
      const entries = await load()
      return entries[0] ?? null
    },
  }

  return api
}

export function queryCollectionNavigation(
  collection: string,
  options: QueryOptions = {},
): NavigationQueryBuilder {
  const cwd = options.cwd ?? process.cwd()
  const contentRoot = path.resolve(cwd, options.contentDir ?? 'content')
  const plugins = options.plugins
  const targetCollection = collection.trim()
  const orders: QueryOrder[] = []

  const load = async () => {
    const { markdownFiles, directoryConfigs } = await scanContentRoot(contentRoot)
    const entries = await Promise.all(
      markdownFiles.map((filePath) => readContentEntry(contentRoot, filePath, plugins)),
    )

    const filteredEntries = entries
      .filter((entry) => entry.collection === targetCollection)
      .sort((left, right) => compareEntries(left, right, orders))

    return buildNavigationTree(
      filteredEntries,
      filterDirectoryConfigsByCollection(directoryConfigs, targetCollection),
    )
  }

  return createNavigationQuery(load, orders)
}

export async function queryCollectionItemSurroundings(
  collection: string,
  path: string,
  options: QueryOptions = {},
) {
  const tree = await queryCollectionNavigation(collection, options)
  const flat = flattenNavigation(tree)
  const target = normalizeRoutePath(path)
  const index = flat.findIndex((item) => item.path === target)
  if (index === -1) {
    return [null, null] as const
  }
  return [flat[index - 1] ?? null, flat[index + 1] ?? null] as const
}

/**
 * Enumerate every route path in a collection.
 *
 * Feed the returned URLs to Vike's `onBeforePrerenderStart()` hook so
 * content-driven (Route Function) pages can be statically pre-rendered.
 */
export async function queryCollectionPaths(
  collection: string,
  options: QueryOptions = {},
): Promise<string[]> {
  const cwd = options.cwd ?? process.cwd()
  const contentRoot = path.resolve(cwd, options.contentDir ?? 'content')
  const plugins = options.plugins
  const { markdownFiles } = await scanContentRoot(contentRoot)
  const entries = await Promise.all(
    markdownFiles.map((filePath) => readContentEntry(contentRoot, filePath, plugins)),
  )

  return entries
    .filter((entry) => entry.collection === collection.trim())
    .filter((entry) => !hasEntryRedirect(entry))
    .sort((left, right) => compareEntries(left, right, []))
    .map((entry) => entry.path)
}
