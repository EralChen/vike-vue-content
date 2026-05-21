<script lang="ts">
import { props, emits } from './ctx'
import { computed, defineComponent, h, ref, watch } from 'vue'
import { VkfInput, _VkfInputCtx } from '@vunk/form/components/input'
import { ElIcon, ElButton, ElFormItem } from 'element-plus'
import { Edit, Check } from '@element-plus/icons-vue'

const VkfConfirmInput = defineComponent({
  name: 'VkfConfirmInput',
  components: {
    VkfInput,
  },
  props,
  emits,
  setup (props, { emit }) {
    const inputProps = _VkfInputCtx.createBindProps(props, ['inputSlots', 'disabled', 'modelValue', 'elRef'])
    const inputEmits = _VkfInputCtx.createOnEmits(emit, ['update:modelValue'])
    const inputValue = ref(props.modelValue as string)
    const elFormItemNode = ref({} as InstanceType<typeof ElFormItem>)

    const getElRef = (e: InstanceType<typeof ElFormItem>) => {
      elFormItemNode.value = e
      props.elRef?.(e)
    }

    watch(() => props.modelValue, (v) => {
      inputValue.value = v as string
    })
    
    const _disabled = ref(true)
    const disabled = computed({
      get () {
        return props.disabled ?? _disabled.value
      }, 
      set (v: boolean) {
        _disabled.value = v
        emit('update:disabled', v)
      },
    })

    const toggle = () => {
      if (!disabled.value) { // 点击 Check
        if (inputValue.value === props.modelValue) { // 不做修改
          disabled.value = true
          return 
        }
        if (props.validateUpdate(inputValue.value)) {
          emit('update:modelValue', inputValue.value)
          elFormItemNode.value.validate('change')
          disabled.value = true
        }
      } else {
        disabled.value = false
      }
    }
    
    const appendEl = () => h(
      ElButton, {
        onClick: toggle,
      }, () => h(ElIcon,
        {
          class: 'vkf-confirm-input-icon',
          size: 16,
        },
        () => h(
          disabled.value ? Edit : Check,
        ),
      ),
    )

    return {
      inputProps,
      appendEl,
      disabled,
      inputEmits,
      inputValue,
      getElRef,
      toggle,
    }
  },
})

export default VkfConfirmInput
</script>
<template>
  <VkfInput 
    v-model="inputValue" 
    class="vkf-confirm-input"
    :input-slots="{
      append: appendEl,
      ...inputSlots
    }" 
    v-bind="inputProps"
    :disabled="disabled" 
    :el-ref="getElRef" 
    @blur="toggle" 
    v-on="inputEmits"
  >
  </VkfInput>
</template>
<style>
.vkf-confirm-input .el-input-group__append {
  cursor: initial;
}

.vkf-confirm-input .vkf-confirm-input-icon {
  color: var(--el-color-primary);
  cursor: pointer;
}
</style>
