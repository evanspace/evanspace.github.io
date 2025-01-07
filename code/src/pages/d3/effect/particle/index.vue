<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { NewThreeScene } from './methods'

import { useResize } from '@/hooks/scene-resize'

import * as ThreeScene from 'three-scene/build/three-scene.module'

const Hooks = ThreeScene.Hooks
const { backgroundLoad } = Hooks.useBackground()

const containerRef = ref()
const options: ConstructorParameters<typeof NewThreeScene>[0] = {
  axes: {
    // visible: true
  },
  grid: {
    // visible: true
  }
}
let scene: InstanceType<typeof NewThreeScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new NewThreeScene(options)
  scene.run()

  useResize(scene).resize()

  return
  backgroundLoad(scene, '226')
})
</script>

<style lang="scss" module></style>
