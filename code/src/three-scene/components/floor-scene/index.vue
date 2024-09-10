<template>
  <div :class="$style['floor-scene']">
    <!-- 操作按钮 -->
    <div class="scene-operation" v-if="devEnv">
      <el-link type="success">随机更新</el-link>
      <el-link @click="() => scene?.getPosition()" type="success">场景坐标</el-link>
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
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import { NewThreeScene } from './methods'
import { colors } from './colors'
import * as UTILS from '../../utils/model'

import type { ObjectItem, ThreeModelItem } from '../../types/model'

const props = withDefaults(defineProps<import('./index').Props>(), {
  dracoUrl: '',
  dotKey: 'DOT',
  camera: () => ({}),
  fog: () => ({}),
  render: () => ({}),
  controls: () => ({}),
  colorMeshName: () => [],
  anchorType: () => []
})

import { useResize } from '../../hooks/resize'
import { useBackground } from '../../hooks/background'
import { useModelLoader } from '../../hooks/model-loader'

const { change: changeBackground, load: backgroundLoad } = useBackground()
const { progress, loadModel, loadModels, getModel } = useModelLoader({
  baseUrl: props.dracoUrl,
  colors,
  colorMeshName: props.colorMeshName
})

// 加载完成、更新、选择 anchorType 类型的模块、双击模型、点击 DOT 类型点位, 点击弹窗点位
const emits = defineEmits<{
  loaded: []
  update: [list: ObjectItem[], isRandom?: boolean]
  select: [item: ObjectItem]
  dblclick: [item: ObjectItem]
  'click-dot': [item: ObjectItem]
  'click-dialog-dot': [item: ObjectItem, pos: { left: number; top: number }]
}>()

const containerRef = ref()

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

// 楼层动画
const floorAnimate = (index?: number) => {
  const floors = scene.getFloor()

  // 楼层列表为 0 则不执行
  if (floors.length === 0) return
  // 执行目标是否存在
  const isExist = index !== void 0 && index > -1
  // 楼层展开是否隐藏其他
  if (props.config?.floorExpandHiddenOther) {
    scene.hideOmitFloor(!isExist)
  }
  floors.forEach((el, i) => {
    // 换算间距
    const pos = el._pos
    let k = i - (!isExist ? i : index)
    const margin = props.config?.floorExpandMargin || 200
    const mode = props.config?.floorExpandMode || 'UD'
    const cy = k * margin
    const ty = (pos?.y ?? 0) + cy
    const tz = index == i ? (pos?.z ?? 0) + margin : pos?.z ?? 0

    // 判断模式
    // UD 上下
    // BA 前后
    // 移动目标为模型坐标则不执行动画
    if (mode === 'UD') {
      if (el.position.y === ty) return
    } else if (mode === 'BA') {
      if (el.position.z === tz) return
    }

    // 标记跟随模型
    if (el.data?.mark) {
      const mark = el.data.mark
      const items = scene.getFlowMark(mark)
      fllowModelAnimate(mode, items, cy, index == i ? margin : 0)
    }
    new TWEEN.Tween(el.position)
      .to(
        {
          y: mode === 'UD' ? ty : el.position.y,
          z: mode === 'BA' ? tz : el.position.z
        },
        500
      )
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  })

  // 楼层展开是否改变视角
  if (!props.config?.floorExpandChangeViewAngle) return
  let to, target
  if (isExist) {
    const object = floors[index] || {}
    to = object.data?.to
    if (!!to) {
      target = object.data?.target || object._pos
    }
  }
  to = scene.getAnimTargetPos(props.config || {}, to, target)
  // 判断位置是否未移动
  if (!isCameraMove(to)) {
    UTILS.cameraInSceneAnimate(scene.camera, to, scene.controls.target)
  }
}

// 判断相机位置是否移动
const isCameraMove = (to: XYZ) => {
  const pos = scene.camera.position
  // 坐标差距小于 1 则未移动
  return Math.abs(pos.x - to.x) < 1 && Math.abs(pos.y - to.y) < 1 && Math.abs(pos.z - to.z) < 1
}

// 跟随模型动画
const fllowModelAnimate = (mode: string, items: ThreeModelItem[], cy: number, cz: number) => {
  if (items.length === 0) return
  items.forEach(el => {
    const pos = el._pos
    const ty = mode == 'UD' ? (pos?.y ?? 0) + cy : pos?.y ?? 0
    const tz = mode == 'BA' ? (pos?.z ?? 0) + cz : pos?.z ?? 0
    new TWEEN.Tween(el.position)
      .to(
        {
          y: ty,
          z: tz
        },
        500
      )
      .easing(TWEEN.Easing.Quadratic.Out)
      .start()
  })
}

