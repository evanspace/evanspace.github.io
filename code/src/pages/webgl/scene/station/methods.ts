import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { Water } from 'three/examples/jsm/objects/Water'

import * as ThreeScene from 'three-scene'

import type { Config, ExtendOptions } from '.'
import type { ObjectItem, XYZ } from 'three-scene/types/model'

import DEFAULTCONFIG from './config'
import { ThreeModelItem } from 'three-scene/types/model'

const Hooks = ThreeScene.Hooks
const Utils = ThreeScene.Utils

const { raycaster, pointer, update: raycasterUpdate, style } = Hooks.useRaycaster()
const { initCSS2DRender, createCSS2DDom } = Hooks.useCSS2D()
const { createDiffusion, updateDiffusion } = Hooks.useDiffusion()
const { createMove, moveAnimate } = Hooks.useMoveAnimate()
const { createFence, fenceAnimate } = Hooks.useFence()
const {
  createRoam,
  executeRoam,
  pause: roamPause,
  play: roamPlay,
  getStatus: getRoamStatus
} = Hooks.useRoam()
const { floorAnimate } = Hooks.useFloor()
const { keyboardPressed, destroyEvent, insertEvent } = Hooks.useKeyboardState()
const { checkCollide } = Hooks.useCollide()

const sightMap = {
  full: 'FULL',
  npc: 'NPC'
}

const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const createWater = (model?) => {
  const waterGeometry = model ? model.geometry : new THREE.PlaneGeometry(200, 200)
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      base + '/oss/textures/waternormals.jpg',
      texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xf00f00,
    waterColor: 0x01688b,
    distortionScale: 3.7
  })
  water.material.uniforms.size.value = 0.5
  return water
}

export class StationThreeScene extends ThreeScene.Scene {
  // 建筑集合
  buildingGroup?: InstanceType<typeof THREE.Group>
  // 锚点集合
  anchorGroup?: InstanceType<typeof THREE.Group>
  // 点位集合
  dotGroup?: InstanceType<typeof THREE.Group>
  // 灯光组
  lightGroup?: InstanceType<typeof THREE.Group>

  // 扩展参数
  extend: Partial<ExtendOptions>
  // CSS2D 渲染器
  css2DRender: InstanceType<typeof Hooks.CSS2DRenderer>
  // 鼠标点击地面扩散波效果
  mouseClickDiffusion: InstanceType<typeof THREE.Mesh>
  // 行走的人物
  character?: InstanceType<typeof THREE.Group> & {
    __runing__?: boolean
    extra: {
      key: string
      mixer: any
      actions: any[]
    }
  }
  characterSightHeight = DEFAULTCONFIG.characterSightHeight

  // 楼层集合（分层）
  floorGroup?: InstanceType<typeof THREE.Group>

  // 当前视角
  currentSight: string
  // 历史中心点（视角切换）
  historyTarget: InstanceType<typeof THREE.Vector3>
  // 历史相机坐标（视角切换）
  historyCameraPosition: InstanceType<typeof THREE.Vector3>

  // 动画模型集合
  animateModels: (InstanceType<typeof THREE.Group> & {
    data?: any
    __mixer__: any
    __action__: any
  })[]

  // 移动系数
  moveFactor = DEFAULTCONFIG.moveFactor

  // 碰撞间距
  collisionSpace = DEFAULTCONFIG.collisionSpace

  // 围栏
  fence?: InstanceType<typeof THREE.Group>

  // 水面
  water?: InstanceType<typeof Water>

