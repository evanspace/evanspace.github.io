<template>
  <div :class="$style['floor-scene']">
    <!-- 操作按钮 -->
    <div class="scene-operation" v-if="devEnv">
      <el-link type="success">随机更新</el-link>
      <el-link type="warning" @click="() => changeBackground(scene)">切换背景</el-link>
    </div>
    <div :class="$style.container" ref="containerRef"></div>

    <div
      class="loading"
      :class="$style.loading"
      :style="{ '--bg-color': bgColor ? String(bgColor) : '' }"
      @dblclick.stop
      v-if="progress.show"
    >
      <div :class="$style.progress" :style="{ '--percentage': progress.percentage + '%' }">
        <div :class="$style['bar-out']">
          <div :class="$style.bar"></div>
        </div>
        <div :class="$style.text">{{ progress.percentage }}%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getProgress } from './data'
import { NewThreeScene } from './methods'

const props = withDefaults(defineProps<import('./index').Props>(), {
  camera: () => ({}),
  fog: () => ({}),
  render: () => ({}),
  controls: () => ({})
})

import { useResize } from '../../hooks/resize'
import { useBackground } from '../..//hooks/background'

const { change: changeBackground } = useBackground()

const containerRef = ref()
const progress = reactive(getProgress())

const devEnv = props.devEnv
const options: ConstructorParameters<typeof NewThreeScene>[0] = {
  baseUrl: props.baseUrl,
  bgUrl: props.bgUrl,
  env: props.env,
  bgColor: props.bgColor,
  camera: props.camera,
  fog: props.fog,
  render: props.render,
  grid: {
    visible: devEnv
  },
  controls: props.controls,
  axes: {
    visible: devEnv
  }
}

let scene: InstanceType<typeof NewThreeScene>

const load = () => {
  const list = props.models
  const max = list.length
  if (max == 0) {
    progress.isEnd = true
    progress.show = false
    return
  }
  progress.isEnd = false
  progress.percentage = 0
  progress.show = true

  scene?.loadSceneEle(props.models, e => {
    console.log(e)
  })
}

const initPage = () => [load()]

onMounted(() => {
  options.container = containerRef.value
  scene = new NewThreeScene(options)
  scene.run()
  useResize(scene).resize()
  initPage()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
