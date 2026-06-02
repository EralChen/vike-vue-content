<template>
	<ul :class="level > 0 ? 'vvc-docs-page-toc-list vvc-docs-page-toc-list--nested' : 'vvc-docs-page-toc-list vvc-docs-page-toc-list--root'">
		<li
			v-for="(link, index) in links"
			:key="link.id || index"
			class="vvc-docs-page-toc-item"
			:class="{ 'vvc-docs-page-toc-item--with-children': link.children?.length }"
		>
			<a
				class="vvc-docs-page-toc-link"
				:class="{ 'is-active': active.includes(link.id) }"
				:href="`#${link.id}`"
				:aria-current="active.includes(link.id) ? 'location' : undefined"
				@click.prevent="emit('select', link.id)"
			>
				<span class="vvc-docs-page-toc-link-text">{{ link.text }}</span>
			</a>

			<DocsTocTree
				v-if="link.children?.length"
				:links="link.children"
				:active="active"
				:level="level + 1"
				@select="emit('select', $event)"
			/>
		</li>
	</ul>
</template>

<script lang="ts" setup>
import type { ContentTocLink } from './types'

defineOptions({
	name: 'DocsTocTree'
})

withDefaults(defineProps<{
	links: ContentTocLink[]
	active: string[]
	level?: number
}>(), {
	level: 0
})

const emit = defineEmits<{
	select: [id: string]
}>()
</script>
