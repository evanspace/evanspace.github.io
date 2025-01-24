<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { LightScene } from './methods'

import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof LightScene>[0] = {
  ambientLight: {
    intensity: 0.15
  },
  directionalLight: {
    visible: false
  }
}
let scene: InstanceType<typeof LightScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new LightScene(options)
  scene.run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
