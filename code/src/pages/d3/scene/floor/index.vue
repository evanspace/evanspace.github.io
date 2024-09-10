<template>
  <div :class="$style.page" class="h-100 o-h">
    <t-floor-scene
      ref="threeSceneRef"
      :dev-env="pageOpts.devEnv"
      :base-url="pageOpts.baseUrl"
      :bg-color="pageOpts.bgColor"
      :bg-url="pageOpts.bgUrl"
      :env="pageOpts.env"
      :sky-code="pageOpts.skyCode"
      :camera="pageOpts.camera"
      :render="pageOpts.render"
      :controls="pageOpts.controls"
      :config="pageOpts.config"
      :models="pageOpts.models"
      :anchor-type="pageOpts.anchorType"
      :floor-model-type="pageOpts.floorModelType"
      :objects="pageOpts.objects"
      :format-object="formatObject"
    ></t-floor-scene>
  </div>
</template>

<script lang="ts" setup>
import tFloorScene from '@/three-scene/components/floor-scene/index.vue'
import { getPageOpts } from './data'
import * as request from './request'

import { useWsStore } from '@/stores'
const wsStore = useWsStore()

const pageOpts = reactive(getPageOpts())
const threeSceneRef = ref()

// 格式化
const formatObject = list => {
  return wsStore.formatData(list)
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
.page {
}
</style>
