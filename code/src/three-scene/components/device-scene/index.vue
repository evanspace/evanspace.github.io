<template>
  <div :class="$style['device-scene']">
    <!-- 操作按钮 -->
    <div class="scene-operation">
      <el-link type="warning" @click="() => changeBackground(scene)">切换背景</el-link>
    </div>

    <div :class="$style.container" ref="containerRef"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, withDefaults } from 'vue'

import { DeviceThreeScene } from './methods'

import { colors } from './colors'
import * as UTILS from '../../utils/model'
import DEFAULTCONFIG from '../../config'

import { deepMerge } from '../../utils'

import type { ObjectItem, ThreeModelItem, XYZ } from '../../types/model'

const props = withDefaults(defineProps<import('./index').Props>(), {
  dracoUrl: '',
  dotKey: 'DOT',
  dotShowStrict: true,
  colors: () => ({}),
  camera: () => ({}),
  cruise: () => ({}),
  fog: () => ({}),
  render: () => ({}),
  controls: () => ({}),
  grid: () => ({}),
  axes: () => ({}),
  directionalLight: () => ({}),
  colorMeshName: () => [],
  anchorType: () => [],
  mainBodyMeshName: () => ['主体'],
  indexDB: () => ({
    cache: true
  })
})

// 加载完成、更新、选择 anchorType 类型的模块、双击模型、点击 DOT 类型点位, 点击弹窗点位
const emits = defineEmits<{
  init: [scene: InstanceType<typeof DeviceThreeScene>]
  loaded: []
  update: [list: ObjectItem[], isRandom?: boolean]
  select: [item: ObjectItem]
  dblclick: [item: ObjectItem]
  'click-dot': [item: ObjectItem]
  'click-dialog-dot': [item: ObjectItem, pos: { left: number; top: number }]
}>()

const COLORS = deepMerge(colors, props.colors)

import { useBackground } from '../../hooks/background'

const { changeBackground, backgroundLoad } = useBackground()

const containerRef = ref()

const options: ConstructorParameters<typeof DeviceThreeScene>[0] = {
  baseUrl: props.baseUrl,
  bgUrl: props.bgUrl,
  env: props.env,
  bgColor: props.bgColor,
  camera: props.camera,
  cruise: props.cruise,
  fog: props.fog,
  render: props.render,
  grid: props.grid,
  controls: props.controls,
  axes: props.axes,
  directionalLight: props.directionalLight
}

let scene: InstanceType<typeof DeviceThreeScene>

// 点位模式
// watch()
// () => props.dotShowStrict,
// () => toggleDotVisible()

// 缩放
watch(
  () => props.scale,
  v => {
    scene?.setScale(v || 1)
  }
)

// 加载
const load = () => {
  // loadModels(props.models, () => {
  //   assemblyScenario()
  // })
}

const initPage = () => {
  load()
  if (props.skyCode) {
    backgroundLoad(scene, props.skyCode)
  }
}

onMounted(() => {
  options.container = containerRef.value

  scene = new DeviceThreeScene(options)
  scene.run()

  emits('init', scene)
  initPage()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
