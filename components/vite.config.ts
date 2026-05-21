
import { defineConfig, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { glob } from 'node:fs/promises'
import path from 'node:path';

export default defineConfig(async ({ command, mode }) => {
  const buildLibEntry = await getBuildLibEntry()
  return {
    // vite config
    build: {
      lib: {
        entry: buildLibEntry.reduce((entryObj, entry) => {
          const entryName = entry.split(path.sep)[0]
          entryObj[entryName] = entry
          return entryObj
        }, {} as Record<string, string>),

        formats: ['es'],

        fileName(format, entryName) {
          // 文件名 + index
          return `${entryName}/index.${format}.js`
        },

      
      },
      emptyOutDir: true,
      rolldownOptions: {
        external: [
          'vue',
          'element-plus',
        ]
      },
    },
    plugins: [
      vue()
    ]
  } as UserConfig 
})

async function getBuildLibEntry() {
  const buildLibEntry = []
  // 每个文件夹的 index 为入口文件
  for await (const entry of glob('*/index.{ts,tsx}')) {
    buildLibEntry.push(entry)
  }
  return buildLibEntry
}

