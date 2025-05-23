import DEFAULTCONFIG from './config'
import * as MS from './methods'
import type { ExtendOptions, Sky, UpdateDotItem } from '.'
import type { ObjectItem, ThreeModelItem } from 'three-scene/types/model'
import { renderEcharts, disposeEcharts } from './echarts'

const { Utils, Hooks, THREE, Scene } = MS

const {
  createRoam,
  executeRoam,
  pause: roamPause,
  play: roamPlay,
  getStatus: getRoamStatus
} = Hooks.useRoam()
const { dubleHorizontal, dubleRotate, oddRotate } = Hooks.useOpenTheDoor()
const { keyboardPressed, destroyEvent, insertEvent } = Hooks.useKeyboardState()
const { createMove, moveAnimate, stop: moveStop } = Hooks.useMoveAnimate()
const { checkCollide } = Hooks.useCollide()
const { virtualization, closeVirtualization } = Hooks.useModelLoader({})
const { createDiffusion } = Hooks.useDiffusion2()

// 视角映射
const SIGHT_MAP = {
  SCREEN: 'SCREEN', // 全屏
  BIRD_VIEW: 'BIRD_VIEW', // 鸟瞰
  PERSON_FIRST: 'PERSON_FIRST', // 人物·第一人称
  PERSON_THREE: 'PERSON_THREE' // 人物·第三人称
}

// 地面网格名称
const GROUND_MESH_NAMES = DEFAULTCONFIG.groundMeshName.concat(DEFAULTCONFIG.liftGroundMeshName)

