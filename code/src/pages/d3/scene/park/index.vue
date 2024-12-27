<template>
  <div :class="$style.page">
    <!-- 操作按钮 -->
    <div class="scene-operation">
      <div class="btn" @click="() => updateObject(true)">随机更新</div>
      <div class="btn" @click="() => scene.toggleSight()">人物视角切换</div>
      <div class="btn" @click="() => scene?.toggleCruise()">定点巡航</div>
      <div class="btn" @click="() => scene?.getPosition()">场景坐标</div>
      <div class="btn" @click="() => changeBackground(scene as any)">切换背景</div>
      <div class="btn" @click="() => scene?.controlReset()">控制器重置</div>
      <div class="btn" @click="() => scene?.characterAccelerate()">人物加速</div>
      <div class="btn" @click="() => scene?.toggleCruiseDepthTest()">巡航深度</div>
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

    <div :class="$style.container" ref="containerRef"></div>

    <t-loading
      v-model="progress.show"
      :bg-color="pageOpts.bgColor"
      :progress="progress.percentage"
    ></t-loading>

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
  GROUND,
  VIDEOPLAY,
  OPEN_THE_DOOR,
  HALF_OPEN_THE_DOOR,
  DOUBLE_OPEN_THE_DOOR,
  WAIT_LIFT,
  SLIDING_DOOR,
  LIGHT_SWITCH,
  getPageOpts,
  getFloorOpts,
  getTipOpts
} from './data'
import {
  ParkThreeScene,
  dotUpdateObjectCall,
  updateObjectCall,
  changeModleStatusColor,
  executeCarRunging,
  getOffsetPoint
} from './methods'
import * as request from './request'

import { Hooks, Utils } from 'three-scene'
import { useResize } from '@/hooks/scene-resize'
import { colors } from './colors'

import type { ObjectItem, ThreeModelItem } from 'three-scene/src/types/model'

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

      robotObj.position.set(pos.x, 0.16, pos.z)
      // 求正切值
      const angle = Math.atan2(-lookAt.z + pos.z, lookAt.x - pos.x)
      robotObj.rotation.z = Math.PI * 0.5 + angle
    }
  })
)
const floorOpts = reactive(getFloorOpts())
const tipOpts = reactive(getTipOpts())
const containerRef = ref()
const COLORS = Utils.deepMerge(colors, pageOpts.colors)

const { changeBackground, backgroundLoad } = Hooks.useBackground()
const { progress, loadModels, getModel, virtualization, closeVirtualization } =
  Hooks.useModelLoader({
    baseUrl: pageOpts.baseUrl,
    // dracoPath: pageOpts.dracoUrl,
    colors: COLORS,
    colorMeshName: pageOpts.colorMeshName,
    indexDB: {
      cache: !true,
      dbName: 'THREE__PARK__DB',
      tbName: 'TB',
      version: 74
    }
  })

const options: ConstructorParameters<typeof ParkThreeScene>[0] = {
  env: '/oss/textures/hdr/3.hdr',
  controls: {
    maxDistance: 1500,
    maxPolarAngle: Math.PI * 0.45,
    screenSpacePanning: !false,
    enablePan: !false
  },
  camera: {
    position: [-85.7, 3.6, 208.6]
  },
  cruise: pageOpts.cruise,
  grid: {
    visible: !true
  },
  axes: {
    visible: true
  },
  directionalLight: {
    visible: true,
    intensity: 3
  }
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
    scene.addDot(item, e => {
      console.log(e)
    })
  )
}

// 循环加载对象
const loopLoadObject = async (item: ObjectItem) => {
  if (!item) return
  const { type, url } = item
  const obj = getModel(type)
  if (!obj) {
    // 地址存在 属于 base 底座
    if (!!url) {
      // await loadBase(item)
    } else {
      // 点位
      if (type === pageOpts.dotKey) {
        createDotObject(item)
      }
    }
    return
  }

  const { floorModelType = [], anchorType = [], carType = [], animationModelType = [] } = pageOpts

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

  // 汽车
  if (carType.includes(type)) {
    executeCarRunging(model)
  }

  // 动画
  if (animationModelType.includes(type)) {
    scene.addModelAnimate(model, obj.animations, true, 0.1)
  }

  // 楼层
  if (floorModelType.includes(type)) {
    // 原始点位 备用
    model._position_ = { x, y, z }
    model._isFloor_ = true
  }

  // 地面
  model.__ground__ = type === GROUND

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

// 组装场景
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

  const to = scene.getAnimTargetPos(pageOpts.config || {})
  // 入场动画
  // @ts-ignore
  Utils.cameraInSceneAnimate(scene.camera, to, scene.controls.target).then(() => {
    scene.controlSave()
  })
}

