import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'

import DEFAULTCONFIG from './config'
import * as MS from './methods'
import { ExtendOptions, Sky } from '.'
import { ObjectItem, ThreeModelItem, XYZ } from 'three-scene/types/model'

const { Utils, Hooks } = MS

const {
  createRoam,
  executeRoam,
  pause: roamPause,
  play: roamPlay,
  getStatus: getRoamStatus
} = Hooks.useRoam()
const { dubleHorizontal, dubleRotate, oddRotate } = Hooks.useOpenTheDoor()
const { keyboardPressed, destroyEvent, insertEvent } = Hooks.useKeyboardState()
const { createMove, moveAnimate } = Hooks.useMoveAnimate()
const { checkCollide } = Hooks.useCollide()
const { virtualization, closeVirtualization } = Hooks.useModelLoader({})
const { createDiffusion, updateDiffusion } = Hooks.useDiffusion2(
  [
    '1.png',
    '2.png',
    '3.png',
    '4.png',
    '5.png',
    '6.png',
    '7.png',
    '8.png',
    '9.png',
    '10.png',
    '11.png',
    '12.png'
  ].map(it => `${DEFAULTCONFIG.baseUrl}/oss/textures/diffusion/${it}`)
)

// 视角映射
const SIGHT_MAP = {
  SCREEN: 'SCREEN', // 屏幕
  PERSON_FIRST: 'PERSON_FIRST', // 人物·第一人称
  PERSON_THREE: 'PERSON_THREE' // 人物·第三人称
}

