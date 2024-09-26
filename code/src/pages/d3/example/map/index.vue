<template>
  <div :class="$style.page" class="h-100 o-h">
    <div :class="$style.operate">
      <el-button type="primary" size="small" @click="onExport">导出</el-button>
    </div>

    <t-map-scene
      ref="threeSceneRef"
      :dev-env="pageOpts.devEnv"
      :base-url="pageOpts.baseUrl"
      :bg-color="pageOpts.bgColor"
      :bg-url="pageOpts.bgUrl"
      :env="pageOpts.env"
      :sky-code="pageOpts.skyCode"
      :camera="pageOpts.camera"
      :cruise="pageOpts.cruise"
      :render="pageOpts.render"
      :controls="pageOpts.controls"
      :directional-light="pageOpts.directionalLight"
      :grid="pageOpts.grid"
      :axes="pageOpts.axes"
      @init="onInit"
    ></t-map-scene>
  </div>
</template>

<script lang="ts" setup>
import tMapScene from 'three-scene/components/map-scene/index.vue'

import { getPageOpts } from './data'

import { useResize } from '@/hooks/scene-resize'

const threeSceneRef = ref()

const pageOpts = reactive(getPageOpts())

const onExport = () => threeSceneRef.value?.exportImage()

const onInit = scene => {
  useResize(scene).resize()
}
</script>

<style lang="scss" module>
@import './style.scss';
</style>