export class OfficeScene extends Scene {
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
  // CSS3D 渲染器
  css3DRender?: ReturnType<typeof MS.createCSS3DRender>
  // 点位集合
  dot3Group?: InstanceType<typeof THREE.Group>
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
      defaultAction: InstanceType<typeof THREE.AnimationAction>
      runging: InstanceType<typeof THREE.AnimationAction>
    }
  }

  // 人物偏移向量
  personSightOffset = new THREE.Vector3(
    DEFAULTCONFIG.personSightOffset.x,
    DEFAULTCONFIG.personSightOffset.y,
    DEFAULTCONFIG.personSightOffset.z
  )

  // 移动系数
  moveFactor = DEFAULTCONFIG.moveFactor

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

  // 扩散波效果
  diffusion: InstanceType<typeof THREE.Mesh> = new THREE.Mesh()

  // 碰撞间距
  collisionSpace = DEFAULTCONFIG.collisionSpace

  // 空调组
  airGroup?: InstanceType<typeof THREE.Group>
  airSpeed = THREE.TSL.uniform(0.05)

  // hover 组
  hoverGroup?: InstanceType<typeof THREE.Group>

  constructor(options: ConstructorParameters<typeof Scene>[0], extend: Partial<ExtendOptions>) {
    super(options)

    this.extend = extend

    this.createClock()

    // 场景合成
    this.postProcessing = MS.createPostProcessing(this.scene, this.camera, this.renderer)

    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    // 预编译着色器
    // @ts-ignore
    this.pmremGenerator.compileEquirectangularShader()

    // 建筑
    this.addBuildingGroup()

    // 锚点
    this.addAnchorGroup()

    // CSS2D 渲染器
    this.css2DRender = MS.createCSS2DRender(this.options, this.container)
    this.addDotGroup()
    // CSS3D 渲染器
    this.css3DRender = MS.createCSS3DRender(this.options, this.container)
    this.addDot3Group()

    // 灯光
    this.addLightGroup()

    // 流光
    this.addFleeting()
    // 路灯
    this.addStreetLamp()
    // 居民灯
    this.addResidentLight()
    // hover 组
    this.addHoverGroup()

    // 查找灯光
    this.findLight()

    // 绑定事件
    this.bindEvent()

    // 扩散波
    this.addDiffusion()

    this.setControlCache()

    this.setDebounceDuration(DEFAULTCONFIG.debounceDuration)
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
    this.postProcessing?.renderAsync()
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

    // css3D 渲染器
    this.css3DRender?.render(this.scene, this.camera)

    // 场景风格
    // this.autoChangeStyle()

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
    this.personAnimate(delta)

    this.debounce(() => {
      this.checkCameraVisibleArea()
      this.checkDot3CameraVisibleObjects()
    })
  }

  // 检测视角可视区域
  checkCameraVisibleArea() {
    const list = this.hoverGroup?.children || []
    const virtual = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2, 2),
      new THREE.MeshBasicMaterial()
    )
    for (let i = 0; i < list.length; i++) {
      const object = list[i]
      if (object.isObject3D) {
        const box1 = new THREE.Box3().setFromObject(object)
        virtual.position.copy(this.camera.position)
        const box2 = new THREE.Box3().setFromObject(virtual)
        const isIntersecting = box1.intersectsBox(box2)
        if (isIntersecting) {
          const obj = DEFAULTCONFIG.cameraTransitionList.find(
            it => it.name + DEFAULTCONFIG.hoverNameSuffix === object.name
          )
          if (obj && obj.id != void 0) {
            if (typeof this.extend.intersectsArea === 'function') this.extend.intersectsArea(obj)
            break
          }
        }
      }
    }
  }

  // 监测 3D 点位相机可视对象
  checkDot3CameraVisibleObjects() {
    this.checkCameraVisibleDot(
      object => {
        object.visible = object.userData.isEchartsDot ? object.visible : true
      },
      object => {
        object.visible = false
      }
    )
  }

  // 检测视角可视点位
  checkCameraVisibleDot(onVisible, onHidden?) {
    const frustum = this.getFrustum()
    const list = this.dot3Group?.children || []
    for (let i = 0; i < list.length; i++) {
      const object = list[i]
      const target = MS.getCSS3DObjectTargetMesh(object)
      if (target instanceof THREE.Mesh) {
        if (this.frustumIntersectsBox(frustum, target)) {
          const ds = this.camera.position.distanceTo(object.position)
          const dis = DEFAULTCONFIG.dotVisibleDistance
          if (ds <= dis.max && ds >= dis.min) {
            if (typeof onVisible === 'function') onVisible(object)
          } else {
            if (typeof onHidden === 'function') onHidden(object)
          }
        } else {
          if (typeof onHidden === 'function') onHidden(object)
        }
      }
    }
  }

  // 获取当前位置-当前点位
  getLocation() {
    let models: MS.THREE.Object3D[] = []
    this.checkCameraVisibleDot(object => {
      models.push(object)
    })
    return models
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
    this.scene.background = texture
    const envMap = this.convertPmremTexture(texture)
    this.scene.environment = envMap
    texture.dispose()
  }

  // 设置 sky 参数 (环境光强度，平行光强度，hdr，可见)
  setStyleOptions(ambIntensity, dirIntensity, hdr, visible = false) {
    this.ambientLight.intensity = ambIntensity
    this.directionalLight.intensity = dirIntensity
    this.fleetingGroup && (this.fleetingGroup.visible = visible)
    this.streetLampGroup && (this.streetLampGroup.visible = visible)
    this.residentLightGroup && (this.residentLightGroup.visible = visible)

    this.loadEnvTexture(hdr, _texture => {
      // console.log(hdr)
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

  // 添加点位组
  addDot3Group() {
    if (!this.css3DRender) return
    this.css3DRender.domElement.className = 'three-scene__dot-wrap'
    const group = new THREE.Group()
    group.name = '点位组3'
    this.dot3Group = group
    this.scene.add(group)
  }
  // 添加点位
  addDot3(item: ObjectItem, clickBack?) {
    if (!this.dot3Group) return new THREE.Mesh()
    const label = MS.createDotCSS3DDom(item, clickBack, e => {
      const type = e.target.dataset.type
      this.addDot3Echarts(item, type)
    })
    this.dot3Group.add(label)
    return label
  }
  // 添加图表点位
  addDot3Echarts(item: ObjectItem, type: string) {
    if (!this.dot3Group) return
    // 查找是否已经存在
    let label = this.dot3Group.children.find(el => el.userData.isEchartsDot)
    if (!label) {
      label = MS.createDotCSS3DEchartsDom(
        item,
        true,
        _e => {
          label && (label.visible = false)
        },
        true
      )
      this.dot3Group.add(label)
    } else {
      const { x = 0, y = 0, z = 0 } = item.position || {}
      label.position.set(x, y, z)
      label.visible = true
    }
    disposeEcharts()
    renderEcharts(label.userData.echartElement, item, type)
  }
  // 关闭点位
  closeDot3() {
    // this.dot3Group?.children.forEach(el => {
    //   el.visible = false
    // })
  }
  // 更新
  updateDot3(data: UpdateDotItem) {
    // 查找对应的点位
    const object = this.dot3Group?.children.find(item => item.userData.data.code === data.code)
    if (!object) return
    MS.updateDot3Visible(object, data)
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

  // 添加 hover 组
  addHoverGroup() {
    const group = new THREE.Group()
    group.name = 'hover 组'
    this.hoverGroup = group
    this.addObject(group)
  }
  // 添加 hover 模型
  addHover(model) {
    const list = MS.convertHoverMaterial(model)
    this.hoverGroup?.add(...list)
  }
  // hover 重置
  resetHover() {
    MS.hoverEmptyGroup([], null, this.container, this.hoverGroup)
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
              this.person.position.setY(pos.y)
              // 获取前进坐标
              const newPos = MS.getForwardPosition(personModel, 0.1)
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
      const dbObj = this.buildingGroup?.getObjectByName(names[i]) as any
      if (!dbObj) continue
      const nObj = dbObj.clone()
      nObj.material = material.clone()
      nObj.name = dbObj.name + '_canvas'
      dbObj.add(nObj)
      dbObj.__cover_texture__ = nObj
      const dir = new THREE.Vector3()
      dbObj.getWorldDirection(dir)
      const dis = dir.clone().multiplyScalar(1e-3)
      const pos = dbObj.position.clone().add(dis) || new THREE.Vector3()
      pos.sub(dbObj.position)
      nObj.position.copy(pos)
      this.canvasTextures.push(nObj.material.map)
    }
  }

  ///////////////////////////
  /////////// 人物 ///////////
  ///////////////////////////
  // 添加人物
  addPerson(model) {
    this.person = model
    const { mixer, actions } = MS.getModelAction(model)
    // 默认状态
    const defaultAction = actions[DEFAULTCONFIG.personDefaultAnimateName]
    defaultAction.play()
    // 步行
    const runging = actions[DEFAULTCONFIG.personRuningAnimateName]
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
        const steep = DEFAULTCONFIG.personRuningSpeed * delta * factor
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
  // 人物视角
  togglePersonSight(type?: number) {
    if (!DEFAULTCONFIG.sightToggle) {
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
    if (DEFAULTCONFIG.sightToggle) {
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
        : DEFAULTCONFIG.cameraMaxDistance.threePerson
      : this.controlCache.maxDistance
    this.controls.screenSpacePanning = !isPerson
    this.controls.enablePan = !isPerson
    // 第一人称则隐藏人物
    this.person && (this.person.visible = !isPersonFirst)
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
  // 切换人物界面效果
  togglePersonView() {
    const dom = this.container.parentNode?.querySelector(
      '.' + DEFAULTCONFIG.personSightClass
    ) as HTMLDivElement
    if (!dom) return
    const isCharacter = this.isPersonSight()
    dom.style.display = isCharacter ? 'block' : 'none'
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
        message: `鼠标点击地面移动，或键盘按键 ${DEFAULTCONFIG.personKeys
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
      personModel.__runing__ = true
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
        this.log('撞到了！')
        return true
      }
    }
  }

  ///////////////////////////
  ////////// 扩散波 //////////
  ///////////////////////////
  // 添加扩散波
  addDiffusion() {
    const mesh = createDiffusion(
      {
        textureSrc: DEFAULTCONFIG.diffusionImg,
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
  /////////// 鸟瞰 ///////////
  ///////////////////////////
  // 公司鸟瞰图
  toggleBridCompany() {
    const name = DEFAULTCONFIG.companyModelName
    const model = this.buildingGroup?.getObjectByName(name) as ThreeModelItem
    if (!model) {
      ElMessage.warning({
        message: `未找到【${name}】模块！`,
        grouping: true
      })
      return
    }
    this.closeCruise()
    this.clsoePerson()
    this.closeRoam()

    const oldStatus = model.__isFocus__
    // 设置聚焦
    model.__isFocus__ = DEFAULTCONFIG.sightToggle ? !model.__isFocus__ : true

    if (!model.__isFocus__ && oldStatus != model.__isFocus__) {
      this.closeVirtualization()
      this.toggleCompanyFocus(false)
      return
    }
    this.toggleCompanyFocus(true)
    if (oldStatus != model.__isFocus__) {
      // 过滤窗帘
      const list = (this.buildingGroup?.children || []).filter(
        el => el.name != DEFAULTCONFIG.curtainMeshName
      )
      virtualization(list, model, {
        wireframe: !false,
        hidden: true,
        opacity: 0.1,
        filter: ['电梯-1']
      })
    }
  }
  // 获取当前鸟瞰状态
  getBridStatus() {
    const name = DEFAULTCONFIG.companyModelName
    const model = this.buildingGroup?.getObjectByName(name) as ThreeModelItem
    return model?.__isFocus__
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
    let { target, to, maxDistance } = this.getControlsCache()
    // 聚焦移动 暂存场景参数
    if (isFocus) {
      this.setControlCache()
      target = new THREE.Vector3(8.5, 185, 0)
      to = new THREE.Vector3(92.8, 291, 104)
      maxDistance = 320
    }
    this.controls.maxDistance = maxDistance
    Utils.cameraLinkageControlsAnimate(this.controls, this.camera, to, target)
  }
  // 关闭鸟瞰视角
  closeBrid() {
    const status = this.getBridStatus()
    if (status) this.closeVirtualization()
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
    const { to, target = object.position } = object.data
    if (!to) return
    if (!this.isCameraMove(to) && this.controls) {
      this.closeRoam()
      this.clsoePerson()
      this.closeCruise()
      this.clsoePerson()
      this.controls.enablePan = true
      this.controls.maxDistance = DEFAULTCONFIG.cameraMaxDistance.indoor
      Utils.cameraLinkageControlsAnimate(this.controls, this.camera, to, target)
    }
  }
  // 相机名称转创
  cameraTransitionByModelname(name) {
    const cameraTransitionList = DEFAULTCONFIG.cameraTransitionList
    const obj = cameraTransitionList.find(it => it.name === name)
    if (!obj) return
    this.cameraTransition({ data: obj })
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

  ///////////////////////////
  /////////// 控制 ///////////
  ///////////////////////////
  // 控制器重置
  controlReset() {
    // 关闭 漫游、人物、鸟瞰
    this.closeRoam()
    this.clsoePerson()
    this.closeBrid()
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

  // 漫游
  toggleRoam() {
    this.closeCruise()
    this.clsoePerson()
    if (this.closeRoam()) return
    const points = this.extend.roamPoints || []
    if (points.length == 0) return
    if (!this.controls) return
    this.controls.maxDistance = DEFAULTCONFIG.cameraMaxDistance.roam
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

  // 定点巡航
  toggleCruise(close?: boolean) {
    if (!DEFAULTCONFIG.sightToggle) {
      close = false
      if (!close === this.options.cruise.runing) return
    }

    this.clsoePerson()
    this.person && (this.person.visible = false)
    this.closeRoam()
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
    this.closeDot3()
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

    // 点击未弹起 且第一视角
    if (this.pointer.isClick && this.person && this.isFirstPersonSight()) {
      this.person.rotation.y -= this.movementXToAngle(e.movementX)
    }

    // 控制最大距离
    const maxDistance = this.controls?.maxDistance || 0
    const hoverDistance = DEFAULTCONFIG.hoverDistance
    // 跳转鸟瞰网格名称
    const toBridMeshName = DEFAULTCONFIG.toBridMeshName

    let objects: any[] = []
    // 悬浮组距离 且控制器激活状态
    const isHoverGroupDistance =
      maxDistance > (this._isTest ? 10000 : hoverDistance.empty) && this.controls?.enabled
    // 空组
    if (isHoverGroupDistance) {
      // 鸟瞰视角
      const isBridSight = this.getBridStatus()
      objects = (this.hoverGroup?.children || []).filter(
        el => !isBridSight || (isBridSight && el.name != toBridMeshName)
      )
    } else {
      // 锚点或者地面
      objects =
        this.buildingGroup?.children
          .filter((it: any) => it.visible)
          .map(it => {
            it.children = it.children.filter(t => t.visible)
            return it
          })
          .concat(this.anchorGroup?.children || []) || []
    }

    // 检查相交对象
    const interscts = MS.getIntersectObjects(
      e,
      this.container,
      this.options.scale,
      this.camera,
      objects,
      // 计算后代，悬浮不计算，否则耗性能
      isHoverGroupDistance || isClick
    )

    if (isHoverGroupDistance) {
      MS.hoverEmptyGroup(interscts, this.extend.onHoverCall, this.container, this.hoverGroup)
    } else {
      // 处理锚点类型-精灵材质
      MS.hoverAnchor(interscts, this.extend.onHoverCall, this.container, this.anchorGroup)
    }
    if (!isClick) return
    if (interscts.length) {
      const intersct = interscts[0]
      const object = intersct.object
      this._isTest && console.log(intersct)
      if (isHoverGroupDistance) {
        // 查找相机切换对应对象
        const obj = DEFAULTCONFIG.cameraTransitionList.find(
          it => it.name + DEFAULTCONFIG.hoverNameSuffix === object.name
        )
        object.visible = false
        if (!obj) {
          if (object.name === toBridMeshName) {
            this.toggleBridCompany()
          }
        } else {
          if (typeof this.extend?.emptyGroupClick === 'function') this.extend.emptyGroupClick(obj)
        }
        return
      }

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

  resize() {
    super.resize()
    const { width, height } = this.options
    this.css2DRender?.setSize(width, height)
    this.css3DRender?.setSize(width, height)
  }

  // 销毁场景
  dispose() {
    this.clearVideo()
    this.animateModels = []
    this.canvasTextures = []
    this.videoModels = []
    this.disposeObj(this.buildingGroup)
    this.disposeObj(this.dotGroup)
    this.disposeObj(this.dot3Group)
    this.disposeObj(this.anchorGroup)
    this.disposeObj(this.lightGroup)
    this.disposeObj(this.fleetingGroup)
    this.disposeObj(this.streetLampGroup)
    this.disposeObj(this.residentLightGroup)

    this.clock = void 0
    this.css2DRender = void 0
    this.css3DRender = void 0
    this.buildingGroup = void 0
    this.dotGroup = void 0
    this.dot3Group = void 0
    this.anchorGroup = void 0
    this.lightGroup = void 0
    this.hoverGroup = void 0
    this.fleetingGroup = void 0
    this.streetLampGroup = void 0
    this.residentLightGroup = void 0
    this.extend = {}

    destroyEvent()
    disposeEcharts()
    super.dispose()
  }
}
