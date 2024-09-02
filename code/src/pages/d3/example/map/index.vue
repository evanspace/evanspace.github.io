<template>
  <div :class="$style.page" class="h-100 o-h">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { NewThreeScene } from './methods'
import { useResize } from '@/three-scene/hooks/resize'

import { useFileLoader } from '@/three-scene/hooks/file-loader'
import { useConvertData } from '@/three-scene/hooks/convert-data'

const { load } = useFileLoader()
const { transformGeoJSON } = useConvertData()

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const containerRef = ref()

const options: ConstructorParameters<typeof NewThreeScene>[0] = {
  camera: {
    position: [0, 100, 200]
  },
  grid: {
    visible: true
  },
  controls: {
    maxPolarAngle: Math.PI * 0.46
    // screenSpacePanning: false
  },
  axes: {
    visible: true
  }
}

let scene: InstanceType<typeof NewThreeScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new NewThreeScene(options)
  scene.run()

  load(`${base}/oss/map/china.json`).then(res => {
    // load(`${base}/oss/map/广东省.json`).then(res => {
    scene.initMap(transformGeoJSON(res))
  })
  load(`${base}/oss/map/china-outline.json`).then(res => {
    // load(`${base}/oss/map/china.json`).then(res => {
    // load(`${base}/oss/map/广东省.json`).then(res => {
    scene.initMapOutLine(transformGeoJSON(res))
  })
  console.log(NewThreeScene.total)
  useResize(scene).resize()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
