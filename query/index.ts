import path from 'node:path'
import { createParse } from 'comark'
import type { ComarkPlugin } from 'comark'
import type {
  ContentDirectoryConfig,
  ContentEntry,
  ContentNavigationItem,
  NavigationQueryBuilder,
  QueryBuilder,
  QueryOptions,
} from '@vike-vue-content/shared/types'

import {
  filterDirectoryConfigsByCollection,
  hasEntryRedirect,
  normalizeRoutePath,
  readContentEntry,
  scanContentRoot,
} from './content'
import { buildNavigationTree, flattenNavigation } from './navigation'
import { compareEntries } from './order'

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

export {
  scanContentRoot,
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
  extractHeadingMetadata,
  buildToc,
  attachContentMetadata,
} from './metadata'

// ─── Content plugins (configure once, use everywhere) ────────

let contentPlugins: unknown[] | undefined

export function configureContentPlugins(plugins: unknown[]) {
  contentPlugins = plugins
  // Invalidate index so next getContentIndex rebuilds with plugins
  indexInstance = null
}

// ─── ContentIndex ────────────────────────────────────────────

export class ContentIndex {
  readonly entries: readonly ContentEntry[]
  private readonly byPath: Map<string, ContentEntry>
  private readonly byCollection: Map<string, ContentEntry[]>
  private readonly navTrees: Map<string, ContentNavigationItem[]>
  private readonly flatNavs: Map<string, ContentNavigationItem[]>

  private constructor(
    entries: ContentEntry[],
    directoryConfigs: Map<string, ContentDirectoryConfig>,
  ) {
    this.entries = Object.freeze(entries)

    this.byPath = new Map()
    this.byCollection = new Map()
    for (const entry of entries) {
      this.byPath.set(entry.path, entry)
      const list = this.byCollection.get(entry.collection) ?? []
      list.push(entry)
      this.byCollection.set(entry.collection, list)
    }

    this.navTrees = new Map()
    this.flatNavs = new Map()
    for (const [collection, colEntries] of this.byCollection) {
      const configs = filterDirectoryConfigsByCollection(directoryConfigs, collection)
      const tree = buildNavigationTree([...colEntries], configs)
      this.navTrees.set(collection, tree)
      this.flatNavs.set(collection, flattenNavigation(tree))
    }
  }

  static async build(contentRoot: string, plugins?: unknown[]): Promise<ContentIndex> {
    const { markdownFiles, directoryConfigs } = await scanContentRoot(contentRoot)
    const parse = plugins?.length
      ? createParse({ plugins: [...plugins] as ComarkPlugin[] })
      : createParse()
    const entries = await Promise.all(
      markdownFiles.map((fp) => readContentEntry(contentRoot, fp, parse)),
    )
    return new ContentIndex(entries, directoryConfigs)
  }

  getByPath(p: string): ContentEntry | undefined {
    return this.byPath.get(normalizeRoutePath(p))
  }

  getByCollection(collection: string): readonly ContentEntry[] {
    return this.byCollection.get(collection) ?? []
  }

  getNavigationTree(collection: string): ContentNavigationItem[] {
    return this.navTrees.get(collection) ?? []
  }

  getFlatNavigation(collection: string): ContentNavigationItem[] {
    return this.flatNavs.get(collection) ?? []
  }

  getSurroundings(
    collection: string,
    p: string,
  ): [ContentNavigationItem | null, ContentNavigationItem | null] {
    const flat = this.getFlatNavigation(collection)
    const target = normalizeRoutePath(p)
    const i = flat.findIndex((item) => item.path === target)
    return [flat[i - 1] ?? null, flat[i + 1] ?? null]
  }

  getPaths(collection: string): string[] {
    return this.getByCollection(collection)
      .filter((e) => !hasEntryRedirect(e))
      .sort((a, b) => compareEntries(a, b, []))
      .map((e) => e.path)
  }
}

// ─── Lazy singleton ──────────────────────────────────────────

let indexInstance: ContentIndex | null = null

export async function getContentIndex(contentRoot: string): Promise<ContentIndex> {
  if (!indexInstance) {
    indexInstance = await ContentIndex.build(contentRoot, contentPlugins)
  }
  return indexInstance
}

export function resetContentIndex(): void {
  indexInstance = null
}

// ─── queryCollectionPaths (used by prerender) ────────────────

export async function queryCollectionPaths(
  collection: string,
  options: QueryOptions = {},
): Promise<string[]> {
  const cwd = options.cwd ?? process.cwd()
  const contentRoot = path.resolve(cwd, options.contentDir ?? 'content')
  const index = await getContentIndex(contentRoot)
  return index.getPaths(collection)
}
