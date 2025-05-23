<template>
  <div :class="$style['device-scene']">
    <!-- 操作按钮 -->
    <div class="scene-operation">
      <div class="btn" @click="() => updateObject(true)">随机更新</div>
      <div class="btn" v-if="cruise.visible" @click="() => scene?.toggleCruise()">定点巡航</div>
      <div class="btn" @click="() => scene?.getPosition()">场景坐标</div>
      <div class="btn" @click="() => changeBackground(scene)">切换背景</div>
      <div class="btn" @click="() => scene?.controlReset()">控制器重置</div>
      <div class="btn" v-if="cruise.visible" @click="() => scene?.toggleCruiseDepthTest()">
        巡航深度
      </div>
    </div>

    <div :class="$style.container" ref="containerRef"></div>

    <t-loading v-model="progress.show" :progress="progress.percentage"></t-loading>

    <!-- 设备信息弹窗 -->
    <div :class="$style.dialog" v-if="dialog.show" :style="dialog.style">
      <slot
        name="dialog"
        :data="dialog.data"
        :title="dialog.title"
        :position="dialog.position"
      ></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import tLoading from '../loading/index.vue'
import { ref, watch, toRaw, onMounted, withDefaults, nextTick } from 'vue'
import * as THREE from 'three'

import { DeviceThreeScene } from './methods'
import { useSky } from '@/hooks/sky'
import { colors } from './colors'
import { Utils, Hooks } from 'three-scene'

import DEFAULTCONFIG from './config'

import type { ObjectItem, ThreeModelItem } from 'three-scene/types/model'

const props = withDefaults(defineProps<import('./index').Props>(), {
  dracoUrl: '',
  // draco 解压文件目录
  dracoPath: '/three/draco/gltf/',
  // basis 解压文件目录
  basisPath: '/three/basis/',
  dotKey: 'DOT',
  dotShowStrict: true,
  colors: () => ({}),
  camera: () => ({}),
  cruise: () => ({}),
  fog: () => ({}),
  render: () => ({}),
  controls: () => ({}),
  grid: () => ({}),
  axes: () => ({}),
  directionalLight: () => ({}),
  colorMeshName: () => [],
  anchorType: () => [],
  mainBodyMeshName: () => ['主体'],
  mainBodyExcludeType: () => ['FM'],
  colorModelType: () => ['FM'],
  indexDB: () => ({
    cache: true
  })
})

defineOptions({
  name: 'device-scene'
})

// 加载完成、更新、选择 anchorType 类型的模块、双击模型、点击 DOT 类型点位, 点击弹窗点位
const emits = defineEmits<{
  init: [scene: InstanceType<typeof DeviceThreeScene>]
  loaded: []
  update: [list: ObjectItem[], isRandom?: boolean]
  select: [item: ObjectItem]
  dblclick: [item: ObjectItem]
  'click-dot': [item: ObjectItem, e: PointerEvent]
  'click-dialog-dot': [item: ObjectItem, pos: { left: number; top: number }]
}>()

const COLORS = Utils.deepMerge(colors, props.colors)

const { changeBackground, backgroundLoad } = Hooks.useBackground(
  props.baseUrl + '/sky/',
  useSky().skys
)
const { progress, MODEL_MAP, loadModel, loadModels, getModel } = Hooks.useModelLoader({
  baseUrl: props.baseUrl,
  dracoPath: props.dracoPath,
  basisPath: props.basisPath,
  colors: COLORS,
  colorMeshName: props.colorMeshName,
  indexDB: props.indexDB
})
const { dialog } = Hooks.useDialog()

const containerRef = ref()

const options: ConstructorParameters<typeof DeviceThreeScene>[0] = {
  baseUrl: props.baseUrl,
  bgUrl: props.bgUrl,
  env: props.env,
  bgColor: props.bgColor,
  camera: props.camera,
  cruise: props.cruise,
  fog: props.fog,
  render: props.render,
  grid: props.grid,
  controls: props.controls,
  axes: props.axes,
  ambientLight: props.ambientLight,
  directionalLight: props.directionalLight
}

let scene: InstanceType<typeof DeviceThreeScene>

// 点位模式
watch(
  () => props.dotShowStrict,
  () => toggleDotVisible()
)

// 缩放
watch(
  () => props.scale,
  v => {
    scene?.setScale(v || 1)
  }
)

