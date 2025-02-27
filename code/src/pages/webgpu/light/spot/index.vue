<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { SpotScene } from './class'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof SpotScene>[0] = {
  grid: {
    visible: true
  },
  ambientLight: {
    visible: false
  },
  directionalLight: {
    visible: false
  }
}
let scene: InstanceType<typeof SpotScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new SpotScene(options).run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
