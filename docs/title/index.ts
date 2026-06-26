import type { DocsPageData } from '@vike-vue-content/shared/types'
import type { PageContext } from 'vike/types'

export function title(pageContext: PageContext & { data?: DocsPageData }): string | undefined {
	return pageContext.data?.title
}

export default title
