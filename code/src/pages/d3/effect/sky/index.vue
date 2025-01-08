<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { SkyScene } from './methods'

import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof SkyScene>[0] = {
  grid: {
    // visible: true
  },
  controls: {
    enablePan: false,
    minDistance: 50,
    maxDistance: 200,
    maxPolarAngle: Math.PI * 0.45
  },
  ambientLight: {
    intensity: 0.5
  },
  directionalLight: {
    intensity: 0.5
  },
  camera: {
    position: [0, 10, 100]
  }
}
let scene: InstanceType<typeof SkyScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new SkyScene(options)
  scene.run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
