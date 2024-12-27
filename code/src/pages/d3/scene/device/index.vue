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
      :config="pageOpts.config"
      :grid="pageOpts.grid"
      :axes="pageOpts.axes"
      :ambient-light="pageOpts.ambientLight"
      :directional-light="pageOpts.directionalLight"
      :models="pageOpts.models"
      :objects="pageOpts.objects"
      :dot-show-strict="pageOpts.dotShowStrict"
      :anchor-type="pageOpts.anchorType"
      :main-body-change-color="pageOpts.mainBodyChangeColor"
      :color-mesh-name="pageOpts.colorMeshName"
      :animation-model-type="pageOpts.animationModelType"
      :text-model-type="pageOpts.textModelType"
      :format-object="formatObject"
      :dot-update-object-call="dotUpdateObjectCall"
      :update-object-call="updateObjectCall"
      @init="onInit"
      @click-dot="onClickDot"
      @dblclick="onDbclick"
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
    </t-device-scene>
  </div>
</template>

<script lang="ts" setup>
import tDeviceScene from 'three-scene/components/device-scene/index.vue'

import { getPageOpts } from './data'
import * as request from './request'

import { useWsStore } from '@/stores'
import { useResize } from '@/hooks/scene-resize'

import type { ObjectItem, ThreeModelItem } from 'three-scene/src/types/model'

const wsStore = useWsStore()

const pageOpts = reactive(getPageOpts())
const threeSceneRef = ref()

// 格式化
const formatObject = list => {
  return wsStore.formatData(list)
}

// 点位更新回调
const dotUpdateObjectCall = (obj: ObjectItem, list: ThreeModelItem[]) => {
  const code = obj.deviceCode || ''
  // const val = wsStore.getKeyValue( code ).value
  const val = Math.random() * 40
  if (val !== void 0) {
    obj.value = val
  }
  const c = code.split('_')[0] || ''
  // const so = wsStore.getRunStatus( c ) > 0
  const so =
    list.findIndex(it => it.data && it.data.deviceCode === c && (it.data?.status || 0) > 0) > -1

  // 判断在运行则展示 不存在的则为公共参数也展示
  if (so || ['SYS', 'CSC'].includes(c)) {
    obj.show = true
  } else {
    obj.show = false
  }
  obj.value = Number(Number(obj.value || 0).toFixed(2))
  return {
    value: obj.value,
    show: obj.show,
    font: {
      ...(obj.font || {}),
      color: '#' + (0xffffff + val * 1000000).toString(16).substring(0, 6)
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

const onDbclick = e => {
  console.log(e)
}

// 切换巡航点位
const onChangeCruisePoint = () => {
  const points = [
    [450, 0.1, 350],
    [450, 0.1, -350],
    [-450, 0.1, -350],
    [-450, 0.1, 350]
  ].map(items => {
    return items.map(t => t * (0.2 - Math.random() * 0.2 + 1))
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
    let json: any = {}
    if (res.ConfigJson instanceof Object) {
      json = res.ConfigJson
    } else if (typeof res.ConfigJson == 'string') {
      try {
        json = JSON.parse(res.ConfigJson)
      } catch (er) {}
    }

    if (json.cruise) {
      pageOpts.cruise && (pageOpts.cruise.points = json.cruise)
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
@import './style.scss';
</style>
