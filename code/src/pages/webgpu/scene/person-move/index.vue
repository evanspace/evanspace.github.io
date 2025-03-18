<template>
  <div class="three-page" :class="$style.page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { Scene } from './class'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof Scene>[0] = {
  axes: {
    visible: true
  },
  grid: {
    visible: true
  },
  camera: {
    near: 1e-10,
    position: [0, 5, 1]
  }
}
let scene: InstanceType<typeof Scene>

onMounted(() => {
  options.container = containerRef.value
  scene = new Scene(options).run()

  useResize(scene).resize()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
