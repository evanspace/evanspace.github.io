<template>
  <div class="three-page">
    <div class="container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { useResize } from '@/hooks/scene-resize'
import { Scene } from './class'

const containerRef = useTemplateRef('containerRef')

const options: ConstructorParameters<typeof Scene>[0] = {
  grid: {
    visible: !true
  },
  ambientLight: {
    visible: false
  },
  directionalLight: {
    visible: false
  },
  axes: {
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

<style lang="scss">
//
</style>
