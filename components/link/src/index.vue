<template>
	<a :href="resolvedHref" :target="resolvedTarget" :rel="resolvedRel">
		<slot />
	</a>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { usePageContext } from 'vike-vue/usePageContext'
import { props as dprops, emits } from './ctx'

const props = defineProps(dprops)
const emit = defineEmits(emits)

// base 由宿主在运行时通过 Vike 注入（pageContext._baseServer），
// 不会在组件库构建时被编译固化。
const pageContext = usePageContext() as unknown as { _baseServer?: string }

// 带协议的绝对地址（http://、https://）或协议相对地址（//）视为外链。
const isExternal = computed(() => /^(https?:)?\/\//i.test(props.href))

// 作者用 MDC 内联属性显式写的 target/rel 优先；否则外链自动新窗口打开。
const resolvedTarget = computed(() => {
	if (props.target !== undefined) {
		return props.target
	}
	return isExternal.value ? '_blank' : undefined
})

const resolvedRel = computed(() => {
	if (props.rel !== undefined) {
		return props.rel
	}
	return isExternal.value ? 'noopener noreferrer' : undefined
})

function prependBase(url: string, baseServer: string): string {
	let base = baseServer
	if (base.endsWith('/') && base !== '/') {
		base = base.slice(0, -1)
	}
	if (base === '/') {
		return url
	}
	return `${base}${url}`
}

const resolvedHref = computed(() => {
	const href = props.href
	// 仅处理站内绝对路径；外链、锚点、相对路径保持原样。
	if (!href || !href.startsWith('/')) {
		return href
	}
	const base = pageContext._baseServer ?? '/'
	return prependBase(href, base)
})
</script>
