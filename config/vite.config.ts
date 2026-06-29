import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { external, replaceLibAlias } from '@lib/internal'

const buildEntries = {
  root: '+config.ts',
}

export default defineConfig({
  build: {
    lib: {
      entry: buildEntries,
      formats: ['es'],
      fileName(_format, entryName) {
        if (entryName === 'root') {
          return '+config.js'
        }

        return `${entryName}/index.es.js`
      },
    },
    emptyOutDir: true,
    rolldownOptions: {
      external: [
        ...external,
        /^node:/,
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
  plugins: [vue(), replaceLibAlias()],
} as UserConfig)
