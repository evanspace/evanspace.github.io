<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ClearcoatScene } from './class'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof ClearcoatScene>[0] = {
  axes: {
    visible: true
  },
  camera: {
    position: [0, 0, 10]
  },
  ambientLight: {
    visible: false
  },
  directionalLight: {
    visible: false
  }
}
let scene: InstanceType<typeof ClearcoatScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new ClearcoatScene(options).run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
