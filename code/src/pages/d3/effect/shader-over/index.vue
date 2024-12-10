<template>
  <div :class="$style.page">
    <div :class="$style.container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { NewThreeScene } from './methods'
import { Sketch } from './test'

import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof NewThreeScene>[0] = {
  axes: {
    visible: true
  },
  camera: {
    position: [2000, 0, 2500]
  },
  controls: {
    // visible: false
    maxDistance: 10000
  },
  directionalLight: {
    visible: false
  },
  ambientLight: {
    visible: false
  },
  grid: {
    visible: true
  }
}
let scene: InstanceType<typeof NewThreeScene>

onMounted(() => {
  options.container = containerRef.value
  new Sketch({
    el: containerRef.value
  })
  return
  scene = new NewThreeScene(options)
  scene.run()

  useResize(scene).resize()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
