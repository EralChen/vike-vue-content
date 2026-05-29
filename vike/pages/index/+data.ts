import { fileURLToPath } from 'node:url'
import { queryCollection } from 'vike-vue-content/query'

export type Data = Awaited<ReturnType<typeof data>>

export async function data() {
  const contentDir = fileURLToPath(new URL('../../content', import.meta.url))
  const page = await queryCollection('docs', { contentDir }).path('/docs').first()

  return {
    docsPage: page,
  }
}