  constructor(
    options: ConstructorParameters<typeof ThreeScene.Scene>[0],
    extend: Partial<ExtendOptions>
  ) {
    super(options)

    this.extend = extend
    this.css2DRender = initCSS2DRender(this.options, this.container)
    this.css2DRender.domElement.className = 'three-scene__dot-wrap'

    // 鼠标点击地面扩散波效果
    this.mouseClickDiffusion = createDiffusion(4, void 0, 6)
    this.mouseClickDiffusion.rotation.x = -Math.PI * 0.5
    this.mouseClickDiffusion.position.y = 0.5
    this.mouseClickDiffusion.visible = false
    this.addObject(this.mouseClickDiffusion)

    this.createClock()
    this.currentSight = sightMap.full
    this.historyTarget = new THREE.Vector3()
    this.historyCameraPosition = new THREE.Vector3()
    this.animateModels = []

    this.bindEvent()
    this.addBuildingGroup()
    this.addFloorGroup()
    this.addAnchorGroup()
    this.addDotGroup()
    this.addLightGroup()
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
    this.animateModels = []
    this.addBuildingGroup()

    this.clearAnchor()
    this.clearDot()
    this.clearFloor()
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

  // 清除场景锚点
  clearAnchor() {
    if (this.anchorGroup) {
      this.disposeObj(this.anchorGroup)
    }
    this.addAnchorGroup()
  }

  // 添加锚点
  addAnchor(obj) {
    if (this.anchorGroup) {
      this.anchorGroup.add(obj)
    }

    const { x, y, z } = obj.position
    // 创建精灵动画
    Utils.createSpriteAnimate(obj, [x, y, z], 1, 8)
  }

  // 添加点位组
  addDotGroup() {
    const group = new THREE.Group()
    group.name = '点位组'
    this.dotGroup = group
    this.addObject(group)
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
    this.dotGroup?.add(label)
    return label
  }

  // 添加楼层
  addFloorGroup() {
    const group = new THREE.Group()
    group.name = '楼层组'
    this.floorGroup = group
    this.addObject(group)
  }

  // 清除楼层组
  clearFloor() {
    if (this.floorGroup) {
      this.disposeObj(this.floorGroup)
    }
    this.addFloorGroup()
  }

  // 添加楼层
  addFloor(...obj) {
    if (this.floorGroup) {
      this.floorGroup.add(...obj)
    }
  }

  // 添加灯组
  addLightGroup() {
    const group = new THREE.Group()
    group.name = '灯光组'
    this.lightGroup = group
    this.addObject(group)
  }

  // 清除灯组
  clearLightGroup() {
    if (this.lightGroup) {
      this.disposeObj(this.lightGroup)
    }
    this.addLightGroup()
  }

  // 关闭灯组
  closeLightGroup(isOpen: boolean = false) {
    this.lightGroup?.children.forEach((el: any) => {
      if (el.isSpotLight) {
        el.visible = isOpen
      }
    })
  }

  // 添加灯
  addLight(item: ObjectItem, obj, hasHelper?: boolean) {
    if (this.lightGroup) {
      obj.name = item.name
      const pos = item.position || { x: 0, y: 0, z: 0 }
      const { to = { x: pos.x, y: pos.y - 2, z: pos.z } } = item
      obj.target.position.set(to.x, to.y, to.z)
      // 开灯
      obj.visible = true
      this.lightGroup.add(obj)
      this.lightGroup.add(obj.target)
      if (hasHelper) {
        const helper = new THREE.SpotLightHelper(obj, obj.color)
        this.lightGroup.add(helper)
      }
    }
  }

  // 灯光开关
  lightSwitch(object) {
    const light = this.lightGroup?.getObjectsByProperty('name', object.data?.bind)
    if (!light) return
    light.forEach(el => {
      el.visible = !el.visible
    })
  }

  // 添加水面
  addWater(waterName) {
    const obj = this.scene.getObjectByName(waterName)
    if (!obj) return
    console.log(obj)
    const water = createWater(obj)
    const v = obj.getWorldPosition(new THREE.Vector3())
    water.position.copy(v)
    obj.position.y -= 0.2
    if (this.water) {
      this.scene.remove(this.water)
    }
    this.water = water
    this.addBuilding(this.water)
  }

  // 添加人物
  addCharacter(model, point) {
    const { x, y, z } = point
    model.position.set(x, y, z)

    this.character = model

    // 动画
    const animations = model.animations
    const mixer = new THREE.AnimationMixer(model)
    const actions = {}

    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i]
      const action = mixer.clipAction(clip)
      actions[clip.name] = action
    }

    // 空闲
    const key = 'Idle'
    const dance = actions[key]
    dance.play()

    // 步行
    const runging = actions['Walking']

