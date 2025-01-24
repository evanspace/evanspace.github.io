<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { SelectiveScene } from './methods'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof SelectiveScene>[0] = {
  camera: {
    position: [0, 0, 100]
  }
}
let scene: InstanceType<typeof SelectiveScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new SelectiveScene(options).run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
