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
    visible: true,
    fork: true
  },
  render: {
    alpha: true
  },
  camera: {
    near: 1e-10,
    position: [-100, 100, -100]
  },
  controls: {
    enablePan: false,
    maxPolarAngle: Math.PI / 2,
    minDistance: 1e-4,
    maxDistance: 200
  }
}
let scene: InstanceType<typeof Scene>

onMounted(() => {
  scene = new Scene(options, containerRef.value).run()

  useResize(scene).resize()
})
</script>

<style lang="scss" module>
@use './style.scss';
</style>
