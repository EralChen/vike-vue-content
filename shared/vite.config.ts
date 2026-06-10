import { glob } from 'node:fs/promises'
import { defineConfig, type UserConfig } from 'vite'
import { external, replaceLibAlias, createLibraryOptions } from '@lib/internal'
export default defineConfig(async () => {
  const buildLibEntry = await getBuildLibEntry()
  return {
    build: {
      lib:  createLibraryOptions(buildLibEntry),
      rolldownOptions: {
        external: [
          ...external,
        ]
      },
    },
    plugins: [replaceLibAlias()],
  } as UserConfig
})

async function getBuildLibEntry() {
  const buildLibEntry = []

  for await (const entry of glob(['index.ts', '*/index.{ts,tsx}'])) {
    buildLibEntry.push(entry)
  }

  return buildLibEntry
}
