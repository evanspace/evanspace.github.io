<template>
  <div :class="$style.page" class="h-100 o-h">
    <div ref="containerRef" class="h-100"></div>
  </div>
</template>

<script lang="ts" setup>
import { NewThreeScene } from './methods'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()

const options: ConstructorParameters<typeof NewThreeScene>[0] = {
  bgColor: 0x311d3f,
  fog: {
    visible: true,
    color: 0xffffff,
    near: 100,
    far: 500
  },
  camera: {
    position: [0, 100, 150]
  },
  ambientLight: {
    visible: false
  },
  directionalLight: {
    // visible: false
    helper: true,
    light2: false
  },
  grid: {
    visible: true
  }
}

let scene: InstanceType<typeof NewThreeScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new NewThreeScene(options)
  scene.run()
  useResize(scene).resize()
})
</script>

<style lang="scss" module>
.page {
  position: relative;
}
</style>
