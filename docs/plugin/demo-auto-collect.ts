import type { Plugin, ResolvedConfig } from 'vite'
import path from 'node:path'
import { glob } from 'tinyglobby'
import { getVikeConfig } from 'vike/plugin'

const VIRTUAL_DEMOS = '\0virtual:vvc-demos'
const VIRTUAL_SOURCES = '\0virtual:vvc-demo-sources'

interface DemoEntry {
  dir: string
  name: string
  path: string
}

export function demoAutoCollectPlugin(): Plugin {
  let config: ResolvedConfig
  let collected = false
  const demosByDir: Record<string, { name: string; path: string }[]> = {}
  const sourcesByDir: Record<string, { name: string; path: string }[]> = {}

  return {
    name: 'vike-vue-content-demo-auto-collect',
    configResolved(config_) {
      config = config_
    },
    resolveId(id) {
      if (id === 'virtual:vvc-demos') return VIRTUAL_DEMOS
      if (id === 'virtual:vvc-demo-sources') return VIRTUAL_SOURCES
    },
    async load(id) {
      if (id === VIRTUAL_DEMOS) {
        await collect()
        return generateDemoModule()
      }
      if (id === VIRTUAL_SOURCES) {
        await collect()
        return generateSourceModule()
      }
    },
  }

  async function collect() {
    if (collected) return
    collected = true

    const root = config.root
    const vikeConfig = getVikeConfig()

    const demosDirSet = new Set<string>()
    for (const page of Object.values(vikeConfig.pages)) {
      const docs = page.config as Record<string, unknown> | undefined
      const docsConfig = docs?.docs as { demosDir?: string } | undefined
      const dir = docsConfig?.demosDir
      if (dir) demosDirSet.add(dir)
    }

    for (const dir of demosDirSet) {
      const absDir = path.isAbsolute(dir) ? dir : path.resolve(root, dir)

      const vueFiles = await glob(['**/*.vue'], { cwd: absDir, absolute: true })
      demosByDir[dir] = vueFiles.map((file) => ({
        name: path.relative(absDir, file).replace(/\\/g, '/'),
        path: file.split(path.sep).join('/'),
      }))

      const allFiles = await glob(['**/*'], { cwd: absDir, absolute: true })
      const filtered = allFiles.filter((file) => {
        const rel = path.relative(absDir, file)
        return !rel.startsWith('.') && !file.endsWith(path.sep)
      })
      sourcesByDir[dir] = filtered.map((file) => ({
        name: path.relative(absDir, file).replace(/\\/g, '/'),
        path: file.split(path.sep).join('/'),
      }))
    }
  }

  function generateDemoModule(): string {
    const entries: DemoEntry[] = []
    for (const [dir, demos] of Object.entries(demosByDir)) {
      for (const d of demos) {
        entries.push({ dir, name: d.name, path: d.path })
      }
    }

    if (entries.length === 0) return 'export const demosByDir = {};'

    const imports = entries.map((e, i) => `import Demo_${i} from '${e.path}'`).join('\n')

    const dirMap: Record<string, string[]> = {}
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i]
      ;(dirMap[e.dir] ??= []).push(`'${e.name}': Demo_${i}`)
    }

    const dirEntries = Object.entries(dirMap).map(
      ([dir, items]) => `'${dir}': {\n${items.join(',\n')}\n}`,
    )

    return `${imports}\n\nexport const demosByDir = {\n${dirEntries.join(',\n')}\n}`
  }

  function generateSourceModule(): string {
    const entries: DemoEntry[] = []
    for (const [dir, sources] of Object.entries(sourcesByDir)) {
      for (const s of sources) {
        entries.push({ dir, name: s.name, path: s.path })
      }
    }

    if (entries.length === 0) return 'export const sourcesByDir = {};'

    const imports = entries.map((e, i) => `import Source_${i} from '${e.path}?raw'`).join('\n')

    const dirMap: Record<string, string[]> = {}
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i]
      ;(dirMap[e.dir] ??= []).push(`'${e.name}': Source_${i}`)
    }

    const dirEntries = Object.entries(dirMap).map(
      ([dir, items]) => `'${dir}': {\n${items.join(',\n')}\n}`,
    )

    return `${imports}\n\nexport const sourcesByDir = {\n${dirEntries.join(',\n')}\n}`
  }
}
