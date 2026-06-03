
import type { Plugin } from 'vite'
import {
	inferDocsBaseFromPageFile,
	isDocsPrerenderFile,
	isDocsRouteFile,
	normalizeDocsRuntimeFileId,
} from '../utils/page-file'

const ZERO_ARG_CREATE_DOCS_ROUTE_RE = /\bcreateDocsRoute\s*\(\s*\)/g
const ZERO_ARG_CREATE_DOCS_PRERENDER_RE = /\bcreateDocsPrerender\s*\(\s*\)/g

export function docsRuntimeBasePlugin(): Plugin {
	return {
		name: 'vike-vue-content-docs-runtime-base',
		enforce: 'pre',
		transform(code, id) {
			if (!code.includes('createDocsRoute(') && !code.includes('createDocsPrerender(')) {
				return null
			}

			const normalizedId = normalizeDocsRuntimeFileId(id)
			const docsBase = inferDocsBaseFromPageFile(normalizedId)
			if (!docsBase) {
				return null
			}

			let transformed = code
			if (isDocsRouteFile(normalizedId)) {
				transformed = transformed.replace(
					ZERO_ARG_CREATE_DOCS_ROUTE_RE,
					`createDocsRoute(${JSON.stringify(docsBase)})`,
				)
			}
			if (isDocsPrerenderFile(normalizedId)) {
				transformed = transformed.replace(
					ZERO_ARG_CREATE_DOCS_PRERENDER_RE,
					`createDocsPrerender(${JSON.stringify(docsBase)})`,
				)
			}

			if (transformed === code) {
				return null
			}

			return {
				code: transformed,
				map: null,
			}
		},
	}
}