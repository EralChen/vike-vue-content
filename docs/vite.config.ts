import { glob } from 'node:fs/promises'
import path from 'node:path'
import { defineConfig, type UserConfig } from 'vite'
import { external, replaceLibAlias } from '@lib/internal'
import { builtinModules } from 'node:module'
const nodeBuiltins = builtinModules.flatMap((name) => [name, `node:${name}`])

export default defineConfig(async () => {
  const buildLibEntry = await getBuildLibEntry()

  return {
    build: {
      lib: {
        entry: buildLibEntry.reduce((entryObj, entry) => {
          const entryName = entry.split(path.sep)[0]
          entryObj[entryName] = entry
          return entryObj
        }, {} as Record<string, string>),
        formats: ['es'],
        fileName(format, entryName) {
          // Handle root index entry
          if (entryName === 'index.ts' || entryName === 'index') {
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
          'vike',
          /^vike(\/.*)?$/,
          'vike-vue',
          /^vike-vue(\/.*)?$/,
          '@comark/vue',
          /^@comark\/vue(\/.*)?$/,
          'comark',
          /^comark(\/.*)?$/,
        ],
      },
    },
    plugins: [replaceLibAlias()],
  } as UserConfig
})

async function getBuildLibEntry() {
  const buildLibEntry = ['index.ts']

  for await (const entry of glob('*/index.{ts,tsx}')) {
    buildLibEntry.push(entry)
  }

  return buildLibEntry
}
