<template>
  <div class="three-page" :class="$style.page">
    <!-- 操作按钮 -->
    <div class="scene-operation">
      <div class="btn" @click="() => Emitter.emit('SCENE:POS')">场景坐标</div>

      <div class="item" @click="() => Emitter.emit('CAMERA:ROAM')">全景漫游</div>

      <div class="item" v-for="item in cameraPositionList" @click="onCameraTransition(item)">
        {{ item.name }}
      </div>

      <div class="item" @click="() => Emitter.emit('CAMERA:CRUISE')">定点巡航</div>
      <div class="item" @click="() => Emitter.emit('CAMERA:RESET')">视角重置</div>

      <div class="item" @click="() => Emitter.emit('LIGHT:CLG')">灯组开关</div>
      <div class="item" @click="() => Emitter.emit('LIGHT:FIRSTFLOOR')">一楼灯开关</div>
      <div
        class="item"
        @click="() => Emitter.emit('LIGHT:LCR', null, Math.floor(Math.random() * 5))"
      >
        大会议室灯
      </div>

      <div class="item" @click="() => Emitter.emit('CURTAIN:TOGGLE')">窗帘开关</div>
      <div class="item" @click="() => Emitter.emit('EFFECT:FLEETING')">流光开关</div>

      <div class="item" @click="() => Emitter.emit('SKY:DAY')">白天</div>
      <div class="item" @click="() => Emitter.emit('SKY:EVENING')">傍晚</div>
      <div class="item" @click="() => Emitter.emit('SKY:NIGHT')">夜间</div>

      <div class="item" @click="() => Emitter.emit('AIR:MAIN')">空调开关</div>
      <div class="item" @click="() => Emitter.emit('AIR:WINDADD')">空调风速+</div>
      <div class="item" @click="() => Emitter.emit('AIR:WINDSUB')">空调风速-</div>

      <div class="item" @click="() => Emitter.emit('CAMERA:FIRST')">第一人称</div>
      <div class="item" @click="() => Emitter.emit('CAMERA:THREE')">第三人称</div>
      <div class="item" @click="() => Emitter.emit('PERSON:ADD')">人物加速</div>
      <div class="item" @click="() => Emitter.emit('PERSON:SUB')">人物减速</div>

      <div class="item" @click="() => Emitter.emit('BIRD:COMPANY')">鸟瞰</div>
    </div>

    <div class="h-100" ref="containerRef"></div>

    <t-loading
      v-model="progress.show"
      :progress="progress.percentage"
      :bg-src="DEFAULTCONFIG.bgSrc"
    ></t-loading>

    <t-tip-msg v-model="tipOpts.show" :style="tipOpts.style" :msg="tipOpts.msg"></t-tip-msg>

    <t-first-person />

    <canvas :class="$style['canvas-texture']" ref="canvasTextureRef"></canvas>

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

    <t-edit-dialog
      v-model="dialog.show"
      :title="dialog.title"
      v-model:content="dialog.content"
      :err-message="dialog.errMessage"
      @confirm="onEditDialogConfirm"
    ></t-edit-dialog>
  </div>
</template>

<script lang="ts" setup>
import tLoading from '@/components/loading/index.vue'
import tTipMsg from './tip-msg.vue'
import tEditDialog from './edit-dialog.vue'
import tFirstPerson from './first-person.vue'

import { getPageOpts, getTipOpts, getFloorOpts } from './data'
import KEYS from './keys'
import Emitter from './emitter'

import { OfficeScene } from './class'
import * as MS from './methods'
import { useResize } from '@/hooks/scene-resize'
import { onListen } from './listen'

import DEFAULTCONFIG from './config'
import * as request from './request'
import { ObjectItem } from 'three-scene/types/model'
import { useDialog } from '@/hooks/dialog'
import { getStorage, setStorage } from '@/common/utils/storage'
import { useAppStore } from '@/stores'

const { Hooks, Utils, THREE } = MS

const appStore = useAppStore()
// 存在则刷新
if (appStore.historyRoutes.includes('/webgpu/scene/office')) {
  window.location.reload()
}

// 界面配置
const pageOpts = reactive(getPageOpts())
// 提示框
const tipOpts = reactive(getTipOpts())
// 电梯楼层配置
const floorOpts = reactive(getFloorOpts())

