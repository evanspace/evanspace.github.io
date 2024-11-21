import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import ThreeScene from 'three-scene'
import { useRaycaster } from 'three-scene/hooks/raycaster'
import { useCSS2D, CSS2DRenderer } from 'three-scene/hooks/css2d'

import { Water } from 'three/examples/jsm/objects/Water'
import { Sky } from 'three/examples/jsm/objects/Sky'

import type { Config, ExtendOptions } from '.'
import { useLensflare } from 'three-scene/hooks/lensflare'

import type { XYZ, ObjectItem } from 'three-scene/types/model'

import DEFAULTCONFIG from './config'

const { raycaster, pointer, update: raycasterUpdate } = useRaycaster()
const { initCSS2DRender, createCSS2DDom } = useCSS2D()

import * as UTILS from 'three-scene/utils/model'

const { addLensflare } = useLensflare()

const base = import.meta.env.VITE_BEFORE_STATIC_PAT || ''

const createWater = () => {
  // 创建水面
  const waterGeometry = new THREE.PlaneGeometry(900, 50)
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(base + '/oss/textures/waternormals.jpg', texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xf00f00,
    waterColor: 0x01688b,
    distortionScale: 3.5
  })
  water.rotation.x = -Math.PI / 2
  water.rotation.z = Math.PI * 0.05
  water.material.uniforms.size.value = 0.5
  water.position.y = -1
  water.position.x = 65
  water.position.z = 230
  return water
}

export class ParkThreeScene extends ThreeScene {
  // 水面
  water?: InstanceType<typeof Water>
  // 天空
  sky?: InstanceType<typeof Sky>
  // 太阳
  sun?: InstanceType<typeof THREE.Vector3>

  // 建筑集合
  buildingGroup?: InstanceType<typeof THREE.Group>
  // 点位集合
  dotGroup?: InstanceType<typeof THREE.Group>
  // 扩展参数
  extend: Partial<ExtendOptions>
  // CSS2D 渲染器
  css2DRender: InstanceType<typeof CSS2DRenderer>
  constructor(options: ConstructorParameters<typeof ThreeScene>[0], extend: Partial<ExtendOptions>) {
    super(options)

    this.extend = extend
    this.css2DRender = initCSS2DRender(this.options, this.container)
    this.css2DRender.domElement.className = 'three-scene__dot-wrap'

    this.bindEvent()
    this.addBuildingGroup()
    this.addDotGroup()

    // 光晕
    this.addLensflare()
  }

  // 添加建筑组
  addBuildingGroup() {
    const group = new THREE.Group()
    group.name = '建筑组'
    this.buildingGroup = group
    this.addObject(group)
  }

  // 清除场景建筑
  clearBuilding() {
    if (this.buildingGroup) {
      this.disposeObj(this.buildingGroup)
    }
    this.addBuildingGroup()
    this.clearDot()
  }

  // 添加建筑
  addBuilding(...obj) {
    if (this.buildingGroup) {
      this.buildingGroup.add(...obj)
    }
  }

  // 添加点位组
  addDotGroup() {
    const group = new THREE.Group()
    group.name = '点位组'
    this.dotGroup = group
    this.scene.add(group)
  }

  // 清除场景点位
  clearDot() {
    if (this.dotGroup) {
      this.disposeObj(this.dotGroup)
    }
    this.addDotGroup()
  }

  // 添加点位
  addDot(item: ObjectItem, clickBack) {
    const pos = item.position
    const { size, color } = item.font || {}
    const { x = 0, y = 0, z = 0 } = pos || {}
    const label = createCSS2DDom({
      name: `
        <div class="bg"></div>
        <span class="inner" style="${
          size != void 0 ? `font-size: ${typeof size === 'string' ? size : size + 'px'};` : ''
        } ${color != void 0 ? `color: ${color}` : ''}"></span>
      `,
      className: 'dot-2D-label',
      position: [x, y, z],
      onClick: clickBack
    })
    label.name = item.name
    label.data = item
    // 原始点位 备用
    label._position_ = { x, y, z }
    this.dotGroup.add(label)
    return label
  }

