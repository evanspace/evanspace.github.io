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
  directionalLight: {
    light2: false
  },
  render: {
    logarithmicDepthBuffer: false
  },
  camera: {
    position: [0, 2, 2]
  },
  controls: {
    minDistance: 2,
    maxDistance: 100
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
