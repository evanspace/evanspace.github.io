<template>
  <div :class="$style.page">
    <!-- 操作按钮 -->
    <div class="scene-operation">
      <div class="btn" @click="() => updateObject()">随机更新</div>
      <div class="btn" @click="() => Emitter.emit('SCENE:POS')">场景坐标</div>
      <div class="btn" @click="() => scene.exportImage()">截图</div>

      <div class="item" @click="() => Emitter.emit('CAMERA:ROAM')">全景漫游</div>
      <div class="item" @click="() => Emitter.emit('CAMERA:MACHINEROOM')">制冷机房</div>
      <div class="item" v-for="item in cameraPositionList" @click="onCameraTransition(item)">
        {{ item.name }}
      </div>

      <div class="item" @click="() => Emitter.emit('CAMERA:CRUISE')">定点巡航</div>
      <div class="item" @click="() => Emitter.emit('CAMERA:RESET')">视角重置</div>
      <div class="item" @click="() => Emitter.emit('CAMERA:FIRST')">第一人称</div>
      <div class="item" @click="() => Emitter.emit('CAMERA:THREE')">第三人称</div>

      <div class="item" @click="() => Emitter.emit('PERSON:ACTION')">人物动作</div>
      <div class="item" @click="() => Emitter.emit('PERSON:ADD')">人物加速</div>
      <div class="item" @click="() => Emitter.emit('PERSON:SUB')">人物减速</div>
    </div>

    <div :class="$style.container" ref="containerRef"></div>

    <t-first-person />

    <t-loading
      v-model="progress.show"
      :progress="progress.percentage"
      :bg-src="DEFAULTCONFIG.bgSrc"
    ></t-loading>

    <!-- // 提示 -->
    <div
      :class="$style.tip"
      v-if="tipOpts.show"
      :style="{
        left: tipOpts.style.left + 'px',
        top: tipOpts.style.top + 'px'
      }"
    >
      <div :class="$style.msg" v-html="tipOpts.msg"></div>
    </div>

    <!-- 弹窗 -->
    <div :class="$style.dialog" v-if="dialog.show" :style="dialog.style">
      <div :class="$style.wrap">
        <div>{{ dialog.title }}</div>
        <div :class="$style.content">
          <div :class="$style.item" v-for="item in dialog.list">
            <span>{{ item.name }}：</span>
            <span>{{ item.value }}{{ item.unit || '' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import tLoading from '@/components/loading/index.vue'
import tFirstPerson from './first-person.vue'
import {
  ANCHOR_POS,
  ANCHOR_TARGET,
  ROBOT,
  CRUISE_POINT_UP,
  CHARACTER,
  OPEN_DOOR,
  LIGHT_SWITCH,
  WATER_PUMP,
  getPageOpts,
  getTipOpts
} from './data'
import * as request from './request'
import Emitter from './emitter'

import DEFAULTCONFIG from './config'
import { StationThreeScene, dotUpdateObjectCall, getOffsetPoint } from './methods'
import { onListen } from './listen'
import { useResize } from '@/hooks/scene-resize'
import { useSky } from '@/hooks/sky'
import { Hooks, Utils } from 'three-scene'

import type { ObjectItem, ThreeModelItem } from 'three-scene/types/model'

const pageOpts = reactive(
  getPageOpts((pos, lookAt, cruiseCurve, t) => {
    if (robotObj) {
      // 前置视角前 0.02
      t = t + 0.02
      if (t > 1) t = t - 1
      pos = getOffsetPoint(cruiseCurve.getPointAt(t))
      const oft = 0.001
      let ts = t + oft
      if (ts > 1) ts = ts - 1
      lookAt = cruiseCurve.getPointAt(ts)

      robotObj.position.set(pos.x, CRUISE_POINT_UP, pos.z)
      // 求正切值
      const angle = Math.atan2(-lookAt.z + pos.z, lookAt.x - pos.x)
      robotObj.rotation.z = Math.PI * 0.5 + angle
    }
  })
)
const tipOpts = reactive(getTipOpts())

const { skys } = useSky()
const { backgroundLoad } = Hooks.useBackground(DEFAULTCONFIG.baseUrl + '/sky/', skys)
const { progress, loadModels, getModel, initModels } = Hooks.useModelLoader({
  baseUrl: DEFAULTCONFIG.baseUrl,
  indexDB: DEFAULTCONFIG.indexDB
})
const { options: dialog } = Hooks.useDialog()

const containerRef = ref()
const options: ConstructorParameters<typeof StationThreeScene>[0] = {
  baseUrl: DEFAULTCONFIG.baseUrl,
  env: pageOpts.env,
  cruise: pageOpts.cruise,
  controls: {
    enableDamping: true,
    dampingFactor: 0.48,
    maxPolarAngle: Math.PI * 0.48,
    // enablePan: false,
    screenSpacePanning: false,
    maxDistance: 800
  },
  render: {
    alpha: true,
    preserveDrawingBuffer: true
  },
  camera: {
    near: 0.1,
    fov: 52,
    position: [222.54, 150.82, 589.31]
  },
  directionalLight: {
    intensity: 2.2
  }
}
let scene: InstanceType<typeof StationThreeScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new StationThreeScene(options, {
    groundMeshName: [
      '行走地面',
      '平面125',
      '平面126',
      '平面127',
      '平面128',
      '平面129',
      '平面130',
      '楼梯',
      '机房地面',
      '地面005',
      '地面006',
      '立方体128',
      '立方体780_1',
      '11111',
      '22222'
    ],
    roamPoints: pageOpts.roamPoints,
    onDblclick: object => {
      if (object && object._isFloor_) {
        scene.floorExpand(object)
      } else {
        const names = scene.extend.dblclickModelName || []
        const name = object.name
        if (names.includes(name)) {
          // 查找点位信息
          const item = cameraPositionList.value.find(it => it.bind === name)
          if (item) {
            onCameraTransition(item)
          }
        }
      }
    },
    onClickLeft: (object, _intersct) => {
      dialog.select = []
      dialog.show = false
      if (object && object.data) {
        onClickLeft(object)
      }
    },
    onClickGround: (_object, intersct) => {
      scene.mouseClickGround(intersct)
    },
    onHoverAnchor: (object, style) => {
      const isShow = !!object && object.object._isAnchor_
      tipOpts.show = isShow
      if (isShow) {
        tipOpts.style.top = style.top
        tipOpts.style.left = style.left
        const data = object.object.data
        tipOpts.msg = `
          <p>${data.name}</p>
          <p>类型：${data.type}</p>
          <p>绑定：${data.bind || '无'}</p>
        `
      }
    },
    animateCall: () => {
      // 弹窗位置
      if (dialog.show && dialog.select && !!dialog.select.length) {
        // 设备弹窗信息
        const object = dialog.select[0]
        updateDialogPosition(object)
      }
    }
  })
  scene.run()

  useResize(scene).resize()
  initPage()
})

