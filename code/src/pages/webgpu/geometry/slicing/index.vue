<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>

    <t-loading v-model="progress.show" :progress="progress.percentage"></t-loading>
  </div>
</template>

<script lang="ts" setup>
import tLoading from '@/components/loading/index.vue'

import { getPageOpts } from './data'
import { SlicingScene } from './methods'

import { Hooks, Utils } from 'three-scene'
import { useResize } from '@/hooks/scene-resize'

const pageOpts = reactive(getPageOpts())

const { progress, loadModels, initModels, getModel } = Hooks.useModelLoader({
  baseUrl: pageOpts.base,
  indexDB: {
    // cache: false
  }
})

const containerRef = ref()
const options: ConstructorParameters<typeof SlicingScene>[0] = {
  baseUrl: pageOpts.base,
  env: '/textures/hdr/8.hdr',
  directionalLight: {
    intensity: 4
  }
}
let scene: InstanceType<typeof SlicingScene>

const initPage = () => {
  loadModels(pageOpts.models, () => {
    progress.percentage = 100
    progress.show = false

    initModels(pageOpts.objects, item => {
      const { type } = item
      const obj = getModel(type)
      if (!obj) return Promise.resolve()
      console.log(obj)

      // 深克隆
      let model = Utils.modelDeepClone(obj)
      const { position: POS, scale: SCA, rotation: ROT } = Utils.get_P_S_R_param(model, item)
      const [x, y, z] = POS

      // 缩放
      model.scale.set(...SCA)

      // 摆放位置
      model.position.set(x, y, z)
      // 转换方位
      model.rotation.set(...ROT)

      scene.addModel(model)
      return Promise.resolve()
    })
  })
}

onMounted(() => {
  options.container = containerRef.value
  scene = new SlicingScene(options).run()

  useResize(scene).resize()

  initPage()
})
</script>

<style lang="scss"></style>
