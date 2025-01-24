<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { RectareaScene } from './methods'

import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof RectareaScene>[0] = {
  ambientLight: {
    visible: false
  },
  directionalLight: {
    visible: false
  },
  camera: {
    position: [0, 5, -35]
  }
}
let scene: InstanceType<typeof RectareaScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new RectareaScene(options)
  scene.run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
