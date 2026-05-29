import { builtinModules } from 'node:module'
import { defineConfig, type UserConfig } from 'vite'

const nodeBuiltins = builtinModules.flatMap((name) => [name, `node:${name}`])

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      formats: ['es'],
      fileName(format) {
        return `index.${format}.js`
      },
    },
    emptyOutDir: true,
    rolldownOptions: {
      external: [
        ...nodeBuiltins,
        'comark',
      ],
    },
  },
} as UserConfig)