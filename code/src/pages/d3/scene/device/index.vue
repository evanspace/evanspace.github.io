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
      :ambient-light="pageOpts.ambientLight"
      :directional-light="pageOpts.directionalLight"
      :models="pageOpts.models"
      :objects="pageOpts.objects"
      :dot-show-strict="pageOpts.dotShowStrict"
      :main-body-change-color="pageOpts.mainBodyChangeColor"
      :color-mesh-name="pageOpts.colorMeshName"
      :animation-model-type="pageOpts.animationModelType"
      :format-object="formatObject"
      :dot-update-object-call="dotUpdateObjectCall"
      :update-object-call="updateObjectCall"
      @init="onInit"
    ></t-device-scene>
  </div>
</template>

<script lang="ts" setup>
import tDeviceScene from 'three-scene/components/device-scene/index.vue'

import { getPageOpts } from './data'
import * as request from './request'

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

// 切换巡航点位
const onChangeCruisePoint = () => {
  const points = [
    [450, 0.1, 450],
    [450, 0.1, -450],
    [-450, 0.1, -450],
    [-450, 0.1, 450]
  ].map(items => {
    return items.map(t => t * (0.5 - Math.random() * 0.5 + 1))
  })
  pageOpts.cruise && (pageOpts.cruise.points = points)
}

onMounted(() => [
  request.getConfig().then(res => {
    console.log(res)
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
])
</script>

<style lang="scss" module>
@import './style.scss';
</style>
