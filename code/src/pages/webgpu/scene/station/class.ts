import * as MS from './data/methods'
import type { ExtendOptions, Sky } from './type'
import type { ObjectItem, ThreeModelItem } from 'three-scene/types/model'

import __CONFOG__ from './data/config'

const { Utils, Hooks, THREE } = MS

const {
  createRoam,
  executeRoam,
  pause: roamPause,
  play: roamPlay,
  getStatus: getRoamStatus
} = Hooks.useRoam()
const { floorAnimate } = Hooks.useFloor()
const { keyboardPressed, destroyEvent, insertEvent } = Hooks.useKeyboardState()
const { createMove, moveAnimate, stop: moveStop } = Hooks.useMoveAnimate()
const { createDiffusion } = Hooks.useDiffusion2()
const { checkCollide } = Hooks.useCollide()
const { oddRotate } = Hooks.useOpenTheDoor()
const { virtualization, closeVirtualization } = Hooks.useModelLoader({})
const { createFence, fenceAnimate } = Hooks.useFence()

// 视角映射
const SIGHT_MAP = {
  SCREEN: 'SCREEN', // 全屏
  BIRD_VIEW: 'BIRD_VIEW', // 鸟瞰
  PERSON_FIRST: 'PERSON_FIRST', // 人物·第一人称
  PERSON_THREE: 'PERSON_THREE' // 人物·第三人称
}

export class Scene extends MS.Scene {
  // 场景合成渲染器
  postProcessing: InstanceType<typeof THREE.PostProcessing>

  // 建筑集合
  buildingGroup?: InstanceType<typeof THREE.Group>
  // 设备组
  deviceGroup?: InstanceType<typeof THREE.Group>
  // 锚点集合
  anchorGroup?: InstanceType<typeof THREE.Group>
  // 点位集合
  dotGroup?: InstanceType<typeof THREE.Group>
  // 灯光组
  lightGroup?: InstanceType<typeof THREE.Group>

  // 楼层集合（分层）
  floorGroup?: InstanceType<typeof THREE.Group>

  // 围栏
  fence?: InstanceType<typeof THREE.Group>

  // 水面
  // water?: InstanceType<typeof Water>

  // 扩展参数
  extend: Partial<ExtendOptions>

  // CSS2D 渲染器
  css2DRender?: InstanceType<typeof Hooks.CSS2DRenderer>
  // 扩散波效果
  diffusion: InstanceType<typeof THREE.Mesh> = new THREE.Mesh()

  // 动画模型集合
  animateModels: ThreeModelItem[] = []

  // 行走的人物
  person?: InstanceType<typeof THREE.Group> & {
    __runing__?: boolean
    extra: {
      mixer: InstanceType<typeof THREE.AnimationMixer>
      actions: Record<string, InstanceType<typeof THREE.AnimationAction>>
      defaultAction: InstanceType<typeof THREE.AnimationAction>
      runging: InstanceType<typeof THREE.AnimationAction>
    }
  }

  // 人物偏移向量
  personSightOffset = new THREE.Vector3(
    __CONFOG__.personSightOffset.x,
    __CONFOG__.personSightOffset.y,
    __CONFOG__.personSightOffset.z
  )
  // 移动系数
  moveFactor = __CONFOG__.moveFactor
  // 当前视角
  currentSight = SIGHT_MAP.SCREEN

  // 缓存信息
  controlCache = {
    // 中心目标
    target: new THREE.Vector3(),
    // 相机坐标
    cameraPosition: new THREE.Vector3(),
    // 视角最远距离
    maxDistance: 0,
    // 人物坐标
    personPosition: new THREE.Vector3()
  }

  // 环境光
  ambientLight = new THREE.AmbientLight()
  // 平行光
  directionalLight = new THREE.DirectionalLight()

  // 当前风格（白天/傍晚/夜间）
  sky: Sky = __CONFOG__.sky
  style = -1
  styleTimes = __CONFOG__.styleTimes

  // 碰撞间距
  collisionSpace = __CONFOG__.collisionSpace

