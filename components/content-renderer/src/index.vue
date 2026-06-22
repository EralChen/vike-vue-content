<script lang="ts" setup>
import { computed } from 'vue'
import { ComarkRenderer } from '@comark/vue'
import ProseA from '@vike-vue-content/components/prose-a'
import ProseCode from '@vike-vue-content/components/prose-code'
import CodeGroup from '@vike-vue-content/components/code-group'
import CodePreview from '@vike-vue-content/components/code-preview'
import { props as dprops, emits } from './ctx'

const props = defineProps(dprops)
const emit = defineEmits(emits)

// 内置组件：a/pre 替换为 prose 版本，code-group/code-preview 提供代码预览能力。
// 消费端传入的 components 优先级更高。
const resolvedComponents = computed(() => ({
  a: ProseA,
  pre: ProseCode,
  'code-group': CodeGroup,
  'code-preview': CodePreview,
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
