<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { LookatScene } from './methods'

import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof LookatScene>[0] = {
  axes: {
    visible: true
  },
  controls: {
    maxDistance: 5000
  }
}
let scene: InstanceType<typeof LookatScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new LookatScene(options).run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
