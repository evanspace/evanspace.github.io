<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { SmokeScene } from './methods'

import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof SmokeScene>[0] = {
  grid: {
    visible: true
  },
  axes: {
    visible: true
  },
  render: {
    logarithmicDepthBuffer: false
  }
}
let scene: InstanceType<typeof SmokeScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new SmokeScene(options)
  scene.run()

  useResize(scene).resize()
})
</script>

<style lang="scss" module></style>