  // 添加太阳光晕
  addLensflare() {
    const { position = [500, 1000, 800], color = 0xffffff } = this.options.directionalLight
    const [x, y, z] = position
    const lensflare = addLensflare(color, x, y, z)
    this.addObject(lensflare)

    this.sun = new THREE.Vector3(x, y, z)
    this.water = createWater()
    this.addObject(this.water)
    // 创建天空
    // this.sky = new Sky()
    // this.sky.scale.setScalar(10000)
    // this.updateSkyAndSun()
  }

  // 更新天空、太阳
  updateSkyAndSun() {
    const { water, sky, sun } = this
    const skyUniforms = sky.material.uniforms
    // 系数控制参数
    const effectController = {
      turbidity: 10, // 浑浊
      rayleigh: 1, // 视觉效果就是傍晚晚霞的红光的深度
      mieCoefficient: 0.005, // 粒子的米氏散射系数
      mieDirectionalG: 0.2, // 方向
      elevation: 4, // 太阳高度
      azimuth: 180, // 太阳角度
      exposure: null // 光晕强度
    }
    skyUniforms['turbidity'].value = effectController.turbidity
    skyUniforms['rayleigh'].value = effectController.rayleigh
    skyUniforms['mieCoefficient'].value = effectController.mieCoefficient
    skyUniforms['mieDirectionalG'].value = effectController.mieDirectionalG

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation)
    const theta = THREE.MathUtils.degToRad(effectController.azimuth)

    // 设置球坐标系
    sun.setFromSphericalCoords(1, phi, theta)
    // 太阳方位
    sky.material.uniforms['sunPosition'].value.copy(sun)

    // 太阳方向
    water.material.uniforms['sunDirection'].value.copy(sun).normalize()

    // 环境映射
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    // 场景环境
    this.scene.environment = pmremGenerator.fromScene(sky).texture

    // 场景光晕强度
    this.renderer.toneMappingExposure = effectController.exposure
  }

  // 模型动画
  modelAnimate(): void {
    // css2D 渲染器
    this.css2DRender.render(this.scene, this.camera)

    if (typeof this.extend.animateCall === 'function') this.extend.animateCall()

    // 水面波动
    this.water.material.uniforms['time'].value += 1 / 60
  }

  // 移动
  onPointerMove(e: PointerEvent) {
    this.checkIntersectObjects(e)
  }

  // 弹起
  onPointerUp(e: PointerEvent) {
    super.onPointerUp(e)

    let s = e.timeStamp - this.pointer.tsp
    // 判断是否未点击
    const isClick = s < DEFAULTCONFIG.rightClickBackDiffTime
    if (e.button == 2) {
      // console.log('你点了右键')
      if (isClick && typeof this.extend?.onClickRight === 'function') this.extend.onClickRight(e)
    } else if (e.button == 0) {
      // console.log('你点了左键')
      isClick && this.checkIntersectObjects(e)
    } else if (e.button == 1) {
      // console.log('你点了滚轮')
    }
  }

  // 检查交叉几何体
  checkIntersectObjects(e: PointerEvent) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e, dom, scale)
    let isClick = e.type == 'pointerdown' || e.type == 'pointerup'
    const objects = this.buildingGroup.children.filter(it => it.visible && it._isAnchor_)

    // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
    raycaster.setFromCamera(pointer, this.camera)
    let interscts = raycaster.intersectObjects(objects, isClick)
    dom.style.cursor = interscts.length > 0 ? 'pointer' : 'auto'
    if (!isClick) {
      return
    }

    if (interscts.length) {
      const object = interscts[0].object

      if (!object) return
      if (typeof this.extend?.onClickLeft === 'function') this.extend.onClickLeft(object)
    } else {
      if (typeof this.extend?.onClickLeft === 'function') this.extend.onClickLeft()
    }
  }

  // 查找父级组合
  findParentGroupGroup(object) {
    const _find = obj => {
      let parent = obj.parent
      if (!parent) {
        return
      }
      if (parent && parent._isBuilding_) {
        return parent
      }
      return _find(parent)
    }
    return _find(object)
  }

  // 获取楼层集合
  getFloor() {
    return this.buildingGroup.children.filter(it => it._isFloor_)
  }

  // 隐藏除楼层之外的对象
  hideOmitFloor(visible: boolean) {
    this.buildingGroup.children.forEach(el => {
      el.visible = el._isFloor_ || visible
    })
  }

  // 获取所有对象
  getAll() {
    return this.buildingGroup.children.concat(this.dotGroup.children)
  }

  // 获取跟随目标集合
  getFlowMark(mark) {
    return this.getAll().filter(el => el.data?.followMark === mark)
  }

  // 获取动画目标点
  getAnimTargetPos(config: Partial<Config>, _to?: XYZ, _target?: XYZ) {
    const to = _to || config.to || { x: -104, y: 7, z: 58 }
    const target = _target || config.target || { x: 0, y: 0, z: 0 }
    // 中心点位
    this.controls.target.set(target.x, target.y, target.z)
    return to
  }

  // 获取场景坐标
  getPosition() {
    console.log('视角', this.camera.position)
    console.log('目标位置', this.controls.target)
  }

  resize() {
    super.resize()
    const { width, height } = this.options
    this.css2DRender.setSize(width, height)
  }
}

