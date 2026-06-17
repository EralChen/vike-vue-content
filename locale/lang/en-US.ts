import type { Language } from '../types'

const enUS: Language = {
	name: 'en-US',
	vvc: {
		cmd: {
			placeholder: 'Search docs...',
			emptyHint: 'Type to search docs',
			noResults: 'No matching results',
			navHint: 'Navigate',
			selectHint: 'Select',
			closeHint: 'Close',
			ariaLabel: 'Search docs',
		},
		toc: {
			heading: 'On this page',
		},
		search: {
			buttonLabel: 'Search docs...',
		},
		surround: {
			prev: 'Previous page',
			next: 'Next page',
		},
		page: {
			notFound: 'Page not found: {path}',
		},
	},
}

export default enUS
