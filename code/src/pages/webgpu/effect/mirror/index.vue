<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { MirrorScene } from './class'

import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof MirrorScene>[0] = {
  grid: {
    visible: true
  },
  camera: {
    position: [0, 75, 160]
  },
  ambientLight: {
    visible: false
  },
  directionalLight: {
    visible: false
  }
}
let scene: InstanceType<typeof MirrorScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new MirrorScene(options).run()

  useResize(scene).resize()
})
</script>

<style lang="scss" module></style>
