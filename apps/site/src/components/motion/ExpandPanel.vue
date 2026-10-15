<script setup lang="ts">
defineProps<{ open: boolean }>()
function enable(element: Element) {
  element.removeAttribute('inert')
}
</script>
<template>
  <Transition
    name="expand"
    @before-enter="enable"
    @leave-cancelled="enable"
    @before-leave="(element) => element.setAttribute('inert', '')"
  >
    <div v-if="open" class="grid grid-rows-[1fr]" data-motion-panel>
      <div class="min-h-0 overflow-hidden"><slot /></div>
    </div>
  </Transition>
</template>