// 地面网格名称
const GROUND_MESH_NAMES = DEFAULTCONFIG.groundMeshName.concat(DEFAULTCONFIG.liftGroundMeshName)

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

  // 画布纹理集合
  canvasTextures: InstanceType<typeof THREE.Texture>[] = []
  // 视频元素集合
  videoModels: ThreeModelItem[] = []

  // 行走的人物
  person?: InstanceType<typeof THREE.Group> & {
    __runing__?: boolean
    extra: {
      mixer: InstanceType<typeof THREE.AnimationMixer>
      actions: Record<string, InstanceType<typeof THREE.AnimationAction>>
      dance: InstanceType<typeof THREE.AnimationAction>
      runging: InstanceType<typeof THREE.AnimationAction>
    }
  }
  // 人物视线高度
  personSightHeight = DEFAULTCONFIG.personSightHeight
  // 移动系数
  moveFactor = DEFAULTCONFIG.moveFactor

  // 当前视角
  currentSight = SIGHT_MAP.SCREEN
  // 历史中心点（视角切换）
  historyTarget: InstanceType<typeof THREE.Vector3> = new THREE.Vector3()
  // 历史相机坐标（视角切换）
  historyCameraPosition: InstanceType<typeof THREE.Vector3> = new THREE.Vector3()

  // 扩散波效果
  diffusion: InstanceType<typeof THREE.Mesh> = new THREE.Mesh()

  // 碰撞间距
  collisionSpace = DEFAULTCONFIG.collisionSpace

  // 空调组
  airGroup?: InstanceType<typeof THREE.Group>
  airSpeed = THREE.TSL.uniform(0.05)

  constructor(
    options: ConstructorParameters<typeof ThreeScene.Scene>[0],
    extend: Partial<ExtendOptions>
  ) {
    super(options)

    this.extend = extend

    this.createClock()

    // 场景合成
    this.postProcessing = MS.createPostProcessing(this.scene, this.camera, this.renderer)

    // 建筑
    this.addBuildingGroup()

    // 锚点
    this.addAnchorGroup()

    // CSS2D 渲染器
    this.css2DRender = MS.createCSS2DRender(this.options, this.container)
    this.addDotGroup()
    // 灯光
    this.addLightGroup()

    // 流光
    this.addFleeting()
    // 路灯
    this.addStreetLamp()
    // 居民灯
    this.addResidentLight()

    // 查找灯光
    this.findLight()

    // 绑定事件
    this.bindEvent()

    // 扩散波
    this.addDiffusion()
    console.log(this)
  }

  // 设置环境贴图
  setEnv(texture) {
    this.scene.environment = texture
    this.scene.background = texture
  }

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
    this.postProcessing.renderAsync()
  }

  run() {
    this.renderer.setAnimationLoop(() => {
      this.animate()
      this.modelAnimate()
    })
    return this
  }

  // 模型动画
  modelAnimate() {
    let delta = this.clock?.getDelta() as number

    // css2D 渲染器
    this.css2DRender?.render(this.scene, this.camera)

    // 场景风格
    this.autoChangeStyle()

    // 锚点动画
    this.anchorAnimateUpdate(delta)

    // 流光动画
    if (this.fleetingGroup?.visible) {
      MS.fleetingGroupAnimate(1)
    }

    // 模型动画
    this.modelAnimateUpdate(delta)

    // 执行漫游
    executeRoam(this.camera, this.controls)
    // 恢复锚点组 hover 效果
    MS.restoreAnchorMaterial(this.anchorGroup)

    // 人物动画
    this.persionAnimate(delta)

    // 扩散波
    this.diffusionAnimate()
  }

  // 查找灯光
  findLight() {
    // 环境光
    const amb = this.scene.getObjectByProperty('isAmbientLight', true) as THREE.AmbientLight
    this.ambientLight = amb
    // 平行光
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

  // 设置 sky 参数 (环境光强度，平行光强度，hdr，可见)
  setStyleOptions(ambIntensity, dirIntensity, hdr, visible = false) {
    this.ambientLight.intensity = ambIntensity
    this.directionalLight.intensity = dirIntensity
    this.fleetingGroup && (this.fleetingGroup.visible = visible)
    this.streetLampGroup && (this.streetLampGroup.visible = visible)
    this.residentLightGroup && (this.residentLightGroup.visible = visible)
    this.toggleCruiseBloom(visible, THREE)

    this.loadEnvTexture(hdr, _texture => {
      // this.postProcessing.needsUpdate = true
      // console.log(this.scene.environment)
      // this.postProcessing = MS.createPostProcessing(this.scene, this.camera, this.renderer)
      // console.log(this.postProcessing)
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
  // 锚点动画
  anchorAnimateUpdate(delta) {
    this.anchorGroup?.children.forEach((el: any) => {
      if (el.__mixer__) {
        el.__mixer__.update(delta)
      }
    })
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
    if (!this.dotGroup) return new THREE.Mesh()
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
  // 关闭所有灯光
  closeLightGroup(isOpen: boolean = false) {
    this.lightGroup?.traverse((el: any) => {
      if (el.isSpotLight || el.isRectAreaLight) {
        el.visible = isOpen
      }
    })
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

  // 添加路灯
  addStreetLamp() {
    this.streetLampGroup = MS.createStreetLampGroup(DEFAULTCONFIG.streetLamps)
    this.addObject(this.streetLampGroup)
  }

  // 添加居民灯
  addResidentLight() {
    this.residentLightGroup = MS.createResidentLightGroup(DEFAULTCONFIG.residentLights)
    this.addObject(this.residentLightGroup)
  }

  // 窗帘动画
  toggleCurtain(object, isClose?) {
    const dobj = this.animateModels.find(el => el.name === object.data?.bind)
    if (!dobj) return
    MS.toggleCurtainAnimate(dobj, isClose)
    return dobj.__close__
  }

  ///////////////////////////
  /////////// 开门 ///////////
  ///////////////////////////

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
  // 闸机
  openGate(object) {
    return this.dubleRotateDoor(object)
  }

  ///////////////////////////
  /////////// 电梯 ///////////
  ///////////////////////////
  // 等电梯
  waitLift(object, personIsFllow?: boolean) {
    // 电梯组
    const liftName = object.data.target
    // 电梯轿厢
    const box = this.scene.getObjectByName(liftName) as any
    if (!box) {
      ElMessage.error({
        message: `【${liftName}】模块未找到！`,
        grouping: true
      })
    }
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
        const opt = {
          data: { bind: bindLift }
        }
        // 绑定过则关闭电梯门-上一次打开，防止不在同一层的外门未关闭
        this.dubleHorizontalDoor(opt, 2.3, false)
      }
      const opt = {
        data: { bind: liftName }
      }
      // 关电梯门
      this.dubleHorizontalDoor(opt, 2.3, false).then(() => {
        const personModel = this.person
        // 电梯移动
        MS.liftMove(liftName, bpos, { y: cpos.y })
          .onUpdate(pos => {
            // 人物跟随
            if (personIsFllow) {
              if (!this.person) return
              this.person.position.y = pos.y
              // 获取前进坐标
              const newPos = MS.getForwardPosition(personModel, 0.1)
              this.camera.position.y = pos.y + this.personSightHeight
              this.setControlTarget(newPos)
            }
          })
          .onComplete(() => {
            // 当前移动到哪一层，后续滑动时需要关闭之前到达的层
            box.__bind_lift__ = object.data.bind
            // 电梯开门
            this.openDoorByLift(object, liftName)
          })
      })
    } else {
      this.openDoorByLift(object, liftName)
    }
  }
  // 电梯开门
  openDoorByLift(object, liftName) {
    // 电梯门打开
    this.dubleHorizontalDoor(object, 2.3)
    const opt = {
      data: { bind: liftName }
    }
    this.dubleHorizontalDoor(opt, 2.3)
  }

  ///////////////////////////
  /////////// 大屏 ///////////
  ///////////////////////////
  // 视频材质
  addVideoMaterial(names: string[]) {
    this.videoModels = []
    for (let i = 0; i < names.length; i++) {
      const name = names[i]
      const dbObj = this.buildingGroup?.getObjectByName(name) as any
      if (!dbObj) continue
      // 灯光
      const light = this.lightGroup?.getObjectByName(name + '-照明灯')
      if (light) {
        light.visible = true
      }
      MS.addVideoMaterial(dbObj)
      this.videoModels.push(dbObj)
    }
  }
  // 清理视频
  clearVideo() {
    MS.clearVideo(this.videoModels)
  }
  // 视频播放
  videoPlay(object) {
    const vobj = this.scene.getObjectByName(object.data.bind) as any
    MS.videoMaterilPlay(vobj)
  }
  // 绘制 canva 材质
  drawCanvas(text = '') {
    if (!this.extend.canvas) return
    MS.drawBdCanvas(this.extend.canvas, text)

    if (!this.canvasTextures.length) return
    this.canvasTextures.forEach(map => {
      map.needsUpdate = true
    })
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

  ///////////////////////////
  /////////// 人物 ///////////
  ///////////////////////////
  // 添加人物
  addPerson(model) {
    this.person = model
    const { mixer, actions } = MS.getModelAction(model)
    // 舞蹈
    const dance = actions['PlayOne-Talk']
    dance.play()
    // 步行
    const runging = actions['PlayOne-Walk']
    model.extra = {
      mixer,
      actions,
      runging,
      dance
    }
    this.addObject(model)
    this.addPersonEvent()
  }
  // 人物行走
  personWalk(isWalk = true) {
    const personModel = this.person
    if (!personModel) return
    const { dance, runging } = personModel.extra
    if (isWalk) {
      dance.stop()
      runging.play()
    } else {
      runging.stop()
      dance.play()
    }
  }
  // 人物事件
  addPersonEvent() {
    const personModel = this.person
    if (!personModel) return
    const keys = ['W', 'S'].map(key => key.toUpperCase().charCodeAt(0))

    // 插入事件 播放/暂停 动作
    insertEvent(
      e => {
        if (personModel.__runing__) return
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
        if (personModel.__runing__) return
        if (keys.includes(e.keyCode)) {
          this.personWalk(false)
        }
      }
    )
  }
  // 人物动画
  persionAnimate(delta) {
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
        const steep = 5 * delta * factor
        // 旋转速度
        const angle = Math.PI * 0.2 * delta * factor
        // 前进后退
        this.keyboardToMove(steep)

        // 转向
        if (keyboardPressed('A')) {
          personModel.rotation.y += angle
          this.keyboardToTotation()
        } else if (keyboardPressed('D')) {
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
    const isS = keyboardPressed('S')
    if (keyboardPressed('W') || isS) {
      // 向量
      const dir = new THREE.Vector3()
      // 获取的视线方向
      personModel?.getWorldDirection(dir)
      // dis向量表示相机沿着相机视线方向平移的位移量
      const dis = dir.clone().multiplyScalar(isS ? -steep : steep)
      // 初始位置+偏移向量
      const newPos = personModel?.position.clone().add(dis) || new THREE.Vector3()
      if (!this.checkCharacterCollide(newPos)) {
        personModel?.position.copy(newPos)
        if (isS) {
          // 定位后一步
          const ds = dir.clone().multiplyScalar(-steep * 2)
          this.camera.position.copy(this.camera.position.clone().add(ds))
        }
        this.setControlTarget(personModel?.position)
      }
    }
  }
  // 按键转向
  keyboardToTotation() {
    const personModel = this.person
    // 向量
    const dir = new THREE.Vector3()
    // 目标视线方向坐标
    personModel?.getWorldDirection(dir)
    const mds = this.controls?.maxDistance || 1
    const dis = dir.clone().multiplyScalar(-mds)
    const newPos =
      personModel?.position.clone().setY(this.camera.position.y).add(dis) || new THREE.Vector3()
    this.camera.position.copy(newPos)
    this.setControlTarget(personModel?.position)
  }
  // 人物视角
  togglePersonSight(type?: number) {
    // 巡航中不可操作
    if (this.judgeCruise()) return
    // 判断漫游并停止
    this.judgeAndStopRoam()

    // 当前视角
    const sight = this.isPersonSight()
      ? SIGHT_MAP.SCREEN
      : type == 1
      ? SIGHT_MAP.PERSON_FIRST
      : SIGHT_MAP.PERSON_THREE
    this.currentSight = sight

    console.log(sight)

    // 控制器限制切换
    this.controlsLimitSet()
    // 人物视角界面效果
    this.togglePersonView()
    this.cameraChangeByPerson()
  }
  // 控制器限制设置
  controlsLimitSet() {
    if (!this.controls) return
    const sight = this.currentSight
    const isPersonFirst = sight === SIGHT_MAP.PERSON_FIRST
    const isPerson = isPersonFirst || sight === SIGHT_MAP.PERSON_THREE

    // 控制器操作限制切换
    this.controls.maxDistance = isPerson ? (isPersonFirst ? 0 : 10) : 800
    this.controls.screenSpacePanning = !isPerson
    this.controls.enablePan = !isPerson
  }
  // 人物视角
  isPersonSight() {
    return (
      this.currentSight === SIGHT_MAP.PERSON_FIRST || this.currentSight === SIGHT_MAP.PERSON_THREE
    )
  }
  // 切换人物界面效果
  togglePersonView() {
    const dom = this.container.parentNode?.querySelector(
      '.' + DEFAULTCONFIG.personSightClass
    ) as HTMLDivElement
    if (!dom) return
    const isCharacter = this.isPersonSight()
    dom.style.display = isCharacter ? 'block' : 'none'
  }
  // 清除人物视角状态
  clearPersonSightStatus() {
    this.currentSight = SIGHT_MAP.SCREEN
    this.togglePersonView()
  }
  // 机位切换
  cameraChangeByPerson() {
    if (!this.person || !this.controls) return
    // 人物视角
    const isPerson = this.isPersonSight()
    const position = this.person.position
    // 向量
    const up = new THREE.Vector3(0, this.personSightHeight, 0)
    /// 切换到人物视角，暂存控制参数
    if (isPerson) {
      ElMessage.success({
        message: `鼠标点击地面移动，或键盘按键 ${DEFAULTCONFIG.personKeys
          .map(it => `${it.code} ${it.desc}`)
          .join('、')}，来控制人物！`,
        grouping: true
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

    const vect = isPerson ? position : this.historyTarget
    const pos = vect.clone().add(up)
    this.controls.target.copy(pos)
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
  // 人物移动
  personMove(intersct) {
    // 巡航中不可操作
    if (this.judgeCruise()) return Promise.reject()
    // 非人物视角
    if (!this.isPersonSight()) return Promise.reject()

    const personModel = this.person
    if (!personModel) return Promise.reject()
    // 电梯网格
    const liftMeshName = DEFAULTCONFIG.liftGroundMeshName

    const lookAt = intersct.point
    const obj = this.diffusion

    this.personWalk()

    obj.position.copy(lookAt.clone().add(new THREE.Vector3(0, 0.05, 0)))
    obj.visible = true

    return new Promise(resolve => {
      // 创建移动
      createMove(
        personModel,
        lookAt,
        (pos, stop) => {
          this.setControlTarget(pos)
          if (
            this.checkCharacterCollide(pos, liftMeshName.includes(intersct.object.name) ? 2 : 0.3)
          ) {
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
        ElMessage.warning({
          message: '撞到了！',
          grouping: true
        })
        return true
      }
    }
  }

  ///////////////////////////
  ////////// 扩散波 //////////
  ///////////////////////////
  // 添加扩散波
  addDiffusion() {
    const mesh = createDiffusion(2)
    mesh.rotation.x = -Math.PI * 0.5
    mesh.position.y = 0.5
    mesh.visible = false
    this.addObject(mesh)
    this.diffusion = mesh
  }
  // 扩散波动画
  diffusionAnimate() {
    if (this.diffusion.visible) {
      updateDiffusion(2)
    }
  }

  ///////////////////////////
  /////////// 鸟瞰 ///////////
  ///////////////////////////
  // 公司鸟瞰图
  toggleBridCompany() {
    if (this.judgeCruise()) return
    this.clearPersonSightStatus()
    this.judgeAndStopRoam()

    const name = DEFAULTCONFIG.companyModelName
    const model = this.buildingGroup?.getObjectByName(name) as ThreeModelItem
    console.log(model)
    if (!model) {
      ElMessage.warning({
        message: `未找到【${name}】模块！`,
        grouping: true
      })
      return
    }

    // 设置聚焦
    model.__isFocus__ = !model.__isFocus__

    if (!model.__isFocus__) {
      this.closeVirtualization()
      this.toggleCompanyFocus(false)
      return
    }
    this.toggleCompanyFocus(true)
    virtualization(this.buildingGroup?.children || [], model, {
      wireframe: !false,
      hidden: true,
      opacity: 0.1,
      filter: ['电梯-1']
    })
  }
  // 关闭虚化
  closeVirtualization() {
    const name = DEFAULTCONFIG.companyModelName
    const model = this.buildingGroup?.getObjectByName(name) as ThreeModelItem
    model.__isFocus__ = false
    closeVirtualization(this.buildingGroup?.children, {
      filter: ['_空调风_grp']
    })
  }
  // 公司聚焦
  toggleCompanyFocus(isFocus) {
    if (!this.controls) return
    let target = this.historyTarget
    let to = this.historyCameraPosition as XYZ

    // 聚焦移动 暂存场景参数
    if (isFocus) {
      this.historyTarget = new THREE.Vector3().copy(this.controls.target)
      this.historyCameraPosition = new THREE.Vector3().copy(this.camera.position)

      target = new THREE.Vector3(8.5, 185, 0)
      to = { x: 8.5, y: 290, z: 135 }
    }

    this.controls.maxDistance = 320

    this.controls.enablePan = isFocus
    Utils.cameraLinkageControlsAnimate(this.controls, this.camera, to, target)
  }

  ///////////////////////////
  /////////// 空调 ///////////
  ///////////////////////////
  addAirWindMaterial(_names: string[]) {
    const group = MS.createAirGroup(this.scene, this.airSpeed)

    this.airGroup = group
    this.addObject(group)
  }
  // 空调开关
  toggleAir(object, isOpen?) {
    if (!this.airGroup) return
    const bind = object.data.bind
    // 存在则单控
    if (bind) {
      const dobj = this.airGroup.getObjectByName(object.data.bind) as any
      if (!dobj) return
      dobj.__open__ = isOpen ?? !dobj.__open__
      dobj.visible = dobj.__open__
    } else {
      // 全控
      this.airGroup?.children.forEach(el => {
        this.toggleAir({ data: { bind: el.name } }, isOpen)
      })
    }
  }
  // 空调风速
  changeAirWindSpeed(speed = 0.02) {
    this.airSpeed.value += speed
    if (this.airSpeed.value < 0.05) {
      this.airSpeed.value = 0.05
    }
    if (this.airSpeed.value > 0.5) {
      this.airSpeed.value = 0.5
    }
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
    if (this.judgeCruise()) return
    if (this.diffusion.visible) {
      ElMessage.warning({
        message: '人物移动中，不可操作！',
        grouping: true
      })
      return
    }

    this.clearPersonSightStatus()

    const { to, target = object.position } = object.data

    if (!to) return

    if (!this.isCameraMove(to) && this.controls) {
      // 判断漫游并停止
      this.judgeAndStopRoam()
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

  // 控制器重置
  controlReset() {
    this.judgeAndStopRoam()
    this.clearPersonSightStatus()
    this.closeVirtualization()
    if (!this.controls) return
    this.controls.enablePan = true
    this.controls.maxDistance = 1500
    this.controls.maxPolarAngle = Math.PI * 0.48
    super.controlReset()
  }
  // 设置控制中心点
  setControlTarget(point) {
    if (!this.controls) return
    this.controls.target.copy(point.clone().add(new THREE.Vector3(0, this.personSightHeight, 0)))
    this.camera.lookAt(this.controls.target)
  }

  // 漫游
  toggleRoam() {
    this.clearPersonSightStatus()
    if (this.judgeAndStopRoam()) return
    const points = this.extend.roamPoints || []
    if (points.length == 0) return
    if (!this.controls) return
    this.controls.maxDistance = 5
    createRoam({
      points,
      segment: 6,
      tension: 0,
      speed: 2,
      close: false,
      factor: 1
    })
    roamPlay()
  }
  // 设置漫游点位
  setRoamPoint(points) {
    this.extend.roamPoints = points
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

  // 定点巡航
  toggleCruise(close?: boolean) {
    super.toggleCruise(close)
    // 场景合成
    this.postProcessing = MS.createPostProcessing(this.scene, this.camera, this.renderer)
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

  // 鼠标移动
  onPointerMove(e: PointerEvent) {
    this.checkIntersectObjects(e)
  }
  // 鼠标弹起
  onPointerUp(e: PointerEvent) {
    super.onPointerUp(e)
    let s = e.timeStamp - this.pointer.tsp
    // 判断是否未点击
    const isClick = s < DEFAULTCONFIG.clickIntervalTime
    if (e.button == 2) {
      if (isClick && typeof this.extend?.onClickRight === 'function') this.extend.onClickRight(e)
    } else if (e.button == 0) {
      isClick && this.checkIntersectObjects(e)
    }
  }
  // 检查相交对象
  checkIntersectObjects(e: PointerEvent) {
    let isClick = e.type == 'pointerdown' || e.type == 'pointerup'
    // 锚点或者地面
    const objects =
      this.buildingGroup?.children
        .filter((it: any) => it.visible)
        .map(it => {
          it.children = it.children.filter(t => t.visible)
          return it
        })
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

    // 处理锚点类型-精灵材质
    MS.hoverAnchor(interscts, this.extend.onHoverAnchor, this.container, this.anchorGroup)
    if (!isClick) return

    if (interscts.length) {
      const intersct = interscts[0]
      const object = intersct.object
      console.log(intersct)

      // 建筑
      const obj = MS.findParentIsBuilding(object)
      // 点击地面
      const isClickGround =
        typeof object.name == 'string' && GROUND_MESH_NAMES.some(t => object.name.indexOf(t) > -1)
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

  // 销毁场景
  dispose() {
    this.clearVideo()
    this.animateModels = []
    this.canvasTextures = []
    this.videoModels = []
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

    this.renderer.dispose()
    destroyEvent()
    super.dispose()
  }
}
