<template>
  <div :class="$style.page">
    <!-- 操作按钮 -->
    <div class="scene-operation">
      <div class="btn" @click="() => updateObject()">随机更新</div>
      <div class="btn" @click="() => Emitter.emit('SCENE:POS')">场景坐标</div>

      <div class="item" @click="() => Emitter.emit('CAMERA:ROAM')">全景漫游</div>
      <div class="item" v-for="item in cameraPositionList" @click="onCameraTransition(item)">
        {{ item.name }}
      </div>

      <div class="item" @click="() => Emitter.emit('CAMERA:CRUISE')">定点巡航</div>
      <div class="item" @click="() => Emitter.emit('CAMERA:RESET')">视角重置</div>

      <div class="item" @click="() => Emitter.emit('AIR:MAIN')">空调开关</div>

      <div class="item" @click="() => Emitter.emit('LIGHT:CLG')">灯组开关</div>
      <div class="item" @click="() => Emitter.emit('LIGHT:FIRSTFLOOR')">一楼开关</div>

      <div class="item" @click="() => Emitter.emit('CURTAIN:TOGGLE')">窗帘开关</div>
      <div class="item" @click="() => Emitter.emit('EFFECT:FLEETING')">流光开关</div>

      <div class="item" @click="() => Emitter.emit('SKY:DAY')">白天</div>
      <div class="item" @click="() => Emitter.emit('SKY:EVENING')">傍晚</div>
      <div class="item" @click="() => Emitter.emit('SKY:NIGHT')">夜间</div>

      <div
        class="item"
        @click="() => Emitter.emit('LIGHT:LCR', null, Math.floor(Math.random() * 5))"
      >
        大会议室灯
      </div>
      <div class="item" @click="() => Emitter.emit('CAMERA:FIRST')">第一人称</div>
      <div class="item" @click="() => Emitter.emit('CAMERA:THREE')">第三人称</div>
      <div class="item" @click="() => Emitter.emit('PERSON:ADD')">人物加速</div>
      <div class="item" @click="() => Emitter.emit('PERSON:SUB')">人物减速</div>

      <div class="item" @click="() => Emitter.emit('BIRD:COMPANY')">鸟瞰</div>
    </div>

    <div :class="$style.container" ref="containerRef"></div>

    <canvas :class="$style['canvas-texture']" ref="canvasTextureRef"></canvas>

    <t-first-person />

    <t-loading v-model="progress.show" :progress="progress.percentage"></t-loading>

    <!-- 楼层选择 -->
    <div :class="$style['floor-select']" v-show="floorOpts.show">
      <el-button
        v-for="item in floorItems"
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

    <t-dialog
      v-model="dialog.show"
      :title="dialog.title"
      v-model:content="dialog.content"
      :err-message="dialog.errMessage"
      @confirm="onConfirm"
    ></t-dialog>
  </div>
</template>

<script lang="ts" setup>
import tDialog from './edit-dialog.vue'
import tLoading from '@/components/loading/index.vue'
import tFirstPerson from './first-person.vue'

import {
  ROBOT,
  CURTAIN,
  CHARACTER,
  ANCHOR_POS,
  CRUISE_POINT_UP,
  WAIT_LIFT,
  LIGHT_SWITCH,
  LIGHT_MAIN_SWITCH,
  AIR_SWITCH,
  GATE_SWITCH,
  DOUBLE_HORIZONTAL_SWITCH,
  DOUBLE_ROTATE_SWITCH,
  ODD_ROTATE_SWITCH,
  CURTAIN_SWITCH,
  VIDEO_SWITCH,
  SCREEN_EDIT,
  MODE_SWITCH,
  getPageOpts,
  getTipOpts,
  getFloorOpts
} from './data'
import Emitter from './emitter'
import { OfficeThreeScene, dotUpdateObjectCall, getOffsetPoint } from './methods'
import { onListen } from './listen'
import * as request from './request'

import { useResize } from '@/hooks/scene-resize'
import { useDialog } from '@/hooks/dialog'
import * as ThreeScene from 'three-scene'

import type { ObjectItem, ThreeModelItem } from 'three-scene/types/model'
import { ElInput, ElMessageBox } from 'element-plus'
import { getStorage, setStorage } from '@/common/utils/storage'

