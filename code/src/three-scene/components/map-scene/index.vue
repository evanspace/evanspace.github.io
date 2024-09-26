<template>
  <div :class="$style['map-scene']">
    <div :class="$style.container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { MapThreeScene } from './methods'

import { useBackground } from '../../hooks/background'
import { useConvertData } from '../../hooks/convert-data'

const { backgroundLoad } = useBackground()
const { transformGeoJSON } = useConvertData()

const props = withDefaults(defineProps<import('./index').Props>(), {
  camera: () => ({}),
  cruise: () => ({}),
  fog: () => ({}),
  render: () => ({}),
  controls: () => ({}),
  grid: () => ({}),
  axes: () => ({}),
  config: () => ({}),
  color: () => ({}),
  corrugatedPlate: true
})

const containerRef = ref()

// 加载完成
const emits = defineEmits<{
  init: [scene: InstanceType<typeof MapThreeScene>]
}>()

// 地图数据
watch(
  () => props.mapJson,
  json => {
    if (json) {
      scene?.initMap(transformGeoJSON(json))
    }
  }
)

// 轮廓线
watch(
  () => props.outlineJson,
  json => {
    if (json) {
      scene?.initMapOutLine(transformGeoJSON(json))
    }
  }
)

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
  // 波纹板
  if (props.corrugatedPlate) {
    scene?.addCorrugatedPlate()
  }
}

onMounted(() => {
  options.container = containerRef.value
  scene = new MapThreeScene(options, props.config, props.color)
  scene.run()

  emits('init', scene)
  initPage()
})

defineExpose({
  exportImage: () => scene?.exportImage()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
