<template>
  <div class="three-page" :class="$style.page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { Css2dScene } from './methods'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()

const options: ConstructorParameters<typeof Css2dScene>[0] = {
  grid: {
    visible: true
  }
}
let scene: InstanceType<typeof Css2dScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new Css2dScene(options)
  scene.run()
  useResize(scene).resize()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
