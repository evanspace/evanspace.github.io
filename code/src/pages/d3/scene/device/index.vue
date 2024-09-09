<template>
  <div :class="$style.wrapper">
    <three-scene
      ref="threeSceneRef"
      sky-code="223"
      :base-url="assetsStore.oss"
      :models="models"
      :objects="objects"
      :config="config"
      :db-name="pageOpts.dbName"
      :tb-name="pageOpts.tbName"
      :db-version="pageOpts.dbVersion"
      :dev-env="pageOpts.devEnv"
      :load-cache="pageOpts.loadCache"
      :dot-show-strict="pageOpts.dotShowStrict"
      :hdr-="pageOpts.hdr"
      :pipe-mesh-name="pipeMeshName"
      :pipe-model-type="pipeModelType"
      :color-mesh-name="colorMeshName"
      :text-model-type="textModelType"
      :animation-model-type="animationModelType"
      :cruise-points="cruisePoints"
      :main-body-change-color="pageOpts.mainBodyChangeColor"
      :cruise-tube-show="pageOpts.cruiseTubeShow"
      :cruise-path-offset="pageOpts.cruisePathOffse"
      :path-tension="pageOpts.pathTension"
      :format-object="formatObject"
      :dot-update-object-call="dotUpdateObjectCall"
      :update-object-call="updateObjectCall"
      :random-update-object-call="randomUpdateObjectCall"
      @click-dot="onThreeDotClick"
      @dblclick="onDblclick"
      @loaded="onLoaded"
    >
    </three-scene>
  </div>
</template>

<script lang="ts" setup>
import type { ObjectItem, ThreeModelItem } from '@/components/three-scene/index'
import { models, colorMeshName, pipeMeshName, pipeModelType, textModelType, animationModelType, getOpts } from './data'
import * as request from './request'

import { useAssetsStore, useWsStore } from '@/stores'
const assetsStore = useAssetsStore()
const wsStore = useWsStore()

const pageOpts = reactive(getOpts())
const threeSceneRef = ref()

const objects = ref<import('@/components/three-scene/index').ObjectItem[]>([])

const cruisePoints = ref<number[][]>([])

const config = reactive({
  to: { x: 0, y: 1300, z: 0 }
})

// 格式化对接列表
const formatObject = list => {
  const data = wsStore.formatData(list)
  console.log(list, data)
  return data
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
  const so = list.findIndex(it => it.data && it.data.deviceCode === c && (it.data?.status || 0) > 0) > -1

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
      color: obj.value > 35 ? '#f00' : null
    }
  }
}

// 更新对象回调
const updateObjectCall = (obj: ObjectItem) => {
  const code = obj.deviceCode || ''
  // console.log( code )
  const status = wsStore.getRunStatus(code)
  const error = wsStore.getErrorStatus(code)
  return {
    status,
    error
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

// dot 点击
const onThreeDotClick = e => {
  console.log(e)
}

const onDblclick = e => {
  console.log(toRaw(e.data))
}

const onLoaded = () => {
  console.log('loaded')
}
const initQuery = () => {
  request.getMonitorConfig({ id: '123456', type: 0 }).then(res => {
    let list = res.pipConfig || []
    list = list.concat(res.jsonList)
    const url = res.modelUrl
    list.unshift({
      name: res.name,
      type: '',
      url: url ? `${assetsStore.oss}${url}` : ''
    })

    objects.value = list
    let json: import('@/components/three-scene/index').Config & {
      cruise?: number[][]
    } = res.configJson

    Object.keys(json).forEach(key => {
      config[key] = json[key]
    })

    cruisePoints.value = json.cruise || []
  })

  threeSceneRef.value?.setControls({
    screenSpacePanning: true,
    minDistance: 100,
    maxDistance: 2000
  })
}

initQuery()
</script>

<style lang="scss" module>
@import './style.scss';
</style>
