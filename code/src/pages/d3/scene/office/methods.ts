import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'

import ThreeScene from 'three-scene'
import { useRaycaster } from 'three-scene/hooks/raycaster'
import { useCSS2D, CSS2DRenderer } from 'three-scene/hooks/css2d'
import { useDiffusion } from 'three-scene/hooks/diffusion'
import { useMoveAnimate } from 'three-scene/hooks/move-animate'
import { useFence } from 'three-scene/hooks/fence'

import * as UTILS from 'three-scene/utils/model'
import DEFAULTCONFIG from './config'

import type { ExtendOptions } from '.'
import type { ObjectItem } from 'three-scene/types/model'

const { raycaster, pointer, update: raycasterUpdate, style } = useRaycaster()
const { initCSS2DRender, createCSS2DDom } = useCSS2D()
const { createDiffusion, updateDiffusion } = useDiffusion()
const { createMove, moveAnimate } = useMoveAnimate()
const { createFence, fenceAnimate } = useFence()

const sightMap = {
  full: 'FULL',
  npc: 'NPC'
}

export class OfficeThreeScene extends ThreeScene {
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
  css2DRender: InstanceType<typeof CSS2DRenderer>
  // 鼠标点击地面扩散波效果
  mouseClickDiffusion: InstanceType<typeof THREE.Mesh>
  // 行走的人物
  character?: InstanceType<typeof THREE.Group>

  // 时间
  clock: InstanceType<typeof THREE.Clock>

  // 当前视角
  currentSight: string
  // 历史中心点（视角切换）
  historyTarget: InstanceType<typeof THREE.Vector3>
  // 历史相机坐标（视角切换）
  historyCameraPosition: InstanceType<typeof THREE.Vector3>

  // 动画模型集合
  animateModels: InstanceType<typeof THREE.Group>[]

  // 移动系数
  moveFactor: number = 1

  // 围栏
  fence?: InstanceType<typeof THREE.Group>

  constructor(
    options: ConstructorParameters<typeof ThreeScene>[0],
    extend: Partial<ExtendOptions>
  ) {
    super(options)

    this.extend = extend
    this.css2DRender = initCSS2DRender(this.options, this.container)
    this.css2DRender.domElement.className = 'three-scene__dot-wrap'

    // 添加飞行控制器
    this.addFlyControls()

    // 鼠标点击地面扩散波效果
    this.mouseClickDiffusion = createDiffusion(4, void 0, 6)
    this.mouseClickDiffusion.rotation.x = -Math.PI * 0.5
    this.mouseClickDiffusion.position.y = 0.5
    this.mouseClickDiffusion.visible = false
    this.addObject(this.mouseClickDiffusion)

    this.clock = new THREE.Clock()
    this.currentSight = sightMap.full
    this.historyTarget = new THREE.Vector3()
    this.historyCameraPosition = new THREE.Vector3()
    this.animateModels = []

    this.bindEvent()
    this.addBuildingGroup()
    this.addAnchorGroup()
    this.addDotGroup()
    this.addLightGroup()
  }

  addFlyControls() {
    console.log(FlyControls)
    const ctrl = new FlyControls(this.camera, this.renderer.domElement)

    ctrl.movementSpeed = 1000
    // ctrl.domElement = renderer.domElement;
    ctrl.rollSpeed = Math.PI / 24
    ctrl.autoForward = false
    ctrl.dragToLook = false
    // 聚焦坐标
    // ctrl.target.set(0, 0, 0)
    // 保存状态
    // ctrl.saveState()
    this.controls = ctrl
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
    UTILS.createSpriteAnimate(obj, [x, y, z], 0.2, 8)
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
  }

  // 视角切换（人物/全屏）
  toggleSight() {
    if (this.judgeCruise()) return

    const sight = this.currentSight == sightMap.full ? sightMap.npc : sightMap.full
    this.currentSight = sight

    // 人物视角
    const isCharacter = sight === sightMap.npc

    // 控制器操作限制切换
    this.controls.maxDistance = isCharacter ? 10 : 800
    this.controls.screenSpacePanning = !isCharacter
    this.controls.enablePan = !isCharacter

    const target = this.controls.target
    const position = this.character.position

    /// 切换到人物视角，暂存控制参数
    if (isCharacter) {
      const { x, y, z } = target
      this.historyTarget = new THREE.Vector3(x, y, z)
      const { x: x2, y: y2, z: z2 } = this.camera.position
      this.historyCameraPosition = new THREE.Vector3(x2, y2, z2)
      const { x: x3, y: y3, z: z3 } = position
      this.camera.lookAt(new THREE.Vector3(x3, y3 + 1.5, z3))
    } else {
      const { x, y, z } = this.historyCameraPosition
      console.log(this.historyCameraPosition)
      this.camera.position.set(x, y, z)
      this.camera.lookAt(position)
    }

    const { x, y, z } = isCharacter ? position : this.historyTarget
    target.set(x, y, z)
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
    const height = 1.5
    const { x, y, z } = point
    this.controls.target.set(x, y + height, z)
    this.camera.lookAt(this.controls.target)
  }

