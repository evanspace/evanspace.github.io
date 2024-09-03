<template>
  <div :class="$style.page" class="h-100 o-h">
    <div class="h-100" ref="containerRef"></div>

    <div :class="$style['dialog-view']" v-if="show" :style="dialog.style">
      <div :class="$style.title">
        {{ dialog.extend.name }}
      </div>

      <div v-if="dialog.extend.isScatter">数量：{{ dialog.extend.value }}</div>
      <div v-else>总数：{{ dialog.extend.count }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getMap } from './request'
import { NewThreeScene } from './methods'

import { useResize } from '@/three-scene/hooks/resize'
import { useDialog } from '@/hooks/dialog'

import { useFileLoader } from '@/three-scene/hooks/file-loader'
import { useConvertData } from '@/three-scene/hooks/convert-data'

const { show, options: dialog } = useDialog({
  style: {
    left: '0px',
    top: '0px'
  },
  extend: {}
})
const { load } = useFileLoader()
const { transformGeoJSON } = useConvertData()

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const containerRef = ref()

const options: ConstructorParameters<typeof NewThreeScene>[0] = {
  camera: {
    position: [0, 100, 200]
  },
  grid: {
    visible: true
  },
  controls: {
    maxPolarAngle: Math.PI * 0.46,
    maxDistance: 20000
    // screenSpacePanning: false
  },
  axes: {
    visible: true
  }
}

let scene: InstanceType<typeof NewThreeScene>

const queryMap = () => {
  getMap().then(list => {
    console.log(list)
    const projects: import('./index').MapPoint[] = []
    const citys = list.map(item => {
      const len = item.projects.length
      let city = item.province
      item.projects.forEach(it => {
        projects.push({
          value: [it.lng, it.lat],
          name: it.name,
          carbon: it.carbonEmission,
          use: it.use,
          count: len,
          city: item.province,
          id: it.id
        })
      })
      const value = item.total
      return {
        name: city,
        code: item.code,
        count: len,
        city: item.province,
        value
      }
    })
    scene?.initScatter(projects, (e, position) => {
      let isShow = !!e
      if (isShow) {
        if (dialog.style) {
          dialog.style.left = position.left + 'px'
          dialog.style.top = position.top + 'px'
        }
        const isScatter = e.isScatter
        dialog.extend.name = e.data.name
        let value = 0,
          count = 0
        if (isScatter) {
          value = e.data.use
        } else {
          const obj = citys.find(it => it.name == e.name)
          if (!obj) isShow = false
          count = obj?.count
        }
        dialog.extend.value = value
        dialog.extend.count = count
        dialog.extend.isScatter = isScatter
      }
      show.value = isShow
    })
  })
}

onMounted(() => {
  options.container = containerRef.value
  scene = new NewThreeScene(options)
  scene.run()

  // 地图
  load(`${base}/oss/map/china.json`).then(res => {
    // load(`${base}/oss/map/广东省.json`).then(res => {
    scene.initMap(transformGeoJSON(res))
  })

  // 轮廓
  load(`${base}/oss/map/china-outline.json`).then(res => {
    scene.initMapOutLine(transformGeoJSON(res))
  })
  console.log(NewThreeScene.total)
  queryMap()
  useResize(scene).resize()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
