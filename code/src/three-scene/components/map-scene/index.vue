<template>
  <div :class="$style['map-scene']">
    <div :class="$style.container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { MapThreeScene } from './methods'

import { useBackground } from '../../hooks/background'

const { backgroundLoad } = useBackground()

const props = withDefaults(defineProps<import('./index').Props>(), {
  camera: () => ({}),
  cruise: () => ({}),
  fog: () => ({}),
  render: () => ({}),
  controls: () => ({}),
  grid: () => ({}),
  axes: () => ({})
})

const containerRef = ref()

// 加载完成
const emits = defineEmits<{
  init: [scene: InstanceType<typeof MapThreeScene>]
}>()

const options: ConstructorParameters<typeof MapThreeScene>[0] = {
  baseUrl: props.baseUrl,
  bgUrl: props.bgUrl,
  env: props.env,
  bgColor: props.bgColor,
  camera: props.camera,
  cruise: props.cruise,
  fog: props.fog,
  render: props.render,
  grid: props.grid,
  controls: props.controls,
  axes: props.axes
}

let scene: InstanceType<typeof MapThreeScene>

const initPage = () => {
  if (props.skyCode) {
    backgroundLoad(scene, props.skyCode)
  }
}

onMounted(() => {
  options.container = containerRef.value
  scene = new MapThreeScene(options)
  scene.run()

  emits('init', scene)
  initPage()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