  constructor(options: ConstructorParameters<typeof MS.Scene>[0], extend: Partial<ExtendOptions>) {
    super(options)
    this.extend = extend

    // 场景合成
    this.postProcessing = MS.createPostProcessing(this.scene, this.camera, this.renderer)

    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    // 预编译着色器
    // @ts-ignore
    this.pmremGenerator.compileEquirectangularShader()

    // CSS2D 渲染器
    this.css2DRender = MS.createCSS2DRender(this.options, this.container)
    this.addDotGroup()

    // 时间生成器
    this.createClock()

    // 建筑组
    this.addBuildingGroup()

    // 建筑组
    this.addDeviceGroup()

    // 楼层组
    this.addFloorGroup()

    // 锚点组
    this.addAnchorGroup()

    // 灯光组
    this.addLightGroup()

    // 扩散波
    this.addDiffusion()

    // 查找灯光
    this.findLight()

    // 绑定事件
    this.bindEvent()
  }

  // 模型动画
  modelAnimate() {
    let delta = this.clock?.getDelta() as number

    // css2D 渲染器
    this.css2DRender?.render(this.scene, this.camera)

    if (typeof this.extend.animateCall === 'function') this.extend.animateCall()

    // 锚点动画
    this.anchorAnimateUpdate(delta)

    // 模型动画
    this.modelAnimateUpdate(delta)

    // 场景风格
    this.autoChangeStyle()

    // 执行漫游
    executeRoam(this.camera, this.controls)

    // 人物动画
    this.personAnimate(delta)

    // 恢复锚点组 hover 效果
    MS.restoreAnchorMaterial(this.anchorGroup)

    // 围栏动画
    fenceAnimate()
  }

