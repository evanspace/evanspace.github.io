<template>
  <div :class="$style.page">
    <!-- 操作按钮 -->
    <div class="scene-operation">
      <div class="btn" @click="() => updateObject()">随机更新</div>
      <div class="btn" @click="() => scene?.getPosition()">场景坐标</div>
      <div class="btn" @click="() => changeBackground(scene)">切换背景</div>
    </div>

    <div :class="$style.container" ref="containerRef"></div>

    <t-loading v-model="progress.show" :progress="progress.percentage"></t-loading>

    <div :class="$style.camera">
      <div
        :class="$style.item"
        v-for="item in cameraPositionList"
        @click="onCameraTransition(item)"
      >
        {{ item.name }}
      </div>
      <div :class="$style.item" @click="() => scene?.toggleCruise()">定点巡航</div>
      <div :class="$style.item" @click="() => scene?.controlReset()">视角重置</div>
      <div :class="$style.item" @click="() => scene.toggleSight()">人物视角</div>
      <div :class="$style.item" @click="() => scene.characterAccelerate()">人物加速</div>
      <div :class="$style.item" @click="() => scene.characterAccelerate(-1)">人物减速</div>
    </div>

    <!-- 楼层选择 -->
    <div :class="$style['floor-select']" v-show="floorOpts.show">
      <el-button
        v-for="item in floorOpts.list"
        type="primary"
        :disabled="floorOpts.active === item.key"
        @click="onFloorMoveTo(item)"
        >{{ item.name }}</el-button
      >
    </div>

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
  </div>
</template>

<script lang="ts" setup>
import tLoading from 'three-scene/components/loading/index.vue'

import {
  ROBOT,
  CHARACTER,
  ANCHOR_POS,
  CRUISE_POINT_UP,
  WAIT_LIFT,
  LIGHT_SWITCH,
  GATE_TYPE,
  GATE_SWITCH,
  getPageOpts,
  getTipOpts,
  getFloorOpts
} from './data'
import { OfficeThreeScene, dotUpdateObjectCall, getOffsetPoint } from './methods'
import * as request from './request'

import { useResize } from '@/hooks/scene-resize'
import { useBackground } from 'three-scene/hooks/background'
import { useModelLoader } from 'three-scene/hooks/model-loader'
import * as UTILS from 'three-scene/utils/model'

import type { ObjectItem, ThreeModelItem } from 'three-scene/types/model'

const pageOpts = reactive(
  getPageOpts((pos, lookAt, cruiseCurve, t) => {
    if (!robotObj) return
    // 前置视角前 0.015
    t = t + 0.005
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
  })
)
const floorOpts = reactive(getFloorOpts())
const tipOpts = reactive(getTipOpts())
const { changeBackground, backgroundLoad } = useBackground()
const { progress, loadModels, getModel } = useModelLoader({
  baseUrl: pageOpts.baseUrl,
  indexDB: {
    cache: true,
    dbName: 'THREE__OFFICE__DB',
    tbName: 'TB',
    version: 15
  }
})

const containerRef = ref()
const options: ConstructorParameters<typeof OfficeThreeScene>[0] = {
  env: pageOpts.env,
  cruise: pageOpts.cruise,
  controls: {
    visible: !false,

    enableDamping: true,
    dampingFactor: 0.48,
    maxPolarAngle: Math.PI * 0.48,
    // enablePan: false
    screenSpacePanning: false,
    maxDistance: 800
  },
  camera: {
    // near: 1,
    // far: 500,
    // orthogonal: true,
    // position: [0, 150, 0]
  },
  directionalLight: {
    // intensity: 3
  },
  axes: {
    visible: true
  }
}
let scene: InstanceType<typeof OfficeThreeScene>

const liftGroupName = '单元1号电梯'

// 楼层移动至
const onFloorMoveTo = item => {
  floorOpts.active = item.key
  const liftName = '电梯门' + item.key
  scene.waitLift(
    {
      data: {
        bind: liftName,
        to: {
          y: item.y
        }
      }
    },
    liftGroupName,
    true
  )
}

