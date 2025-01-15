<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>

    <t-loading v-model="progress.show" :progress="progress.percentage"></t-loading>
  </div>
</template>

<script lang="ts" setup>
import tLoading from '@/components/loading/index.vue'

import { getPageOpts } from './data'
import { SmokeScene } from './methods'

import { useResize } from '@/hooks/scene-resize'

import { Hooks, Utils } from 'three-scene'

const pageOpts = reactive(getPageOpts())
const { progress, loadModels, getModel, initModels } = Hooks.useModelLoader({
  baseUrl: pageOpts.base
})

const containerRef = ref()
const options: ConstructorParameters<typeof SmokeScene>[0] = {
  grid: {
    visible: true
  },
  axes: {
    visible: true
  },
  render: {
    logarithmicDepthBuffer: false
  }
}
let scene: InstanceType<typeof SmokeScene>

const initPage = () => {
  loadModels(pageOpts.models, () => {
    // 加载进度 100
    progress.percentage = 100
    progress.show = false

    // 初始化模型
    initModels(pageOpts.objects, item => {
      const { type } = item
      const obj = getModel(type)
      if (!obj) return Promise.resolve()

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

      scene.addObject(model)
      return Promise.resolve()
    })
  })
}

onMounted(() => {
  options.container = containerRef.value
  scene = new SmokeScene(options)
  scene.run()

  useResize(scene).resize()

  initPage()
})
</script>

<style lang="scss" module></style>
