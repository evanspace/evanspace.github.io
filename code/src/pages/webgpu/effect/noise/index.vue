<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { useResize } from '@/hooks/scene-resize'
import { Scene } from './class'

const containerRef = ref()
const options: ConstructorParameters<typeof Scene>[0] = {
  container: containerRef.value,
  render: {
    antialias: true
    // powerPreference: 'high-performance'
  },
  grid: {
    visible: true
  },
  camera: {
    position: [0, 150, 0]
  }
}

let scene: InstanceType<typeof Scene> | null = null

onMounted(() => {
  options.container = containerRef.value
  scene = new Scene(options).run()

  useResize(scene).resize()
})
</script>
