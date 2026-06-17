import { glob } from 'node:fs/promises'
import { defineConfig, type UserConfig } from 'vite'
import { createLibraryOptions, external } from '@lib/internal'

export default defineConfig(async () => {
	const buildLibEntry = []
	for await (const entry of glob(['index.ts', '*/index.{ts,tsx}'])) {
		buildLibEntry.push(entry)
	}

	return {
		build: {
			lib: createLibraryOptions(buildLibEntry),
			rolldownOptions: {
				external: [...external],
			},
		},
	} as UserConfig
})
