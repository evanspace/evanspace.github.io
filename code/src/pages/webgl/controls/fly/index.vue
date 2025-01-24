<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { NewThreeScene } from './methods'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()

const options: ConstructorParameters<typeof NewThreeScene>[0] = {
  axes: {
    visible: true
  },
  render: {
    alpha: true
  },
  grid: {
    visible: true
  },
  controls: {
    visible: false
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

<style lang="scss" module></style>
