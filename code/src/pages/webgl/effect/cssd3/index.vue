<template>
  <div class="three-page" :class="$style.page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { Css3dScene } from './methods'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()

const options: ConstructorParameters<typeof Css3dScene>[0] = {
  grid: {
    visible: true
  },
  controls: {
    maxDistance: 5000
  }
}
let scene: InstanceType<typeof Css3dScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new Css3dScene(options)
  scene.run()
  useResize(scene).resize()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
