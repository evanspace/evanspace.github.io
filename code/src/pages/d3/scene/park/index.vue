<template>
  <div :class="$style.page">
    <!-- 操作按钮 -->
    <div class="scene-operation">
      <div class="btn" @click="() => updateObject(true)">随机更新</div>
      <!-- <div class="btn" v-if="cruise.visible" @click="() => scene?.toggleCruise()">定点巡航</div> -->
      <div class="btn" @click="() => scene?.getPosition()">场景坐标</div>
      <div class="btn" @click="() => changeBackground(scene)">切换背景</div>
      <div class="btn" @click="() => scene?.controlReset()">控制器重置</div>
      <!-- <div class="btn" v-if="cruise.visible" @click="() => scene?.toggleCruiseDepthTest()">巡航深度</div> -->
    </div>

    <div :class="$style.container" ref="containerRef"></div>

    <div
      class="loading"
      :class="$style.loading"
      :style="{ '--bg-color': pageOpts.bgColor ? String(pageOpts.bgColor) : '' }"
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
import { getPageOpts } from './data'
import {
  ParkThreeScene,
  dotUpdateObjectCall,
  updateObjectCall,
  changeModleStatusColor,
  executeCarRunging
} from './methods'
import * as request from './request'

import { useBackground } from '@/hooks/background'
import { useResize } from '@/hooks/scene-resize'
import { useModelLoader } from 'three-scene/hooks/model-loader'
import * as UTILS from 'three-scene/utils/model'
import { colors } from './colors'
// import DEFAULTCONFIG from 'three-scene/config'

import { deepMerge } from 'three-scene/utils/index'

import type { ObjectItem } from 'three-scene/types/model'

const pageOpts = reactive(getPageOpts())
const containerRef = ref()
const COLORS = deepMerge(colors, pageOpts.colors)

const { changeBackground, backgroundLoad } = useBackground()
const { progress, loadModels, getModel } = useModelLoader({
  baseUrl: pageOpts.baseUrl,
  // dracoPath: pageOpts.dracoUrl,
  colors: COLORS,
  colorMeshName: pageOpts.colorMeshName,
  indexDB: {
    cache: true,
    dbName: 'THREE__PARK__DB',
    tbName: 'TB',
    version: 5
  }
})

const options: ConstructorParameters<typeof ParkThreeScene>[0] = {
  controls: {
    screenSpacePanning: false,
    maxDistance: 5000,
    maxPolarAngle: Math.PI * 0.46
  },
  grid: {
    visible: !true
  },
  axes: {
    visible: true
  },
  directionalLight: {
    visible: true,
    intensity: 1.5
  }
}

// 更新点位隐现
const updateDotVisible = (target: ThreeModelItem) => {
  const item = target.data as ObjectItem
  if (typeof dotUpdateObjectCall === 'function') {
    const res = dotUpdateObjectCall(item, scene.deviceGroup)
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

  const { floorModelType = [], anchorType = [], carType = [] } = pageOpts

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

  // 骑车
  if (carType.includes(type)) {
    executeCarRunging(model)
  }

  // 楼层
  if (floorModelType.includes(type)) {
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

// 组装场景
const assemblyScenario = async () => {
  // 加载进度 100
  progress.percentage = 100
  progress.show = false

  // 清除
  scene.clearDevice()

  await nextTick()
  await initDevices()

  const to = scene.getAnimTargetPos(pageOpts.config || {})
  // 入场动画
  UTILS.cameraInSceneAnimate(scene.camera, to, scene.controls.target).then(() => {
    scene.controlSave()
  })
}

// 加载
const deviceConfigs = ref<ObjectItem[]>([])
const load = () => {
  loadModels(pageOpts.models, () => {
    request.getConfig().then(res => {
      console.log(res)
      let json = {}
      if (res.ConfigJson instanceof Object) {
        json = res.ConfigJson
      } else if (typeof res.ConfigJson == 'string') {
        try {
          json = JSON.parse(res.ConfigJson)
        } catch (er) {}
      }
      deviceConfigs.value = res.JsonList
      Object.keys(json).forEach(key => {
        pageOpts.config && (pageOpts.config[key] = json[key])
      })
      assemblyScenario()
    })
  })
}

// 更新
const updateObject = isRandom => {
  const emitData: ObjectItem[] = []

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

const initPage = () => {
  load()
  backgroundLoad(scene, pageOpts.skyCode)
}

let scene: InstanceType<typeof ParkThreeScene>

onMounted(() => {
  options.container = containerRef.value

  scene = new ParkThreeScene(options, {
    onDblclick: object => {
      console.log(object)
    },
    onClickLeft(object) {
      console.log(object)
    },
    onClickRight: e => {
      console.log(e)
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
