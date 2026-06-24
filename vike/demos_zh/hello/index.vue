<script lang="ts" setup>
import { ref } from 'vue'
import txt from './data.txt?raw'
const data = ref(txt)
</script>
<template>
  <div>{{ data }}</div>
</template>
