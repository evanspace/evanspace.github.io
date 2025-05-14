<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { Scene } from './class'
import { useResize } from '@/hooks/scene-resize'

const containerRef = useTemplateRef('containerRef')
const options: ConstructorParameters<typeof Scene>[0] = {
  camera: {
    position: [0, 100, 100]
  },
  grid: {
    visible: true
  }
}
let scene: InstanceType<typeof Scene>

onMounted(() => {
  options.container = containerRef.value as HTMLElement
  scene = new Scene(options).run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
