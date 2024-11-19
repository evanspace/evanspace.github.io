import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { FloorThreeScene } from 'three-scene/components/floor-scene/methods'

import { useLensflare } from 'three-scene/hooks/lensflare'

import { Water } from 'three/examples/jsm/objects/Water'
import { Sky } from 'three/examples/jsm/objects/Sky'

import type { ExtendOptions } from '.'
import type { ObjectItem } from 'three-scene/types/model'

import * as UTILS from 'three-scene/utils/model'
import { random } from 'three-scene/utils/index'

const { addLensflare } = useLensflare()

const createWater = () => {
  // 创建水面
  const waterGeometry = new THREE.PlaneGeometry(900, 50)
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      new URL('/oss/textures/waternormals.jpg', import.meta.url).href,
      texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      }
    ),
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

export class ParkThreeScene extends FloorThreeScene {
  // 水面
  water: InstanceType<typeof Water>
  // 天空
  sky: InstanceType<typeof Sky>
  // 太阳
  sun: InstanceType<typeof THREE.Vector3>
  constructor(options: ConstructorParameters<typeof FloorThreeScene>[0], extend: Partial<ExtendOptions>) {
    super(options, extend)

    // 光晕
    const { position = [500, 1000, 800], color = 0xffffff } = this.options.directionalLight
    const [x, y, z] = position
    const lensflare = addLensflare(color, x, y, z)
    this.addObject(lensflare)

    this.sun = new THREE.Vector3(x, y, z)
    this.water = createWater()
    this.addObject(this.water)
    this.createSky()
    this.updateSkyAndSun()
  }

  createSky() {
    // 创建天空
    this.sky = new Sky()
    this.sky.scale.setScalar(10000)
    // this.addObject(this.sky)
  }

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

  modelAnimate(): void {
    super.modelAnimate()
    // 水面波动
    this.water.material.uniforms['time'].value += 1 / 60
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
  const delay = random(0, 10 * 1000)

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
