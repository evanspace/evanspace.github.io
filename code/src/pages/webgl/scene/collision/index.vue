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

const baseUrl = import.meta.env.VITE_GIT_OSS

const { progress, loadModel } = Hooks.useModelLoader({
  baseUrl
})

const initPage = () => {
  progress.show = true
  loadModel({
    name: '碰撞世界',
    key: 'collision-world',
    size: 0.09,
    url: '/models/glb/碰撞世界.glb'
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

const onContainerMouseDown = () => {
  scene.onContainerMouseDown()
}

const onDocumentMouseUp = () => {
  scene.onDocumentMouseUp()
}

const onDocumentMouseDown = () => {
  scene.onDocumentMouseDown()
}

const onBodyMouseMove = e => {
  scene.onBodyMouseMove(e)
}

const bindEvent = () => {
  scene.container.addEventListener('mousedown', onContainerMouseDown, false)
  document.addEventListener('mouseup', onDocumentMouseUp, false)
  document.addEventListener('mousedown', onDocumentMouseDown, false)
  document.body.addEventListener('mousemove', onBodyMouseMove, false)
}

const removeEvent = () => {
  scene.container.removeEventListener('mousedown', onContainerMouseDown, false)
  document.removeEventListener('mouseup', onDocumentMouseUp, false)
  document.removeEventListener('mousedown', onDocumentMouseDown, false)
  document.body.removeEventListener('mousemove', onBodyMouseMove, false)
}

onMounted(() => {
  options.container = containerRef.value
  scene = new Scene(options).run()

  useResize(scene).resize()

  initPage()
  bindEvent()
})

onBeforeUnmount(removeEvent)
</script>

<style lang="scss" module>
@use './style.scss';
</style>
