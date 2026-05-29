import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { createParse, type ComarkTree } from 'comark'

const parseMarkdown = createParse()

export type ContentEntry = {
  id: string
  collection: string
  path: string
  title?: string
  description?: string
  body: ComarkTree
  rawbody: string
  frontmatter: Record<string, unknown>
  meta: Record<string, unknown>
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
  const routePath = normalizeRoutePath(
    '/' + relPath.replace(/\.md$/i, '').replace(/\/index$/i, ''),
  )

  return {
    id: relPath,
    collection,
    path: routePath,
    title: asString(frontmatter.title),
    description: asString(frontmatter.description),
    body: parsed,
    rawbody,
    frontmatter,
    meta: asRecord(parsed.meta),
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