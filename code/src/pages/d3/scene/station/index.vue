<template>
  <div :class="$style.page">
    <div :class="$style.container" ref="containerRef"></div>

    <t-loading v-model="progress.show" :progress="progress.percentage"></t-loading>
  </div>
</template>

<script lang="ts" setup>
import tLoading from 'three-scene/components/loading/index.vue'
import { getPageOpts } from './data'
import * as request from './request'

import { StationThreeScene, dotUpdateObjectCall } from './methods'

import { useResize } from '@/hooks/scene-resize'
import { useBackground } from 'three-scene/hooks/background'
import { useModelLoader } from 'three-scene/hooks/model-loader'
import * as UTILS from 'three-scene/utils/model'

import type { ObjectItem, ThreeModelItem } from 'three-scene/types/model'

const pageOpts = reactive(getPageOpts())

const { changeBackground, backgroundLoad } = useBackground()
const { progress, loadModels, getModel } = useModelLoader({
  baseUrl: pageOpts.baseUrl,
  // colorMeshName: pageOpts.colorMeshName,
  indexDB: {
    cache: true,
    dbName: 'THREE__STATION__DB',
    tbName: 'TB',
    version: 1
  }
})

const containerRef = ref()
let options: ConstructorParameters<typeof StationThreeScene>[0] = {
  axes: {
    visible: true
  },
  grid: {
    visible: !true,
    fork: true,
    divisions: 20
  },
  controls: {
    enableDamping: true,
    dampingFactor: 0.1,
    maxPolarAngle: Math.PI * 0.45,
    // enablePan: false
    screenSpacePanning: false,
    maxDistance: 150
  }
}
let scene: InstanceType<typeof StationThreeScene>

onMounted(() => {
  options.container = containerRef.value
  scene = new StationThreeScene(options, {})
  scene.run()

  useResize(scene).resize()
  initPage()
})

const initPage = () => {
  load()
  backgroundLoad(scene, pageOpts.skyCode)
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
    })
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
  // scene.setCruisePoint(pageOpts.cruise.points)

  const to = scene.getAnimTargetPos(pageOpts.config || {})
  // 入场动画
  UTILS.cameraInSceneAnimate(scene.camera, to, scene.controls.target).then(() => {
    scene.controlSave()
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
    scene.addModelAnimate(model, obj.animations, true, 0.1)
  }

  // 锚点
  if (anchorType.includes(type)) {
    model._isAnchor_ = true

    scene.addAnchor(model)
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
    scene.addDot(item, e => {
      console.log(e)
    })
  )
}
</script>

<style lang="scss" module>
@import './style.scss';
</style>
