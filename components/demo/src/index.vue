<script lang="ts" setup>
import { computed } from 'vue'
import CodePreview from '@vike-vue-content/components/code-preview'
import { useDemos } from '@vike-vue-content/composables/demos'
import { props as dprops } from './ctx'

const props = defineProps(dprops)

const demos = useDemos()

const previewKey = computed(() => props.preview?.trim() || '')

const demoComponent = computed(() => {
	if (!previewKey.value) return null
	return demos.value[previewKey.value] ?? null
})
</script>

<template>
	<CodePreview>
		<component v-if="demoComponent" :is="demoComponent" />
	</CodePreview>
</template>
