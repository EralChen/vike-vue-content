<script lang="ts" setup>
import { ComarkRenderer } from '@comark/vue'
import { props as dprops, emits } from './ctx'

const props = defineProps(dprops)
const emit = defineEmits(emits)
</script>

<template>
  <Suspense @resolve="emit('resolve')">
    <ComarkRenderer
      v-if="props.tree"
      :tree="props.tree"
      :components="props.components"
      :data="props.data"
    />
  </Suspense>
</template>