import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * 滚动监听——核心逻辑搬自 Nuxt UI 的 `useScrollspy`
 * (@nuxt/ui/dist/runtime/composables/useScrollspy.js)。
 *
 * 用单个常驻的 IntersectionObserver 收集“当前视口内可见的标题集合”，把它们
 * 整体作为 active，于是目录高亮是一段连续区间而非单项；当视口内没有任何标题
 * 时（停在两个标题之间的长段落），保留上一次的可见集合，避免高亮闪烁。
 */
export function useScrollspy() {
	const observer = ref<IntersectionObserver>()
	const visibleHeadings = ref<string[]>([])
	const activeHeadings = ref<string[]>([])

	function observerCallback(entries: IntersectionObserverEntry[]) {
		entries.forEach((entry) => {
			const id = entry.target.id
			if (!id) {
				return
			}

			if (entry.isIntersecting) {
				visibleHeadings.value = [...visibleHeadings.value, id]
			} else {
				visibleHeadings.value = visibleHeadings.value.filter((h) => h !== id)
			}
		})
	}

	function updateHeadings(headings: Element[]) {
		if (!observer.value) {
			return
		}

		// 路由切换会换一批标题元素，先断开旧的观察并清空可见集合，再观察新的。
		observer.value.disconnect()
		visibleHeadings.value = []

		headings.forEach((heading) => observer.value?.observe(heading))
	}

	watch(visibleHeadings, (val, oldVal) => {
		activeHeadings.value = val.length === 0 ? oldVal : val
	})

	onMounted(() => {
		observer.value = new IntersectionObserver(observerCallback)
	})

	onBeforeUnmount(() => observer.value?.disconnect())

	return {
		visibleHeadings,
		activeHeadings,
		updateHeadings,
	}
}
