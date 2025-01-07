<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { RainThreeScene } from './methods'

import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof RainThreeScene>[0] = {
  grid: {
    // visible: true
  },
  render: {
    antialias: true,
    logarithmicDepthBuffer: false
  },
  axes: {
    visible: true
  },
  ambientLight: {
    color: 0x111111
  },
  directionalLight: {
    position: [3, 17, 17]
  },
  camera: {
    position: [40, 8, 0]
  },
  controls: {
    maxDistance: 50
  }
}
let scene: InstanceType<typeof RainThreeScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new RainThreeScene(options)
  scene.run()

  useResize(scene).resize()
})
</script>

<style lang="scss" module></style>
