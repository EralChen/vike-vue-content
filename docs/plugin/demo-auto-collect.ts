import type { Plugin, ResolvedConfig } from 'vite'
import path from 'node:path'
import { glob } from 'tinyglobby'

const VIRTUAL_ID = '\0virtual:vvc-demos'
const VIRTUAL_ID_SOURCES = '\0virtual:vvc-demo-sources'

export function demoAutoCollectPlugin(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'vike-vue-content-demo-auto-collect',
    configResolved: {
      async handler(config_) {
        config = config_
      },
    },
    resolveId(id) {
      if (id === 'virtual:vvc-demos') return VIRTUAL_ID
      if (id === 'virtual:vvc-demo-sources') return VIRTUAL_ID_SOURCES
    },
    async load(id) {
      if (id === VIRTUAL_ID) {
        return await generateDemoModule()
      }
      if (id === VIRTUAL_ID_SOURCES) {
        return await generateSourceModule()
      }
    },
  }

  async function scanDemos() {
    const root = config.root
    const demosDir = path.join(root, 'demos')
    const files = await glob(['**/*.vue'], { cwd: demosDir, absolute: true })
    return files.map(file => {
      const relative = path.relative(demosDir, file).replace(/\.vue$/, '')
      const posixPath = file.split(path.sep).join('/')
      return { name: relative, path: posixPath }
    })
  }

  async function generateDemoModule() {
    const demos = await scanDemos()
    if (demos.length === 0) {
      return 'export const demos = {};'
    }
    const imports = demos
      .map((d, i) => `import Demo_${i} from '${d.path}'`)
      .join('\n')
    const map = demos
      .map((d, i) => `'${d.name}': Demo_${i}`)
      .join(',\n')
    return `${imports}\n\nexport const demos = {\n${map}\n}`
  }

  async function generateSourceModule() {
    const demos = await scanDemos()
    if (demos.length === 0) {
      return 'export const sources = {};'
    }
    const imports = demos
      .map((d, i) => `import Source_${i} from '${d.path}?raw'`)
      .join('\n')
    const map = demos
      .map((d, i) => `'${d.name}': Source_${i}`)
      .join(',\n')
    return `${imports}\n\nexport const sources = {\n${map}\n}`
  }
}
