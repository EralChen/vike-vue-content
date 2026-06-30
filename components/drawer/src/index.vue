<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { props as dprops, emits } from './ctx'
const props = defineProps(dprops)
const emit = defineEmits(emits)

// SSR-safe: Teleport only renders after client mount (like reka-ui)
const isMounted = ref(false)
onMounted(() => { isMounted.value = true })

function onOverlayClick() {
  if (props.dismissible) {
    emit('update:open', false)
  }
}
</script>

<template>
  <Teleport v-if="isMounted" :to="to">
    <Transition name="vvc-drawer-fade">
      <div v-if="open" class="vvc-drawer-overlay" @click="onOverlayClick">
        <Transition :name="`vvc-drawer-${direction}`">
          <div v-if="open"
            class="vvc-drawer-panel"
            :class="`vvc-drawer-panel--${direction}`"
            :style="{ width, maxWidth: '360px' }"
            @click.stop
          >
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.vvc-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.4);
}

.vvc-drawer-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: var(--color-bg, #fff);
  overflow-y: auto;
  scrollbar-width: thin;
}

.vvc-drawer-panel--left  { left: 0; }
.vvc-drawer-panel--right { right: 0; }

/* transitions */
.vvc-drawer-fade-enter-active,
.vvc-drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}
.vvc-drawer-fade-enter-from,
.vvc-drawer-fade-leave-to {
  opacity: 0;
}

.vvc-drawer-left-enter-active,
.vvc-drawer-left-leave-active,
.vvc-drawer-right-enter-active,
.vvc-drawer-right-leave-active {
  transition: transform 0.3s ease;
}
.vvc-drawer-left-enter-from,
.vvc-drawer-left-leave-to {
  transform: translateX(-100%);
}
.vvc-drawer-right-enter-from,
.vvc-drawer-right-leave-to {
  transform: translateX(100%);
}
</style>
