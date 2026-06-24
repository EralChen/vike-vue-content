<script lang="ts" setup>
import { computed, provide } from 'vue'
import { ComarkRenderer } from '@comark/vue'
import ProseA from '@vike-vue-content/components/prose-a'
import ProseCode from '@vike-vue-content/components/prose-code'
import CodeGroup from '@vike-vue-content/components/code-group'
import CodePreview from '@vike-vue-content/components/code-preview'
import { props as dprops, emits } from './ctx'
import { contentDemosKey, contentSourcesKey } from '@vike-vue-content/shared/symbols'

const props = defineProps(dprops)
const emit = defineEmits(emits)

provide(contentDemosKey, computed(() => props.demos))
provide(contentSourcesKey, computed(() => props.sources))

// 内置组件：a/pre 替换为 prose 版本，code-group/code-preview 提供源码展示能力。
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
