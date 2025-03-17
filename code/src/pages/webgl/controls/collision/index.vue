<template>
  <div class="three-page" :class="$style.page">
    <div class="h-100" ref="containerRef"></div>

    <t-loading v-model="progress.show" :progress="progress.percentage"></t-loading>

    <div :class="$style.center"></div>
  </div>
</template>

<script lang="ts" setup>
import tLoading from '@/components/loading/index.vue'

import { Scene } from './class'
import { useResize } from '@/hooks/scene-resize'
import { Hooks } from 'three-scene'

const baseUrl = import.meta.env.VITE_BEFORE_STATIC_PATH

const { progress, loadModel } = Hooks.useModelLoader({
  baseUrl
})

const initPage = () => {
  progress.show = true
  loadModel({
    name: '碰撞世界',
    key: 'collision-world',
    size: 0.09,
    url: '/oss/model/glb/碰撞世界.glb'
  }).then(glb => {
    scene.addWordModel(glb)
    progress.show = false
  })
}

const containerRef = ref()
const options: ConstructorParameters<typeof Scene>[0] = {
  axes: {
    visible: true
  },
  grid: {
    visible: true
  },
  camera: {
    near: 1e-10,
    position: [0, 0, 0]
  },
  controls: {
    visible: false
  }
}
let scene: InstanceType<typeof Scene>

onMounted(() => {
  options.container = containerRef.value
  scene = new Scene(options).run()

  useResize(scene).resize()

  initPage()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
