<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { ComarkRenderer } from '@comark/vue'
import CodeGroup from '@vike-vue-content/components/code-group'
import CodePreview from '@vike-vue-content/components/code-preview'
import { useContentRenderer } from '@vike-vue-content/composables/content-renderer'
import { props as dprops } from './ctx'

const props = defineProps(dprops)
const { demos, parsedSources, components } = useContentRenderer()

const previewKey = computed(() => props.preview.trim())

const demoComponent = computed(() => {
	console.debug('previewKey.value', previewKey.value)
	console.debug('demos.value', demos.value)
	console.debug('demos.value[previewKey.value]', demos.value[previewKey.value])
	return demos.value[previewKey.value] 
})

const sourceKeys = computed(() => {
	if (props.source) return normalizeSourceKeys(props.source)
	if (previewKey.value && parsedSources.value[previewKey.value]) return [previewKey.value]
	return []
})

const getFilename = (path: string) => {
	const parts = path.split('/')
	return parts[parts.length - 1]
}


function normalizeSourceKeys(source: string | string[]): string[] {
	if (Array.isArray(source)) return source
	if (source.trim()) return [source.trim()]
	return []
}
</script>

<template>
	<CodePreview>
		<component v-if="demoComponent" :is="demoComponent" />

		<template #source v-if="parsedSources">
			<CodeGroup>
				<template v-for="key in sourceKeys" :key="key">
					<ComarkRenderer
						:tree="parsedSources[key]"
						:components="components"
						:filename="getFilename(key)"
					/>
				</template>
			</CodeGroup>

		</template>
	</CodePreview>
</template>
