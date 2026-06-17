<script lang="ts" setup>
import { provide, toRef } from 'vue'
import { localeContextKey } from '@vike-vue-content/locale'
import { props as dprops, emits } from './ctx'

const props = defineProps(dprops)
defineEmits(emits)

provide(localeContextKey, toRef(props, 'locale'))
</script>

<template>
	<slot />
</template>
