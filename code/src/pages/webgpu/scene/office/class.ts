import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'

import DEFAULTCONFIG from './config'
import * as MS from './methods'
import { ExtendOptions, Sky } from '.'

const { Utils } = MS
const { pass } = THREE.TSL

export class OfficeScene extends ThreeScene.Scene {
  // 扩展参数
  extend: Partial<ExtendOptions>

  // 场景合成渲染器
  postProcessing: InstanceType<typeof THREE.PostProcessing>

  // 建筑集合
  buildingGroup?: InstanceType<typeof THREE.Group>
  // 锚点集合
  anchorGroup?: InstanceType<typeof THREE.Group>

  // CSS2D 渲染器
  css2DRender?: ReturnType<typeof MS.createCSS2DRender>
  // 点位集合
  dotGroup?: InstanceType<typeof THREE.Group>
  // 灯光组
  lightGroup?: InstanceType<typeof THREE.Group>

  // 动画模型集合
  animateModels: ThreeModelItem[] = []

  // 环境光
  ambientLight = new THREE.AmbientLight()
  // 平行光
  directionalLight = new THREE.DirectionalLight()

  // 当前风格（白天/傍晚/夜间）
  sky: Sky = DEFAULTCONFIG.sky
  style = -1
  styleTimes = DEFAULTCONFIG.styleTimes

  // 流光
  fleetingGroup?: InstanceType<typeof THREE.Group>

  // 路灯
  streetLampGroup?: InstanceType<typeof THREE.Group>

  // 居民灯
  residentLightGroup?: InstanceType<typeof THREE.Group>

  constructor(
    options: ConstructorParameters<typeof ThreeScene.Scene>[0],
    extend: Partial<ExtendOptions>
  ) {
    super(options)

    this.extend = extend

    this.createClock()

    // 场景合成
    const scenePass = pass(this.scene, this.camera)
    this.postProcessing = MS.createPostProcessing(scenePass, this.renderer)

    this.addBuildingGroup()
    this.addAnchorGroup()

    this.css2DRender = MS.createCSS2DRender(this.options, this.container)
    this.addDotGroup()
    this.addLightGroup()

    // 流光
    this.addFleeting()

    this.findLight()
  }

  // 设置环境贴图
  setEnv(texture) {
    this.scene.environment = texture
    this.scene.background = texture
  }

  // 渲染器
  createRender() {
    return new THREE.WebGPURenderer() as any
  }

  // 渲染
  render() {
    this.postProcessing.renderAsync()
  }

  // 模型动画
  modelAnimate() {
    let delta = this.clock?.getDelta() as number

    // css2D 渲染器
    this.css2DRender?.render(this.scene, this.camera)

    // 场景风格
    this.autoChangeStyle()

    // 流光动画
    if (this.fleetingGroup?.visible) {
      MS.fleetingGroupAnimate(0.2)
    }

    // 模型动画
    if (this.animateModels.length) {
      this.animateModels.forEach((el: any) => {
        if (el.__mixer__) {
          el.__mixer__.update(delta)
        }
      })
    }
  }

  // 查找灯光
  findLight() {
    const amb = this.scene.getObjectByProperty('isAmbientLight', true) as THREE.AmbientLight
    this.ambientLight = amb
    const dire = this.scene.getObjectByProperty(
      'isDirectionalLight',
      true
    ) as THREE.DirectionalLight
    this.directionalLight = dire
  }

  // 白天
  toByday(style = 1) {
    this.style = style
    const { ambientLight, directionalLight } = this.options
    console.log(ambientLight)
    this.setStyleOptions(ambientLight.intensity, directionalLight.intensity, this.sky.day)
  }

  // 傍晚
  toEvening(style = 2) {
    this.style = style
    this.setStyleOptions(0.01, 0.5, this.sky.evening)
  }

  // 夜晚
  toNight(style = 3) {
    this.style = style
    this.setStyleOptions(0.01, 0, this.sky.night, true)
  }

  // 设置 sky 参数 (环境光强度，平行光强度，hdr，可见)
  setStyleOptions(ambIntensity, dirIntensity, hdr, visible = false) {
    this.ambientLight.intensity = ambIntensity
    this.directionalLight.intensity = dirIntensity
    this.fleetingGroup && (this.fleetingGroup.visible = visible)
    this.streetLampGroup && (this.streetLampGroup.visible = visible)
    this.residentLightGroup && (this.residentLightGroup.visible = visible)

    this.loadEnvTexture(hdr, _texture => {
      this.postProcessing.needsUpdate = true
      console.log(this.postProcessing)
    })
  }

