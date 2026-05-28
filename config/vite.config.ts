import { defineConfig, type UserConfig } from 'vite'
import { external } from '@lib/internal'

export default defineConfig({
  build: {
    lib: {
      entry: '+config.ts',
      formats: ['es'],
      fileName() {
        return '+config.js'
      },
    },
    emptyOutDir: true,
    rolldownOptions: {
      external,
    },
  },
} as UserConfig)