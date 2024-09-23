<template>
  <div :class="$style.page" class="h-100 o-h">
    <div :class="$style.operate">
      <div class="flex flex-ac">
        <span>点位：</span>
        <el-switch v-model="pageOpts.dotShowStrict" active-text="严格" inactive-text="全显" inline-prompt></el-switch>
      </div>
    </div>
    <t-floor-scene
      ref="threeSceneRef"
      :dev-env="pageOpts.devEnv"
      :base-url="pageOpts.baseUrl"
      :bg-color="pageOpts.bgColor"
      :bg-url="pageOpts.bgUrl"
      :env="pageOpts.env"
      :indexDB="pageOpts.indexDB"
      :sky-code="pageOpts.skyCode"
      :camera="pageOpts.camera"
      :render="pageOpts.render"
      :controls="pageOpts.controls"
      :grid="pageOpts.grid"
      :config="pageOpts.config"
      :models="pageOpts.models"
      :anchor-type="pageOpts.anchorType"
      :dot-show-strict="pageOpts.dotShowStrict"
      :floor-model-type="pageOpts.floorModelType"
      :main-body-change-color="pageOpts.mainBodyChangeColor"
      :main-body-mesh-name="pageOpts.mainBodyMeshName"
      :animation-model-type="pageOpts.animationModelType"
      :objects="pageOpts.objects"
      :format-object="formatObject"
      :dot-update-object-call="dotUpdateObjectCall"
      :random-update-object-call="randomUpdateObjectCall"
      @init="onInit"
    >
      <template #dialog="{ data, title }">
        <div :class="$style['dialog-wrap']">
          <div :class="$style.circle"></div>
          <div :class="$style.line"></div>
          <div :class="$style.content">
            <div :class="$style.title">{{ title }}</div>
            <div :class="$style.data">{{ data }}</div>
          </div>
        </div>
      </template>
    </t-floor-scene>
  </div>
</template>

<script lang="ts" setup>
import tFloorScene from 'three-scene/components/floor-scene/index.vue'
import { getPageOpts } from './data'
import * as request from './request'

import type { ObjectItem } from 'three-scene/types/model.d'

import { useWsStore } from '@/stores'
import { useResize } from '@/hooks/scene-resize'
const wsStore = useWsStore()

const pageOpts = reactive(getPageOpts())
const threeSceneRef = ref()

// 格式化
const formatObject = list => {
  return wsStore.formatData(list)
}

// 点位更新回调
const dotUpdateObjectCall = (obj: ObjectItem, _group) => {
  // const val = wsStore.getKeyValue( code ).value
  const val = Math.random() * 40
  if (val !== void 0) {
    obj.value = val
  }

  obj.show = Math.random() > 0.5
  obj.value = Number(Number(obj.value || 0).toFixed(2))
  return {
    value: obj.value,
    show: obj.show,
    font: {
      ...(obj.font || {}),
      color: obj.value > 35 ? '#f00' : null
    }
  }
}

// 随机更新回调
const randomUpdateObjectCall = (_obj: ObjectItem) => {
  // const code = _obj.deviceCode || ''
  // console.log( code )
  const status = Math.random() > 0.5 ? 1 : 0
  const error = Math.random() > 0.5 ? 1 : 0
  const disabled = Math.random() > 0.8 ? 1 : 0
  const ctl = Math.floor(Math.random() * 3)
  return {
    status: disabled > 0 ? 0 : status,
    error: disabled > 0 ? 0 : error,
    remote: ctl == 1 ? 1 : 0,
    local: ctl == 2 ? 1 : 0,
    disabled
  }
}

const onInit = scene => {
  useResize(scene).resize()
}

onMounted(() => {
  request.getConfig().then(res => {
    let list = res.JsonList
    const url = res.ModelUrl
    list.unshift({
      name: res.Name,
      type: '',
      url: url ? `${pageOpts.baseUrl}${url}` : ''
    })
    let json = {}
    if (res.ConfigJson instanceof Object) {
      json = res.ConfigJson
    } else if (typeof res.ConfigJson == 'string') {
      try {
        json = JSON.parse(res.ConfigJson)
      } catch (er) {}
    }
    Object.keys(json).forEach(key => {
      pageOpts.config && (pageOpts.config[key] = json[key])
    })

    pageOpts.objects = list
  })
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
