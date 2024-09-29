<template>
  <div :class="$style.page" class="h-100 o-h">
    <div :class="$style.operate">
      <div class="flex flex-ac">
        <span>点位：</span>
        <el-switch v-model="pageOpts.dotShowStrict" active-text="严格" inactive-text="全显" inline-prompt></el-switch>
      </div>
      <div class="flex flex-ac">
        <el-link type="success" @click="onChangeCruisePoint">切换巡航点位</el-link>
      </div>
    </div>

    <t-device-scene
      ref="threeSceneRef"
      :dev-env="pageOpts.devEnv"
      :base-url="pageOpts.baseUrl"
      :bg-color="pageOpts.bgColor"
      :bg-url="pageOpts.bgUrl"
      :sky-code="pageOpts.skyCode"
      :env="pageOpts.env"
      :colors="pageOpts.colors"
      :indexDB="pageOpts.indexDB"
      :camera="pageOpts.camera"
      :cruise="pageOpts.cruise"
      :render="pageOpts.render"
      :controls="pageOpts.controls"
      :grid="pageOpts.grid"
      :axes="pageOpts.axes"
      :directional-light="pageOpts.directionalLight"
      :models="pageOpts.models"
      :objects="pageOpts.objects"
      :dot-show-strict="pageOpts.dotShowStrict"
      :format-object="formatObject"
      @init="onInit"
    ></t-device-scene>
  </div>
</template>

<script lang="ts" setup>
import tDeviceScene from 'three-scene/components/device-scene/index.vue'

import { getPageOpts } from './data'

import { useWsStore } from '@/stores'
import { useResize } from '@/hooks/scene-resize'
const wsStore = useWsStore()

const pageOpts = reactive(getPageOpts())
const threeSceneRef = ref()

// 格式化
const formatObject = list => {
  return wsStore.formatData(list)
}

const onInit = scene => {
  useResize(scene).resize()
}

// 切换巡航点位
const onChangeCruisePoint = () => {
  const points = [
    [450, 1, 450],
    [450, 1, -450],
    [-450, 1, -450],
    [-450, 1, 450]
  ].map(items => {
    return items.map(t => t * (0.5 - Math.random() * 0.5 + 1))
  })
  pageOpts.cruise && (pageOpts.cruise.points = points)
}
</script>

<style lang="scss" module>
@import './style.scss';
</style>