// 创建机器人
let robotObj: any
const createRoblt = () => {
  robotObj = getModel(ROBOT)
  robotObj.position.z = 0.16
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
    x: -80.6,
    y: 0.16,
    z: 193.4
  }

  // move.x = 98.4
  // move.z = -87
  scene.addCharacter(obj, move)
}

// 加载
const modelConfigList = ref<ObjectItem[]>([])
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
      scene.addVideoMaterial()
    })
  })
}

// 更新
const updateObject = isRandom => {
  const emitData: ObjectItem[] = []

  scene.getAll().forEach((el: any, _i) => {
    if (!el.data) return

    const data = el.data
    // 数据参数
    let type = data.type

    // 点位
    if (type === pageOpts.dotKey) {
      updateDotVisible(el)
      return
    }

    if (typeof updateObjectCall === 'function') {
      const res = updateObjectCall(data, isRandom)
      if (!res) return
      if (typeof res !== 'object') {
        console.warn(Error('更新回调函数返回对象不为 Object，当前类型：' + typeof res))
      }
      Object.keys(res).forEach(key => {
        data[key] = res[key]
      })
    }
    emitData.push(toRaw(data))

    let { status = 0, error = 0, remote = 0, local = 0, disabled = 0 } = data
    // 获取颜色
    const cKey = error > 0 ? 'error' : status > 0 ? 'runing' : 'normal'
    const cobj = COLORS[cKey]
    let color = cobj[type] != void 0 ? cobj[type] : cobj.color

    // if (typeof props.getColorCall === 'function') {
    //   const cr = props.getColorCall(data)
    //   if (cr) color = cr
    // }

    changeModleStatusColor({
      type,
      el,
      colorObj: cobj,
      color,
      paused: status == 0,
      error: error > 0,
      remote: remote > 0,
      local: local > 0,
      disabled: disabled > 0
    })
  })
}

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
    true
  )
}

const initPage = () => {
  load()
  backgroundLoad(scene, pageOpts.skyCode as any)
}

let scene: InstanceType<typeof ParkThreeScene>

onMounted(() => {
  options.container = containerRef.value

  const liftMeshName = '轿厢-ground'
  scene = new ParkThreeScene(options, {
    groundMeshName: ['地面', '楼板', 'mesh_0_4', 'ground', liftMeshName],
    onDblclick: object => {
      if (object.data?.type === 'building_commercial_5') {
        virtualization(
          scene.buildingGroup?.children.filter(el => !['地面', '场景'].includes(el.name)) || [],
          object,
          {
            wireframe: !false,
            opacity: 0.1
          }
        )
      } else {
        closeVirtualization(scene.buildingGroup?.children)
      }
    },
    onClickLeft(object, _intersct) {
      if (object && object.data) {
        const data = object.data
        switch (data?.type) {
          case VIDEOPLAY:
            scene.videoPlay(object)
            break
          case OPEN_THE_DOOR: // 开门
          case HALF_OPEN_THE_DOOR: // 半开门-90 度开门
            scene.openTheDoor(object, data.type === HALF_OPEN_THE_DOOR)
            break
          case DOUBLE_OPEN_THE_DOOR: // 双开门
            scene.openTheDoubleSlidingDoor(object)
            break
          case WAIT_LIFT: // 等电梯
            scene.waitLift(object)
            break
          case SLIDING_DOOR: // 推拉门
            scene.openTheSlidingDoor(object)
            break
          case LIGHT_SWITCH: // 开关灯
            scene.lightSwitch(object)
            break
        }
      }
    },
    onClickGround: (_object, intersct) => {
      scene.mouseClickGround(intersct).then(_obj => {
        floorOpts.show = intersct.object.name === liftMeshName
      })
    },
    onClickRight: e => {
      console.log(e)
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