  // 自动切换场景风格
  autoChangeStyle() {
    const times = this.styleTimes
    const hour = new Date().getHours()
    const index = times.findIndex((ar, i) =>
      i == times.length - 1 ? hour >= ar[0] || hour < ar[1] : hour >= ar[0] && hour < ar[1]
    )

    if (this.style != index + 1) {
      if (index == 0) {
        this.toByday()
      } else if (index == 1) {
        this.toEvening()
      } else if (index == 2) {
        this.toNight()
      }
    }
  }

  // 添加建筑组
  addBuildingGroup() {
    const group = new THREE.Group()
    group.name = '建筑组'
    this.buildingGroup = group
    this.addObject(group)
  }
  // 添加建筑
  addBuilding(...obj) {
    if (this.buildingGroup) {
      this.buildingGroup.add(...obj)
    }
  }

  // 添加锚点组
  addAnchorGroup() {
    const group = new THREE.Group()
    group.name = '锚点组'
    this.anchorGroup = group
    this.addObject(group)
  }
  // 添加锚点
  addAnchor(obj) {
    if (this.anchorGroup) {
      this.anchorGroup.add(obj)
    }
    const { x, y, z } = obj.position
    // 创建精灵动画
    Utils.createSpriteAnimate(obj, [x, y, z], 0.2, 8)
  }

  // 添加点位组
  addDotGroup() {
    if (!this.css2DRender) return
    this.css2DRender.domElement.className = 'three-scene__dot-wrap'
    const group = new THREE.Group()
    group.name = '点位组'
    this.dotGroup = group
    this.scene.add(group)
  }
  // 添加点位
  addDot(item: ObjectItem, clickBack) {
    const label = MS.createDotCSS2DDom(item, clickBack)
    this.dotGroup.add(label)
    return label
  }

  // 添加灯光组
  addLightGroup() {
    const group = new THREE.Group()
    group.name = '灯光组'
    this.lightGroup = group
    this.addObject(group)
  }
  // 添加灯光
  addLight(item: ObjectItem, obj, hasHelper?: boolean) {
    if (!this.lightGroup) return
    const group = MS.createLightGroup(item, obj, hasHelper)
    this.lightGroup.add(group)
  }

  // 流光
  addFleeting() {
    this.fleetingGroup = MS.createFleetingGroup(DEFAULTCONFIG.fleetings, 0x0053ff, 1)
    this.addObject(this.fleetingGroup)
  }
  // 流光状态切换
  toggleFleeting(isOpen?: boolean) {
    this.fleetingGroup && (this.fleetingGroup.visible = isOpen ?? !this.fleetingGroup.visible)
  }

  // 窗帘动画
  toggleCurtain(object, isClose?) {
    const dobj = this.animateModels.find(el => el.name === object.data?.bind)
    if (!dobj) return
    MS.toggleCurtainAnimate(dobj, isClose)
    return dobj.__close__
  }

  // 相机移动聚焦点
  cameraLookatMoveTo(pos) {
    if (!this.controls) return
    Utils.cameraLookatAnimate(this.camera, pos, this.controls.target)
  }

  // 相机转场
  cameraTransition(object) {
    // if (this.judgeCruise()) return

    // if (this.mouseClickDiffusion.visible) {
    //   ElMessage.warning({
    //     message: '人物移动中，不可操作！',
    //     grouping: true
    //   })
    //   return
    // }

    // this.clearCharacterSight()

    const { to, target = object.position } = object.data

    if (!to) return

    if (!this.isCameraMove(to) && this.controls) {
      // this.judgeAndStopRoam()
      this.controls.enablePan = true
      this.controls.maxDistance = 5
      Utils.cameraLinkageControlsAnimate(this.controls, this.camera, to, target)
    }
  }

  // 添加模型动画
  addModelAnimate(model, animations = [], play: boolean = true, timeScale: number = 1) {
    MS.createModelAnimate(model, animations, play, timeScale)
    this.animateModels.push(model)
  }

  controlReset() {
    // this.judgeAndStopRoam()
    // this.clearCharacterSight()
    if (!this.controls) return
    this.controls.enablePan = true
    this.controls.maxDistance = 1500
    this.controls.maxPolarAngle = Math.PI * 0.48
    super.controlReset()
  }

  // 销毁
  dispose() {
    this.animateModels = []
    this.disposeObj(this.buildingGroup)
    this.disposeObj(this.dotGroup)
    this.disposeObj(this.anchorGroup)
    this.disposeObj(this.lightGroup)
    this.disposeObj(this.fleetingGroup)
    this.disposeObj(this.streetLampGroup)
    this.disposeObj(this.residentLightGroup)

    this.clock = void 0
    this.css2DRender = void 0
    this.buildingGroup = void 0
    this.dotGroup = void 0
    this.anchorGroup = void 0
    this.lightGroup = void 0
    this.fleetingGroup = void 0
    this.streetLampGroup = void 0
    this.residentLightGroup = void 0
    this.extend = {}
    super.dispose()
    console.log(this.scene)
  }
}
