import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const buildEntries = {
  root: '+config.ts',
  docs: 'docs/index.ts',
  'docs/data': 'docs/data/index.ts',
  'docs/prerender': 'docs/prerender/index.ts',
  'docs/route': 'docs/route/index.ts',
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
        'vue',
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
  plugins: [vue()],
} as UserConfig)