// 点位更新回调
export const dotUpdateObjectCall = (obj: ObjectItem, _group) => {
  // const val = wsStore.getKeyValue( code ).value
  const val = Math.random() * 40
  if (val !== void 0) {
    obj.value = val
  }

  obj.show = Math.random() > 0.5
  obj.value = Number(Number(obj.value || 0).toFixed(2))
  return {
    value: obj.value,
    show: obj.show,
    font: {
      ...(obj.font || {}),
      color: obj.value > 35 ? '#f00' : null
    }
  }
}

// 更新回调
export const updateObjectCall = (_obj: ObjectItem, isRandom) => {
  console.log(isRandom)
  // const code = _obj.deviceCode || ''
  // console.log( code )
  const status = Math.random() > 0.5 ? 1 : 0
  const error = Math.random() > 0.5 ? 1 : 0
  const disabled = Math.random() > 0.8 ? 1 : 0
  const ctl = Math.floor(Math.random() * 3)
  return {
    status: disabled > 0 ? 0 : status,
    error: disabled > 0 ? 0 : error,
    remote: ctl == 1 ? 1 : 0,
    local: ctl == 2 ? 1 : 0,
    disabled
  }
}

// 修改模型部件状态及颜色 (类型、模型、颜色对象、颜色、动画暂停状态、故障状态)
export const changeModleStatusColor = (opts: import('./index').ChangeMaterialOpts) => {
  let { el, type, colorObj: cobj, color, paused } = opts
  let colors = UTILS.getColorArr(color)
  color = colors[0]

  // 场景
  // 扩展数据
  const extra = el.extra
  // 状态运行则运动
  if (!!extra) {
    // 暂停状态
    !!extra.action && (extra.action.paused = paused)
    if (color != void 0) {
      const meshs = extra.meshs || []
      meshs.forEach(e => {
        UTILS.setMaterialColor(e, color)
      })
    }
  }
}

// 执行汽车行驶动画
export const executeCarRunging = el => {
  const data = el.data
  const { to, position } = data
  if (!to) return
  const time = 30 * 1000

  // 动画延迟时间
  const delay = THREE.MathUtils.randInt(0, 10 * 1000)

  // 动画：透明度缩放动画
  el.tween1 = new TWEEN.Tween(el.position)
    .to(to, time)
    .delay(delay)
    .onUpdate(({ x, y, z }) => {
      el.position.x = x
      el.position.y = y
      el.position.z = z
    })
  el.tween2 = new TWEEN.Tween(position).to(to, time).onUpdate(({ x, y, z }) => {
    el.position.x = x
    el.position.y = y
    el.position.z = z
  })

  // 第一段动画完成后接第二段
  el.tween1.chain(el.tween2)
  // 第二段动画完成后接第一段
  el.tween2.chain(el.tween1)
  el.tween1.start()
}

// 偏移坐标
export const getOffsetPoint = (pos, offset = 0) => {
  return new THREE.Vector3(pos.x, pos.y + offset, pos.z)
}