// 相机转场
const onCameraTransition = item => {
  scene.cameraTransition({
    position: item.position,
    data: item
  })
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
    scene.addDot(item, _e => {
      scene.cameraLookatMoveTo(item.position)
    })
  )
}

// 更新
const updateObject = () => {
  scene.getAll().forEach((el, _i) => {
    if (!el.data) return

    const data = el.data
    // 数据参数
    let type = data.type

    // 点位
    if (type === pageOpts.dotKey) {
      updateDotVisible(el)
      return
    }
  })
}

// 初始化设备列表
const initDevices = () => {
  let i = 0,
    len = modelConfigList.value.length
  return new Promise(resolve => {
    if (len == 0) return resolve(null)
    const _loop = async () => {
      const item = modelConfigList.value[i]
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

// 循环加载对象
const loopLoadObject = async (item: ObjectItem) => {
  if (!item) return
  const { type } = item
  const obj = getModel(type)
  if (!obj) {
    // 点位
    if (type === pageOpts.dotKey) {
      createDotObject(item)
    }
    return
  }

  const { anchorType = [], animationModelType = [] } = pageOpts

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

  model._isBuilding_ = true
  model.data = item

  // 动画
  if (animationModelType.includes(type)) {
    scene.addModelAnimate(model, obj.animations, true, 1)
  }

  // 闸机类型
  if (type === GATE_TYPE) {
    model.name = item.name
  }

  // 锚点
  if (anchorType.includes(type)) {
    model._isAnchor_ = true

    scene.addAnchor(model)
  }

  // 聚光灯
  else if (model.isSpotLight) {
    scene.addLight(item, model, true)
  } else {
    scene.addBuilding(model)
  }

  return Promise.resolve()
}

// 组装
const assemblyScenario = async () => {
  // 加载进度 100
  progress.percentage = 100
  progress.show = false

  // 清除
  scene.clearBuilding()

  await nextTick()
  await initDevices()

  // 巡航
  scene.setCruisePoint(pageOpts.cruise.points)

  const to = scene.getValidTargetPosition(pageOpts.config || {})

  // 入场动画
  UTILS.cameraInSceneAnimate(scene.camera, to, scene.controls.target).then(() => {
    scene.controlSave()
  })
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
      let json = {}
      if (res.ConfigJson instanceof Object) {
        json = res.ConfigJson
      } else if (typeof res.ConfigJson == 'string') {
        try {
          json = JSON.parse(res.ConfigJson)
        } catch (er) {}
      }
      modelConfigList.value = res.JsonList
      Object.keys(json).forEach(key => {
        pageOpts.config && (pageOpts.config[key] = json[key])
      })
      await assemblyScenario()
      createRoblt()
      createCharacter()
    })
  })
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
    x: 0,
    y: 0,
    z: 0
  }
  obj.scale.setScalar(0.5)
  scene.addCharacter(obj, move)
}

const initPage = () => {
  load()
  backgroundLoad(scene, pageOpts.skyCode)
}

onMounted(() => {
  options.container = containerRef.value
  const liftMeshName = '轿厢-ground'
  scene = new OfficeThreeScene(options, {
    groundMeshName: ['ground', liftMeshName],
    onClickLeft: (object, _intersct) => {
      if (object && object.data) {
        const data = object.data
        switch (data?.type) {
          case ANCHOR_POS: // 定位
            scene.cameraTransition(object)
            break
          case WAIT_LIFT: // 等电梯
            scene.waitLift(object, liftGroupName)
            break
          case LIGHT_SWITCH: // 开关灯
            scene.lightSwitch(object)
            break
          case GATE_SWITCH: // 闸机
            scene.openGate(object)
            break
        }
      }
    },
    onClickGround: (_object, intersct) => {
      scene
        .mouseClickGround(intersct, liftMeshName)
        .then(_obj => {
          floorOpts.show = intersct.object.name === liftMeshName
        })
        .catch(() => {})
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
    }
  })

  scene.run()
  useResize(scene).resize()

  initPage()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
