<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ParallaxScene } from './methods'

import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof ParallaxScene>[0] = {
  grid: {
    // visible: true
  },
  controls: {
    autoRotate: true
  }
}
let scene: InstanceType<typeof ParallaxScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new ParallaxScene(options).run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
