<script lang="ts" setup>
import { computed } from 'vue'
import CodeGroup from '@vike-vue-content/components/code-group'
import CodePreview from '@vike-vue-content/components/code-preview'
import ProseCode from '@vike-vue-content/components/prose-code'
import { useDemos } from '@vike-vue-content/composables/demos'
import { useSources } from '@vike-vue-content/composables/sources'
import { props as dprops } from './ctx'

const props = defineProps(dprops)

const demos = useDemos()
const sources = useSources()

type SourceEntry = {
	id: string
	key: string
	code: string
	language?: string
	filename: string
}

const previewKey = computed(() => props.preview?.trim() || '')

const demoComponent = computed(() => {
	if (!previewKey.value) return null
	return demos[previewKey.value] ?? null
})

const sourceKeys = computed(() => {
	if (props.source !== undefined) {
		return normalizeSourceKeys(props.source)
	}
	if (previewKey.value && typeof sources[previewKey.value] === 'string') {
		return [previewKey.value]
	}
	return []
})

const sourceEntries = computed<SourceEntry[]>(() => {
	return sourceKeys.value.flatMap((key, index) => {
		const code = sources[key]
		if (typeof code !== 'string') return []

		const language = inferSourceLanguage(key, code, previewKey.value)
		return [{
			id: `${key}:${index}`,
			key,
			code,
			language,
			filename: inferSourceFilename(key, language),
		}]
	})
})

function normalizeSourceKeys(source: string | string[]): string[] {
	if (Array.isArray(source)) {
		return normalizeStringArray(source)
	}

	const trimmed = source.trim()
	if (!trimmed) {
		return []
	}

	if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
		try {
			const parsed = JSON.parse(trimmed.replace(/'/g, '"'))
			if (Array.isArray(parsed)) {
				return normalizeStringArray(parsed)
			}
		} catch {
			const matches = Array.from(trimmed.matchAll(/['"]([^'"]+)['"]/g), (match) => match[1])
			if (matches.length > 0) {
				return normalizeStringArray(matches)
			}
		}
	}

	return [trimmed]
}

function normalizeStringArray(values: unknown[]): string[] {
	return values.flatMap((value) => (typeof value === 'string' && value.trim().length > 0 ? [value.trim()] : []))
}

function inferSourceLanguage(key: string, code: string, currentPreviewKey: string): string | undefined {
	const extension = key.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase()
	if (extension) {
		return normalizeLanguage(extension)
	}

	const trimmed = code.trimStart()
	if (currentPreviewKey && key === currentPreviewKey) {
		return 'vue'
	}
	if (trimmed.startsWith('<template') || trimmed.startsWith('<script') || trimmed.startsWith('<style')) {
		return 'vue'
	}
	if (trimmed.startsWith('<')) {
		return 'html'
	}
	if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
		return 'json'
	}
	if (/\blang=['"]ts['"]/.test(code) || /^\s*(import|export)\s/m.test(code)) {
		return 'ts'
	}
	if (/\b(const|let|var|function)\b/.test(code)) {
		return 'js'
	}
	return undefined
}

function normalizeLanguage(extension: string): string {
	switch (extension) {
		case 'mjs':
		case 'cjs':
		case 'js':
			return 'js'
		case 'mts':
		case 'cts':
		case 'ts':
			return 'ts'
		case 'yml':
			return 'yaml'
		case 'shell':
			return 'bash'
		default:
			return extension
	}
}

function inferSourceFilename(key: string, language?: string): string {
	const basename = key.split('/').pop() || key
	if (/\.[a-z0-9]+$/i.test(basename)) {
		return basename
	}

	const extension = defaultExtensionForLanguage(language)
	return extension ? `${basename}.${extension}` : basename
}

function defaultExtensionForLanguage(language?: string): string | undefined {
	switch (language) {
		case 'vue':
		case 'ts':
		case 'js':
		case 'html':
		case 'css':
		case 'scss':
		case 'sass':
		case 'md':
		case 'json':
			return language
		case 'yaml':
			return 'yml'
		case 'bash':
			return 'sh'
		default:
			return undefined
	}
}
</script>

<template>
	<CodePreview>
		<component v-if="demoComponent" :is="demoComponent" />

		<template v-if="sourceEntries.length > 0" #source>
			<CodeGroup v-if="sourceEntries.length > 1">
				<ProseCode
					v-for="entry in sourceEntries"
					:key="entry.id"
					:code="entry.code"
					:language="entry.language"
					:filename="entry.filename"
				>
					<code :class="entry.language ? `language-${entry.language}` : undefined">{{ entry.code }}</code>
				</ProseCode>
			</CodeGroup>

			<ProseCode
				v-else
				:code="sourceEntries[0].code"
				:language="sourceEntries[0].language"
				:filename="sourceEntries[0].filename"
			>
				<code :class="sourceEntries[0].language ? `language-${sourceEntries[0].language}` : undefined">{{ sourceEntries[0].code }}</code>
			</ProseCode>
		</template>
	</CodePreview>
</template>
