<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { NewThreeScene } from './methods'

import { useResize } from '@/hooks/scene-resize'
import { Hooks } from 'three-scene/build/three-scene.module'

const containerRef = ref()
const options: ConstructorParameters<typeof NewThreeScene>[0] = {
  grid: {
    visible: true
  }
}
let scene: InstanceType<typeof NewThreeScene>

const { backgroundLoad } = Hooks.useBackground()

const initPage = () => {
  backgroundLoad(scene, '226')
}

onMounted(() => {
  options.container = containerRef.value
  scene = new NewThreeScene(options)
  scene.run()
  useResize(scene).resize()

  initPage()
})
</script>

<style lang="scss" module></style>
