<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ShadowScene } from './methods'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof ShadowScene>[0] = {
  grid: {
    visible: true
  },
  directionalLight: {
    light2: false
  }
}
let scene: InstanceType<typeof ShadowScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new ShadowScene(options).run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
