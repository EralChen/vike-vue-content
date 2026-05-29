import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { createParse, type ComarkTree } from 'comark'

const parseMarkdown = createParse()

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
  [key: string]: unknown
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
    const files = await walkMarkdownFiles(contentRoot)
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

async function walkMarkdownFiles(rootDir: string): Promise<string[]> {
  const files: string[] = []

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
      if (item.isFile() && item.name.endsWith('.md')) {
        files.push(itemPath)
      }
    }
  }

  await visit(rootDir)
  return files
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
  const entries = await queryCollection(collection, options).all()
  return buildNavigationTree(entries)
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
  const entries = await queryCollection(collection, options).all()
  return entries.map((entry) => entry.path)
}

function buildNavigationTree(entries: ContentEntry[]): ContentNavigationItem[] {
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
        if (!isLeaf) {
          node.page = false
        }
        level.push(node)
      }

      if (isLeaf) {
        node.title = entry.title ?? node.title
        node.stem = entry.stem
        delete node.page
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