const onClickLeft = object => {
  const data = object.data
  switch (data?.type) {
    case ANCHOR_POS: // 定位
      scene.cameraTransition(object)
      break
    case ANCHOR_TARGET: // 锚点
      dialog.select = [object]
      dialogShowData()
      break
    case OPEN_DOOR: // 开门-90° 旋转开门
      scene.openTheDoor(object)
      break
    case LIGHT_SWITCH: // 开关灯
      scene.lightSwitch(object)
      break
  }
}

const initPage = () => {
  load()
  backgroundLoad(scene, pageOpts.skyCode)

  onListen(scene)
}

// 加载
const modelConfigList = ref<ObjectItem[]>([])
// 定位点位列表
const cameraPositionList = computed(() =>
  modelConfigList.value.filter(it => it.type === ANCHOR_POS)
)
const load = () => {
  loadModels(pageOpts.models, () => {
    request.getConfig().then(async res => {
      let json: any = {}
      if (res.ConfigJson instanceof Object) {
        json = res.ConfigJson
      } else if (typeof res.ConfigJson == 'string') {
        try {
          json = JSON.parse(res.ConfigJson)
        } catch (er) {}
      }
      modelConfigList.value = res.JsonList

      const names = cameraPositionList.value.filter(it => it.bind).map(it => it.bind || '')
      scene?.setDblclickModelName(names)

      pageOpts.cruise.points = json.cruise || []
      pageOpts.roamPoints = json.roamPoints || []
      Object.keys(json).forEach(key => {
        pageOpts.config && (pageOpts.config[key] = json[key])
      })
      await assemblyScenario()
      scene?.addWater('水流')
      createRoblt()
      createCharacter()
      updateObject()
    })
  })
}

// 组装场景
const assemblyScenario = async () => {
  // 清除
  scene.clearBuilding()

  await nextTick()
  await initModels(modelConfigList.value, loopLoadObject)

  // 漫游
  scene.setRoamPoint(pageOpts.roamPoints)
  // 巡航
  scene.setCruisePoint(pageOpts.cruise.points)

  const to = scene.getValidTargetPosition(pageOpts.config || {})
  scene.camera.position.set(to.x, to.y, to.z)
  // 加载进度 100
  progress.percentage = 100
  progress.show = false
  scene.controlSave()

  // 入场动画
  // Utils.cameraInSceneAnimate(scene.camera, to, scene.controls?.target).then(() => {
  //   scene.closeLightGroup()
  // })
}

