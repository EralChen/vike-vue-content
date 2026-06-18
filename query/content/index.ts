import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { createParse, type ComarkTree } from 'comark'
import type {
  ContentDirectoryConfig,
  ContentEntry,
  ContentNavigationConfig,
} from '@vike-vue-content/shared/types'
import { parse as parseYaml } from 'yaml'

import {
  attachContentMetadata,
  buildToc,
  extractHeadingMetadata,
  extractTitleFromMarkdown,
} from '../metadata'
import type { ComarkPlugin } from 'comark'

const defaultParse = createParse()
const parseCache = new Map<string, ReturnType<typeof createParse>>()

function getParse(plugins?: unknown[]) {
  if (!plugins?.length) return defaultParse
  const key = plugins.map((_, i) => i).join(',')
  if (!parseCache.has(key)) {
    parseCache.set(key, createParse({ plugins: plugins as ComarkPlugin[] }))
  }
  return parseCache.get(key)!
}

const CONTENT_DIRECTORY_CONFIG_FILE = '.config.yml'

export type ContentScanResult = {
  markdownFiles: string[]
  directoryConfigs: Map<string, ContentDirectoryConfig>
}

export async function scanContentRoot(rootDir: string): Promise<ContentScanResult> {
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

export async function readContentEntry(contentRoot: string, filePath: string, plugins?: unknown[]): Promise<ContentEntry> {
  const rawbody = await readFile(filePath, 'utf8')
  const parse = getParse(plugins)
  const parsed = await parse(rawbody) as ComarkTree
  const frontmatter = asRecord(parsed.frontmatter)
  const relPath = toPosix(path.relative(contentRoot, filePath))
  const collection = relPath.split('/').filter(Boolean)[0] ?? 'content'
  const stem = relPath.replace(/\.md$/i, '')
  const routeStem = stripOrderingPath(stem)
  const routePath = normalizeRoutePath('/' + routeStem.replace(/\/index$/i, ''))
  const headingMeta = extractHeadingMetadata(rawbody)
  const toc = buildToc(headingMeta)
  const title = asString(frontmatter.title)
    ?? extractTitleFromMarkdown(rawbody)
    ?? buildFallbackTitleFromStem(routeStem)
  const description = asString(frontmatter.description)
  const navigation = normalizePageNavigation(frontmatter.navigation, routePath)

  return {
    id: relPath,
    collection,
    path: routePath,
    stem,
    title,
    description,
    toc,
    navigation,
    body: attachContentMetadata(parsed, toc, headingMeta),
    rawbody,
    frontmatter,
    meta: asRecord(parsed.meta),
  }
}

export function hasEntryRedirect(entry: ContentEntry): boolean {
  const redirectValue = entry.frontmatter.redirect
  return typeof redirectValue === 'string' && redirectValue.trim().length > 0
}

export function filterDirectoryConfigsByCollection(
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

export function normalizeRoutePath(value: string): string {
  const normalized = toPosix(value).trim()
  const withLeadingSlash = normalized.startsWith('/') ? normalized : `/${normalized}`
  const compact = withLeadingSlash.replace(/\/+/g, '/').replace(/\/$/, '')
  return compact || '/'
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
  const navigation = normalizeNavigationConfig(value.navigation, routePath, CONTENT_DIRECTORY_CONFIG_FILE)
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
  source: string,
): ContentNavigationConfig | undefined {
  if (value === undefined) {
    return undefined
  }

  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Invalid ${source} at ${routePath}: navigation should be an object`)
  }

  const config = value as Record<string, unknown>
  const label = asString(config.label)
  const description = asString(config.description)
  const icon = asString(config.icon)
  const hidden = config.hidden
  const flatten = config.flatten
  const extras = Object.fromEntries(
    Object.entries(config).filter(([key]) => !['label', 'description', 'icon', 'hidden', 'flatten'].includes(key)),
  )

  if (config.label !== undefined && label === undefined) {
    throw new Error(`Invalid ${source} at ${routePath}: navigation.label should be a string`)
  }

  if (config.description !== undefined && description === undefined) {
    throw new Error(`Invalid ${source} at ${routePath}: navigation.description should be a string`)
  }

  if (config.icon !== undefined && icon === undefined) {
    throw new Error(`Invalid ${source} at ${routePath}: navigation.icon should be a string`)
  }

  if (hidden !== undefined && typeof hidden !== 'boolean') {
    throw new Error(`Invalid ${source} at ${routePath}: navigation.hidden should be a boolean`)
  }

  if (flatten !== undefined && typeof flatten !== 'boolean') {
    throw new Error(`Invalid ${source} at ${routePath}: navigation.flatten should be a boolean`)
  }

  if (
    label === undefined
    && description === undefined
    && icon === undefined
    && hidden === undefined
    && flatten === undefined
    && Object.keys(extras).length === 0
  ) {
    return undefined
  }

  return {
    ...extras,
    label,
    description,
    icon,
    hidden,
    flatten,
  }
}

function normalizePageNavigation(
  value: unknown,
  routePath: string,
): ContentNavigationConfig | undefined {
  if (value === undefined) {
    return undefined
  }

  return normalizeNavigationConfig(value, routePath, 'markdown frontmatter')
}

function getCollectionFromRoutePath(routePath: string): string {
  return routePath.split('/').filter(Boolean)[0] ?? ''
}

function toDirectoryRoutePath(contentRoot: string, directoryPath: string): string {
  const relPath = toPosix(path.relative(contentRoot, directoryPath))
  return normalizeRoutePath(`/${stripOrderingPath(relPath)}`)
}

function buildFallbackTitleFromStem(routeStem: string): string {
  const segments = routeStem.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1] ?? routeStem
  const segment = lastSegment === 'index' && segments.length > 1
    ? segments[segments.length - 2] ?? lastSegment
    : lastSegment

  return segment
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function stripOrderingPath(value: string): string {
  return value
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/^\d+\./, ''))
    .join('/')
}

function toPosix(value: string): string {
  return value.replace(/\\/g, '/')
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}