const Utils = ThreeScene.Utils
const Hooks = ThreeScene.Hooks

const pageOpts = reactive(
  getPageOpts((pos, lookAt, cruiseCurve, t) => {
    if (!robotObj) return
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
  })
)
const floorOpts = reactive(getFloorOpts())
const tipOpts = reactive(getTipOpts())
const { progress, loadModels, getModel } = Hooks.useModelLoader({
  baseUrl: pageOpts.baseUrl,
  indexDB: {
    cache: true,
    dbName: 'THREE__OFFICE__DB',
    tbName: 'TB',
    version: 73
  }
})

const containerRef = ref()
const canvasTextureRef = ref()
const options: ConstructorParameters<typeof OfficeThreeScene>[0] = {
  // env: pageOpts.env,
  cruise: pageOpts.cruise,
  controls: {
    visible: !false,
    enableDamping: true,
    dampingFactor: 0.25,
    maxPolarAngle: Math.PI * 0.48,
    // enablePan: false,
    screenSpacePanning: false,
    maxDistance: 1500
  },
  camera: {
    near: 3,
    fov: 45
  },
  directionalLight: {
    intensity: 4,
    light2: false
  },
  ambientLight: {
    intensity: 0.01
  },
  axes: {
    visible: true,
    size: 1000
  }
}
let scene: InstanceType<typeof OfficeThreeScene>

// 电梯到达楼层
const floorItems = computed(() => {
  return floorOpts.list.find(it => it.target === floorOpts.targetName)?.items || []
})

// 大屏欢迎词弹窗
const welcomKey = 'welcom.key'
const { options: dialog } = useDialog({
  title: '编辑欢迎词',
  content: getStorage(welcomKey) || '中碳能源',
  errMessage: '请输入欢迎词！'
})

// 楼层移动至
const onFloorMoveTo = item => {
  floorOpts.active = item.key
  const liftName = item.bind

  scene.waitLift(
    {
      data: {
        bind: liftName,
        to: {
          y: item.y
        },
        target: floorOpts.targetName
      }
    },
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
  if (type === ANCHOR_POS) return
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
    scene.addModelAnimate(model, obj.animations, type !== CURTAIN, 1)
  }

  // 锚点
  if (anchorType.includes(type)) {
    model._isAnchor_ = true

    scene.addAnchor(model)
  }

  // 聚光灯 / 面光灯
  else if (model.isSpotLight || model.isRectAreaLight) {
    scene.addLight(item, model, false)
  } else {
    scene.addBuilding(model)
  }

  return Promise.resolve()
}

// 组装
const assemblyScenario = () => {
  return new Promise(async resolve => {
    // 清除
    scene.clearBuilding()

    await nextTick()
    await initDevices()

    // 漫游
    scene.setRoamPoint(pageOpts.roamPoints)

    // 巡航
    scene.setCruisePoint(pageOpts.cruise.points)

    const to = scene.getValidTargetPosition(pageOpts.config || {})

    // 入场动画
    // @ts-ignore
    Utils.cameraInSceneAnimate(scene.camera, to, scene.controls.target).then(() => {
      scene.controlSave()
      // 加载进度 100
      progress.percentage = 100
      progress.show = false

      nextTick(() => {
        Emitter.emit('LIGHT:CLOSE')
        resolve(1)
      })
    })
  })
}

// 加载场景
const loadScene = async res => {
  await assemblyScenario()
  createRoblt()
  createCharacter()
  // 绘制画布纹理
  Emitter.emit('SCREEN:WELCOM', dialog.content)
  scene.addVideoMaterial(res.JsonList.filter(it => it.type === VIDEO_SWITCH).map(it => it.bind))
  scene.addCanvasMaterial(res.JsonList.filter(it => it.type === SCREEN_EDIT).map(it => it.bind))
  scene.addAirWindMaterial(res.JsonList.filter(it => it.type === AIR_SWITCH).map(it => it.bind))
}

// 加载
const modelConfigList = ref<ObjectItem[]>([])
// 定位点位列表
const cameraPositionList = computed(() =>
  modelConfigList.value.filter(it => it.type === ANCHOR_POS)
)

