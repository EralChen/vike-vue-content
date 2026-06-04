import { glob } from 'node:fs/promises'
import path from 'node:path'
import { builtinModules } from 'node:module'
import { defineConfig, type UserConfig } from 'vite'
import { external, replaceLibAlias } from '@lib/internal'

const nodeBuiltins = builtinModules.flatMap((name) => [name, `node:${name}`])

export default defineConfig(async () => {
  const buildLibEntry = await getBuildLibEntry()

  return {
    build: {
      lib: {
        entry: buildLibEntry.reduce((entryObj, entry) => {
          const entryName = path.dirname(entry) === '.' ? 'index' : path.dirname(entry)
          entryObj[entryName] = entry
          return entryObj
        }, {} as Record<string, string>),
        formats: ['es'],
        fileName(format, entryName) {
          if (entryName === 'index') {
            return `index.${format}.js`
          }
          return `${entryName}/index.${format}.js`
        },
      },

      emptyOutDir: true,

      rolldownOptions: {
        platform: 'node',
        external: [
          ...external,
          ...nodeBuiltins,
          'comark',
          /^comark(\/.*)?$/,
          '@comark/vue',
          /^@comark\/vue(\/.*)?$/,
          'shiki',
          /^shiki(\/.*)?$/,
          '@shikijs/themes',
          /^@shikijs\/themes(\/.*)?$/,
        ],
      },
    },
    plugins: [replaceLibAlias()],
  } as UserConfig
})

async function getBuildLibEntry() {
  const buildLibEntry: string[] = []

  for await (const entry of glob('*/index.{ts,tsx}')) {
    buildLibEntry.push(entry)
  }

  return buildLibEntry
}
