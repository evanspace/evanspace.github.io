<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { WaterScene } from './methods'
import { useResize } from '@/hooks/scene-resize'

const containerRef = ref()
const options: ConstructorParameters<typeof WaterScene>[0] = {
  directionalLight: {
    position: [0.5, 3, 0.5],
    color: 0xffe499,
    intensity: 5,
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
    // 相机最远距离 影响水波纹效果
    far: 25,
    position: [3, 2, 4]
  },
  controls: {
    minDistance: 1,
    maxDistance: 10,
    maxPolarAngle: Math.PI * 0.9
  }
}
let scene: InstanceType<typeof WaterScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new WaterScene(options)
  scene.run()

  useResize(scene).resize()
})
</script>

<style lang="scss"></style>
