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
  camera: {
    position: [0, 80, 300]
  },
  grid: {
    visible: true
  },
  axes: {
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
