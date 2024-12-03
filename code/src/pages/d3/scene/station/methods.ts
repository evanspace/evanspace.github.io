import * as THREE from 'three'

import ThreeScene from 'three-scene'
import { useRaycaster } from 'three-scene/hooks/raycaster'
import { useCSS2D, CSS2DRenderer } from 'three-scene/hooks/css2d'

import type { Config, ExtendOptions } from '.'
import type { ObjectItem, XYZ } from 'three-scene/types/model'

import DEFAULTCONFIG from './config'

import * as UTILS from 'three-scene/utils/model'

const { raycaster, pointer, update: raycasterUpdate, style } = useRaycaster()
const { initCSS2DRender, createCSS2DDom } = useCSS2D()

export class StationThreeScene extends ThreeScene {
  // 建筑集合
  buildingGroup?: InstanceType<typeof THREE.Group>
  // 锚点集合
  anchorGroup?: InstanceType<typeof THREE.Group>
  // 点位集合
  dotGroup?: InstanceType<typeof THREE.Group>
  // 扩展参数
  extend: Partial<ExtendOptions>
  // CSS2D 渲染器
  css2DRender: InstanceType<typeof CSS2DRenderer>

  // 时间
  clock: InstanceType<typeof THREE.Clock>

  // 动画模型集合
  animateModels: InstanceType<typeof THREE.Group>[]

  constructor(
    options: ConstructorParameters<typeof ThreeScene>[0],
    extend: Partial<ExtendOptions>
  ) {
    super(options)

    this.extend = extend
    this.css2DRender = initCSS2DRender(this.options, this.container)
    this.css2DRender.domElement.className = 'three-scene__dot-wrap'

    this.clock = new THREE.Clock()
    this.animateModels = []

    this.bindEvent()
    this.addBuildingGroup()
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
    UTILS.createSpriteAnimate(obj, [x, y, z], 1, 8)
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

  // 获取动画目标点
  getAnimTargetPos(config: Partial<Config>, _to?: XYZ, _target?: XYZ) {
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
    const { to, target = object.position } = object.data

    if (!to) return
    if (!this.isCameraMove(to)) {
      const { x, y, z } = target
      this.controls.target.set(x, y, z)
      UTILS.cameraInSceneAnimate(this.camera, to, this.controls.target)
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
