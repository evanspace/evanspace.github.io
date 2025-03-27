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
      :config="pageOpts.config"
      :color="pageOpts.color"
      :map-json="pageOpts.mapJson"
      :outline-json="pageOpts.outlineJson"
      :flywire="pageOpts.flywire"
      :bar-list="pageOpts.barList"
      :scatters="pageOpts.scatters"
      :bar-label-render="barLabelRender"
      @init="onInit"
      @click="onMapClick"
      @change-map="queryMap"
    >
      <template #dialog="{ data }">
        <div :class="$style['dialog-view']">
          <div :class="$style.city" class="flex">
            <span :class="$style.name">{{ data.isScatter ? data.city : data.name }}</span>
            <span :class="$style.total">{{ data.total }}个项目</span>
          </div>

          <div :class="$style.project" class="flex flex-ac" v-if="data.isScatter">
            <img :src="`${pageOpts.baseUrl}/imgs/map/pos.png`" alt="" />
            <span :class="$style.name">{{ data.name }}</span>
          </div>

          <div :class="$style.count">
            <div :class="$style.item">
              <span>今日用电量</span>
              <span>{{ numConverter(data.value) }}</span>
              <span>kWh</span>
            </div>
            <div :class="$style.item" v-if="data.isScatter">
              <span>今日碳排放</span>
              <span>{{ numConverter(data.carbon) }}</span>
              <span>kgCO₂</span>
            </div>
          </div>
        </div>
      </template>
    </t-map-scene>
  </div>
</template>

<script lang="ts" setup>
import tMapScene from '@/components/map-scene/index.vue'

import * as request from './request'
import { getPageOpts } from './data'

import { numConverter } from '@/common/utils/reckon'

import { useResize } from '@/hooks/scene-resize'
import { Hooks } from 'three-scene'

const { load } = Hooks.useFileLoader()

const threeSceneRef = ref()

const pageOpts = reactive(getPageOpts())

const onExport = () => threeSceneRef.value?.exportImage()

const onInit = scene => {
  const base = pageOpts.baseUrl

  // 地图
  load(`${base}/map/china.json`).then(res => {
    pageOpts.mapJson = res
  })

  // 轮廓
  load(`${base}/map/china-outline.json`).then(res => {
    pageOpts.outlineJson = res
  })

  useResize(scene).resize()
}

const onMapClick = data => {
  console.log(data)
  ElMessage.info({
    message: data.name,
    grouping: true
  })
}

const barLabelRender = item => {
  const { name = '', value = 0, unit = '' } = item
  return {
    name: `
      <div class="label-wrap">
        <div class="name">${name}</div>
        <div class="text">
          <span class="value">${numConverter(value)}</span>
          <span class="unit">${unit}</span>
        </div>
      </div>
    `,
    className: 'map-bar-label'
    // onClick: e => {console.log(e)}
  }
}

const queryMap = () => {
  request.getMap().then(res => {
    pageOpts.flywire = res.lines
    pageOpts.scatters = res.projects
    pageOpts.barList = res.citys
  })
}

onMounted(() => {})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
