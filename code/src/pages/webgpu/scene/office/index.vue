<template>
  <div class="three-page" :class="$style.page">
    <!-- 操作按钮 -->
    <div class="scene-operation">
      <div class="btn" @click="() => Emitter.emit('SCENE:POS')">场景坐标</div>

      <div class="item" @click="() => Emitter.emit('CAMERA:RESET')">视角重置</div>

      <div class="item" @click="() => Emitter.emit('SKY:DAY')">白天</div>
      <div class="item" @click="() => Emitter.emit('SKY:EVENING')">傍晚</div>
      <div class="item" @click="() => Emitter.emit('SKY:NIGHT')">夜间</div>

      <div class="item" @click="() => Emitter.emit('CURTAIN:TOGGLE')">窗帘开关</div>
      <div class="item" @click="() => Emitter.emit('EFFECT:FLEETING')">流光开关</div>

      <div class="item" v-for="item in cameraPositionList" @click="onCameraTransition(item)">
        {{ item.name }}
      </div>
    </div>

    <div class="h-100" ref="containerRef"></div>

    <t-loading v-model="progress.show" :progress="progress.percentage"></t-loading>
  </div>
</template>

<script lang="ts" setup>
import tLoading from '@/components/loading/index.vue'
import { getPageOpts } from './data'
import KEYS from './keys'
import Emitter from './emitter'

import { OfficeScene } from './class'
import * as MS from './methods'
import { useResize } from '@/hooks/scene-resize'
import { onListen } from './listen'

import DEFAULTCONFIG from './config'
import * as request from './request'
import { ObjectItem } from 'three-scene/types/model'

const { Hooks, Utils } = MS

const pageOpts = reactive(getPageOpts())

const { progress, loadModels, initModels, getModel } = Hooks.useModelLoader({
  baseUrl: DEFAULTCONFIG.baseUrl,
  indexDB: DEFAULTCONFIG.indexDB
})

const containerRef = ref()
const options: ConstructorParameters<typeof OfficeScene>[0] = {
  controls: {
    visible: !false,
    enableDamping: true,
    dampingFactor: 0.25,
    maxPolarAngle: Math.PI * 0.48,
    screenSpacePanning: false,
    maxDistance: 1500
  },
  axes: {
    visible: true,
    size: 1000
  },
  camera: {
    near: 3,
    fov: 45
  },
  ambientLight: {
    intensity: 0.01
  },
  directionalLight: {
    intensity: 4,
    light2: false
  }
}
let scene: InstanceType<typeof OfficeScene>

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
    if (type === KEYS.S_ANCHOR_POS) return Promise.resolve()
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
      scene.addModelAnimate(model, obj.animations, type !== KEYS.S_CURTAIN, 1)
    }

    // 锚点
    if (anchorType.includes(type)) {
      model._isAnchor_ = true
      scene.addAnchor(model)
    }

    // 聚光灯 / 面光灯
    else if (model.isSpotLight || model.isRectAreaLight) {
      // scene.addLight(item, model, !false)
    } else {
      scene.addBuilding(model)
    }

    return Promise.resolve()
  })
}

// 场景组装
const assemblyScenario = () => {
  return new Promise(async resolve => {
    // 加载进度 100
    progress.percentage = 100
    progress.show = false

    await nextTick()
    await loadSceneModel()

    const to = scene.getValidTargetPosition(pageOpts.config || {})

    // 入场动画
    // @ts-ignore
    Utils.cameraInSceneAnimate(scene.camera, to, scene.controls.target).then(() => {
      scene.controlSave()
    })
  })
}

// 获取界面配置
const getPageOptions = () => {
  return request.getConfig().then(res => {
    return request.getModes().then(list => {
      list.forEach((item, index) => {
        res.JsonList.push({
          ...item,
          type: KEYS.S_MODE_SWITCH,
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
  modelConfigList.value.filter(it => it.type === KEYS.S_ANCHOR_POS)
)

// 加载
const load = () => {
  loadModels(pageOpts.models, () => {
    getPageOptions().then(async res => {
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
      await assemblyScenario()
    })
  })
}

const initPage = () => {
  load()

  onListen(scene)
}

onMounted(() => {
  options.container = containerRef.value
  scene = new OfficeScene(options, {}).run()

  useResize(scene).resize()

  initPage()
})
</script>

<style lang="scss" module>
@import './style.scss';
</style>
