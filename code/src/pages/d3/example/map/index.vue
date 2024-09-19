<template>
  <div :class="$style.page" class="h-100 o-h">
    <div class="h-100" ref="containerRef"></div>

    <div :class="$style.operate">
      <el-button type="primary" size="small" @click="onExport">导出</el-button>
    </div>

    <div :class="$style['dialog-view']" v-if="show" :style="dialog.style">
      <div :class="$style.city" class="flex" v-if="dialog.extend.city">
        <span :class="$style.name">{{ dialog.extend.city }}</span>
        <span :class="$style.total">{{ dialog.extend.total }}个项目</span>
      </div>
      <div :class="$style.project" class="flex flex-ac" v-if="dialog.extend.title">
        <img :src="`${base}oss/img/map/pos.png`" alt="" />
        <span :class="$style.name">{{ dialog.extend.title }}</span>
      </div>
      <div :class="$style.count">
        <div :class="$style.item" v-for="item in dialog.list">
          <span>{{ item.name }}</span>
          <span>{{ item.value }}</span>
          <span>{{ item.unit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as request from './request'
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
  list: [],
  extend: {
    isScatter: false,
    city: '',
    title: '',
    total: 0
  }
})
const { load } = useFileLoader()
const { transformGeoJSON } = useConvertData()

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const containerRef = ref()

// const path = '/oss/img/sky'
// const skyCode = 216
const options: ConstructorParameters<typeof NewThreeScene>[0] = {
  // bgUrl: [
  //   `${base}${path}/${skyCode}/posX.jpeg`,
  //   `${base}${path}/${skyCode}/negX.jpeg`,
  //   `${base}${path}/${skyCode}/posY.jpeg`,
  //   `${base}${path}/${skyCode}/negY.jpeg`,
  //   `${base}${path}/${skyCode}/posZ.jpeg`,
  //   `${base}${path}/${skyCode}/negZ.jpeg`
  // ],
  // bgUrl: `${base}/oss/img/map/earth.jpg`,
  // env: `${base}/oss/textures/hdr/skidpan_2k.hdr`,
  bgColor: 0x071729,
  camera: {
    position: [0, 100, 200]
  },
  fog: {
    visible: false,
    near: 2000,
    far: 3000
  },
  render: {
    preserveDrawingBuffer: true
  },
  grid: {
    visible: true
  },
  controls: {
    maxPolarAngle: Math.PI * 0.46,
    maxDistance: 5000,
    enableDamping: true,
    screenSpacePanning: false
  },
  axes: {
    visible: false
  }
}

let scene: InstanceType<typeof NewThreeScene>

const onExport = () => scene?.exportImage()

const queryMap = () => {
  request.getMap().then(res => {
    const { projects, citys } = res
    scene?.initScatter(projects, (e, position) => {
      let isShow = !!e
      if (isShow) {
        if (dialog.style) {
          dialog.style.left = position.left + 'px'
          dialog.style.top = position.top + 'px'
        }
        const isScatter = e.isScatter
        const data = e.data
        let city = '',
          title = '',
          total = 0,
          list: ListItem[] = []
        if (isScatter) {
          city = data.city
          title = data.name
          total = data.total
          list = [
            { name: '今日用电量', value: data.use, unit: 'kWh' },
            { name: '今日碳排放', value: data.carbon, unit: 'kgCO₂' }
          ]
        } else {
          const obj = citys.find(it => it.name == e.name)
          if (obj) {
            city = obj?.city
            total = obj?.total ?? 0
            list = [{ name: '今日用电量', value: obj?.use, unit: 'kWh' }]
          } else {
            isShow = false
          }
        }
        dialog.list = list
        dialog.extend.city = city
        dialog.extend.title = title
        dialog.extend.total = total
        dialog.extend.isScatter = isScatter
      }
      show.value = isShow
    })
    scene?.initMapBar(citys)
    scene?.initFlywire(res.lines)
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
    queryMap()
  })

  // 轮廓
  load(`${base}/oss/map/china-outline.json`).then(res => {
    scene.initMapOutLine(transformGeoJSON(res))
  })
  useResize(scene).resize()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