// 巡航
watch(
  () => props.cruise.points,
  v => {
    if (progress.isEnd) scene.setCruisePoint(v || [])
  }
)

// 对象列表
watch(
  () => props.objects,
  () => {
    if (progress.isEnd) assemblyScenario()
  }
)

// 点位隐现方式切换
const toggleDotVisible = () => {
  const list = scene.dotGroup?.children || []
  for (let i = 0; i < list.length; i++) {
    const el = list[i] as ThreeModelItem
    if (!el.data) continue
    const data = el.data
    // 数据参数
    let type = data.type
    // 点位
    if (type === props.dotKey) {
      updateDotVisible(el)
    }
  }
}

// 管路初始化
const initPipe = () => {
  if (!props.pipes || props.pipes.length == 0) return

  const list = props.pipes
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    const { type, map } = item
    const obj = getModel(type)
    if (!obj) continue
    // 深克隆
    let model = Utils.modelDeepClone(obj)
    const mapMeshName = obj._mapMeshName_
    const { position: POS, scale: SCA, rotation: ROT } = Utils.get_P_S_R_param(model, item)
    const [x, y, z] = POS

    const mesh = Utils.findObjectsByHasProperty(model.children, [mapMeshName])
    if (mesh.length) {
      mesh.forEach(el => {
        el.material.map = el.material.map.clone()
        if (map) {
          const repeat = el.material.map.repeat
          // 纹理对象阵列
          el.material.map.repeat.set(repeat.x * (map[0] ?? 1), repeat.y * (map[1] ?? 1))
        }
      })
      model[DEFAULTCONFIG.meshKey.pipe] = mesh
    }

    // 缩放
    model.scale.set(...SCA)
    // 摆放位置
    model.position.set(x, y, z)
    // 转换方位
    model.rotation.set(...ROT)

    model._isPipe_ = true
    model.data = item
    scene.addPipe(model)
  }
}

