<template>
  <div :class="$style.page" class="h-100 o-h">
    <div :class="$style.operate">
      <div class="flex flex-ac">
        <span>点位：</span>
        <el-switch
          v-model="pageOpts.dotShowStrict"
          active-text="严格"
          inactive-text="全显"
          inline-prompt
        ></el-switch>
      </div>
      <el-link type="success" @click="onChangeCruisePoint">切换巡航点位</el-link>
      <el-link type="primary" size="small" @click="onExport">导出</el-link>
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
      :colors="pageOpts.colors"
      :cruise="pageOpts.cruise"
      :render="pageOpts.render"
      :controls="pageOpts.controls"
      :grid="pageOpts.grid"
      :directional-light="pageOpts.directionalLight"
      :config="pageOpts.config"
      :models="pageOpts.models"
      :anchor-type="pageOpts.anchorType"
      :dot-show-strict="pageOpts.dotShowStrict"
      :floor-model-type="pageOpts.floorModelType"
      :main-body-change-color="pageOpts.mainBodyChangeColor"
      :main-body-mesh-name="pageOpts.mainBodyMeshName"
      :animation-model-type="pageOpts.animationModelType"
      :objects="pageOpts.objects"
      :dot-update-object-call="dotUpdateObjectCall"
      :update-object-call="updateObjectCall"
      @init="onInit"
      @click-dot="onClickDot"
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
import tFloorScene from '@/components/floor-scene/index.vue'
import { getPageOpts } from './data'
import * as request from './request'

import type { ObjectItem } from 'three-scene/types/model'

import { useResize } from '@/hooks/scene-resize'

const pageOpts = reactive(getPageOpts())
const threeSceneRef = ref()

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

// 更新回调
const updateObjectCall = (_obj: ObjectItem, isRandom) => {
  console.log(isRandom)
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
const onClickDot = (item, e) => {
  console.log(item, e)
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

const onExport = () => threeSceneRef.value?.exportImage()

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

    pageOpts.objects = list.map(item => {
      if (item.type === 'COLD_ROOM_INLET') {
        item.onClick = e => {
          ElMessage.success({
            message: e.name,
            grouping: true
          })
        }
      }
      return item
    })
  })
})
</script>

<style lang="scss" module>
@use './style.scss';
</style>