  //  等电梯
  waitLift(object, liftGroupName, fllow?: boolean) {
    // 电梯轿厢
    const box = this.scene.getObjectByName(liftGroupName)

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
    // 电梯门打开
    this.openTheDoubleSlidingDoor(object, 60)
    this.openTheDoubleSlidingDoor(
      {
        data: { bind: liftGroupName }
      },
      60 * 0.02
    )
  }
  // 开关灯
  lightSwitch(object) {
    console.log(object)
    const light = this.lightGroup.getObjectsByProperty('name', object.data?.bind)
    light.forEach(el => {
      el.visible = !el.visible
    })
    console.log(light)
  }

  // 双开门(两扇门 往两边平移)
  openTheDoubleSlidingDoor(object, scale = 400, isOpen?: boolean) {
    const dobj = this.scene.getObjectByName(object.data.bind)
    if (!dobj) return Promise.reject()
    const left = dobj.children.find(el => el.name.indexOf('左') > -1)
    const right = dobj.children.find(el => el.name.indexOf('右') > -1)

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
          1000 * 1
        )
        .delay(0)
        .start()
      new TWEEN.Tween(rpos)
        .to(
          {
            x: rMoveX
          },
          1000 * 1
        )
        .delay(0)
        .start()
        .onComplete(() => {
          resolve(dobj)
        })
    })
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

  // 相机移动聚焦点
  cameraLookatMoveTo(pos) {
    UTILS.cameraLookatAnimate(this.camera, pos, this.controls.target)
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

    if (this.isPerspectives()) {
      this.toggleSight()
    }

    const { to, target = object.position } = object.data

    if (!to) return

    if (!this.isCameraMove(to)) {
      UTILS.cameraLinkageControlsAnimate(this.controls, this.camera, to, target)
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

  // 模型动画
  modelAnimate(): void {
    // css2D 渲染器
    this.css2DRender.render(this.scene, this.camera)

    if (typeof this.extend.animateCall === 'function') this.extend.animateCall()

    this.restoreAnchorMaterial()

    let delta = this.clock.getDelta()
    // 模型动画
    if (this.animateModels.length) {
      this.animateModels.forEach(el => {
        if (el.__mixer__) {
          el.__mixer__.update(delta)
        }
      })
    }

    this.anchorGroup.children.forEach(el => {
      if (el.__mixer__) {
        el.__mixer__.update(delta)
      }
    })

    if (this.character) {
      const mixer = this.character.extra.mixer
      mixer.update(delta)

      moveAnimate(0.2 * this.moveFactor)
    }

    // 波纹扩散
    if (this.mouseClickDiffusion.visible) {
      updateDiffusion()
    }

    fenceAnimate()
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
    const objects = this.buildingGroup.children
      .filter(it => it.visible && (isClick || it.__ground__))
      .concat(this.anchorGroup.children)

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
      this.anchorGroup.children.forEach(el => {
        el.__change_color__ = el.uuid === object.uuid
      })
    } else {
      this.container.style.cursor = 'auto'
      this.anchorGroup.children.forEach(el => {
        el.__change_color__ = false
      })
    }
  }

  // 恢复锚点材质
  restoreAnchorMaterial() {
    this.anchorGroup.traverse(el => {
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
    return this.buildingGroup.children.concat(this.dotGroup.children)
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
    this.disposeObj(this.lightGroup)
    this.disposeObj(this.mouseClickDiffusion)

    this.clock = null
    this.css2DRender = null
    this.buildingGroup = null
    this.character = null
    this.dotGroup = null
    this.anchorGroup = null
    this.lightGroup = null
    this.fence = null
    this.mouseClickDiffusion = null
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