const load = () => {
  loadModels(pageOpts.models, () => {
    request
      .getConfig()
      .then(res => {
        return request.getModes().then(list => {
          list.forEach((item, index) => {
            res.JsonList.push({
              ...item,
              type: MODE_SWITCH,
              position: { x: 19 - index * 0.6, y: 186.8, z: 49 }
            })
          })
          return res
        })
      })
      .then(res => {
        let json: any = {}
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
        pageOpts.cruise.points = json.cruise || []
        pageOpts.roamPoints = json.roamPoints || []

        setTimeout(() => {
          loadScene(res)
        }, 100)
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
    x: 14.4,
    y: 184.6,
    z: 37.6
  }
  obj.scale.setScalar(0.75)

  scene.addCharacter(obj, move)
}

const initPage = () => {
  load()

  onListen(scene)
}

const onDialogInput = () => {
  dialog.show = true
  return
  ElMessageBox({
    title: '编辑欢迎词',
    message: () => {
      return h(ElInput, {
        type: 'textarea',
        rows: 5,
        style: {
          width: '100%'
        },
        placeholder: '请输入欢迎词',
        maxlength: 24,
        showWordLimit: true,
        modelValue: dialog.title,
        'onUpdate:modelValue': v => {
          dialog.title = v
        }
      })
    },
    customClass: 'screen-welcom-dialog',
    beforeClose: (action, _instance, done) => {
      if (action === 'confirm') {
        if (!dialog.title) {
          ElMessage.warning({
            message: '请输入欢迎词！',
            grouping: true
          })
          return
        }
      }
      done()
    }
  }).then(action => {
    if (action == 'confirm') {
      setStorage(welcomKey, dialog.title || '')
      Emitter.emit('SCREEN:WELCOM', dialog.title)
    }
  })
}

const onConfirm = text => {
  dialog.content = text
  setStorage(welcomKey, dialog.content || '')
  Emitter.emit('SCREEN:WELCOM', dialog.content)
}

const onClickLeft = object => {
  const data = object.data
  switch (data?.type) {
    case ANCHOR_POS: // 定位
      scene.cameraTransition(object)
      break
    case WAIT_LIFT: // 等电梯
      floorOpts.targetName = object.data.target
      scene.waitLift(object)
      break
    case LIGHT_SWITCH: // 开关灯
      Emitter.emit('LIGHT:AUTO', object)
      break
    case LIGHT_MAIN_SWITCH: // 灯总开关
      object.__close__ = !object.__close__
      Emitter.emit('LIGHT:CLOSE', !object.__close__)
      break
    case GATE_SWITCH: // 闸机
      scene.openGate(object)
      break
    case DOUBLE_HORIZONTAL_SWITCH: // 双开横推门
      scene.dubleHorizontalDoor(object, 5.4)
      break
    case ODD_ROTATE_SWITCH: // 单旋转开门
      scene.oddRotateDoor(object)
      break
    case DOUBLE_ROTATE_SWITCH: // 双旋转开门
      scene.dubleRotateDoor(object)
      break
    case CURTAIN_SWITCH: // 窗帘动画
      Emitter.emit('CURTAIN:TOGGLE')
      break
    case VIDEO_SWITCH: // 视频播放
      scene.videoPlay(object)
      break
    case SCREEN_EDIT: // 大屏欢迎词编辑
      onDialogInput()
      break
    case AIR_SWITCH: // 空调
      Emitter.emit('AIR:ODD', object)
      break
    case MODE_SWITCH: // 模式
      console.log(toRaw(object.data))
      break
  }
}

onMounted(() => {
  options.container = containerRef.value
  const liftMeshNames = ['电梯地板002', '电梯地板']
  scene = new OfficeThreeScene(options, {
    canvas: canvasTextureRef.value,
    groundMeshName: [
      '地面002',
      '立方体306',
      '平面118',
      '立方体475',
      '立方体514',
      '立方体552',
      '地面020',
      '地面',
      '平面391',

      '立方体474',
      '立方体1617',
      'ground',
      ...liftMeshNames
    ],
    roamPoints: pageOpts.roamPoints,
    sky: pageOpts.sky,
    onClickLeft: (object, _intersct) => {
      if (object && object.data) {
        onClickLeft(object)
      }
    },
    onClickGround: (_object, intersct) => {
      scene
        .mouseClickGround(intersct, liftMeshNames)
        .then(_obj => {
          floorOpts.show = liftMeshNames.includes(intersct.object.name)
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
