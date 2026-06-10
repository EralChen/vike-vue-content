
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'
import { glob } from 'node:fs/promises'
import { createLibraryOptions, external } from '@lib/internal'

export default defineConfig(async () => {
  const buildLibEntry = await getBuildLibEntry()
  return {
    build: {
      lib: createLibraryOptions(buildLibEntry),
      rolldownOptions: {
        external: [
          ...external,
        ]
      },
    },
    plugins: [
      vue(),
      vueJsx(),
    ]
  } as UserConfig
})

async function getBuildLibEntry() {
  const buildLibEntry = []

  for await (const entry of glob(['index.ts', '*/index.{ts,tsx}'])) {
    buildLibEntry.push(entry)
  }

  return buildLibEntry
}
