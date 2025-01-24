<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { SkyScene } from './methods'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof SkyScene>[0] = {
  // 使用灯光 控制台会有警告
  directionalLight: {
    color: 0xffe499,
    intensity: 5,
    position: [0.5, 3, 0.5],
    light2: false
  },
  ambientLight: {
    visible: false
  },
  render: {
    logarithmicDepthBuffer: false
  },
  camera: {
    near: 0.25,
    far: 25,
    position: [3, 2, 4]
  },
  controls: {
    minDistance: 1,
    maxDistance: 10,
    maxPolarAngle: Math.PI * 0.9
  }
}
let scene: InstanceType<typeof SkyScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new SkyScene(options)
  scene.run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
