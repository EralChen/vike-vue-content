<script lang="ts" setup>
import { computed } from 'vue'
import { props as dprops, emits } from './ctx'
const props = defineProps(dprops)
const emit = defineEmits(emits)
const data = computed(() => `Hello, ${props.name}!`)
</script>
<template>
  <div
    @click="emit('click', { name: name , event: $event })"
    :style="{
      color: props.theme === 'light' ? '#000' : '#fff',
      backgroundColor: props.theme === 'light' ? '#fff' : '#333',
      padding: '10px',
      borderRadius: '5px',
      cursor: 'pointer'
    }"
  >{{ data }}</div>
</template>