// 加载基础
const loadBase = async (item: ObjectItem) => {
  const { type, url = '', name } = item
  const model = await loadModel({ key: type, url, name, size: 0 })
  const { position: POS, scale: SCA, rotation: ROT } = UTILS.get_P_S_R_param(model, item)
  // 缩放
  model.scale.set(...SCA)
  // 摆放位置
  model.position.set(...POS)
  // 转换方位
  model.rotation.set(...ROT)
  model._isBase_ = true
  scene.addDevice(model)
  return Promise.resolve(model)
}

// 循环加载对象
const loopLoadObject = async (item: ObjectItem) => {
  if (!item) return
  const { type, url } = item
  const obj = getModel(type)
  if (!obj) {
    // 地址存在 属于 base 底座
    if (!!url) {
      await loadBase(item)
    } else {
      // 点位
      if (type === props.dotKey) {
      }
    }
    return
  }

  const floorType = props.floorModelType || []
  const anchorType = props.anchorType || []

  // 深克隆
  let model = UTILS.deepClone(obj)
  const { position: POS, scale: SCA, rotation: ROT } = UTILS.get_P_S_R_param(model, item)
  const [x, y, z] = POS

  // 缩放
  model.scale.set(...SCA)

  // 摆放位置
  model.position.set(x, y, z)
  // 转换方位
  model.rotation.set(...ROT)
  model._isDevice_ = true
  model.data = item

  // 楼层
  if (floorType.includes(type)) {
    // 原始点位 备用
    model._position_ = { x, y, z }
    model._isFloor_ = true
  }

  // 锚点
  if (anchorType.includes(type)) {
    model._isAnchor_ = true
  }

  scene.addDevice(model)

  return Promise.resolve()
}

// 初始化设备列表
const initDevices = () => {
  let i = 0,
    len = deviceConfigs.value.length
  return new Promise(resolve => {
    if (len == 0) return resolve(null)
    const _loop = async () => {
      const item = deviceConfigs.value[i]
      await loopLoadObject(item)
      i++
      if (i < len) {
        _loop()
      } else {
        resolve(i)
      }
    }
    _loop()
  })
}

// 初始化设备配置
const deviceConfigs = ref<ObjectItem[]>([])
const initDeviceConfigs = () => {
  deviceConfigs.value.length = 0
  const list = toRaw(props.objects) || []

  if (typeof props.formatObject !== 'function') {
    deviceConfigs.value = list
    throw Error('未传入格式化函数 formatObject')
  } else {
    const data = props.formatObject(list)
    deviceConfigs.value = data
  }
}

// 组装场景
const assemblyScenario = async () => {
  // 加载进度 100
  progress.percentage = 100
  progress.show = false

  // 清除
  scene.clearDevice()

  await nextTick()
  initDeviceConfigs()
  await initDevices()

  if (typeof props.config?.load === 'function') {
    props.config?.load(scene)
  }

  // 楼层索引存在则执行楼层动画
  const floorIndex = props.config?.floorExpandIndex || -1
  const to = scene.getAnimTargetPos(props.config || {})
  const floors = scene.getFloor()
  if (floorIndex > -1 && floors.length) {
    floorAnimate(floorIndex)
    // 楼层展开是否改变视角
    if (!props.config?.floorExpandChangeViewAngle) {
      // 入场动画
      UTILS.cameraInSceneAnimate(scene.camera, to, scene.controls.target).then(() => {
        emits('loaded')
      })
    }
  } else {
    // 入场动画
    UTILS.cameraInSceneAnimate(scene.camera, to, scene.controls.target).then(() => {
      emits('loaded')
    })
  }
}

// 加载
const load = () => {
  loadModels(props.models, () => {
    console.log('加载完成')
    assemblyScenario()
  })
}

const initPage = () => {
  load()
  if (props.skyCode) {
    backgroundLoad(scene, props.skyCode)
  }
}

onMounted(() => {
  options.container = containerRef.value
  scene = new NewThreeScene(options, {
    onDblclick: object => {
      const data = object.data
      const index = scene.getFloor().findIndex(el => object.uuid === el.uuid)
      if (typeof data.onDblclick === 'function') {
        data.onDblclick(toRaw(data), object, index)
      }
      if (index > -1) {
        floorAnimate(index)
      }
    },
    onClickLeft(object) {
      console.log(object)
      emits('select', object)
    },
    onClickRight: _e => {
      if (typeof props.config?.back === 'function') {
        props.config.back(scene)
      } else {
        floorAnimate(-1)
      }
    }
  })
  scene.run()
  useResize(scene).resize()
  initPage()
})

defineExpose({
  floorAnimate
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
