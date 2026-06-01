import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { createParse, type ComarkTree } from 'comark'
import { parse as parseYaml } from 'yaml'

const parseMarkdown = createParse()
const CONTENT_DIRECTORY_CONFIG_FILE = '.config.yml'

export type ContentEntry = {
  id: string
  collection: string
  path: string
  stem: string
  title?: string
  description?: string
  body: ComarkTree
  rawbody: string
  frontmatter: Record<string, unknown>
  meta: Record<string, unknown>
}

export type ContentNavigationItem = {
  title: string
  path: string
  stem?: string
  children?: ContentNavigationItem[]
  page?: false
  config?: ContentDirectoryConfig
  navigation?: ContentNavigationConfig
  [key: string]: unknown
}

export type ContentDirectoryConfig = {
  navigation?: ContentNavigationConfig
  redirect?: string
}

export type ContentNavigationConfig = {
  label?: string
  icon?: string
  hidden?: boolean
  flatten?: boolean
}

export type QueryOptions = {
  cwd?: string
  contentDir?: string
}

export type QueryBuilder = {
  path(value: string): QueryBuilder
  all(): Promise<ContentEntry[]>
  first(): Promise<ContentEntry | null>
}

export function queryCollection(collection: string, options: QueryOptions = {}): QueryBuilder {
  const cwd = options.cwd ?? process.cwd()
  const contentRoot = path.resolve(cwd, options.contentDir ?? 'content')
  const targetCollection = collection.trim()
  let selectedPath: string | null = null

  const load = async () => {
    const { markdownFiles: files } = await scanContentRoot(contentRoot)
    const entries = await Promise.all(
      files.map((filePath) => readContentEntry(contentRoot, filePath)),
    )

    return entries
      .filter((entry) => entry.collection === targetCollection)
      .filter((entry) => !selectedPath || entry.path === selectedPath)
      .sort((a, b) => a.path.localeCompare(b.path))
  }

  const api: QueryBuilder = {
    path(value: string) {
      selectedPath = normalizeRoutePath(value)
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

type ContentScanResult = {
  markdownFiles: string[]
  directoryConfigs: Map<string, ContentDirectoryConfig>
}

async function scanContentRoot(rootDir: string): Promise<ContentScanResult> {
  const markdownFiles: string[] = []
  const directoryConfigs = new Map<string, ContentDirectoryConfig>()

  async function visit(dir: string) {
    let items
    try {
      items = await readdir(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const item of items) {
      const itemPath = path.join(dir, item.name)
      if (item.isDirectory()) {
        await visit(itemPath)
        continue
      }
      if (item.isFile() && item.name === CONTENT_DIRECTORY_CONFIG_FILE) {
        const routePath = toDirectoryRoutePath(rootDir, dir)
        const config = await readDirectoryConfig(itemPath, routePath)
        if (config) {
          directoryConfigs.set(routePath, config)
        }
        continue
      }
      if (item.isFile() && item.name.endsWith('.md')) {
        markdownFiles.push(itemPath)
      }
    }
  }

  await visit(rootDir)
  return { markdownFiles, directoryConfigs }
}

async function readContentEntry(contentRoot: string, filePath: string): Promise<ContentEntry> {
  const rawbody = await readFile(filePath, 'utf8')
  const parsed = await parseMarkdown(rawbody)
  const frontmatter = asRecord(parsed.frontmatter)
  const relPath = toPosix(path.relative(contentRoot, filePath))
  const collection = relPath.split('/').filter(Boolean)[0] ?? 'content'
  const stem = relPath.replace(/\.md$/i, '')
  const routePath = normalizeRoutePath(
    '/' + stem.replace(/\/index$/i, ''),
  )

  return {
    id: relPath,
    collection,
    path: routePath,
    stem,
    title: asString(frontmatter.title),
    description: asString(frontmatter.description),
    body: parsed,
    rawbody,
    frontmatter,
    meta: asRecord(parsed.meta),
  }
}

export async function queryCollectionNavigation(
  collection: string,
  options: QueryOptions = {},
): Promise<ContentNavigationItem[]> {
  const cwd = options.cwd ?? process.cwd()
  const contentRoot = path.resolve(cwd, options.contentDir ?? 'content')
  const { markdownFiles, directoryConfigs } = await scanContentRoot(contentRoot)
  const entries = await Promise.all(
    markdownFiles.map((filePath) => readContentEntry(contentRoot, filePath)),
  )

  return buildNavigationTree(
    entries.filter((entry) => entry.collection === collection.trim()),
    filterDirectoryConfigsByCollection(directoryConfigs, collection),
  )
}

export async function queryCollectionItemSurroundings(
  collection: string,
  path: string,
  options: QueryOptions = {},
): Promise<[ContentNavigationItem | null, ContentNavigationItem | null]> {
  const tree = await queryCollectionNavigation(collection, options)
  const flat = flattenNavigation(tree)
  const target = normalizeRoutePath(path)
  const index = flat.findIndex((item) => item.path === target)
  if (index === -1) {
    return [null, null]
  }
  return [flat[index - 1] ?? null, flat[index + 1] ?? null]
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
  const { markdownFiles } = await scanContentRoot(contentRoot)
  const entries = await Promise.all(
    markdownFiles.map((filePath) => readContentEntry(contentRoot, filePath)),
  )

  return entries
    .filter((entry) => entry.collection === collection.trim())
    .filter((entry) => !hasEntryRedirect(entry))
    .map((entry) => entry.path)
    .sort((left, right) => left.localeCompare(right))
}

function hasEntryRedirect(entry: ContentEntry): boolean {
  const redirectValue = entry.frontmatter.redirect
  return typeof redirectValue === 'string' && redirectValue.trim().length > 0
}

function buildNavigationTree(
  entries: ContentEntry[],
  directoryConfigs: Map<string, ContentDirectoryConfig>,
): ContentNavigationItem[] {
  const root: ContentNavigationItem[] = []
  const sorted = [...entries].sort((a, b) => a.stem.localeCompare(b.stem))

  for (const entry of sorted) {
    const segments = entry.path.split('/').filter(Boolean)
    let level = root
    let currentPath = ''

    for (let i = 0; i < segments.length; i++) {
      currentPath += '/' + segments[i]
      const isLeaf = i === segments.length - 1
      let node = level.find((item) => item.path === currentPath)

      if (!node) {
        node = {
          title: generateTitle(segments[i]!),
          path: currentPath,
          children: [],
        }
        applyDirectoryConfig(node, directoryConfigs.get(currentPath))
        if (!isLeaf) {
          node.page = false
        }
        level.push(node)
      }

      if (isLeaf) {
        node.title = entry.title ?? node.title
        node.stem = entry.stem
        delete node.page
        applyDirectoryConfig(node, directoryConfigs.get(currentPath))
      }

      level = node.children!
    }
  }

  return pruneEmptyChildren(root)
}

function flattenNavigation(items: ContentNavigationItem[]): ContentNavigationItem[] {
  const out: ContentNavigationItem[] = []
  for (const item of items) {
    if (item.page !== false) {
      out.push({ ...item, children: undefined })
    }
    if (item.children?.length) {
      out.push(...flattenNavigation(item.children))
    }
  }
  return out
}

function pruneEmptyChildren(items: ContentNavigationItem[]): ContentNavigationItem[] {
  return items.map((item) => {
    if (item.children?.length) {
      return { ...item, children: pruneEmptyChildren(item.children) }
    }
    const { children, ...rest } = item
    return rest
  })
}

function generateTitle(segment: string): string {
  return segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function applyDirectoryConfig(
  item: ContentNavigationItem,
  config: ContentDirectoryConfig | undefined,
): void {
  if (!config) {
    return
  }

  if (config.navigation?.label) {
    item.title = config.navigation.label
  }

  if (config.navigation) {
    item.navigation = config.navigation
  }

  item.config = config
}

function filterDirectoryConfigsByCollection(
  configs: Map<string, ContentDirectoryConfig>,
  collection: string,
): Map<string, ContentDirectoryConfig> {
  const targetCollection = collection.trim()
  const filtered = new Map<string, ContentDirectoryConfig>()

  for (const [routePath, config] of configs) {
    if (getCollectionFromRoutePath(routePath) === targetCollection) {
      filtered.set(routePath, config)
    }
  }

  return filtered
}

function getCollectionFromRoutePath(routePath: string): string {
  return routePath.split('/').filter(Boolean)[0] ?? ''
}

function toDirectoryRoutePath(contentRoot: string, directoryPath: string): string {
  const relPath = toPosix(path.relative(contentRoot, directoryPath))
  return normalizeRoutePath(`/${relPath}`)
}

async function readDirectoryConfig(
  filePath: string,
  routePath: string,
): Promise<ContentDirectoryConfig | null> {
  const raw = await readFile(filePath, 'utf8')

  let value: unknown
  try {
    value = parseYaml(raw)
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(`Invalid ${CONTENT_DIRECTORY_CONFIG_FILE} at ${routePath}: ${reason}`)
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Invalid ${CONTENT_DIRECTORY_CONFIG_FILE} at ${routePath}: expected an object`)
  }

  return normalizeDirectoryConfig(value as Record<string, unknown>, routePath)
}

function normalizeDirectoryConfig(
  value: Record<string, unknown>,
  routePath: string,
): ContentDirectoryConfig | null {
  const navigation = normalizeNavigationConfig(value.navigation, routePath)
  const redirect = asString(value.redirect)

  if (value.redirect !== undefined && redirect === undefined) {
    throw new Error(
      `Invalid ${CONTENT_DIRECTORY_CONFIG_FILE} at ${routePath}: redirect should be a string`,
    )
  }

  if (navigation === undefined && redirect === undefined) {
    return null
  }

  return {
    navigation,
    redirect,
  }
}

function normalizeNavigationConfig(
  value: unknown,
  routePath: string,
): ContentNavigationConfig | undefined {
  if (value === undefined) {
    return undefined
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(
      `Invalid ${CONTENT_DIRECTORY_CONFIG_FILE} at ${routePath}: navigation should be an object`,
    )
  }

  const config = value as Record<string, unknown>
  const label = asString(config.label)
  const icon = asString(config.icon)
  const hidden = config.hidden
  const flatten = config.flatten

  if (config.label !== undefined && label === undefined) {
    throw new Error(
      `Invalid ${CONTENT_DIRECTORY_CONFIG_FILE} at ${routePath}: navigation.label should be a string`,
    )
  }

  if (config.icon !== undefined && icon === undefined) {
    throw new Error(
      `Invalid ${CONTENT_DIRECTORY_CONFIG_FILE} at ${routePath}: navigation.icon should be a string`,
    )
  }

  if (hidden !== undefined && typeof hidden !== 'boolean') {
    throw new Error(
      `Invalid ${CONTENT_DIRECTORY_CONFIG_FILE} at ${routePath}: navigation.hidden should be a boolean`,
    )
  }

  if (flatten !== undefined && typeof flatten !== 'boolean') {
    throw new Error(
      `Invalid ${CONTENT_DIRECTORY_CONFIG_FILE} at ${routePath}: navigation.flatten should be a boolean`,
    )
  }

  if (label === undefined && icon === undefined && hidden === undefined && flatten === undefined) {
    return undefined
  }

  return {
    label,
    icon,
    hidden,
    flatten,
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function normalizeRoutePath(value: string): string {
  const normalized = toPosix(value).trim()
  const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`
  const compact = withLeadingSlash.replace(/\/+/g, '/').replace(/\/$/, '')
  return compact || '/'
}

function toPosix(value: string): string {
  return value.replace(/\\/g, '/')
}