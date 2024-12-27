import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import * as ThreeScene from 'three-scene/build/three-scene.module'

import type { Config, ExtendOptions } from '.'
import type { ObjectItem, XYZ } from 'three-scene/src/types/model'

import DEFAULTCONFIG from './config'

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

const sightMap = {
  full: 'FULL',
  npc: 'NPC'
}
export class StationThreeScene extends ThreeScene.Scene {
  // 建筑集合
  buildingGroup?: InstanceType<typeof THREE.Group>
  // 锚点集合
  anchorGroup?: InstanceType<typeof THREE.Group>
  // 点位集合
  dotGroup?: InstanceType<typeof THREE.Group>
  // 扩展参数
  extend: Partial<ExtendOptions>
  // CSS2D 渲染器
  css2DRender: InstanceType<typeof Hooks.CSS2DRenderer>
  // 鼠标点击地面扩散波效果
  mouseClickDiffusion: InstanceType<typeof THREE.Mesh>
  // 行走的人物
  character?: InstanceType<typeof THREE.Group> & {
    extra: {
      key: string
      mixer: any
      actions: any[]
    }
  }
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
    __mixer__: any
  })[]

  // 移动系数
  moveFactor: number = 1

  // 围栏
  fence?: InstanceType<typeof THREE.Group>

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
  toggleSight() {
    if (this.judgeCruise()) return

    const sight = this.currentSight == sightMap.full ? sightMap.npc : sightMap.full
    this.currentSight = sight

    // 人物视角
    const isCharacter = sight === sightMap.npc

    if (!this.controls) return
    // 控制器操作限制切换
    this.controls.maxDistance = isCharacter ? 20 : 800
    this.controls.screenSpacePanning = !isCharacter
    this.controls.enablePan = !isCharacter
    this.controls.maxPolarAngle = Math.PI * (isCharacter ? 0.8 : 0.48)

    if (!this.character) return
    const position = this.character.position

    // 向量
    const up = new THREE.Vector3(0, 2, 0)
    /// 切换到人物视角，暂存控制参数
    if (isCharacter) {
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
  isPerspectives() {
    return this.currentSight == sightMap.npc
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
    const height = 3
    const { x, y, z } = point
    this.controls.target.set(x, y + height, z)
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

    return new Promise(resolve => {
      // 创建移动
      createMove(
        character,
        lookAt,
        pos => {
          this.setControlTarget(pos)
        },
        pos => {
          this.setControlTarget(pos)
          runging.stop()
          obj.visible = false
          resolve(character)
        }
      )
    })
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

    if (this.isPerspectives()) {
      this.toggleSight()
    }

    const { to, target = object.position } = object.data

    if (!to) return

    if (!this.isCameraMove(to)) {
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

      if (this.isPerspectives()) {
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
    if (this.isPerspectives()) {
      this.toggleSight()
    }
    super.controlReset()
    if (!this.controls) return
    this.historyTarget = new THREE.Vector3().copy(this.controls.target)
    this.historyCameraPosition = new THREE.Vector3().copy(this.camera.position)
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

  // 机房视角-其他虚化
  toCoolMachineRoom(isFocus) {
    if (!this.controls) return
    let target = this.historyTarget
    let to = this.historyCameraPosition as XYZ

    // 聚焦移动 暂存场景参数
    if (isFocus) {
      this.historyTarget = new THREE.Vector3().copy(this.controls.target)
      this.historyCameraPosition = new THREE.Vector3().copy(this.camera.position)

      target = new THREE.Vector3(-171.5, -6.5, 125.2)
      to = { x: -169.5, y: 34.9, z: 46.1 }
    }
    Utils.cameraLinkageControlsAnimate(
      this.controls,
      this.camera as InstanceType<typeof THREE.PerspectiveCamera>,
      to,
      target
    )
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

    let delta = this.clock?.getDelta()
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
  }

  // 双击
  onDblclick(e: MouseEvent) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e as PointerEvent, dom, scale)

    if (this.floorGroup) {
      // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
      raycaster.setFromCamera(pointer, this.camera)
      // 检查射线和物体之间的交叉点（包含或不包含后代）
      const objects = this.floorGroup.children
      const interscts = raycaster.intersectObjects(objects)
      if (interscts.length) {
        const obj = interscts[0].object
        const object = this.findParentGroup(obj)
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
  findParentGroup(object) {
    const _find = obj => {
      if (obj._isBuilding_) return obj
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
    this.animateModels = []
    this.disposeObj(this.buildingGroup)
    this.disposeObj(this.character)
    this.disposeObj(this.dotGroup)
    this.disposeObj(this.anchorGroup)
    this.disposeObj(this.fence)
    this.disposeObj(this.mouseClickDiffusion)
    this.disposeObj(this.floorGroup)

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
