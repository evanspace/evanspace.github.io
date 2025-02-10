import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import * as ThreeScene from 'three-scene'

import DEFAULTCONFIG from './config'

import type { ExtendOptions } from '.'
import type { ObjectItem, ThreeModelItem } from 'three-scene/types/model'

const Hooks = ThreeScene.Hooks
const Utils = ThreeScene.Utils
const { raycaster, pointer, update: raycasterUpdate, style } = Hooks.useRaycaster()
const { initCSS2DRender, createCSS2DDom } = Hooks.useCSS2D()
const { createDiffusion, updateDiffusion } = Hooks.useDiffusion()
const { createMove, moveAnimate } = Hooks.useMoveAnimate()
const { createFence, fenceAnimate } = Hooks.useFence()
const { keyboardPressed, destroyEvent, insertEvent } = Hooks.useKeyboardState()
const { checkCollide } = Hooks.useCollide()
const { dubleHorizontal, dubleRotate, oddRotate } = Hooks.useOpenTheDoor()
const {
  createRoam,
  executeRoam,
  pause: roamPause,
  play: roamPlay,
  getStatus: getRoamStatus
} = Hooks.useRoam()

const base = import.meta.env.VITE_BEFORE_STATIC_PAT || ''

const sightMap = {
  full: 'FULL',
  npc: 'NPC'
}

// 创建视频元素
const createVideoDom = (src?: string) => {
  const dom = document.createElement('video')
  dom.src = base + (src || '/oss/textures/park/sintel.mp4')
  dom.loop = true
  // videoDom.autoplay = true
  return dom
}

// 视频封面
const videoCoverTexture = new THREE.TextureLoader().load(base + '/oss/textures/office/cover.jpg')
// 空调风纹理
const windTexture = new THREE.TextureLoader().load(base + '/oss/textures/office/wind.png')

