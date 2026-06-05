<script lang="ts" setup>
import { computed } from 'vue'
import { ComarkRenderer } from '@comark/vue'
import Link from '@vike-vue-content/components/link'
import ProseCode from '@vike-vue-content/components/prose-code'
import { props as dprops, emits } from './ctx'

const props = defineProps(dprops)
const emit = defineEmits(emits)

// markdown 链接被 comark 渲染为 `a` 标签。默认用 base 感知的 Link 替换，
// 让站内绝对路径自动拼上 Vite base；消费端传入的 components 优先级更高。
const resolvedComponents = computed(() => ({
  a: Link,
  pre: ProseCode,
  ...props.components,
}))
</script>

<template>
  <Suspense @resolve="emit('resolve')">
    <ComarkRenderer
      v-if="props.tree"
      :tree="props.tree"
      :components="resolvedComponents"
      :data="props.data"
    />
  </Suspense>
</template>
