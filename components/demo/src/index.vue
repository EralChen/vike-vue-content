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

const previewKey = computed(() => props.preview?.trim() || '')

const demoComponent = computed(() => {
	if (!previewKey.value) return null
	return demos[previewKey.value] ?? null
})

const sourceKeys = computed(() => {
	if (props.source !== undefined) return normalizeSourceKeys(props.source)
	if (previewKey.value && sources[previewKey.value] !== undefined) return [previewKey.value]
	return []
})

function getSourceFilename(key: string): string {
	return key.split('/').pop() || key
}

function normalizeSourceKeys(source: string | string[]): string[] {
	if (Array.isArray(source)) return source.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
	const t = source.trim()
	if (!t) return []
	if (t.startsWith('[') && t.endsWith(']')) {
		try { return JSON.parse(t.replace(/'/g, '"')).filter((s: unknown) => typeof s === 'string' && s.trim().length > 0) }
		catch {
			const m = Array.from(t.matchAll(/['"]([^'"]+)['"]/g), x => x[1])
			if (m.length) return m
		}
	}
	return [t]
}
</script>

<template>
	<CodePreview>
		<component v-if="demoComponent" :is="demoComponent" />

		<template v-if="sourceKeys.length > 0" #source>
			<CodeGroup v-if="sourceKeys.length > 1">
				<ProseCode v-for="key in sourceKeys" :key="key" :code="sources[key]" :filename="getSourceFilename(key)">
					<code>{{ sources[key] }}</code>
				</ProseCode>
			</CodeGroup>

			<ProseCode v-else :code="sources[sourceKeys[0]]" :filename="getSourceFilename(sourceKeys[0])">
				<code>{{ sources[sourceKeys[0]] }}</code>
			</ProseCode>
		</template>
	</CodePreview>
</template>
