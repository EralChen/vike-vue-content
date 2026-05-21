<script lang="ts">
import { props, emits } from './ctx'
import { defineComponent } from 'vue'
import { VkfFormItemRendererTemplate } from '@vunk/form'
export default defineComponent({
  name: 'VkfTemplatesLayout',
  components: {
    VkfFormItemRendererTemplate,
  },
  emits,
  props,
  setup () {
    return {}
  },
})
</script>
<template>
  <VkfFormItemRendererTemplate :type="'ElCollapse'">
    <template #default="{ data: props, Renderer, raw }">
      <ElCollapse  v-bind="props">
        <component :is="Renderer" :source="raw.templateSlots"></component>
      </ElCollapse>
    </template>
  </VkfFormItemRendererTemplate>

  <VkfFormItemRendererTemplate :type="'ElCollapseItem'">
    <template #default="{ data: props, Renderer, raw }">
      <ElCollapseItem v-bind="props" >
        <component :is="Renderer" :source="raw.templateSlots"></component>
      </ElCollapseItem>
    </template>
  </VkfFormItemRendererTemplate>
</template>
