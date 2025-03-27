<template>
  <div class="three-page">
    <div class="h-100" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { getPageOpts } from './data'
import { OutlineScene } from './methods'
import { useResize } from '@/hooks/scene-resize'

import { Hooks, Utils } from 'three-scene'

const pageOpts = reactive(getPageOpts())
const { progress, loadModels, getModel, initModels } = Hooks.useModelLoader({
  baseUrl: pageOpts.base
})

const containerRef = ref()
const options: ConstructorParameters<typeof OutlineScene>[0] = {
  baseUrl: pageOpts.base,
  env: '/textures/hdr/moonless_golf_1k.hdr',
  camera: {
    position: [0, 0, 15]
  }
}
let scene: InstanceType<typeof OutlineScene>

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

      scene.addModel(model)
      return Promise.resolve()
    })
  })
}

onMounted(() => {
  options.container = containerRef.value
  scene = new OutlineScene(options).run()

  useResize(scene).resize()

  initPage()
})
</script>

<style lang="scss"></style>