// 大屏欢迎词弹窗
const welcomKey = 'welcom.key'
const { options: dialog } = useDialog({
  title: '编辑欢迎词',
  content: getStorage(welcomKey) || '中碳能源',
  errMessage: '请输入欢迎词！'
})

const { progress, loadModels, initModels, getModel } = Hooks.useModelLoader(
  {
    baseUrl: DEFAULTCONFIG.baseUrl,
    indexDB: DEFAULTCONFIG.indexDB
  },
  THREE
)

const canvasTextureRef = ref()
const containerRef = ref()
const options: ConstructorParameters<typeof OfficeScene>[0] = {
  cruise: pageOpts.cruise,
  baseUrl: DEFAULTCONFIG.baseUrl,
  render: {
    alpha: true
  },
  controls: {
    visible: !false,
    enableDamping: true,
    dampingFactor: 0.25,
    maxPolarAngle: Math.PI * 0.48,
    screenSpacePanning: false,
    maxDistance: 1500
  },
  camera: {
    near: 3,
    fov: 45,
    position: [-799.2, 55, 376.3]
  },
  ambientLight: {
    intensity: 0.01
  },
  directionalLight: {
    intensity: 4,
    light2: false,
    position: [2000, 7000, 2000],
    shadow: {
      mapSize: 512 * 4
    },
    shadowCamera: {
      boundary: 5000
    }
  }
}
let scene: InstanceType<typeof OfficeScene>

// 电梯到达楼层
const floorItems = computed(() => {
  return floorOpts.list.find(it => it.target === floorOpts.targetName)?.items || []
})

// 相机转场
const onCameraTransition = item => {
  scene.cameraTransition({
    position: item.position,
    data: item
  })
}

// 创建 dot 点位
const createDotObject = item => {
  MS.updateDotVisible(
    scene,
    scene.addDot(item, _e => {
      scene.cameraLookatMoveTo(item.position)
    }),
    false
  )
}

