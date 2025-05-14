<template>
  <div :class="$style.page">
    <!-- 操作按钮 -->
    <t-operation
      ref="operationRef"
      :list="cameraPositionList"
      :scene="scene"
      @change="onCameraTransition"
    ></t-operation>

    <div :class="$style.container" ref="containerRef"></div>

    <t-loading
      v-model="progress.show"
      :progress="progress.percentage"
      :bg-src="__CONFOG__.bgSrc"
    ></t-loading>

    <t-first-person />

    <t-tip-msg v-model="tipOpts.show" :style="tipOpts.style" :msg="tipOpts.msg"></t-tip-msg>

    <t-dialog v-model="dialog.show" :title="dialog.title" :style="dialog.style" :list="dialog.list">
    </t-dialog>
  </div>
</template>

<script lang="ts" setup>
import tLoading from '@/components/loading/index.vue'
import tOperation from './components/oprtation.vue'
import tFirstPerson from './components/first-person.vue'
import tTipMsg from './components/tip-msg.vue'
import tDialog from './components/dialog.vue'
import { Scene } from './class'
import { getPageOpts, getTipOpts } from './data'

import KEYS from './data/keys'
import __CONFOG__ from './data/config'
import { useResize } from '@/hooks/scene-resize'
import { useSky } from '@/hooks/sky'
import * as request from './data/request'
import * as MS from './data/methods'
import { onListen } from './data/listen'

import type { ObjectItem } from 'three-scene/types/model'

const { Hooks, Utils } = MS

const container = useTemplateRef('containerRef')
const operationRef = useTemplateRef('operationRef')

// 界面配置
const pageOpts = reactive(getPageOpts())
// 提示框配置
const tipOpts = reactive(getTipOpts())

const options: ConstructorParameters<typeof Scene>[0] = {
  baseUrl: __CONFOG__.baseUrl,
  cruise: pageOpts.cruise,
  env: __CONFOG__.env,
  render: {
    alpha: true
  },
  controls: {
    enableDamping: true,
    dampingFactor: 0.48,
    maxPolarAngle: Math.PI * 0.48,
    screenSpacePanning: false,
    maxDistance: 800
  },
  camera: {
    near: 1e-10,
    fov: 52,
    position: [-799.2, 55, 376.3]
  },
  ambientLight: {
    intensity: 2
  },
  directionalLight: {
    intensity: 1.5,
    // light2: false,
    position: [0, 7000, 2000],
    position2: [0, 7000, -2000],
    shadow: {
      mapSize: 512 * 4
    },
    shadowCamera: {
      boundary: 7000
    }
  }
}
let scene: InstanceType<typeof Scene>

const { skys } = useSky()
const { backgroundLoad } = Hooks.useBackground(__CONFOG__.baseUrl + '/sky/', skys)
const base = import.meta.env.VITE_OSS_BUCKET
const { progress, loadModels, getModel, initModels } = Hooks.useModelLoader({
  // baseUrl: __CONFOG__.baseUrl,
  baseUrl: base,
  indexDB: __CONFOG__.indexDB
})
const { options: dialog } = Hooks.useDialog()

// 模型配置列表
const modelConfigList = ref<ObjectItem[]>([])

// 定位点位列表
const cameraPositionList = computed(() =>
  modelConfigList.value.filter(it => it.type === KEYS.M_ANCHOR_POS)
)

// 初始化场景模型
const initSceneModel = () => {
  loadModels(pageOpts.models, () => {
    request.getConfig().then(res => {
      let json: any = {}
      if (res.ConfigJson instanceof Object) {
        json = res.ConfigJson
      } else if (typeof res.ConfigJson == 'string') {
        try {
          json = JSON.parse(res.ConfigJson)
        } catch (er) {}
      }
      modelConfigList.value = res.JsonList

      // 巡航点位
      pageOpts.cruise.points = json.cruise || []
      // 漫游点位
      pageOpts.roamPoints = json.roamPoints || []

      // 双击建筑名称
      const names = cameraPositionList.value.filter(it => it.bind).map(it => it.bind || '')
      scene?.setDblclickModelName(names)

      // 配置
      Object.keys(json).forEach(key => {
        pageOpts.config && (pageOpts.config[key] = json[key])
      })

      setTimeout(() => {
        loadScene()
      }, 100)
    })
  })
}