// 加载基础
const loadBase = async (item: ObjectItem) => {
  const { type, url = '', name } = item
  const model = await loadModel({ key: type, url, name, size: 0 })
  const { position: POS, scale: SCA, rotation: ROT } = Utils.get_P_S_R_param(model, item)
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

// 更新点位隐现
const updateDotVisible = (target: ThreeModelItem) => {
  const item = target.data
  if (!item || !scene.deviceGroup) return
  if (typeof props.dotUpdateObjectCall === 'function') {
    const res = props.dotUpdateObjectCall(item, scene.deviceGroup.children) as any
    if (typeof res === 'object') {
      Object.keys(res).forEach(key => {
        item[key] = res[key]
      })
    }
  } else {
    console.warn(Error('未传人点位更新对象回调方法 dotUpdateObjectCall'))
  }

  target.visible = item.show || !props.dotShowStrict
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
const createDotObject = (item: ObjectItem) => {
  updateDotVisible(
    scene.addDot(item, e => {
      emits('click-dot', toRaw(item), e as PointerEvent)
    })
  )
}

// 创建状态标识
const createStatusMark = (model: ThreeModelItem, item: ObjectItem) => {
  // 警告标识
  const warnStatusModel = getModel(MODEL_MAP.warning)
  if (!!warnStatusModel) {
    const key = DEFAULTCONFIG.meshKey.warning
    const {
      group: wg,
      action,
      mixer
    }: any = Utils.createWarning(key, item, warnStatusModel, props.statusOffset?.WARNING)
    model.add(wg)
    model[key] = { action, mixer }
  }

  // 就地标识
  const localStatusModel = getModel(MODEL_MAP.local)
  if (!!localStatusModel) {
    const key = DEFAULTCONFIG.meshKey.local
    const localModel = Utils.createStatusMark(item, localStatusModel, props.statusOffset?.STATUS)
    model.add(localModel)
    model[key] = localModel
  }

  // 禁用标识
  const disabledStatusModel = getModel(MODEL_MAP.disabled)
  if (!!disabledStatusModel) {
    const key = DEFAULTCONFIG.meshKey.disabled
    const disabledModel = Utils.createStatusMark(
      item,
      disabledStatusModel,
      props.statusOffset?.DISABLED,
      true
    )
    model.add(disabledModel)
    model[key] = disabledModel
  }
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
        createDotObject(item)
      }
    }
    return
  }

  const anchorType = props.anchorType || []

  // 深克隆
  let model = Utils.modelDeepClone(obj)
  const { position: POS, scale: SCA, rotation: ROT } = Utils.get_P_S_R_param(model, item)
  const [x, y, z] = POS

  // 缩放
  model.scale.set(...SCA)

  // 动画类型
  const animationModelType = props.animationModelType || []
  // 颜色网格
  const colorMeshName = props.colorMeshName || []
  // 主体排除类型
  const mainBodyExcludeType = props.mainBodyExcludeType || []
  // 绘制文字类型
  const textModelType = props.textModelType || []

  const fontParser = getModel(MODEL_MAP.font)
  // 是否需要绘制文字
  if (textModelType.includes(type) && !!fontParser) {
    const group = new THREE.Group()
    group.add(model)
    const text = Utils.createText(item, fontParser, COLORS.normal.text, props.statusOffset?.TEXT)
    group.add(text)
    group.name = item.name
    model = group
  }

  // 动画
  if (animationModelType.includes(type)) {
    if (model.type !== 'Group') {
      const group = new THREE.Group()
      group.add(model)
      group.name = model.name
      model = group
    }

    // 创建状态标识
    createStatusMark(model, item)

    // 主体网格
    if (props.mainBodyChangeColor && !mainBodyExcludeType.includes(type)) {
      const mesh = Utils.findObjectsByHasProperty(model.children, props.mainBodyMeshName)
      const cobj = COLORS.normal
      let color = cobj.main != void 0 ? cobj.main : cobj.color
      let colrs = Utils.getColorArr(color)
      if (colrs.length) {
        mesh.forEach((e, i) => {
          Utils.setMaterialColor(e, colrs[i % colrs.length])
        })
      }
      model[DEFAULTCONFIG.meshKey.body] = mesh
    }

    // 升起动画
    // model.position.y = y - 30
    // Utils.deviceAnimate( model, { y } )
    const meshs = Utils.findObjectsByHasProperty(model.children, colorMeshName)
    // 叶轮动画
    let mixer = new THREE.AnimationMixer(model)
    let action
    if (obj.animations.length) {
      action = mixer.clipAction(obj.animations[0])
      // 暂停
      action.paused = true
      // 动画速度
      action.timeScale = 1.5
      // 播放
      action.play()
    }
    // 记录数据
    model.extra = { action, mixer, meshs }
  } else {
    const meshs: any[] = []
    model.traverse((el: ThreeModelItem) => {
      if (typeof el.name == 'string' && colorMeshName.some(t => el.name.indexOf(t) > -1)) {
        meshs.push(el)
      }
    })
    if (meshs.length) {
      // 记录数据
      model[DEFAULTCONFIG.meshKey.color] = meshs
    }
  }

  // 摆放位置
  model.position.set(x, y, z)
  // 转换方位
  model.rotation.set(...ROT)

  model._isDevice_ = true
  model.data = item

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
    console.warn(Error('未传入格式化函数 formatObject'))
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

  // 管路初始化
  initPipe()

  // 巡航
  scene.setCruisePoint(props.cruise?.points || [])

  if (typeof props.config?.load === 'function') {
    props.config?.load(scene)
  }

  const to = scene.getAnimTargetPos(props.config || {})
  if (!scene.controls || !to) return
  // 入场动画
  Utils.cameraInSceneAnimate(scene.camera, to, scene.controls.target).then(() => {
    emits('loaded')
    scene.controlSave()
  })
}

// 加载
const load = () => {
  loadModels(props.models, () => {
    assemblyScenario()
  })
}

const initPage = () => {
  load()
  if (props.skyCode) {
    backgroundLoad(scene, props.skyCode)
  }
}

// 弹窗展示数据
const dialogShowData = () => {
  if (!dialog.select || !dialog.select.length) return
  const object = dialog.select[0] as ThreeModelItem
  const data = object.data
  dialog.data = data as Partial<ObjectItem>
  dialog.title = data?.name || ''
  dialog.show = true

  const pos = updateDialogPosition(object)
  emits('click-dialog-dot', data as ObjectItem, pos)
}

// 更新 dialog 坐标
const updateDialogPosition = (object: ThreeModelItem) => {
  const dom = containerRef.value
  const pos = Utils.getPlanePosition(dom, object, scene.camera)
  dialog.position = pos
  if (dialog.style) {
    dialog.style.left = pos.left + 'px'
    dialog.style.top = pos.top + 'px'
  }
  return pos
}

