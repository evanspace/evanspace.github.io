<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>

    <t-loading v-model="progress.show" :progress="progress.percentage"></t-loading>
  </div>
</template>

<script lang="ts" setup>
import tLoading from '@/components/loading/index.vue'

import { NewScene } from './methods'
import { useResize } from '@/hooks/scene-resize'
import * as ThreeScene from 'three-scene/build/three-scene.module'

import { getPageOpts } from './data'

const Hooks = ThreeScene.Hooks
const pageOpts = reactive(getPageOpts())

const { progress, loadModels, getModel, MODEL_MAP } = Hooks.useModelLoader({
  baseUrl: pageOpts.baseUrl,
  indexDB: {
    cache: true,
    dbName: 'THREE__OFFICE__DB',
    tbName: 'TB',
    version: 40
  }
})

const containerRef = ref()
const options: ConstructorParameters<typeof NewScene>[0] = {
  grid: {
    visible: true
  },
  axes: {
    visible: true
  },
  camera: {
    position: [-200, 300, 300]
  },
  render: {
    alpha: true
  }
}
let scene: InstanceType<typeof NewScene>

const initPage = () => {
  loadModels(pageOpts.models, () => {
    // 加载进度 100
    progress.percentage = 100
    progress.show = false

    const fontParser = getModel(MODEL_MAP.font)

    scene.addModel(fontParser)
  })
}

onMounted(() => {
  options.container = containerRef.value
  scene = new NewScene(options)
  scene.run()

  useResize(scene).resize()

  initPage()
})
</script>

<style lang="scss"></style>