// 加载场景
const loadScene = async () => {
  //  组装场景
  await assemblyScenario()

  // 创建人物
  createPerson()

  operationRef.value?.update()
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
    x: -65.8,
    y: -34.8,
    z: 22.3
  }
  model.position.set(x, y, z)
  model.rotateY(Math.PI * 1)
  model.scale.setScalar(2)

  scene.addPerson(model)
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
  scene.setCruisePoint(pageOpts.cruise.points || [])

  const to = scene.getValidTargetPosition(pageOpts.config || {})
  scene.camera.position.set(to.x, to.y, to.z)
  // 加载进度 100
  progress.percentage = 100
  progress.show = false
  scene.controlSave()
}

// 创建 dot 点位
const createDotObject = item => {
  MS.updateDotVisible(
    scene,
    scene.addDot(item, (_e, label) => {
      dialog.select = [label]
      dialogShowData()
      scene.cameraLookatMoveTo(item.position)
    }),
    __CONFOG__.dotShowStrict
  )
}

// 循环加载对象
const loopLoadObject = async (item: ObjectItem) => {
  if (!item) return
  const { type } = item
  // 隐藏机位锚点
  if (type === KEYS.M_ANCHOR_POS) return

  const obj = getModel(type)
  if (!obj) {
    // 点位
    if (type === KEYS.DOT) {
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
    scene.addModelAnimate(model, obj.animations, type !== KEYS.M_WATER_PUMP, 1)
  }

  // 记录备用坐标(更随标记)
  if (item.followMark || item.mark) {
    model._position_ = { x, y, z }
  }

  // 锚点
  if (anchorType.includes(type)) {
    model._isAnchor_ = true

    scene.addAnchor(model, type !== KEYS.M_ANCHOR_TARGET)
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
  else if (type === KEYS.M_WATER_PUMP) {
    model._isDevice_ = true
    model.name = item.name
    scene.addDevice(model)
  } else {
    scene.addBuilding(model)
  }

  return Promise.resolve()
}

// 相机转场
const onCameraTransition = item => {
  scene.cameraTransition({
    position: item.position,
    data: item
  })
}

const initPage = () => {
  initSceneModel()
  backgroundLoad(scene, __CONFOG__.skyCode)

  onListen(scene)
}

// 鼠标悬浮
const onHoverCall = (object, style) => {
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

const onClickLeft = object => {
  const data = object.data
  switch (data?.type) {
    case KEYS.M_ANCHOR_POS: // 定位
      scene.cameraTransition(object)
      break
    case KEYS.M_ANCHOR_TARGET: // 锚点
      dialog.select = [object]
      dialogShowData()
      break
    case KEYS.S_OPEN_DOOR: // 开门-90° 旋转开门
      scene.oddRotateDoor(object)
      break
    case KEYS.S_LIGHT_SWITCH: // 开关灯
      scene.lightSwitch(object)
      break
  }
}

// 弹窗展示数据
const dialogShowData = () => {
  if (!dialog.select) return
  const object = dialog.select[0]
  const data = object.data || object.userData?.data

  dialog.data = data as Partial<ObjectItem>
  dialog.title = data?.name || ''
  const { x, y, z } = data?.position || {}
  dialog.list = [
    { name: '坐标', value: `${x},${y},${z}` },
    { name: data?.unit === 'Hz' ? '频率' : '用电', value: data?.value, unit: data?.unit }
  ]
  dialog.show = true
}

// 更新 dialog 坐标
const updateDialogPosition = object => {
  const dom = container.value as HTMLElement
  const pos = Utils.getPlanePosition(dom, object, scene.camera as any)
  dialog.position = pos
  if (dialog.style) {
    dialog.style.left = pos.left + 'px'
    dialog.style.top = pos.top + 'px'
  }
  return pos
}

onMounted(() => {
  options.container = container.value as HTMLElement
  scene = new Scene(options, {
    onHoverCall: onHoverCall,
    onClickLeft: (object, _intersct) => {
      dialog.select = []
      dialog.show = false
      if (object && object.data) {
        onClickLeft(object)
      }
    },
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
    animateCall: () => {
      // 弹窗位置
      if (dialog.show && dialog.select && !!dialog.select.length) {
        // 设备弹窗信息
        const object = dialog.select[0]
        updateDialogPosition(object)
      }
    },
    onClickGround: (_object, intersct) => {
      scene.personMove(intersct)
    }
  }).run()
  useResize(scene).resize()

  initPage()
})
</script>

<style lang="scss" module>
@use './style.scss';
</style>