    model.extra = {
      key,
      mixer,
      actions,
      runging
    }
    this.addObject(model)

    const keys = ['W', 'S'].map(key => key.toUpperCase().charCodeAt(0))

    // 插入事件 播放/暂停 动作
    insertEvent(
      e => {
        if (model.__runing__) return
        if (keys.includes(e.keyCode)) {
          runging.play()
        }
        if (this.isCharacterSight()) {
          if (keyboardPressed('X')) {
            this.characterAccelerate(1)
          }
          if (keyboardPressed('Z')) {
            this.characterAccelerate(-1)
          }
        }
      },
      e => {
        if (model.__runing__) return
        if (keys.includes(e.keyCode)) {
          runging.stop()
        }
      }
    )
  }

  // 人物动作
  changeCharacterAction() {
    if (!this.character) return
    let { key, actions } = this.character.extra as any
    // 空闲、步行、跑步、舞蹈、死亡、坐着、站立、弹跳、出拳、点赞、行走跳跃、点头、摇头、打招呼
    const all = [
      'Idle',
      /* 'Walking',  */ 'Running',
      'Dance',
      'Death',
      'Sitting',
      'Standing',
      'Jump',
      'Punch',
      'ThumbsUp',
      'WalkJump',
      'Yes',
      'No',
      'Wave'
    ]
    const text = [
      '空闲',
      '跑步',
      '舞蹈',
      '散架',
      '坐着',
      '站立',
      '弹跳',
      '出拳',
      '点赞',
      '行走跳跃',
      '点头',
      '摇头',
      '打招呼'
    ]
    let index = all.findIndex(it => it === key) || 0
    actions[key].stop()
    index++
    if (index >= all.length) index = 0
    key = all[index]

    actions[key].play()
    ElMessage.success({
      message: text[index],
      grouping: true
    })
    this.character.extra.key = key
  }

  // 视角切换（人物/全屏）
  // 1-第一人称 3-第三人称
  toggleSight(type?: number) {
    if (this.judgeCruise()) return

    const sight = this.currentSight == sightMap.full ? sightMap.npc : sightMap.full
    this.currentSight = sight

    // 人物视角
    const isCharacter = sight === sightMap.npc

    if (!this.controls) return
    // 控制器操作限制切换
    this.controls.maxDistance = isCharacter ? (type == 3 ? 20 : 0) : 800
    // this.controls.screenSpacePanning = !isCharacter
    this.controls.enablePan = !isCharacter
    // this.controls.maxPolarAngle = Math.PI * (isCharacter ? 0.8 : 0.48)

    if (!this.character) return
    const position = this.character.position
    this.toggleCharacterView()

    // 向量
    const up = new THREE.Vector3(0, this.characterSightHeight, 0)
    /// 切换到人物视角，暂存控制参数
    if (isCharacter) {
      ElMessage.success({
        message: '鼠标点击地面移动，或键盘 W、S 前后移动，A、D调整左右方向，X 加速，Z 减速!',
        grouping: true
      })

      this.historyTarget = this.controls.target.clone()
      this.historyCameraPosition = this.camera.position.clone()
      const pos = position.clone().add(up)
      this.camera.lookAt(pos)
    } else {
      this.camera.position.copy(this.historyCameraPosition)
      this.camera.lookAt(position)
    }

    const vect = isCharacter ? position : this.historyTarget
    const pos = vect.clone().add(up)
    this.controls.target.copy(pos)
  }

  // 是否人物视角
  isCharacterSight() {
    return this.currentSight == sightMap.npc
  }

  // 清除人物视角状态
  clearCharacterSight() {
    this.currentSight = sightMap.full
    this.toggleCharacterView()
  }

  // 切换人物界面效果
  toggleCharacterView() {
    const dom = this.container.parentNode?.querySelector('.character-sight') as HTMLDivElement
    if (!dom) return
    const isCharacter = this.currentSight === sightMap.npc
    dom.style.display = isCharacter ? 'block' : 'none'
  }

  // 人物加速
  characterAccelerate(speed = 1) {
    this.moveFactor += speed
    if (this.moveFactor >= 10) this.moveFactor = 10
    else if (this.moveFactor <= 1) this.moveFactor = 1
    ElMessage.success({
      message: '人物速度：' + this.moveFactor,
      grouping: true
    })
  }

  // 设置控制中心点
  setControlTarget(point) {
    if (!this.controls) return
    const { x, y, z } = point
    this.controls.target.set(x, y + this.characterSightHeight, z)
    this.camera.lookAt(this.controls.target)
  }

  // 鼠标点击地面
  mouseClickGround(intersct) {
    if (this.currentSight !== sightMap.npc) return Promise.reject()

    const character = this.character
    if (!character) return Promise.reject()
    const { runing } = this.options.cruise
    // 自动巡航中不操作
    if (runing) return Promise.reject()
    const lookAt = intersct.point
    const obj = this.mouseClickDiffusion

    const { runging } = character.extra as any
    runging.play()

    const { x, y, z } = lookAt
    obj.position.set(x, y, z)
    obj.visible = true

    character.__runing__ = true
    return new Promise(resolve => {
      // 创建移动
      createMove(
        character,
        lookAt,
        (pos, stop) => {
          this.setControlTarget(pos)
          if (this.checkCharacterCollide(pos, 2)) {
            stop()
            runging.stop()
            character.__runing__ = false
            obj.visible = false
          }
        },
        pos => {
          this.setControlTarget(pos)
          runging.stop()
          character.__runing__ = false
          obj.visible = false
          resolve(character)
        }
      )
    })
  }

  // 检测人物碰撞
  checkCharacterCollide(pos, y = 0.3) {
    if (!this.character) return
    // 检测碰撞
    const intersects = checkCollide(
      this.character,
      pos,
      this.buildingGroup?.children || [],
      true,
      new THREE.Vector3(0, y, 0)
    )
    if (intersects.length) {
      const intersect = intersects[0]

      // 于目标距离
      if (intersect.distance < this.collisionSpace) {
        ElMessage.warning({
          message: '撞到了！',
          grouping: true
        })
        return true
      }
    }
  }

  // 获取动画目标点
  getAnimTargetPos(config: Partial<Config>, _to?: XYZ, _target?: XYZ) {
    if (!this.controls) return
    const to = _to || config.to || { x: -104, y: 7, z: 58 }
    const target = _target || config.target || { x: 0, y: 0, z: 0 }
    // 中心点位
    this.controls.target.set(target.x, target.y, target.z)
    return to
  }

  // 添加模型动画
  addModelAnimate(model, animations = [], play: boolean = true, timeScale: number = 1) {
    if (!animations.length) return
    const mixer = new THREE.AnimationMixer(model)
    const obj = animations.reduce((ob, cur: any) => {
      const key = cur.name || ''
      ob[key] = mixer.clipAction(cur)
      if (play) {
        ob[key].play()
      }
      ob[key].timeScale = timeScale
      return ob
    }, {})

    model.__action__ = obj
    model.__mixer__ = mixer
    this.animateModels.push(model)
  }

  // 相机转场
  cameraTransition(object) {
    if (this.judgeCruise()) return

    if (this.mouseClickDiffusion.visible) {
      ElMessage.warning({
        message: '人物移动中，不可操作！',
        grouping: true
      })
      return
    }

    this.clearCharacterSight()

    const { to, target = object.position } = object.data

    if (!to) return

    if (!this.isCameraMove(to) && this.controls) {
      const dis = new THREE.Vector3(to.x, to.y, to.z).distanceTo(
        new THREE.Vector3(target.x, target.y, target.z)
      )
      this.controls.maxDistance = dis
      Utils.cameraLinkageControlsAnimate(
        this.controls,
        this.camera as InstanceType<typeof THREE.PerspectiveCamera>,
        to,
        target
      )
    }

    const { bind } = object.data
    if (!bind) {
      return
    }

    const obj = this.buildingGroup?.getObjectByName(bind)
    this.addFence(obj)
  }

  // 添加围栏
  addFence(model?) {
    // 先删除
    if (this.fence) {
      this.disposeObj(this.fence)
      this.fence = void 0
    }

    if (model) {
      // 围栏
      const fence = createFence(model, 0x52ffae)
      this.fence = fence
      this.addObject(fence)
    }
  }

  // 相机移动聚焦点
  cameraLookatMoveTo(pos) {
    return new Promise((resolve, reject) => {
      if (this.judgeCruise(true)) return reject(false)

      if (this.isCharacterSight()) {
        return reject(false)
      }

      if (!this.controls) return

      this.controls.maxDistance = 100
      Utils.cameraLookatAnimate(
        this.camera as InstanceType<typeof THREE.PerspectiveCamera>,
        pos,
        this.controls.target
      ).then(() => {
        this.controls && (this.controls.maxDistance = 800)
        resolve(this.camera)
      })
    })
  }

  // 切换巡航
  toggleCruise(close?: boolean) {
    if (getRoamStatus()) {
      ElMessage.warning({
        message: '请退出漫游！',
        grouping: true
      })
      return
    }
    super.toggleCruise(close)
  }

  // 判断是否巡航中
  judgeCruise(isSilent?: boolean) {
    if (this.options.cruise.runing) {
      if (isSilent) return false
      ElMessage.warning({
        message: '请退出巡航！',
        grouping: true
      })
      return true
    }
    if (getRoamStatus()) {
      if (isSilent) return false
      ElMessage.warning({
        message: '请退出漫游！',
        grouping: true
      })
      return true
    }
    return false
  }

  // 控制重置视角
  controlReset() {
    if (this.judgeCruise()) return
    this.clearCharacterSight()
    if (!this.controls) return
    this.controls.maxDistance = 800
    super.controlReset()

    this.historyTarget = new THREE.Vector3().copy(this.controls.target)
    this.historyCameraPosition = new THREE.Vector3().copy(this.camera.position)
  }

  // 设置漫游点位
  setRoamPoint(points) {
    this.extend.roamPoints = points
  }

  // 场景漫游
  toggleRoam() {
    if (!this.controls) return
    // 漫游中则暂停
    if (getRoamStatus()) {
      roamPause()
      this.controls.maxDistance = 800
      return
    }
    const points = this.extend.roamPoints || []
    if (points.length == 0) return
    this.controls.maxDistance = 20
    createRoam({
      points,
      tension: 0.3
    })
    roamPlay()
  }

  // 楼层展开
  floorExpand(object) {
    const data = object.data
    const list = this.getFloorByGroup(data.group) as any[]
    if (!list.length) return
    const index = list.findIndex(el => object.uuid === el.uuid)
    floorAnimate(list, index, mark => this.getFlowMark(mark))
  }

  // 获取机房
  getMachineRoomStatus(name) {
    const room = this.scene.getObjectByName(name) as ThreeModelItem
    return {
      isFocus: room?.__isFocus__,
      room
    }
  }

  // 机房视角-其他虚化
  toCoolMachineRoom(isFocus) {
    if (!this.controls) return
    let target = this.historyTarget
    let to = this.historyCameraPosition as XYZ

    // 聚焦移动 暂存场景参数
    if (isFocus) {
      this.historyTarget = new THREE.Vector3().copy(this.controls.target)
      this.historyCameraPosition = new THREE.Vector3().copy(this.camera.position)

      target = new THREE.Vector3(-78.4, -33, 29.2)
      to = { x: -143.7, y: -25.8, z: 67 }
    }

    const dis = target.distanceTo(to)
    this.controls.maxDistance = dis

    Utils.cameraLinkageControlsAnimate(this.controls, this.camera, to, target)
  }

  // 开门
  openTheDoor(object) {
    const dobj = this.scene.getObjectByName(object.data.bind) as any
    if (!dobj) return

    dobj.__open__ = !dobj.__open__
    new TWEEN.Tween(dobj.rotation)
      .to(
        {
          y: dobj.__open__ ? Math.PI * 0.5 : 0
        },
        1000 * 1.5
      )
      .delay(0)
      .start()
  }

  // 模型动画
  modelAnimate(): void {
    // css2D 渲染器
    this.css2DRender.render(this.scene, this.camera)

    if (typeof this.extend.animateCall === 'function') this.extend.animateCall()

    this.restoreAnchorMaterial()

    let delta = this.clock?.getDelta() || 0
    // 模型动画
    if (this.animateModels.length) {
      this.animateModels.forEach(el => {
        if (el.__mixer__) {
          el.__mixer__.update(delta)
        }
      })
    }

    if (!this.anchorGroup) return
    this.anchorGroup.children.forEach((el: any) => {
      if (el.__mixer__) {
        el.__mixer__.update(delta)
      }
    })

    if (this.character) {
      const mixer = this.character.extra.mixer
      mixer.update(delta)

      moveAnimate(0.5 * this.moveFactor)
    }

    // 波纹扩散
    if (this.mouseClickDiffusion.visible) {
      updateDiffusion()
    }

    fenceAnimate()

    executeRoam(this.camera, this.controls)

    // 人物视角
    if (this.isCharacterSight() && !this.character?.__runing__) {
      // 移动速度
      const steep = 10 * delta
      // 旋转速度
      const angle = Math.PI * 0.2 * delta
      const target = this.character
      if (!target) return

      // 前进、后退
      const isS = keyboardPressed('S')
      if (keyboardPressed('W') || isS) {
        // 向量
        const dir = new THREE.Vector3()
        // 视线方向
        target?.getWorldDirection(dir)
        // dis向量表示相机沿着相机视线方向平移的位移量
        const dis = dir.clone().multiplyScalar(isS ? -steep : steep)
        // 初始位置+偏移向量
        const newPos = target?.position.clone().add(dis) || new THREE.Vector3()
        if (this.checkCharacterCollide(newPos)) {
        } else {
          target?.position.copy(newPos)
          if (isS) {
            // 定位后一步
            const ds = dir.clone().multiplyScalar(-steep * 2)
            this.camera.position.copy(this.camera.position.clone().add(ds))
          }
          this.setControlTarget(target?.position)
        }
      }

      // 左、右
      if (keyboardPressed('A')) {
        target.rotation.y += angle
        this.keyboardToTotation()
      } else if (keyboardPressed('D')) {
        target.rotation.y -= angle
        this.keyboardToTotation()
      }
    }

    // 水面波动
    if (this.water) {
      this.water.material.uniforms['time'].value += 1 / 60
    }
  }

  // 按键转向
  keyboardToTotation() {
    const target = this.character
    // 向量
    const dir = new THREE.Vector3()
    // 目标视线方向坐标
    target?.getWorldDirection(dir)
    const mds = this.controls?.maxDistance || 1
    const dis = dir.clone().multiplyScalar(-mds)
    const newPos =
      target?.position.clone().setY(this.camera.position.y).add(dis) || new THREE.Vector3()
    this.camera.position.copy(newPos)
    this.setControlTarget(target?.position)
  }

  // 设置双击模型名称
  setDblclickModelName(names: string[]) {
    this.extend.dblclickModelName = names
  }

  // 双击
  onDblclick(e: MouseEvent) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e as PointerEvent, dom, scale)

    if (this.floorGroup && this.buildingGroup) {
      // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
      raycaster.setFromCamera(pointer, this.camera)
      // 检查射线和物体之间的交叉点（包含或不包含后代）
      const objects = this.floorGroup.children.concat(this.buildingGroup.children)
      const interscts = raycaster.intersectObjects(objects)

      if (interscts.length) {
        const obj = interscts[0].object
        const object = this.findParentGroup(obj, this.extend.dblclickModelName)
        if (!object) return
        if (typeof this.extend?.onDblclick === 'function') this.extend.onDblclick(object)
      }
    }
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
    const isClick = s < DEFAULTCONFIG.clickIntervalTime
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
    // 锚点或者地面
    const objects =
      this.buildingGroup?.children
        .filter((it: any) => it.visible && (isClick || it.__ground__))
        .concat(this.anchorGroup?.children || []) || []

    // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
    raycaster.setFromCamera(pointer, this.camera)
    let interscts = raycaster.intersectObjects(objects, isClick /* 是否检查所有后代 */)

    // dom.style.cursor = !isClick && interscts.length > 0 ? 'pointer' : 'auto'
    if (!isClick) {
      // 处理锚点类型-精灵材质
      this.hoverAnchor(interscts)
      return
    }
    dom.style.cursor = 'auto'

    if (interscts.length) {
      const intersct = interscts[0]
      const object = intersct.object
      console.log(intersct)

      // 是否点击地面
      const isClickGround =
        typeof object.name == 'string' &&
        (this.extend.groundMeshName || []).some(t => object.name.indexOf(t) > -1)

      const obj = this.findParentGroup(object)
      if (isClickGround) {
        if (typeof this.extend?.onClickGround === 'function')
          this.extend.onClickGround(obj, intersct)
      }

      if (!obj) return
      if (typeof this.extend?.onClickLeft === 'function') this.extend.onClickLeft(obj, intersct)
    } else {
      if (typeof this.extend?.onClickLeft === 'function') this.extend.onClickLeft()
    }
  }

  // 悬浮锚点
  hoverAnchor(interscts) {
    if (typeof this.extend.onHoverAnchor === 'function')
      this.extend.onHoverAnchor(interscts[0], style)

    if (interscts.length) {
      const intersct = interscts[0]
      const object = intersct.object
      this.container.style.cursor = object._isAnchor_ ? 'pointer' : 'auto'
      if (!object._isAnchor_) return

      const mat = object.material
      if (object.__mat_color__ === void 0) {
        object.__mat_color__ = mat.color
      }
      mat.color = new THREE.Color(0xff0ff0)
      this.anchorGroup?.children.forEach((el: any) => {
        el.__change_color__ = el.uuid === object.uuid
      })
    } else {
      this.container.style.cursor = 'auto'
      this.anchorGroup?.children.forEach((el: any) => {
        el.__change_color__ = false
      })
    }
  }

  // 恢复锚点材质
  restoreAnchorMaterial() {
    this.anchorGroup?.traverse((el: any) => {
      if (el.isSprite) {
        if (!el.__change_color__ && el.__mat_color__) {
          el.material.color = el.__mat_color__
        }
      }
    })
  }

  // 查找父级组合
  findParentGroup(object, filterNames: string[] = []) {
    const _find = obj => {
      if (obj._isBuilding_ || filterNames.includes(obj.name)) return obj
      let parent = obj.parent
      if (!parent) {
        return
      }
      return _find(parent)
    }
    return _find(object)
  }

  // 获取所有对象
  getAll() {
    return (
      this.buildingGroup?.children
        .concat(this.dotGroup?.children || [])
        .concat(this.floorGroup?.children || [])
        .concat(this.anchorGroup?.children || []) || []
    )
  }

  // 获取楼层组
  getFloorByGroup(name) {
    return this.floorGroup?.children.filter((it: any) => it.data.group === name)
  }

  // 获取跟随目标集合
  getFlowMark(mark) {
    return this.getAll().filter((el: any) => el.data?.followMark === mark)
  }

  resize() {
    super.resize()
    const { width, height } = this.options
    this.css2DRender.setSize(width, height)
  }

  dispose() {
    destroyEvent()
    this.animateModels = []
    this.disposeObj(this.buildingGroup)
    this.disposeObj(this.character)
    this.disposeObj(this.dotGroup)
    this.disposeObj(this.anchorGroup)
    this.disposeObj(this.fence)
    this.disposeObj(this.mouseClickDiffusion)
    this.disposeObj(this.floorGroup)
    this.disposeObj(this.lightGroup)

    this.clock = void 0
    // @ts-ignore
    this.css2DRender = void 0
    this.buildingGroup = void 0
    this.character = void 0
    this.dotGroup = void 0
    this.anchorGroup = void 0
    this.fence = void 0
    // @ts-ignore
    this.mouseClickDiffusion = void 0
    this.floorGroup = void 0
    this.lightGroup = void 0
    this.extend = {}
    super.dispose()
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
      color: '#' + (0xffffff + val * 1000000).toString(16).substring(0, 6)
    }
  }
}

// 偏移坐标
export const getOffsetPoint = (pos, offset = 0) => {
  return new THREE.Vector3(pos.x, pos.y + offset, pos.z)
}