// 加载场景模型
const loadSceneModel = () => {
  initModels(modelConfigList.value, (item: ObjectItem) => {
    if (!item) return Promise.resolve()
    const { type } = item
    if (type === KEYS.M_ANCHOR_POS) return Promise.resolve()
    const obj = getModel(type)
    if (!obj) {
      // 点位
      if (type === KEYS.DOT) {
        createDotObject(item)
      }
      return Promise.resolve()
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
      scene.addModelAnimate(model, obj.animations, type !== KEYS.M_CURTAIN, 1)
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
  })
}

// 场景组装
const assemblyScenario = () => {
  return new Promise(async resolve => {
    await nextTick()
    await loadSceneModel()

    // 漫游
    scene.setRoamPoint(pageOpts.roamPoints)
    // 巡航
    scene.setCruisePoint(pageOpts.cruise?.points || [])

    const to = scene.getValidTargetPosition(pageOpts.config || {})
    scene.camera.position.set(to.x, to.y, to.z)
    scene.controlSave()
    Emitter.emit('LIGHT:CLOSE')
    // 加载进度 100
    progress.percentage = 100
    progress.show = false
    resolve(1)

    // 入场动画
    // Utils.cameraInSceneAnimate(scene.camera, to, scene.controls?.target).then(() => {
    // })
  })
}

// 获取界面配置
const getPageOptions = () => {
  return request.getConfig().then(res => {
    return request.getModes().then(list => {
      list.forEach((item, index) => {
        res.JsonList.push({
          ...item,
          type: KEYS.M_MODE_SWITCH,
          position: { x: 19 - index * 0.6, y: 186.8, z: 49 }
        })
      })
      return res
    })
  })
}

const modelConfigList = ref<ObjectItem[]>([])
// 定位点位列表
const cameraPositionList = computed(() =>
  modelConfigList.value.filter(it => it.type === KEYS.M_ANCHOR_POS)
)

// 加载场景
const loadScene = async res => {
  //  组装场景
  await assemblyScenario()

  // 创建人物
  createPerson()
  // 绘制画布纹理
  Emitter.emit('SCREEN:WELCOM', dialog.content)
  // 添加视频材质
  scene.addVideoMaterial(
    res.JsonList.filter(it => it.type === KEYS.M_VIDEO_SWITCH).map(it => it.bind)
  )
  // 添加画布纹理
  scene.addCanvasMaterial(
    res.JsonList.filter(it => it.type === KEYS.M_SCREEN_EDIT).map(it => it.bind)
  )
  // 添加空调材质
  scene.addAirWindMaterial(
    res.JsonList.filter(it => it.type === KEYS.M_AIR_SWITCH).map(it => it.bind)
  )
}

// 加载
const load = () => {
  loadModels(pageOpts.models, () => {
    getPageOptions().then(res => {
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

// 创建人物
const createPerson = () => {
  const model = getModel(KEYS.M_PERSON)
  model.traverse(el => {
    if (el.isMesh) {
      el.castShadow = true
    }
  })
  const { x, y, z } = {
    x: 14.4,
    y: 184.6,
    z: 37.6
  }
  model.position.set(x, y, z)
  model.rotateY(Math.PI * 1)
  model.scale.setScalar(2)

  scene.addPerson(model)
}

// 楼层移动至
const onFloorMoveTo = item => {
  floorOpts.active = item.key
  const liftName = item.bind
  console.log(item)

  const opts = {
    data: {
      bind: liftName,
      to: { y: item.y },
      target: floorOpts.targetName
    }
  }
  scene?.waitLift(opts, true)
}

// 初始化界面
const initPage = () => {
  load()

  onListen(scene)
}

// 编辑弹窗确认
const onEditDialogConfirm = text => {
  dialog.content = text
  setStorage(welcomKey, dialog.content || '')
  Emitter.emit('SCREEN:WELCOM', dialog.content)
}

const onClickLeft = object => {
  const data = object.data
  switch (data?.type) {
    case KEYS.M_ANCHOR_POS: // 定位
      scene.cameraTransition(object)
      break
    case KEYS.M_WAIT_LIFT: // 等电梯
      floorOpts.targetName = object.data.target
      scene.waitLift(object)
      break
    case KEYS.M_LIGHT_SWITCH: // 开关灯
      Emitter.emit('LIGHT:AUTO', object)
      break
    case KEYS.M_LIGHT_MAIN_SWITCH: // 灯总开关
      object.__close__ = !object.__close__
      Emitter.emit('LIGHT:CLOSE', !object.__close__)
      break
    case KEYS.M_GATE_SWITCH: // 闸机
      scene.openGate(object)
      break
    case KEYS.M_DOUBLE_HORIZONTAL_SWITCH: // 双开横推门
      scene.dubleHorizontalDoor(object, 5.4)
      break
    case KEYS.M_ODD_ROTATE_SWITCH: // 单旋转开门
      scene.oddRotateDoor(object)
      break
    case KEYS.M_DOUBLE_ROTATE_SWITCH: // 双旋转开门
      scene.dubleRotateDoor(object)
      break
    case KEYS.M_CURTAIN_SWITCH: // 窗帘动画
      Emitter.emit('CURTAIN:TOGGLE')
      break
    case KEYS.M_VIDEO_SWITCH: // 视频播放
      scene.videoPlay(object)
      break
    case KEYS.M_SCREEN_EDIT: // 大屏欢迎词编辑
      dialog.show = true
      break
    case KEYS.M_AIR_SWITCH: // 空调
      Emitter.emit('AIR:ODD', object)
      break
    case KEYS.M_MODE_SWITCH: // 模式
      console.log(toRaw(object.data))
      break
  }
}

onMounted(() => {
  options.container = containerRef.value
  scene = new OfficeScene(options, {
    canvas: canvasTextureRef.value,
    // 悬浮提示
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

    // 点击左键
    onClickLeft: (object, _intersct) => {
      if (object && object.data) {
        onClickLeft(object)
      }
    },

    // 点击地面
    onClickGround: (_object, intersct) => {
      scene
        .personMove(intersct)
        .then(_obj => {
          floorOpts.show = DEFAULTCONFIG.liftGroundMeshName.includes(intersct.object.name)
        })
        .catch(() => {})
    }
  }).run()

  useResize(scene).resize()

  initPage()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