export class OfficeThreeScene extends ThreeScene.Scene {
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
  }
  characterHeight = 3.5

  // 当前视角
  currentSight: string
  // 历史中心点（视角切换）
  historyTarget: InstanceType<typeof THREE.Vector3>
  // 历史相机坐标（视角切换）
  historyCameraPosition: InstanceType<typeof THREE.Vector3>

  // 动画模型集合
  animateModels: ThreeModelItem[] = []

  // 视频元素集合
  videoModels: ThreeModelItem[] = []
  // 画布纹理集合
  canvasTextures: any[] = []

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

    this.bindEvent()
    this.addBuildingGroup()
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
    Utils.createSpriteAnimate(obj, [x, y, z], 0.2, 8)
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
    this.dotGroup?.add(label)
    return label
  }

  // 添加灯光组
  addLightGroup() {
    const group = new THREE.Group()
    group.name = '灯光组'
    this.lightGroup = group
    this.addObject(group)
  }

  // 清除灯光组
  clearLightGroup() {
    if (this.lightGroup) {
      this.disposeObj(this.lightGroup)
    }
    this.addLightGroup()
  }

  // 关闭所有灯光
  closeLightGroup(isOpen: boolean = false) {
    this.lightGroup?.children.forEach((el: any) => {
      if (el.isSpotLight) {
        el.visible = isOpen
      }
    })
  }

  // 添加灯光
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

  // 绘制 canva 材质
  drawCanvas(text = '') {
    if (!this.extend.canvas) return
    const canvas = this.extend.canvas
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#f00'

    // 分割为两行
    const rows = 2,
      max = 12,
      len = text.length
    const rlen = len > max ? Math.ceil(len / rows) : max
    let list: string[] = [],
      index = 0
    while (index < len) {
      const end = index + rlen
      list.push(text.substring(index, end))
      index = end
    }

    ctx.font = '100 40px 微软雅黑'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const tl = list.length

    list.forEach((tx, index) => {
      const i = index * tl + 1
      ctx.fillText(tx, w / 2, (h / tl / 2) * i)
    })

    if (!this.canvasTextures.length) return
    this.canvasTextures.forEach(map => {
      map.needsUpdate = true
    })
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

    // 舞蹈
    const dance = actions['Dance']
    dance.play()

    // 步行
    const runging = actions['Walking']

    model.extra = {
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

  // 视角切换（人物/全屏）
  // 1-第一人称 3-第三人称
  toggleSight(type?: number) {
    if (this.judgeCruise()) return

    // 漫游
    this.judgeAndStopRoam()

    const sight = this.currentSight == sightMap.full ? sightMap.npc : sightMap.full
    this.currentSight = sight

    // 人物视角
    const isCharacter = sight === sightMap.npc
    if (!this.controls) return

    // 控制器操作限制切换
    this.controls.maxDistance = isCharacter ? (type == 3 ? 10 : 0) : 800
    this.controls.screenSpacePanning = !isCharacter
    this.controls.enablePan = !isCharacter
    // this.controls.maxPolarAngle = Math.PI * (isCharacter ? 0.8 : 0.48)

    if (!this.character) return
    const position = this.character.position

    // 向量
    const up = new THREE.Vector3(0, this.characterHeight, 0)
    /// 切换到人物视角，暂存控制参数
    if (isCharacter) {
      ElMessage.success({
        message: '鼠标点击地面移动，或键盘 W、S 前后移动，A、D调整左右方向，X 加速，Z 减速!',
        duration: 15 * 1000
      })
      this.historyTarget = this.controls.target.clone()
      this.historyCameraPosition = this.camera.position.clone()
      const pos = position.clone().add(up)

      this.camera.lookAt(pos)
      // 相机高度距离人物大于 8
      if (Math.abs(this.camera.position.y - pos.y) > 8) {
        this.camera.position.y = pos.y
      }
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

  // 清楚人物视角状态
  clearCharacterSight() {
    this.currentSight = sightMap.full
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
    this.controls.target.copy(point.clone().add(new THREE.Vector3(0, this.characterHeight, 0)))
    this.camera.lookAt(this.controls.target)
  }

  //  等电梯
  waitLift(object, fllow?: boolean) {
    // 电梯组
    const liftName = object.data.target
    // 电梯轿厢
    const box = this.scene.getObjectByName(liftName) as any
    console.log(box, liftName)

    // 当前绑定坐标
    const cpos = object.data?.to
    if (!box || !cpos) return
    // y 轴对比
    const bpos = box.position

    // 判断间距
    if (Math.abs(cpos.y - bpos.y) > 0.2) {
      // 电梯关门
      const bindLift = box.__bind_lift__
      if (bindLift !== void 0) {
        // 绑定过则关闭电梯门
        this.dubleHorizontalDoor(
          {
            data: { bind: bindLift }
          },
          2.3,
          false
        )
      }
      this.dubleHorizontalDoor(
        {
          data: { bind: liftName }
        },
        2.3,
        false
      ).then(() => {
        const duration = 1000 * 5
        ElMessage.success({
          message: `${liftName}移动中，请稍候，${duration / 1000}秒后到达!`,
          duration: duration
        })

        // 电梯移动
        new TWEEN.Tween(bpos)
          .to(
            {
              y: cpos.y
            },
            duration
          )
          .delay(0)
          .start()
          .onUpdate(pos => {
            // 人物跟随
            if (fllow) {
              if (!this.character) return
              this.character.position.y = pos.y
              this.camera.position.y = pos.y
              this.setControlTarget(this.character.position)
            }
          })
          .onComplete(() => {
            console.log('电梯到了！', box)
            // 当前移动到哪一层，后续滑动时需要关闭之前到达的层
            box.__bind_lift__ = object.data.bind
            // 电梯开门
            this.openLift(object, liftName)
          })
      })
    } else {
      this.openLift(object, liftName)
    }
  }

  // 电梯开门
  openLift(object, liftName) {
    // 电梯门打开
    this.dubleHorizontalDoor(object, 2.3)
    this.dubleHorizontalDoor(
      {
        data: { bind: liftName }
      },
      2.3
    )
  }

  // 开关灯
  lightSwitch(object, isOpen?: boolean, max?: number) {
    const light = this.lightGroup?.getObjectsByProperty('name', object.data?.bind)
    if (!light) return
    console.log('控制灯数量:', max != void 0 && max >= 0 ? max : '全部')
    light.forEach((el, index) => {
      // max 存在则默认未点亮，其他关闭
      let visible = max != void 0 && max >= 0 ? false : isOpen != void 0 ? isOpen : !el.visible
      if (max != void 0 && max >= 0 && index < max) {
        visible = isOpen != void 0 ? isOpen : true
      }
      el.visible = visible
    })
  }

  // 双开门(两扇门 往两边平移)
  dubleHorizontalDoor(object, scale = 400, isOpen?: boolean) {
    const { bind, axle = 'z' } = object.data

    return dubleHorizontal(this.scene, {
      value: bind,
      axle,
      scale,
      isOpen
    })
  }

  // 单旋转开门
  oddRotateDoor(object) {
    const { bind, axle = 'y', internal, autoClose = false } = object.data

    return oddRotate(this.scene, {
      value: bind,
      axle,
      angle: Math.PI * (internal ? -0.5 : 0.5),
      autoClose
    })
  }

  // 双旋转开门
  dubleRotateDoor(object) {
    const { bind, axle = 'y', left = '右', right = '左', internal, autoClose = true } = object.data

    return dubleRotate(this.scene, {
      value: bind,
      axle,
      autoClose,
      angle: Math.PI * (internal ? -0.5 : 0.5),
      leftMatch: left,
      rightMatch: right
    })
  }

  // 闸机
  openGate(object) {
    return this.dubleRotateDoor(object)
  }

  // 窗帘动画
  toggleCurtain(object, isOpen?) {
    const dobj = this.animateModels.find(el => el.name === object.data?.bind)
    console.log(dobj)
    if (!dobj) return

    dobj.__open__ = isOpen ?? !dobj.__open__

    const { __action__, __mixer__ } = dobj
    Object.keys(__action__).forEach(key => {
      if (dobj.__open__) {
        __action__[key].loop = THREE.LoopOnce
        __action__[key].clampWhenFinished = true
        __action__[key].play()
      }
    })
    if (!dobj.__open__) {
      __mixer__.stopAllAction()
    }
  }

  // 视频材质
  addVideoMaterial(names: string[]) {
    const material = new THREE.MeshPhongMaterial({
      map: videoCoverTexture
      // side: THREE.DoubleSide
    })

    this.videoModels = []
    for (let i = 0; i < names.length; i++) {
      const dbObj = this.scene.getObjectByName(names[i]) as any
      if (!dbObj) continue
      const videoDom2 = createVideoDom()
      const videoTexture2 = new THREE.VideoTexture(videoDom2)
      dbObj.__video_texture__ = videoTexture2
      dbObj.__cover_texture__ = videoCoverTexture.clone()
      dbObj.material = material.clone()
      dbObj.__video__ = videoDom2
      this.videoModels.push(dbObj)
    }
  }

  // 画布纹理
  addCanvasMaterial(names: string[]) {
    if (!this.extend.canvas) return
    const material = new THREE.MeshPhongMaterial({
      map: new THREE.CanvasTexture(this.extend.canvas),
      side: THREE.DoubleSide
    })
    this.canvasTextures = []
    for (let i = 0; i < names.length; i++) {
      const dbObj = this.scene.getObjectByName(names[i]) as any
      if (!dbObj) continue
      dbObj.material = material.clone()
      dbObj.__cover_texture__ = material.map?.clone()
      this.canvasTextures.push(dbObj.material.map)
    }
  }

  // 清理视频
  clearVideo() {
    const videos = this.videoModels
    for (let i = 0; i < videos.length; i++) {
      const obj = videos[i]
      const { __video__, __cover_texture__, __video_texture__ } = obj
      if (__video__) {
        __video__.pause()
        __video__.remove()
        __cover_texture__?.dispose()
        __video_texture__?.dispose()
      }
    }
  }

  // 视频播放
  videoPlay(object) {
    const vobj = this.scene.getObjectByName(object.data.bind) as any
    if (vobj && vobj.__video__) {
      const __video__ = vobj.__video__
      if (__video__.paused) {
        vobj.material.map = vobj.__video_texture__
        __video__?.play()
      } else {
        __video__?.pause()
        vobj.material.map = vobj.__cover_texture__
      }
    }
  }

  // 添加空调风材质
  addAirWindMaterial(names: string[]) {
    windTexture.wrapS = THREE.RepeatWrapping
    windTexture.repeat.x = 1
    const material = new THREE.MeshPhongMaterial({
      color: 0xc6deff,
      map: windTexture,
      // opacity: 0.9,
      transparent: true,
      side: THREE.DoubleSide
    })

    for (let i = 0; i < names.length; i++) {
      const dobj = this.scene.getObjectByName(names[i]) as any
      if (!dobj) return
      dobj.traverse(el => {
        if (el.isMesh) {
          el.material = material
        }
      })
      dobj.visible = false
    }
  }

  // 空调开关
  toggleAir(object, isOpen?) {
    const dobj = this.scene.getObjectByName(object.data.bind) as any
    console.log(dobj)
    if (!dobj) return
    dobj.__open__ = isOpen ?? !dobj.__open__
    dobj.visible = dobj.__open__
  }

  // 鼠标点击地面
  mouseClickGround(intersct, filterName: string[]) {
    if (this.currentSight !== sightMap.npc) return Promise.reject()

    const character = this.character as any
    if (!character) return Promise.reject()
    const { runing } = this.options.cruise
    // 自动巡航中不操作
    if (runing) return Promise.reject()
    const lookAt = intersct.point
    const obj = this.mouseClickDiffusion

    const { runging } = character.extra
    runging.play()

    obj.position.copy(lookAt)
    obj.visible = true

    character.__runing__ = true
    return new Promise(resolve => {
      // 创建移动
      createMove(
        character,
        lookAt,
        (pos, stop) => {
          this.setControlTarget(pos)
          if (
            this.checkCharacterCollide(pos, filterName.includes(intersct.object.name) ? 2 : 0.3)
          ) {
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
      if (intersect.distance < 0.3) {
        ElMessage.warning({
          message: '撞到了！',
          grouping: true
        })
        return true
      }
    }
  }

  // 相机移动聚焦点
  cameraLookatMoveTo(pos) {
    if (!this.controls) return
    Utils.cameraLookatAnimate(this.camera as any, pos, this.controls.target)
  }

  // 判断是否巡航中
  judgeCruise() {
    if (this.options.cruise.runing) {
      ElMessage.warning({
        message: '请退出巡航！',
        grouping: true
      })
      return true
    }
    return false
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
      this.judgeAndStopRoam()
      this.controls.maxDistance = 5
      Utils.cameraLinkageControlsAnimate(this.controls, this.camera, to, target)
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

  controlReset() {
    this.judgeAndStopRoam()
    this.clearCharacterSight()
    if (!this.controls) return
    this.controls.maxDistance = 1500
    this.controls.maxPolarAngle = Math.PI * 0.48
    super.controlReset()
  }

  // 判断漫游，并停止
  judgeAndStopRoam() {
    if (getRoamStatus()) {
      if (this.controls) {
        this.controls.maxDistance = 1500
      }
      roamPause()
      return true
    }
    return false
  }

  // 设置漫游点位
  setRoamPoint(points) {
    this.extend.roamPoints = points
  }

  // 漫游
  toggleRoam() {
    this.clearCharacterSight()
    if (this.judgeAndStopRoam()) return
    const points = this.extend.roamPoints || []
    if (points.length == 0) return
    if (!this.controls) return
    this.controls.maxDistance = 20
    createRoam({
      points,
      segment: 6,
      tension: 0.2,
      speed: 4,
      close: false
    })
    roamPlay()
  }

  // 模型动画
  modelAnimate(): void {
    // css2D 渲染器
    this.css2DRender.render(this.scene, this.camera)

    if (typeof this.extend.animateCall === 'function') this.extend.animateCall()

    this.restoreAnchorMaterial()

    let delta = this.clock?.getDelta() as number
    // 模型动画
    if (this.animateModels.length) {
      this.animateModels.forEach((el: any) => {
        if (el.__mixer__) {
          el.__mixer__.update(delta)
        }
      })
    }

    this.anchorGroup?.children.forEach((el: any) => {
      if (el.__mixer__) {
        el.__mixer__.update(delta)
      }
    })

    if (this.character) {
      const mixer = (this.character as any).extra.mixer
      mixer.update(delta)

      moveAnimate(0.2 * this.moveFactor)
    }

    // 波纹扩散
    if (this.mouseClickDiffusion.visible) {
      updateDiffusion()
    }

    fenceAnimate()

    // 人物视角
    if (this.isCharacterSight() && !this.character?.__runing__) {
      const factor = 1 + this.moveFactor / 5
      // 移动速度
      const steep = 5 * delta * factor
      // 旋转速度
      const angle = Math.PI * 0.2 * delta * factor
      const target = this.character
      if (!target) return
      const isS = keyboardPressed('S')
      if (keyboardPressed('W') || isS) {
        // 向量
        const dir = new THREE.Vector3()
        // 获取的视线方向
        target?.getWorldDirection(dir)
        // dis向量表示相机沿着相机视线方向平移的位移量
        const dis = dir.clone().multiplyScalar(isS ? -steep : steep)
        // 初始位置+偏移向量
        const newPos = target?.position.clone().add(dis) || new THREE.Vector3()
        if (this.checkCharacterCollide(newPos)) {
        } else {
          target?.position.copy(newPos)
          this.setControlTarget(target?.position)
        }
      }

      if (keyboardPressed('A')) {
        target.rotation.y += angle
        this.keyboardToTotation()
      } else if (keyboardPressed('D')) {
        target.rotation.y -= angle
        this.keyboardToTotation()
      }
    }

    executeRoam(this.camera, this.controls)

    if (windTexture) {
      windTexture.offset.x += 0.02
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
    return this.buildingGroup?.children.concat(this.dotGroup?.children || []) || []
  }

  resize() {
    super.resize()
    const { width, height } = this.options
    this.css2DRender.setSize(width, height)
  }

  dispose() {
    destroyEvent()
    this.animateModels = []
    this.clearVideo()
    this.videoModels = []
    this.canvasTextures = []
    this.disposeObj(this.buildingGroup)
    this.disposeObj(this.character)
    this.disposeObj(this.dotGroup)
    this.disposeObj(this.anchorGroup)
    this.disposeObj(this.fence)
    this.disposeObj(this.lightGroup)
    this.disposeObj(this.mouseClickDiffusion)

    this.clock = void 0
    // @ts-ignore
    this.css2DRender = void 0
    this.buildingGroup = void 0
    this.character = void 0
    this.dotGroup = void 0
    this.anchorGroup = void 0
    this.lightGroup = void 0
    this.fence = void 0
    // @ts-ignore
    this.mouseClickDiffusion = void 0
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
