import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

import * as ThreeScene from 'three-scene'

import { Water } from 'three/examples/jsm/objects/Water'
import { Sky } from 'three/examples/jsm/objects/Sky'

import type { Config, ExtendOptions } from '.'
import type { XYZ, ObjectItem } from 'three-scene/src/types/model'

import DEFAULTCONFIG from './config'

const Hooks = ThreeScene.Hooks
const Utils = ThreeScene.Utils

const { raycaster, pointer, update: raycasterUpdate, style } = Hooks.useRaycaster()
const { initCSS2DRender, createCSS2DDom } = Hooks.useCSS2D()
const { createDiffusion, updateDiffusion } = Hooks.useDiffusion()
const { createMove, moveAnimate } = Hooks.useMoveAnimate()

const { addLensflare } = Hooks.useLensflare()

const base = import.meta.env.VITE_BEFORE_STATIC_PAT || ''

const createWater = () => {
  // 创建水面
  const waterGeometry = new THREE.PlaneGeometry(900, 50)
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

// 创建视频元素
const createVideoDom = (src?: string) => {
  const dom = document.createElement('video')
  dom.src = base + (src || '/oss/textures/park/sintel.mp4')
  dom.loop = true
  // videoDom.autoplay = true
  return dom
}

// 视频封面
const videoCoverTexture = new THREE.TextureLoader().load(base + '/oss/textures/park/cover.jpeg')

const sightMap = {
  full: 'FULL',
  npc: 'NPC'
}

export class ParkThreeScene extends ThreeScene.Scene {
  // 水面
  water?: InstanceType<typeof Water>
  // 天空
  sky?: InstanceType<typeof Sky>
  // 太阳
  sun?: InstanceType<typeof THREE.Vector3>

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
    extra?: any
  }

  // 当前视角
  currentSight: string
  // 历史中心点（视角切换）
  historyTarget: InstanceType<typeof THREE.Vector3>
  // 历史相机坐标（视角切换）
  historyCameraPosition: InstanceType<typeof THREE.Vector3>

  // 动画模型集合
  animateModels: any[]

  // 移动系数
  moveFactor: number = 1

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
    this.addAnchorGroup()
    this.addDotGroup()
    this.addLightGroup()

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
    this.animateModels = []
    this.addBuildingGroup()
    this.clearAnchor()
    this.clearDot()
    this.clearLightGroup()
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
  addAnchor(...obj) {
    if (this.anchorGroup) {
      this.anchorGroup.add(...obj)
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

  // 添加灯光
  addLight(item: ObjectItem, obj, hasHelper?: boolean) {
    if (this.lightGroup) {
      obj.name = item.name
      const { to = { x: 0, y: 0, z: 0 } } = item
      obj.target.position.set(to.x, to.y, to.z)
      this.lightGroup.add(obj)
      if (hasHelper) {
        const helper = new THREE.SpotLightHelper(obj, obj.color)
        this.lightGroup.add(helper)
      }
    }
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
    const skyUniforms = sky?.material.uniforms
    if (!skyUniforms) return
    // 系数控制参数
    const effectController = {
      turbidity: 10, // 浑浊
      rayleigh: 1, // 视觉效果就是傍晚晚霞的红光的深度
      mieCoefficient: 0.005, // 粒子的米氏散射系数
      mieDirectionalG: 0.2, // 方向
      elevation: 4, // 太阳高度
      azimuth: 180, // 太阳角度
      exposure: 1 // 光晕强度
    }
    skyUniforms['turbidity'].value = effectController.turbidity
    skyUniforms['rayleigh'].value = effectController.rayleigh
    skyUniforms['mieCoefficient'].value = effectController.mieCoefficient
    skyUniforms['mieDirectionalG'].value = effectController.mieDirectionalG

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation)
    const theta = THREE.MathUtils.degToRad(effectController.azimuth)

    if (!sun) return
    // 设置球坐标系
    sun.setFromSphericalCoords(1, phi, theta)
    // 太阳方位
    sky.material.uniforms['sunPosition'].value.copy(sun)

    if (!water) return
    // 太阳方向
    water.material.uniforms['sunDirection'].value.copy(sun).normalize()

    // 环境映射
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    // 场景环境
    this.scene.environment = pmremGenerator.fromScene(sky as any).texture

    // 场景光晕强度
    this.renderer.toneMappingExposure = effectController.exposure
  }

  // 添加人物
  addCharacter(model, point) {
    const { x, y, z } = point
    model.position.set(x, y, z)
    // this.setControlTarget(point)
    // const [x2, y2, z2] = this.options.camera.position

    // 相机入场动画
    // Utils.cameraInSceneAnimate(this.camera, { x: x2, y: y2, z: z2 }, this.controls.target).then(() => {
    //   this.controlSave()
    // })

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
  }

  // 视角切换（人物/全屏）
  toggleSight() {
    if (this.options.cruise.runing) {
      // 定点巡航中，则中断
      this.toggleCruise(true)
      return
    }

    if (!this.controls || !this.character) return

    const sight = this.currentSight == sightMap.full ? sightMap.npc : sightMap.full
    this.currentSight = sight

    // 人物视角
    const isCharacter = sight === sightMap.npc
    // 控制器操作限制切换
    this.controls.maxDistance = isCharacter ? 15 : 1500
    this.controls.screenSpacePanning = !isCharacter
    this.controls.enablePan = !isCharacter
    this.controls.maxPolarAngle = Math.PI * (isCharacter ? 0.49 : 0.45)

    const target = this.controls.target
    const position = this.character.position
    /// 切换到人物视角，暂存控制参数
    if (isCharacter) {
      const { x, y, z } = target
      this.historyTarget = new THREE.Vector3(x, y, z)
      const { x: x2, y: y2, z: z2 } = this.camera.position
      this.historyCameraPosition = new THREE.Vector3(x2, y2, z2)
      const { x: x3, y: y3, z: z3 } = position
      this.camera.lookAt(new THREE.Vector3(x3, y3 + 3, z3))
    } else {
      const { x, y, z } = this.historyCameraPosition
      this.camera.position.set(x, y, z)
      this.camera.lookAt(position)
    }

    const { x, y, z } = isCharacter ? position : this.historyTarget
    target.set(x, y, z)

    // new TWEEN.Tween(target)
    //   .to(isCharacter ? position : this.historyTarget, 1000 * 1)
    //   .delay(0)
    //   .start()
  }

  // 人物加速
  characterAccelerate() {
    this.moveFactor++
    if (this.moveFactor >= 10) this.moveFactor = 10
    console.log('当前人物速度系数：' + this.moveFactor)
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

    const { runging } = character.extra
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

  // 添加视频材质
  addVideoMaterial() {
    const videoDom = createVideoDom()
    // video 作为 VideoTexture 参数创建纹理对象
    const videoTexture = new THREE.VideoTexture(videoDom)
    const geometry = new THREE.PlaneGeometry(10, 5)
    const material = new THREE.MeshPhongMaterial({
      map: videoCoverTexture
      // side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, material) as any
    mesh.__video_texture__ = videoTexture
    mesh.__cover_texture__ = videoCoverTexture
    mesh.position.set(-75, 2.66, 133)
    mesh.name = 'small_video'
    mesh.__video__ = videoDom

    this.addObject(mesh)

    // 添加镜面
    const groundMirror = new Reflector(new THREE.PlaneGeometry(20, 20), {
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0xb5b5b5
    })
    groundMirror.position.set(-75, 0.17, 160)
    groundMirror.rotateX(-Math.PI / 2)
    // groundMirror.position.y = 0.5
    this.addObject(groundMirror)

    // 大屏
    const dbObj = this.scene.getObjectByName('大屏幕') as any
    if (!dbObj) return
    const videoDom2 = createVideoDom()
    const videoTexture2 = new THREE.VideoTexture(videoDom2)
    dbObj.__video_texture__ = videoTexture2
    dbObj.__cover_texture__ = videoCoverTexture.clone()
    dbObj.material = material.clone()
    dbObj.__video__ = videoDom2
  }

  // 视频播放
  videoPlay(object) {
    const vobj = this.scene.getObjectByName(object.data.bind) as any

    if (vobj && vobj.__video__) {
      const videoDom = vobj.__video__
      if (videoDom.paused) {
        vobj.material.map = vobj.__video_texture__
        videoDom?.play()
      } else {
        videoDom?.pause()
        vobj.material.map = vobj.__cover_texture__
      }
    }
  }

  // 开门
  openTheDoor(object, isHalf) {
    const dobj = this.scene.getObjectByName(object.data.bind) as any
    if (!dobj) return

    if (!isHalf) {
      const position = dobj.position
      if (dobj.__open__ == void 0) {
        const { x, y, z } = position
        dobj.__position__ = new THREE.Vector3(x, y, z)
      }
      dobj.__open__ = !dobj.__open__
      new TWEEN.Tween(position)
        .to(
          {
            x: dobj.__position__.x + (dobj.__open__ ? 7 : 0)
          },
          1000 * 1.5
        )
        .delay(0)
        .start()
    } else {
      dobj.__open__ = !dobj.__open__
      new TWEEN.Tween(dobj.rotation)
        .to(
          {
            z: dobj.__open__ ? Math.PI * 0.5 : 0
          },
          1000 * 1.5
        )
        .delay(0)
        .start()
    }
  }

  // 双开门
  openTheDoubleSlidingDoor(object, scale = 400, isOpen?: boolean) {
    const dobj = this.scene.getObjectByName(object.data.bind) as any
    if (!dobj) return Promise.reject()
    const left = dobj.children.find(el => el.name.indexOf('左') > -1) as any
    const right = dobj.children.find(el => el.name.indexOf('右') > -1) as any

    const lpos = left.position
    const rpos = right.position
    if (dobj.__open__ == void 0) {
      const { x, y, z } = lpos
      const { x: x2, y: y2, z: z2 } = rpos
      left.__position__ = new THREE.Vector3(x, y, z)
      right.__position__ = new THREE.Vector3(x2, y2, z2)
    }

    dobj.__open__ = isOpen !== void 0 ? isOpen : !dobj.__open__
    return new Promise(resolve => {
      const rMoveX = right.__position__.x + (dobj.__open__ ? scale : 0)
      // 坐标不变则直接返回
      if (rpos.x === rMoveX) return resolve(dobj)
      new TWEEN.Tween(lpos)
        .to(
          {
            x: left.__position__.x + (dobj.__open__ ? -scale : 0)
          },
          1000 * 1.5
        )
        .delay(0)
        .start()
      new TWEEN.Tween(rpos)
        .to(
          {
            x: rMoveX
          },
          1000 * 1.5
        )
        .delay(0)
        .start()
        .onComplete(() => {
          resolve(dobj)
        })
    })
  }

  // 推拉门
  openTheSlidingDoor(object) {
    const dobj = this.scene.getObjectByName(object.data.bind) as any
    console.log(object)
    if (!dobj) return
    console.log(dobj)
    const left = dobj.children.find(el => el.name.indexOf('左') > -1)
    // const right = dobj.children.find(el => el.name.indexOf('右') > -1)
    const lpos = left.position
    if (dobj.__open__ == void 0) {
      const { x, y, z } = lpos
      left.__position__ = new THREE.Vector3(x, y, z)
    }
    dobj.__open__ = !dobj.__open__
    const scale = 4.5
    const rMoveY = left.__position__.y + (dobj.__open__ ? scale : 0)
    if (lpos.y === rMoveY) return
    new TWEEN.Tween(lpos)
      .to(
        {
          y: left.__position__.y + (dobj.__open__ ? scale : 0)
        },
        1000 * 1.5
      )
      .delay(0)
      .start()
  }

  // 电梯
  waitLift(object, fllow?: boolean) {
    const liftGroupName = '单元1号电梯'
    // 电梯轿厢
    const box = this.scene.getObjectByName(liftGroupName) as any
    console.log(box)
    // 当前绑定坐标
    const cpos = object.data?.to
    if (!box || !cpos) return
    // y 轴对比
    const bpos = box.position

    if (cpos.y != bpos.y) {
      // 电梯关门
      const bindLift = box.__bind_lift__
      if (bindLift !== void 0) {
        // 绑定过则关闭电梯门
        this.openTheDoubleSlidingDoor(
          {
            data: { bind: bindLift }
          },
          200,
          false
        )
      }
      this.openTheDoubleSlidingDoor(
        {
          data: { bind: liftGroupName }
        },
        200 * 0.02,
        false
      ).then(() => {
        // 电梯移动
        new TWEEN.Tween(bpos)
          .to(
            {
              y: cpos.y
            },
            1000 * 1.5
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
            console.log('电梯到了！')
            // 当前移动到哪一层，后续滑动时需要关闭之前到达的层
            box.__bind_lift__ = object.data.bind
            // 电梯开门
            this.openLift(object, liftGroupName)
          })
      })
    } else {
      this.openLift(object, liftGroupName)
    }
  }

  // 电梯开门
  openLift(object, liftGroupName) {
    console.log(object)
    // 电梯门打开
    this.openTheDoubleSlidingDoor(object, 200)
    this.openTheDoubleSlidingDoor(
      {
        data: { bind: liftGroupName }
      },
      200 * 0.02
    )
  }

  // 开关灯
  lightSwitch(object) {
    console.log(object)
    const light = this.lightGroup?.getObjectsByProperty('name', object.data?.bind) as any
    light.forEach(el => {
      el.visible = !el.visible
    })
    console.log(light)
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

  // 模型动画
  modelAnimate(): void {
    // css2D 渲染器
    this.css2DRender.render(this.scene, this.camera)

    if (typeof this.extend.animateCall === 'function') this.extend.animateCall()

    // 水面波动
    if (this.water) {
      this.water.material.uniforms['time'].value += 1 / 60
    }

    // 波纹扩散
    if (this.mouseClickDiffusion.visible) {
      updateDiffusion()
    }

    let delta = this.clock?.getDelta() as number
    if (this.character) {
      const mixer = this.character.extra.mixer
      mixer.update(delta)

      moveAnimate(0.5 * this.moveFactor)
    }

    this.restoreAnchorMaterial()

    // 模型动画
    if (this.animateModels.length) {
      this.animateModels.forEach(el => {
        el.__mixer__.update(delta)
      })
    }
  }

  // 双击
  onDblclick(e: MouseEvent) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e as PointerEvent, dom, scale)

    if (this.buildingGroup) {
      // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
      raycaster.setFromCamera(pointer, this.camera)
      // 检查射线和物体之间的交叉点（包含或不包含后代）
      const objects = [this.buildingGroup]
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
    // let interscts = raycaster.intersectObjects(objects, true)

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
      const object = intersct.object as any
      this.container.style.cursor = object._isAnchor_ ? 'pointer' : 'auto'
      if (!object._isAnchor_) {
        this.anchorGroup?.children.forEach((el: any) => {
          el.__change_color__ = false
        })
        return
      }

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

  // 获取楼层集合
  getFloor() {
    return this.buildingGroup?.children.filter((it: any) => it._isFloor_)
  }

  // 隐藏除楼层之外的对象
  hideOmitFloor(visible: boolean) {
    this.buildingGroup?.children.forEach((el: any) => {
      el.visible = el._isFloor_ || visible
    })
  }

  // 获取所有对象
  getAll() {
    return this.buildingGroup?.children.concat(this.dotGroup?.children || []) || []
  }

  // 获取跟随目标集合
  getFlowMark(mark) {
    return this.getAll().filter((el: any) => el.data?.followMark === mark)
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

  resize() {
    super.resize()
    const { width, height } = this.options
    this.css2DRender.setSize(width, height)
  }

  dispose() {
    this.animateModels = []
    this.disposeObj(this.water)
    this.disposeObj(this.sky)
    this.disposeObj(this.buildingGroup)
    this.disposeObj(this.character)
    this.disposeObj(this.dotGroup)
    this.disposeObj(this.anchorGroup)
    this.disposeObj(this.lightGroup)
    this.disposeObj(this.mouseClickDiffusion)

    this.clock = void 0
    this.water = void 0
    this.sky = void 0
    // @ts-ignore
    this.css2DRender = void 0
    this.buildingGroup = void 0
    this.character = void 0
    this.dotGroup = void 0
    this.anchorGroup = void 0
    this.lightGroup = void 0
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
  let { el, type: _type, colorObj: _cobj, color, paused } = opts
  let colors = Utils.getColorArr(color)
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
        Utils.setMaterialColor(e, color)
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