// 更新
const updateObject = (isRandom: boolean) => {
  const emitData: ObjectItem[] = []

  if (typeof props.updateObjectCall !== 'function') {
    console.warn(Error('未传入更新回调函数 updateObjectCall'))
  }

  scene.getAll().forEach((el: ThreeModelItem, _i) => {
    if (!el.data) return

    const data = el.data
    // 数据参数
    let type = data.type

    // 点位
    if (type === props.dotKey) {
      updateDotVisible(el)
      return
    }

    if (typeof props.updateObjectCall === 'function') {
      const res = props.updateObjectCall(data, isRandom) as any
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

    if (typeof props.getColorCall === 'function') {
      const cr = props.getColorCall(data)
      if (cr) color = cr
    }

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
  emits('update', emitData, isRandom)
}

// 修改模型部件状态及颜色 (类型、模型、颜色对象、颜色、动画暂停状态、故障状态)
const changeModleStatusColor = (opts: import('./index').ChangeMaterialOpts) => {
  let { el, type, colorObj: cobj, color, paused, error } = opts
  let colors = Utils.getColorArr(color)
  color = colors[0]

  const meshKey = DEFAULTCONFIG.meshKey

  const colorModelType = props.colorModelType
  if (colorModelType.includes(type) && color != void 0) {
    const meshs = el[meshKey.color] || []
    meshs.forEach((e: ThreeModelItem) => {
      Utils.setMaterialColor(e, color)
    })
    return
  }

  if (!(props.animationModelType || []).includes(type)) {
    return
  }
  // 文字
  if (props.textChangeColor) {
    const color = cobj.text != void 0 ? cobj.text : cobj.color
    const group = el.getObjectByProperty('_isText_', true)
    let colors = Utils.getColorArr(color)
    Utils.setMaterialColor(group, colors[0])
  }

  // 场景
  // 扩展数据
  const extra = el.extra
  // 状态运行则运动
  if (!!extra) {
    // 暂停状态
    !!extra.action && (extra.action.paused = paused)
    if (color != void 0) {
      const meshs = extra.meshs || []
      meshs.forEach((e: any) => {
        Utils.setMaterialColor(e, color)
      })
    }
  }

  // 主体变色
  if (props.mainBodyChangeColor && el[meshKey.body]) {
    const color = cobj.main != void 0 ? cobj.main : cobj.color
    let colors = Utils.getColorArr(color)
    if (colors.length) {
      el[meshKey.body].forEach((e: any, i: number) => {
        Utils.setMaterialColor(e, colors[i % colors.length])
      })
    }
  }

  const warning = el[meshKey.warning]
  // 警告状态
  if (!!warning) {
    // 警告组合
    const warnGroup = el.children.find((it: ThreeModelItem) => it.name == meshKey.warning)
    if (!!warnGroup) {
      warnGroup.visible = error
      // 暂停状态
      warning.action.paused = !error
    }
  }

  // 就地
  if (!!el[meshKey.local]) {
    el[meshKey.local].visible = opts.local
  }

  // 禁用
  if (!!el[meshKey.disabled]) {
    el[meshKey.disabled].visible = opts.disabled
  }
}

onMounted(() => {
  options.container = containerRef.value

  scene = new DeviceThreeScene(options, {
    onDblclick(object) {
      const data = object.data
      if (typeof data.onDblclick === 'function') {
        data.onDblclick(toRaw(data), object)
      } else {
        emits('dblclick', toRaw(data))
      }
    },
    onClickLeft(object) {
      if (object) {
        const data = object.data
        const backData = toRaw(data)
        emits('select', backData)
        // 点位点击事件
        if (typeof data.onClick === 'function') {
          dialog.show = false
          data.onClick(backData)
        } else {
          dialog.select = [object]
          dialogShowData()
        }
      } else {
        dialog.select = []
        dialog.show = false
      }
    },
    onClickRight(e) {
      console.log(e)
      if (typeof props.config?.back === 'function') {
        props.config.back(scene)
      }
    },
    animateCall: () => {
      // 弹窗位置
      if (dialog.show && dialog.select && !!dialog.select.length) {
        // 设备弹窗信息
        const object = dialog.select[0] as ThreeModelItem
        updateDialogPosition(object)
      }
    }
  })
  scene.run()

  emits('init', scene)
  initPage()
})

defineExpose({
  update: updateObject,
  exportImage: () => scene?.exportImage()
})
</script>

<style lang="scss" module>
@use './style.scss';
</style>