// 循环加载对象
const loopLoadObject = async (item: ObjectItem) => {
  if (!item) return
  const { type } = item
  // 隐藏机位锚点
  if (type === ANCHOR_POS) return

  const obj = getModel(type)
  if (!obj) {
    // 点位
    if (type === pageOpts.dotKey) {
      createDotObject(item)
    }
    return
  }

  const { anchorType = [], animationModelType = [], floorModelType = [] } = pageOpts

  // 深克隆
  let model = Utils.modelDeepClone(obj)
  const { position: POS, scale: SCA, rotation: ROT } = Utils.get_P_S_R_param(model, item)
  const [x, y, z] = POS

  // 缩放
  model.scale.set(...SCA)

  // 摆放位置
  model.position.set(x, y, z)
  // 转换方位
  model.rotation.set(...ROT)

  model._isBuilding_ = true
  model.data = item

  // 动画
  if (animationModelType.includes(type)) {
    scene.addModelAnimate(model, obj.animations, type !== WATER_PUMP, 1)
  }

  // 记录备用坐标(更随标记)
  if (item.followMark || item.mark) {
    model._position_ = { x, y, z }
  }

  // 锚点
  if (anchorType.includes(type)) {
    model._isAnchor_ = true

    scene.addAnchor(model)
  }
  // 聚光灯
  else if (model.isSpotLight) {
    scene.addLight(item, model, true)
  }
  // 楼层
  else if (floorModelType.includes(type)) {
    // 原始点位 备用
    model._position_ = { x, y, z }
    model._isFloor_ = true
    scene.addFloor(model)
  }
  // 设备
  else if (type === WATER_PUMP) {
    model._isDevice_ = true
    model.name = item.name
    scene.addDevice(model)
  } else {
    scene.addBuilding(model)
  }

  return Promise.resolve()
}

// 更新点位隐现
const updateDotVisible = (target: ThreeModelItem) => {
  const item = target.data as ObjectItem
  if (typeof dotUpdateObjectCall === 'function') {
    const res = dotUpdateObjectCall(item, scene.buildingGroup)
    if (typeof res === 'object') {
      Object.keys(res).forEach(key => {
        item[key] = res[key]
      })
    }
  } else {
    console.warn(new Error('未传人点位更新对象回调方法 dotUpdateObjectCall'))
  }

  target.visible = item.show || !pageOpts.dotShowStrict
  const dom = target.element?.getElementsByClassName('inner')[0] as HTMLElement
  if (dom) {
    const { size, color } = item.font || {}
    if (size != void 0) {
      dom.style.fontSize = typeof size === 'string' ? size : size + 'px'
    }
    if (color != void 0) {
      dom.style.color = color
    }
    dom.textContent = `${item.value || 0}${item.unit}`
  }
}

// 创建 dot 点位
const createDotObject = item => {
  updateDotVisible(
    scene.addDot(item, (_e, label) => {
      dialog.select = [label]
      dialogShowData()
      scene.cameraLookatMoveTo(item.position).then(() => {})
    })
  )
}

// 更新 dialog 坐标
const updateDialogPosition = object => {
  const dom = containerRef.value
  const pos = Utils.getPlanePosition(dom, object, scene.camera as any)
  dialog.position = pos
  if (dialog.style) {
    dialog.style.left = pos.left + 'px'
    dialog.style.top = pos.top + 'px'
  }
  return pos
}

// 弹窗展示数据
const dialogShowData = () => {
  if (!dialog.select) return
  const object = dialog.select[0]
  const data = object.data
  dialog.data = data as Partial<ObjectItem>
  dialog.title = data?.name || ''
  const { x, y, z } = data?.position || {}
  dialog.list = [
    { name: '坐标', value: `${x},${y},${z}` },
    { name: data?.unit === 'Hz' ? '频率' : '用电', value: data?.value, unit: data?.unit }
  ]
  dialog.show = true
}

// 更新
const updateObject = () => {
  scene.getAll().forEach((el: any, _i) => {
    if (!el.data) return

    const data = el.data
    // 数据参数
    let type = data.type

    // 点位
    if (type === pageOpts.dotKey) {
      updateDotVisible(el)
      deviceUpdate(el.data)
      return
    }
  })
}

const deviceUpdate = data => {
  const { show, name } = data
  const model = scene.deviceGroup?.getObjectByName(name) as any
  if (model && model.__action__) {
    Object.keys(model.__action__).forEach(key => {
      const obj = model.__action__[key]
      const isRun = show
      if (isRun) {
        if (obj.isRunning()) {
          obj.paused = false
        } else {
          obj.play()
          obj.paused = false
        }
      } else {
        obj.paused = true
      }
    })
  }
  return
}

// 创建机器人
let robotObj: any
const createRoblt = () => {
  robotObj = getModel(ROBOT)
  robotObj.position.z = CRUISE_POINT_UP
  robotObj.rotation.z = Math.PI * 0.5
  scene.addObject(robotObj)
}

// 创建人物
const createCharacter = () => {
  const obj = getModel(CHARACTER)
  obj.traverse(el => {
    if (el.isMesh) {
      el.castShadow = true
    }
  })
  const move = {
    x: -65.8,
    y: -34.8,
    z: 22.3
  }
  // move.x = -1.6
  // move.y = 27.5
  // move.z = 127.8

  obj.scale.setScalar(2)

  scene.addCharacter(obj, move)
}

// 相机转场
const onCameraTransition = item => {
  scene.cameraTransition({
    position: item.position,
    data: item
  })
}
</script>

<style lang="scss" module>
@import './style.scss';
</style>
