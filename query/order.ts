import type { ContentEntry, QueryOrderDirection } from '@vike-vue-content/shared/types'

export type QueryOrder = {
  field: string
  direction: QueryOrderDirection
}

export function compareEntries(
  left: ContentEntry,
  right: ContentEntry,
  orders: QueryOrder[] = [],
): number {
  for (const order of orders) {
    const result = compareValues(
      getEntryFieldValue(left, order.field),
      getEntryFieldValue(right, order.field),
    )

    if (result !== 0) {
      return order.direction === 'DESC' ? -result : result
    }
  }

  return left.stem.localeCompare(right.stem) || left.path.localeCompare(right.path)
}

function getEntryFieldValue(entry: ContentEntry, field: string): unknown {
  if (!field) {
    return undefined
  }

  const segments = field.split('.').filter(Boolean)
  let current: unknown = entry

  for (const segment of segments) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      return undefined
    }
    current = (current as Record<string, unknown>)[segment]
  }

  return current
}

function compareValues(left: unknown, right: unknown): number {
  if (left === right) {
    return 0
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }

  if (typeof left === 'boolean' && typeof right === 'boolean') {
    return Number(left) - Number(right)
  }

  return String(left ?? '').localeCompare(String(right ?? ''))
}