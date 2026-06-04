import type {
  ContentDirectoryConfig,
  ContentEntry,
  ContentNavigationConfig,
  ContentNavigationItem,
  NavigationQueryBuilder,
  QueryOrderDirection,
} from '@vike-vue-content/shared/types'

import type { QueryOrder } from '../order'

export function buildNavigationTree(
  entries: ContentEntry[],
  directoryConfigs: Map<string, ContentDirectoryConfig>,
): ContentNavigationItem[] {
  const root: ContentNavigationItem[] = []

  for (const entry of entries) {
    if (entry.navigation === false) {
      continue
    }

    const segments = entry.path.split('/').filter(Boolean)
    let level = root
    let currentPath = ''

    for (let index = 0; index < segments.length; index++) {
      currentPath += '/' + segments[index]
      const isLeaf = index === segments.length - 1
      let node = level.find((item) => item.path === currentPath)

      if (!node) {
        node = {
          title: generateTitle(segments[index]!),
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
        applyPageNavigation(node, entry)
        applyDirectoryConfig(node, directoryConfigs.get(currentPath))
      }

      level = node.children!
    }
  }

  return pruneEmptyChildren(root)
}

export function flattenNavigation(items: ContentNavigationItem[]): ContentNavigationItem[] {
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

export function createNavigationQuery(
  load: () => Promise<ContentNavigationItem[]>,
  orders: QueryOrder[],
): NavigationQueryBuilder {
  const api = {
    order(field: string, direction: QueryOrderDirection = 'ASC') {
      const normalizedField = field.trim()
      if (normalizedField) {
        orders.push({
          field: normalizedField,
          direction,
        })
      }
      return api
    },
    then(...args: Parameters<Promise<ContentNavigationItem[]>['then']>) {
      return load().then(...args)
    },
    catch(...args: Parameters<Promise<ContentNavigationItem[]>['catch']>) {
      return load().catch(...args)
    },
    finally(...args: Parameters<Promise<ContentNavigationItem[]>['finally']>) {
      return load().finally(...args)
    },
    [Symbol.toStringTag]: 'Promise' as const,
  }

  return api as NavigationQueryBuilder
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

  if (config.navigation) {
    applyNavigationMetadata(item, config.navigation)
  }

  item.config = config
}

function applyPageNavigation(item: ContentNavigationItem, entry: ContentEntry): void {
  if (entry.description) {
    item.description = entry.description
  }

  const navigation = entry.navigation
  if (navigation && typeof navigation === 'object') {
    applyNavigationMetadata(item, navigation)
  }
}

function applyNavigationMetadata(
  item: ContentNavigationItem,
  navigation: ContentNavigationConfig,
): void {
  const title = navigation.label ?? navigation.title
  if (title) {
    item.title = title
  }

  Object.assign(item, navigation)
  item.navigation = {
    ...(item.navigation ?? {}),
    ...navigation,
  }
}