  ///////////////////////////
  /////////// 添加模型组 ///////////
  ///////////////////////////
  // 添加点位组
  addDotGroup() {
    if (!this.css2DRender) return
    this.css2DRender.domElement.className = 'three-scene__dot-wrap'
    const group = new THREE.Group()
    group.name = '点位组'
    group.visible = false
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
    if (!this.dotGroup) return new THREE.Mesh()
    const label = MS.createDotCSS2DDom(item, clickBack)
    this.dotGroup.add(label)
    return label
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

    this.clearDevice()
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

  // 添加设备组
  addDeviceGroup() {
    const group = new THREE.Group()
    group.name = '设备组'
    this.deviceGroup = group
    this.addObject(group)
  }
  // 清除设备组
  clearDevice() {
    if (this.deviceGroup) {
      this.disposeObj(this.deviceGroup)
    }
    this.addDeviceGroup()
  }
  // 添加设备
  addDevice(...obj) {
    if (this.deviceGroup) {
      this.deviceGroup.add(...obj)
    }
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
  addAnchor(obj, isAnimate) {
    if (this.anchorGroup) {
      this.anchorGroup.add(obj)
    }
    if (!isAnimate) return

    const { x, y, z } = obj.position
    // 创建精灵动画
    Utils.createSpriteAnimate(obj, [x, y, z], 1, 8)
  }
  // 锚点动画
  anchorAnimateUpdate(delta) {
    this.anchorGroup?.children.forEach((el: any) => {
      if (el.__mixer__) {
        el.__mixer__.update(delta)
      }
    })
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
  // 开关灯
  lightSwitch(object, isOpen?: boolean, max?: number) {
    const light = this.lightGroup?.getObjectsByProperty('name', object.data?.bind)
    if (!light) return
    // console.log('控制灯数量:', max != void 0 && max >= 0 ? max : '全部')
    light.forEach((el, index) => {
      // max 存在则默认未点亮，其他关闭
      let visible = max != void 0 && max >= 0 ? false : isOpen != void 0 ? isOpen : !el.visible
      if (max != void 0 && max >= 0 && index < max) {
        visible = isOpen != void 0 ? isOpen : true
      }
      el.visible = visible
    })
  }
  // 关闭所有灯光
  closeLightGroup(isOpen: boolean = false) {
    this.lightGroup?.traverse((el: any) => {
      if (el.isSpotLight || el.isRectAreaLight) {
        el.visible = isOpen
      }
    })
  }

  ///////////////////////////
  /////////// 人物 ///////////
  ///////////////////////////
  // 添加人物
  addPerson(model) {
    this.person = model
    const { mixer, actions } = MS.getModelAction(model)
    // 默认状态
    const defaultAction = actions[__CONFOG__.personDefaultAnimateName]
    defaultAction.play()
    // 步行
    const runging = actions[__CONFOG__.personRuningAnimateName]
    model.extra = {
      mixer,
      actions,
      runging,
      defaultAction
    }
    this.addObject(model)
    this.addPersonEvent()
  }
  // 人物行走
  personWalk(isWalk = true) {
    const personModel = this.person
    if (!personModel) return
    const { defaultAction, runging } = personModel.extra
    if (isWalk) {
      runging.play()
      defaultAction.stop()
    } else {
      defaultAction.play()
      runging.stop()
    }
  }
  // 人物事件
  addPersonEvent() {
    const personModel = this.person
    if (!personModel) return
    const keys = ['W', 'S'].map(key => key.toUpperCase().charCodeAt(0)).concat([38, 40])

    // 插入事件 播放/暂停 动作
    insertEvent(
      e => {
        // 人物运行中或者巡航激活或者非人物视角则不处理
        if (personModel.__runing__ || this.isCruise() || !this.isPersonSight()) return
        if (keys.includes(e.keyCode)) {
          this.personWalk()
        }
        if (this.isPersonSight()) {
          if (keyboardPressed('X')) {
            this.personSpeed(1)
          }
          if (keyboardPressed('Z')) {
            this.personSpeed(-1)
          }
        }
      },
      e => {
        if (personModel.__runing__ || this.isCruise() || !this.isPersonSight()) return
        if (keys.includes(e.keyCode)) {
          this.personWalk(false)
        }
      }
    )
  }
  // 人物视角
  isPersonSight() {
    return (
      this.currentSight === SIGHT_MAP.PERSON_FIRST || this.currentSight === SIGHT_MAP.PERSON_THREE
    )
  }
  // 第一人称视角
  isFirstPersonSight() {
    return this.currentSight === SIGHT_MAP.PERSON_FIRST
  }
  // 人物加速
  personSpeed(speed = 1) {
    this.moveFactor += speed
    if (this.moveFactor >= 10) this.moveFactor = 10
    else if (this.moveFactor <= 1) this.moveFactor = 1
    ElMessage.success({
      message: '人物速度：' + this.moveFactor,
      grouping: true
    })
  }
  // 关闭人物视角
  clsoePerson() {
    this.currentSight = SIGHT_MAP.SCREEN
    // 是否行走中
    if (this.person?.__runing__) {
      moveStop(false)
      this.person.__runing__ = false
      this.diffusion.visible = false
      // 关闭行走动作
      this.personWalk(false)
    }
    // 显示人物
    this.person && (this.person.visible = true)
    this.togglePersonView()
  }
  // 切换人物界面效果
  togglePersonView() {
    const dom = this.container.parentNode?.querySelector(
      '.' + __CONFOG__.personSightClass
    ) as HTMLDivElement
    if (!dom) return
    const isCharacter = this.isPersonSight()
    dom.style.display = isCharacter ? 'block' : 'none'
  }
  // 人物视角
  togglePersonSight(type?: number) {
    if (!__CONFOG__.sightToggle) {
      // 第一视角
      if (type == 1 && this.currentSight === SIGHT_MAP.PERSON_FIRST) return
      // 第三视角
      if (type == 3 && this.currentSight === SIGHT_MAP.PERSON_THREE) return
    }
    // 关闭巡航
    this.closeCruise()
    // 关闭漫游
    this.closeRoam()

    // 当前视角
    if (__CONFOG__.sightToggle) {
      this.currentSight = this.isPersonSight()
        ? SIGHT_MAP.SCREEN
        : type == 1
        ? SIGHT_MAP.PERSON_FIRST
        : SIGHT_MAP.PERSON_THREE
    } else {
      this.currentSight = type == 1 ? SIGHT_MAP.PERSON_FIRST : SIGHT_MAP.PERSON_THREE
    }

    // 人物视角界面效果
    this.togglePersonView()
    this.cameraChangeByPerson()
    // 控制器限制切换
    this.controlsLimitSet()
  }
  // 机位切换
  cameraChangeByPerson() {
    if (!this.person || !this.controls) return
    // 人物视角
    const isPerson = this.isPersonSight()
    const personModel = this.person
    const position = personModel.position

    let { target, to } = this.getControlsCache()
    // 向量
    const up = this.personSightOffset.clone()
    /// 切换到人物视角，暂存控制参数
    if (isPerson) {
      ElMessage.success({
        message: `鼠标点击地面移动，或键盘按键 ${__CONFOG__.personKeys
          .map(it => `${it.code} ${it.desc}`)
          .join('、')}，来控制人物！`,
        grouping: true
      })

      this.setControlCache()
      const pos = position.clone().add(up)

      // 第一人称相机角度
      if (this.isFirstPersonSight()) {
        this.keyboardToTotation(true)
      } else {
        this.camera.lookAt(pos)
        this.controls.target.copy(position.clone().add(up))
      }
      // 相机高度距离人物大于 8
      if (Math.abs(this.camera.position.y - pos.y) > 8) {
        this.camera.position.y = pos.y
      }
    } else {
      this.camera.position.copy(to)
      this.camera.lookAt(this.controls.target)
      this.controls.target.copy(target)
    }
  }
  // 按键转向
  keyboardToTotation(setTarget?: boolean) {
    const personModel = this.person
    if (!personModel) return
    // 向量
    const dir = new THREE.Vector3()
    // 目标视线方向坐标
    personModel?.getWorldDirection(dir)

    const cPos = this.camera.position.clone()
    const y = cPos.y
    const mds = cPos.sub(personModel.position.clone().setY(y)).length()
    const dis = dir.clone().multiplyScalar(-mds)
    this.camera.position.copy(personModel.position.clone().setY(y).add(dis))

    if (setTarget) {
      this.setControlTarget(personModel?.position)
    }
  }
  // 控制器限制设置
  controlsLimitSet() {
    if (!this.controls) return
    const sight = this.currentSight
    const isPersonFirst = sight === SIGHT_MAP.PERSON_FIRST
    const isPerson = isPersonFirst || sight === SIGHT_MAP.PERSON_THREE

    // 控制器操作限制切换
    this.controls.maxDistance = isPerson
      ? isPersonFirst
        ? 0
        : __CONFOG__.cameraMaxDistance.threePerson
      : this.controlCache.maxDistance
    this.controls.screenSpacePanning = !isPerson
    this.controls.enablePan = !isPerson
    // 第一人称则隐藏人物
    this.person && (this.person.visible = !isPersonFirst)
  }
  // 人物动画
  personAnimate(delta) {
    const personModel = this.person
    if (personModel) {
      const mixer = personModel.extra.mixer
      mixer.update(delta)
      // 人物移动
      moveAnimate(0.2 * this.moveFactor)

      // 人物视角
      if (this.isPersonSight() && !personModel.__runing__) {
        const factor = 1 + this.moveFactor / 5
        // 移动速度
        const steep = __CONFOG__.personRuningSpeed * delta * factor
        // 旋转速度
        const angle = Math.PI * 0.2 * delta * factor
        // 前进后退
        this.keyboardToMove(steep)

        // 转向
        if (keyboardPressed(['A', 'left'])) {
          personModel.rotation.y += angle
          this.keyboardToTotation()
        } else if (keyboardPressed(['D', 'right'])) {
          personModel.rotation.y -= angle
          this.keyboardToTotation()
        }
      }
    }
  }
  // 按键前进
  keyboardToMove(steep) {
    const personModel = this.person
    // 前进后退
    const isS = keyboardPressed(['S', 'down'])
    if (keyboardPressed(['W', 'up']) || isS) {
      // 向量
      const dir = new THREE.Vector3()
      // 获取的视线方向
      personModel?.getWorldDirection(dir)
      // dis向量表示相机沿着相机视线方向平移的位移量
      const dis = dir.clone().multiplyScalar(isS ? -steep : steep)
      // 初始位置+偏移向量
      const newPos = personModel?.position.clone().add(dis) || new THREE.Vector3()
      // 检测碰撞
      if (!this.checkCharacterCollide(newPos)) {
        personModel?.position.copy(newPos)
        this.setControlTarget(personModel?.position)
      }
    }
  }
  // 检测人物碰撞
  checkCharacterCollide(pos, y = 0.3) {
    if (!this.person) return
    // 检测碰撞
    const intersects = checkCollide(
      this.person,
      pos,
      this.buildingGroup?.children || [],
      true,
      new THREE.Vector3(0, y, 0)
    )
    if (intersects.length) {
      const intersect = intersects[0]

      // 于目标距离
      if (intersect.distance < this.collisionSpace) {
        this.log('撞到了！')
        return true
      }
    }
  }
  // 人物移动
  personMove(intersct) {
    // 巡航中不可操作
    if (this.judgeCruise()) return Promise.reject()
    // 非人物视角
    if (!this.isPersonSight()) return Promise.reject()

    const personModel = this.person
    if (!personModel) return Promise.reject()

    const lookAt = intersct.point
    const obj = this.diffusion

    this.personWalk()

    obj.position.copy(lookAt.clone().add(new THREE.Vector3(0, 0.05, 0)))
    obj.visible = true

    return new Promise(resolve => {
      personModel.__runing__ = true
      // 创建移动
      createMove(
        personModel,
        lookAt,
        (pos, stop) => {
          this.setControlTarget(pos)
          if (this.checkCharacterCollide(pos, 0.3)) {
            stop()
            this.personWalk(false)
            personModel.__runing__ = false
            obj.visible = false
          }
        },
        pos => {
          this.setControlTarget(pos)
          this.personWalk(false)
          personModel.__runing__ = false
          obj.visible = false
          resolve(personModel)
        }
      )
    })
  }

  ///////////////////////////
  ////////// 楼层 //////////
  ///////////////////////////
  // 楼层展开
  floorExpand(object) {
    const data = object.data
    const list = this.getFloorByGroup(data.group) as any[]
    if (!list.length) return
    const index = list.findIndex(el => object.uuid === el.uuid)
    floorAnimate(list, index, mark => this.getFlowMark(mark))
  }

  ///////////////////////////
  ////////// 机房 //////////
  ///////////////////////////
  // 获取机房
  getMachineRoomStatus(name) {
    const room = this.scene.getObjectByName(name) as ThreeModelItem
    return {
      isFocus: room?.__isFocus__,
      room
    }
  }
  // 机房视角-其他虚化
  toCoolMachineRoom() {
    this.closeRoam()
    this.clsoePerson()
    this.closeCruise()
    this.clsoePerson()

    const { room, isFocus } = this.getMachineRoomStatus(__CONFOG__.machineRoomName)

    if (!room) {
      ElMessage.warning({
        message: '未找到机房模块！',
        grouping: true
      })
      return
    }

    room.__isFocus__ = !isFocus
    if (isFocus) {
      closeVirtualization(this.buildingGroup?.children)
      this.toggleCoolMachineRoomFocus(false)
      return
    }
    this.toggleCoolMachineRoomFocus(true)
    virtualization(this.buildingGroup?.children || [], room, {
      wireframe: !false,
      hidden: true,
      opacity: 0.1,
      filter: []
    })
  }
  // 机房聚焦
  toggleCoolMachineRoomFocus(isFocus) {
    if (!this.controls) return
    let { target, to, maxDistance } = this.getControlsCache()
    // 聚焦移动 暂存场景参数
    if (isFocus) {
      this.setControlCache()
      target = new THREE.Vector3(-78.4, -33, 29.2)
      to = new THREE.Vector3(-3.62, -27.53, 18.14)
      maxDistance = 320
    }
    this.controls.maxDistance = maxDistance

    this.dotGroup && (this.dotGroup.visible = isFocus)
    Utils.cameraLinkageControlsAnimate(this.controls, this.camera, to, target)
  }
  // 清除机房聚焦效果
  clearCoolMachineRoomFocus() {
    const { room, isFocus } = this.getMachineRoomStatus(__CONFOG__.machineRoomName)
    if (isFocus) {
      closeVirtualization(this.buildingGroup?.children)
    }
    room.__isFocus__ = false

    this.dotGroup && (this.dotGroup.visible = false)
  }
  // 关闭机房视角
  closeRoom() {
    const { isFocus } = this.getMachineRoomStatus(__CONFOG__.machineRoomName)
    if (isFocus) this.clearCoolMachineRoomFocus()
  }

  ///////////////////////////
  ////////// 扩散波 //////////
  ///////////////////////////
  // 添加扩散波
  addDiffusion() {
    const mesh = createDiffusion(
      {
        textureSrc: __CONFOG__.diffusionImg,
        bloomIntensity: 0.2
      },
      THREE
    )
    mesh.position.y = 0.5
    mesh.visible = false
    this.addObject(mesh)
    this.diffusion = mesh
  }

  ///////////////////////////
  /////////// 开门 ///////////
  ///////////////////////////
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

  ///////////////////////////
  /////////// 相机 ///////////
  ///////////////////////////
  // 相机移动聚焦点
  cameraLookatMoveTo(pos) {
    if (!this.controls) return
    Utils.cameraLookatAnimate(this.camera, pos, this.controls.target)
  }

  // 相机转场
  cameraTransition(object) {
    const { to, target = object.position } = object.data
    if (!to) return
    if (!this.isCameraMove(to) && this.controls) {
      this.closeRoam()
      this.clsoePerson()
      this.closeCruise()
      this.clsoePerson()
      this.controls.enablePan = true

      const dis = new THREE.Vector3(to.x, to.y, to.z).distanceTo(
        new THREE.Vector3(target.x, target.y, target.z)
      )
      this.controls.maxDistance = dis
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
  // 相机名称转场
  cameraTransitionByModelname(name) {
    const cameraTransitionList = __CONFOG__.cameraTransitionList
    const obj = cameraTransitionList.find(it => it.name === name)
    if (!obj) return
    this.cameraTransition({ data: obj })
  }

  ///////////////////////////
  /////////// 模型动画 ///////////
  ///////////////////////////
  // 添加模型动画
  addModelAnimate(model, animations = [], play: boolean = true, timeScale: number = 1) {
    MS.createModelAnimate(model, animations, play, timeScale)
    this.animateModels.push(model)
  }
  // 模型动画
  modelAnimateUpdate(delta) {
    if (this.animateModels.length) {
      this.animateModels.forEach((el: any) => {
        if (el.__mixer__) {
          el.__mixer__.update(delta)
        }
      })
    }
  }

  ///////////////////////////
  /////////// 控制 ///////////
  ///////////////////////////
  // 控制器重置
  controlReset() {
    // 关闭 漫游、人物、机房
    this.closeRoam()
    this.clsoePerson()
    this.closeRoom()
    if (!this.controls) return
    const controls = this.options.controls
    Object.keys(controls).forEach(key => {
      this.controls && (this.controls[key] = controls[key])
    })
    super.controlReset()
  }
  // 缓存控制信息
  setControlCache() {
    if (!this.controls) return
    const controlCache = this.controlCache
    controlCache.target = controlCache.target.copy(this.controls.target)
    controlCache.cameraPosition = controlCache.cameraPosition.copy(this.camera.position)
    controlCache.maxDistance = this.controls.maxDistance
  }
  // 获取缓存控制信息
  getControlsCache() {
    const controlCache = this.controlCache
    return {
      target: controlCache.target,
      to: controlCache.cameraPosition,
      maxDistance: controlCache.maxDistance
    }
  }
  // 设置控制中心点
  setControlTarget(position) {
    if (!this.controls) return
    const camera = this.camera
    const controls = this.controls
    const newPos = position.clone().add(this.personSightOffset.clone())

    camera.position.sub(controls.target)
    controls.target.copy(newPos)
    camera.position.add(newPos)
  }

  ///////////////////////////
  /////////// 巡航 ///////////
  ///////////////////////////
  // 定点巡航
  toggleCruise(close?: boolean) {
    if (!__CONFOG__.sightToggle) {
      close = false
      if (!close === this.options.cruise.runing) return
    }

    this.clsoePerson()
    this.person && (this.person.visible = false)
    this.closeRoam()
    this.closeRoom()
    const runing = !(close ?? this.options.cruise.runing)
    // 即将运行则缓存人物坐标
    if (runing && this.person) {
      this.controlCache.personPosition.copy(this.person?.position)
      // 停止行走
      this.personWalk()
    } else {
      // 人物坐标恢复巡航前
      this.person?.position.copy(this.controlCache.personPosition)
      this.personWalk(false)
    }
    super.toggleCruise(close)
    setTimeout(() => {
      // 显示人物
      this.person && (this.person.visible = true)
    }, 30)
  }
  // 巡航状态回调
  cruiseStatusCall({ enabled, runing }) {
    if (!enabled) return
    this.personWalk(runing)
  }
  // 巡航过渡回调
  cruiseAnimateCall(options) {
    if (!options.enabled || !this.person) return
    MS.cruiseTargetMove(this.person, options, this.controls)
  }
  // 关闭巡航
  closeCruise() {
    const isRuning = this.options.cruise.runing
    // this.closeDot3()
    super.closeCruise()
    if (isRuning) {
      // 人物坐标恢复巡航前
      this.person?.position.copy(this.controlCache.personPosition)
      this.personWalk(false)
      // 关闭人物行走动画
      this.personWalk(false)
    }
  }
  // 设置巡航
  setCruisePoint(points: number[][]) {
    super.setCruisePoint(points)

    this.toggleCruiseBloom(true, THREE)
  }

  // 判断巡航
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

  ///////////////////////////
  /////////// 漫游 ///////////
  ///////////////////////////
  // 漫游
  toggleRoam() {
    this.closeCruise()
    this.clsoePerson()
    this.closeRoom()
    if (this.closeRoam()) return
    const points = this.extend.roamPoints || []
    if (points.length == 0) return
    if (!this.controls) return
    this.controls.maxDistance = __CONFOG__.cameraMaxDistance.roam
    createRoam({
      points,
      segment: 12,
      tension: 0.5,
      speed: 2,
      close: !false,
      factor: 1
    })
    roamPlay()
  }
  // 设置漫游点位
  setRoamPoint(points) {
    this.extend.roamPoints = points
  }
  // 关闭漫游
  closeRoam() {
    if (getRoamStatus()) {
      if (this.controls) {
        this.controls.maxDistance = this.options.controls.maxDistance
      }
      roamPause()
      return true
    }
    return false
  }

  ///////////////////////////
  /////////// 鼠标事件 ///////////
  ///////////////////////////
  // 设置双击模型名称
  setDblclickModelName(names: string[]) {
    this.extend.dblclickModelName = names
  }

  // 双击
  onDblclick(e: MouseEvent) {
    if (this.floorGroup && this.buildingGroup) {
      const objects = this.floorGroup.children.concat(this.buildingGroup.children)
      // 检查相交对象
      const interscts = MS.getIntersectObjects(
        e as PointerEvent,
        this.container,
        this.options.scale,
        this.camera,
        objects,
        // 计算后代，悬浮不计算，否则耗性能
        true
      )

      if (interscts.length) {
        const obj = interscts[0].object
        const object = MS.findParentIsBuilding(obj, this.extend.dblclickModelName)
        if (!object) return
        if (typeof this.extend?.onDblclick === 'function') this.extend.onDblclick(object)
      }
    }
  }

  // 鼠标移动
  onPointerMove(e: PointerEvent) {
    this.checkIntersectObjects(e)
  }
  // 鼠标弹起
  onPointerUp(e: PointerEvent) {
    super.onPointerUp(e)
    let s = e.timeStamp - this.pointer.tsp
    // 判断是否未点击
    const isClick = s < __CONFOG__.clickIntervalTime
    if (e.button == 2) {
      if (isClick && typeof this.extend?.onClickRight === 'function') this.extend.onClickRight(e)
    } else if (e.button == 0) {
      isClick && this.checkIntersectObjects(e)
    }
  }
  // 检查相交对象
  checkIntersectObjects(e: PointerEvent) {
    let isClick = e.type == 'pointerdown' || e.type == 'pointerup'

    // 点击未弹起 且第一视角
    if (this.pointer.isClick && this.person && this.isFirstPersonSight()) {
      this.person.rotation.y -= this.movementXToAngle(e.movementX)
    }

    // 锚点或者地面
    const objects =
      this.buildingGroup?.children
        .filter((it: any) => it.visible && (isClick || it.__ground__))
        .concat(this.anchorGroup?.children || []) || []

    // 检查相交对象
    const interscts = MS.getIntersectObjects(
      e,
      this.container,
      this.options.scale,
      this.camera,
      objects,
      // 计算后代，悬浮不计算，否则耗性能
      isClick
    )

    if (!isClick) {
      // 处理锚点类型-精灵材质
      MS.hoverAnchor(interscts, this.extend.onHoverCall, this.container, this.anchorGroup)
    }
    if (!isClick) return
    if (interscts.length) {
      const intersct = interscts[0]
      const object = intersct.object
      this._isTest && console.log(intersct)
      // 建筑
      const obj = MS.findParentIsBuilding(object)

      // 点击地面
      const isClickGround =
        typeof object.name == 'string' &&
        __CONFOG__.groundMeshName.some(t => object.name.indexOf(t) > -1)
      if (isClickGround) {
        if (typeof this.extend?.onClickGround === 'function')
          this.extend.onClickGround(obj, intersct)
      }

      if (!obj) return
      // 左键
      if (typeof this.extend?.onClickLeft === 'function') this.extend.onClickLeft(obj, intersct)
    } else {
      if (typeof this.extend?.onClickLeft === 'function') this.extend.onClickLeft()
    }
  }

  ///////////////////////////
  /////////// 获取模型 ///////////
  ///////////////////////////
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

  ///////////////////////////
  /////////// 渲染 ///////////
  ///////////////////////////
  // 渲染器
  createRender() {
    const render = new THREE.WebGPURenderer(this.options.render)
    return render
  }

  createScene() {
    return new THREE.Scene()
  }

  createDirectionalLight(color: string | number, intensity: number) {
    return new THREE.DirectionalLight(color, intensity)
  }

  createAmbientLight(color: string | number, intensity: number) {
    return new THREE.AmbientLight(color, intensity)
  }
  // 渲染
  render() {
    this.postProcessing?.renderAsync()
  }

  run() {
    this.renderer.setAnimationLoop(() => {
      this.animate()
      this.modelAnimate()
    })
    return this
  }

  resize() {
    super.resize()
    const { width, height } = this.options
    this.css2DRender?.setSize(width, height)
  }

  // 查找灯光
  findLight() {
    // 环境光
    const amb = this.scene.getObjectByProperty('isAmbientLight', true) as InstanceType<
      typeof THREE.AmbientLight
    >
    this.ambientLight = amb
    // 平行光
    const dire = this.scene.getObjectByProperty('isDirectionalLight', true) as InstanceType<
      typeof THREE.DirectionalLight
    >
    this.directionalLight = dire
  }

  ///////////////////////////
  /////////// 主题 ///////////
  ///////////////////////////
  // 白天
  toByday(style = 1) {
    this.style = style
    const { ambientLight, directionalLight } = this.options
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
    this.setStyleOptions(0.01, 0.3, this.sky.night, true)
  }

  // 设置环境贴图
  setEnv(texture) {
    // this.scene.background = texture
    const envMap = this.convertPmremTexture(texture)
    this.scene.environment = envMap
    texture.dispose()
  }

  // 设置 sky 参数 (环境光强度，平行光强度，hdr，可见)
  setStyleOptions(ambIntensity, dirIntensity, hdr, _visible = false) {
    this.ambientLight.intensity = ambIntensity
    this.directionalLight.intensity = dirIntensity

    this.loadEnvTexture(hdr)
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

  dispose() {
    destroyEvent()
    this.animateModels = []
    this.disposeObj(this.buildingGroup)
    // this.disposeObj(this.character)
    this.disposeObj(this.dotGroup)
    this.disposeObj(this.anchorGroup)
    this.disposeObj(this.fence)
    // this.disposeObj(this.mouseClickDiffusion)
    this.disposeObj(this.floorGroup)
    this.disposeObj(this.lightGroup)

    this.clock = void 0
    // @ts-ignore
    this.css2DRender = void 0
    this.buildingGroup = void 0
    // this.character = void 0
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
