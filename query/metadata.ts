import type { ComarkElement, ComarkNode, ComarkTree } from 'comark'
import type { ContentTocLink } from '@vike-vue-content/shared/types'

const FRONTMATTER_RE = /^---\s*\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/

export type HeadingMeta = {
  id: string
  text: string
  depth: number
}

export function extractTitleFromMarkdown(rawbody: string): string | undefined {
  for (const line of getMarkdownLines(rawbody)) {
    const match = line.match(/^#\s+(.+?)\s*#*\s*$/)
    if (match) {
      return cleanMarkdownText(match[1])
    }
  }

  return undefined
}

export function extractDescriptionFromMarkdown(rawbody: string): string | undefined {
  const paragraph: string[] = []

  for (const line of getMarkdownLines(rawbody)) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (paragraph.length) {
        break
      }
      continue
    }

    if (!isParagraphLine(trimmed)) {
      if (paragraph.length) {
        break
      }
      continue
    }

    paragraph.push(trimmed)
  }

  if (!paragraph.length) {
    return undefined
  }

  return cleanMarkdownText(paragraph.join(' '))
}

export function extractHeadingMetadata(rawbody: string): HeadingMeta[] {
  const nextSlug = createHeadingSlugger()

  return getMarkdownLines(rawbody)
    .map((line) => line.match(/^(#{2,6})\s+(.+?)\s*#*\s*$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => {
      const text = cleanMarkdownText(match[2] ?? '')
      return {
        id: nextSlug(text),
        text,
        depth: match[1]?.length ?? 2,
      }
    })
    .filter((heading) => heading.text)
}

export function buildToc(headings: HeadingMeta[]): ContentTocLink[] {
  const root: ContentTocLink[] = []
  const stack: ContentTocLink[] = []

  for (const heading of headings) {
    const item: ContentTocLink = {
      ...heading,
      children: [],
    }

    while (stack.length && (stack[stack.length - 1]?.depth ?? 0) >= item.depth) {
      stack.pop()
    }

    const parent = stack[stack.length - 1]
    if (parent) {
      parent.children = parent.children ?? []
      parent.children.push(item)
    } else {
      root.push(item)
    }

    stack.push(item)
  }

  return pruneTocChildren(root)
}

export function attachContentMetadata(
  tree: ComarkTree,
  toc: ContentTocLink[],
  headings: HeadingMeta[],
): ComarkTree & { toc: ContentTocLink[] } {
  const headingQueue = headings.map((heading) => ({ ...heading }))

  return {
    ...tree,
    nodes: tree.nodes.map((node) => attachHeadingIds(node, headingQueue)),
    toc,
  }
}

function attachHeadingIds(node: ComarkNode, headings: HeadingMeta[]): ComarkNode {
  if (typeof node === 'string') {
    return node
  }

  if (!Array.isArray(node) || node[0] === null || typeof node[0] !== 'string') {
    return node
  }

  const [tag, attributes, ...children] = node as ComarkElement
  const nextChildren = children.map((child) => attachHeadingIds(child, headings))
  const depth = getHeadingDepth(tag)

  if (depth === null) {
    return [tag, attributes, ...nextChildren]
  }

  const nextAttributes = { ...(attributes ?? {}) }
  if (!nextAttributes.id) {
    if (depth >= 2) {
      const heading = headings.shift()
      nextAttributes.id = heading?.id ?? slugifyHeading(extractTextFromNodes(nextChildren))
    } else {
      nextAttributes.id = slugifyHeading(extractTextFromNodes(nextChildren))
    }
  }

  return [tag, nextAttributes, ...nextChildren]
}

function pruneTocChildren(items: ContentTocLink[]): ContentTocLink[] {
  return items.map((item) => {
    if (item.children?.length) {
      return {
        ...item,
        children: pruneTocChildren(item.children),
      }
    }

    const { children, ...rest } = item
    return rest
  })
}

function getMarkdownLines(rawbody: string): string[] {
  const content = rawbody.replace(FRONTMATTER_RE, '')
  const lines = content.split(/\r?\n/)
  const visibleLines: string[] = []
  let inFence = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence
      continue
    }

    if (!inFence) {
      visibleLines.push(line)
    }
  }

  return visibleLines
}

function isParagraphLine(value: string): boolean {
  return !/^(#|>|-|\*|\+|\d+\.\s|::|```|~~~|\||<)/.test(value)
}

function cleanMarkdownText(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

function createHeadingSlugger() {
  const counts = new Map<string, number>()

  return (value: string) => {
    const base = slugifyHeading(value) || 'section'
    const count = counts.get(base) ?? 0
    counts.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  }
}

function slugifyHeading(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getHeadingDepth(tag: string): number | null {
  const match = tag.match(/^h([1-6])$/)
  return match ? Number(match[1]) : null
}

function extractTextFromNodes(nodes: ComarkNode[]): string {
  return nodes.map((node) => extractTextFromNode(node)).join('').trim()
}

function extractTextFromNode(node: ComarkNode): string {
  if (typeof node === 'string') {
    return node
  }

  if (!Array.isArray(node)) {
    return ''
  }

  if (node[0] === null) {
    return typeof node[2] === 'string' ? node[2] : ''
  }

  const [, , ...children] = node as ComarkElement
  return children.map((child) => extractTextFromNode(child)).join('')
}