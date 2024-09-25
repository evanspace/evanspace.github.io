<template>
  <div :class="$style['map-scene']">
    <div :class="$style.container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MapThreeScene } from './methods'

const containerRef = ref()

// 加载完成
const emits = defineEmits<{
  init: [scene: InstanceType<typeof MapThreeScene>]
}>()

const options: ConstructorParameters<typeof MapThreeScene>[0] = {
  bgColor: 0x071729,
  camera: {
    position: [0, 100, 200]
  },
  fog: {
    visible: false,
    near: 2000,
    far: 3000
  },
  render: {
    preserveDrawingBuffer: true
  },
  grid: {
    visible: true
  },
  controls: {
    maxPolarAngle: Math.PI * 0.46,
    maxDistance: 5000,
    enableDamping: true,
    screenSpacePanning: false
  },
  axes: {
    visible: true
  }
}

let scene: InstanceType<typeof MapThreeScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new MapThreeScene(options)
  scene.run()

  emits('init', scene)
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
