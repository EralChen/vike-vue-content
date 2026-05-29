import path from 'node:path'
import { queryCollection } from 'vike-vue-content/query'

export type Data = Awaited<ReturnType<typeof data>>

export async function data() {
  const contentDir = path.join(process.cwd(), 'content')
  const page = await queryCollection('docs', { contentDir }).path('/docs').first()

  return {
    docsPage: page,
  }
}