<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { FogScene } from './methods'

import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof FogScene>[0] = {
  axes: {
    visible: true
  },
  camera: {
    // near: 1,
    far: 2000
    // fov: 45,
    // position: [30, 15, 30]
  },
  directionalLight: {
    visible: false
  },
  render: {
    logarithmicDepthBuffer: false
  },
  ambientLight: {
    // visible: false
    // intensity: 0.5
  },
  controls: {
    maxPolarAngle: Math.PI * 0.48,
    minDistance: 7,
    maxDistance: 1000
  }
}
let scene: InstanceType<typeof FogScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new FogScene(options).run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
