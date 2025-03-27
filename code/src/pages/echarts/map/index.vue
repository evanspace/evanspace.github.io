<template>
  <div :class="$style.page">
    <div :class="$style['echarts-view']">
      <div ref="earthRef" class="h-100"></div>
    </div>
    <div :class="$style['echarts-view']">
      <div ref="mapRef" class="h-100"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import 'echarts-gl'
import { getCityMapOptions, getEarthOptions } from './methods'
import * as request from './request'
import { Echarts, echarts } from '@/hooks/echarts'
import { useResize } from '@/hooks/echarts/resize'

const base = import.meta.env.VITE_GIT_OSS

const earthRef = ref()
const renderEarth = () => {
  const earth = earthRef.value
  let options = getEarthOptions()
  const echarts = new Echarts(earth, options)
  useResize(echarts).resize()
}

const mapRef = ref()
let mapEcharts: InstanceType<typeof Echarts>

const renderMap = async (DATA, max) => {
  const map = mapRef.value
  // 名称不为 china 则不显示南海诸岛
  const cityPy = 'china'
  const response = await fetch(base + '/map/china.json')
  const mapJson = await response.json()

  // 全局
  // @ts-ignore
  window.MapData = DATA
  if (mapEcharts?.getOption()) {
    // mapEcharts.Echarts.clear()
    // 定时查询开启后，数据从全局变量中获取
    return
  }
  echarts.registerMap(cityPy, mapJson)

  let options = getCityMapOptions(cityPy, DATA)
  options.visualMap && (options.visualMap[0].max = max ?? 1000)
  if (!mapEcharts) {
    mapEcharts = new Echarts(map, options)
    useResize(mapEcharts).resize()
  } else {
    mapEcharts.Echarts.setOption(options)
  }

  mapEcharts.Echarts.hideLoading()
}

const queryProjectMap = DATA => {
  request.getMap().then(res => {
    const { citys, projects, max } = res
    DATA.cityJson = citys
    DATA.scatters = projects
    renderMap(DATA, max)
  })
}

const initQuery = async () => {
  renderEarth()

  const res = await request.getConfig()
  queryProjectMap(res)
}

onMounted(initQuery)
</script>

<style lang="scss" module>
@import './style.scss';
</style>
