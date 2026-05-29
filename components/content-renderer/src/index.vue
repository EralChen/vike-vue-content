<script lang="ts" setup>
import { ComarkRenderer } from '@comark/vue'
import { props as dprops, emits } from './ctx'

const props = defineProps(dprops)
defineEmits(emits)
</script>

<template>
  <Suspense>
    <ComarkRenderer
      v-if="props.tree"
      :tree="props.tree"
      :components="props.components"
      :data="props.data"
    />
  </Suspense>
</template>