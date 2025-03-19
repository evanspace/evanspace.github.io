<template>
  <div class="three-page" :class="$style.page">
    <div class="h-100" ref="containerRef"></div>

    <div :class="$style.echarts" id="echarts" ref="echartsRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { Scene } from './class'
import { Echarts } from '@/hooks/echarts'
import { useResize } from '@/hooks/scene-resize'

import { scatterOption, barOptions } from './echarts-opts'

const containerRef = ref()
const options: ConstructorParameters<typeof Scene>[0] = {
  axes: {
    visible: true
  },
  grid: {
    visible: true,
    fork: true
  },
  ambientLight: {
    intensity: 2
  },
  directionalLight: {
    intensity: 0.1
  },
  camera: {
    near: 1e-10,
    position: [0, 50, 800]
  }
}
let scene: InstanceType<typeof Scene>

const echartsRef = ref()
let echartsList: InstanceType<typeof Echarts>[] = []

const addEcharts = (options, theme: ConstructorParameters<typeof Echarts>[2], data) => {
  const dom = document.createElement('div')
  const echarts = new Echarts(dom, options, theme, {
    width: data.width * 4,
    height: data.height * 4
  })
  // 渲染结束
  echarts.on('finished', () => {
    scene.addEchartPlane(echarts.domElement, data)
  })
  echartsList.push(echarts)

  // echartsRef.value.appendChild(dom)
}

const initPage = () => {
  addEcharts(barOptions, 'essos', {
    key: '---1',
    width: 300,
    height: 100,
    position: { x: -150, y: 50, z: 0 },
    rotation: { x: 0, y: 30, z: 0 }
  })
  addEcharts(scatterOption, 'dark', {
    key: '---2',
    width: 300,
    height: 100,
    position: { x: 150, y: 50, z: 0 },
    rotation: { x: 0, y: -30, z: 0 }
  })
}

onMounted(() => {
  scene = new Scene(options, containerRef.value).run()
  useResize(scene).resize()
  initPage()
})

onBeforeUnmount(() => {
  echartsList.forEach(echarts => {
    echarts.dispose()
  })
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
