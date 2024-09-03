<template>
  <div :class="$style.page">
    <div :class="$style['echarts-view']">
      <e-echarts ref="earthRef" auto-size></e-echarts>
    </div>
    <div :class="$style['echarts-view']">
      <e-echarts ref="mapRef" auto-size></e-echarts>
    </div>
  </div>
</template>

<script lang="ts" setup>
import 'echarts-gl'
import { getCityMapOptions, getEarthOptions } from './methods'
import * as request from './request'

const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const earthRef = ref()
const renderEarth = () => {
  const earth = earthRef.value
  let options = getEarthOptions()
  earth.setOption(options)
}

const mapRef = ref()
const renderMap = async (DATA, max) => {
  const map = mapRef.value
  // 名称不为 china 则不显示南海诸岛
  const cityPy = 'china'
  const response = await fetch(base + 'oss/map/china.json')
  const mapJson = await response.json()

  // 全局
  // @ts-ignore
  window.MapData = DATA
  if (map.getOption()) {
    // map.clear()
    // 定时查询开启后，数据从全局变量中获取
    return
  }
  let options = getCityMapOptions(cityPy, DATA)
  map.registerMap(cityPy, mapJson)
  map.hideLoading()
  options.visualMap.max = max ?? 1000
  map.setOption(options)
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
