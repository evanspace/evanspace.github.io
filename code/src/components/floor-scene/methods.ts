import * as THREE from 'three'

import * as ThreeScene from 'three-scene'

import type { XYZ, ObjectItem } from 'three-scene/types/model'
import type { Config, ExtendOptions } from '.'

import DEFAULTCONFIG from './config'

const Hooks = ThreeScene.Hooks

const { raycaster, pointer, update: raycasterUpdate } = Hooks.useRaycaster()
const { initCSS2DRender, createCSS2DDom } = Hooks.useCSS2D()

export class FloorThreeScene extends ThreeScene.Scene {
  // 设备集合
  deviceGroup?: InstanceType<typeof THREE.Group>
  // 点位集合
  dotGroup?: InstanceType<typeof THREE.Group>
  // 扩展参数
  extend: Partial<ExtendOptions>
  // CSS2D 渲染器
  css2DRender: InstanceType<typeof Hooks.CSS2DRenderer>
  constructor(
    options: ConstructorParameters<typeof ThreeScene.Scene>[0],
    extend: Partial<ExtendOptions>
  ) {
    super(options)

    this.extend = extend
    this.css2DRender = initCSS2DRender(this.options, this.container)
    this.css2DRender.domElement.className = 'three-scene__dot-wrap'

    this.bindEvent()
    this.addDeviceGroup()
    this.addDotGroup()
  }

  // 添加设备组
  addDeviceGroup() {
    const group = new THREE.Group()
    group.name = '设备组'
    this.deviceGroup = group
    this.addObject(group)
  }

  // 清除场景设备
  clearDevice() {
    if (this.deviceGroup) {
      this.disposeObj(this.deviceGroup)
    }
    this.addDeviceGroup()
    this.clearDot()
  }

  // 添加设备
  addDevice(...obj: any[]) {
    if (this.deviceGroup) {
      this.deviceGroup.add(...obj)
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
  addDot(item: ObjectItem, clickBack: (e: Event, label: any) => void) {
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

  modelAnimate() {
    // css2D 渲染器
    this.css2DRender.render(this.scene, this.camera)

    if (typeof this.extend.animateCall === 'function') this.extend.animateCall()
  }

  // 双击
  onDblclick(e: MouseEvent) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e as PointerEvent, dom, scale)

    if (this.deviceGroup) {
      // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
      raycaster.setFromCamera(pointer, this.camera)
      // 检查射线和物体之间的交叉点（包含或不包含后代）
      const objects = [this.deviceGroup]
      const interscts = raycaster.intersectObjects(objects)
      if (interscts.length) {
        const obj = interscts[0].object
        const object = this.findParentGroupGroup(obj)
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
    const objects =
      this.deviceGroup?.children.filter((it: any) => it.visible && it._isAnchor_) || []

    // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
    raycaster.setFromCamera(pointer, this.camera)
    let interscts = raycaster.intersectObjects(objects, isClick)
    dom.style.cursor = interscts.length > 0 ? 'pointer' : 'auto'
    if (!isClick) {
      return
    }

    if (interscts.length) {
      const object = interscts[0].object

      if (!object) return
      if (typeof this.extend?.onClickLeft === 'function') this.extend.onClickLeft(object)
    } else {
      if (typeof this.extend?.onClickLeft === 'function') this.extend.onClickLeft()
    }
  }

  // 查找父级组合
  findParentGroupGroup(object: any) {
    const _find = (obj: any) => {
      let parent = obj.parent
      if (!parent) {
        return
      }
      if (parent && parent._isDevice_) {
        return parent
      }
      return _find(parent)
    }
    return _find(object)
  }

  // 获取楼层集合
  getFloor() {
    return this.deviceGroup?.children.filter((it: any) => it._isFloor_) || []
  }

  // 隐藏除楼层之外的对象
  hideOmitFloor(visible: boolean) {
    this.deviceGroup?.children.forEach((el: any) => {
      el.visible = el._isFloor_ || visible
    })
  }

  // 获取所有对象
  getAll() {
    return this.deviceGroup?.children.concat(this.dotGroup?.children || []) || []
  }

  // 获取跟随目标集合
  getFlowMark(mark: string) {
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
    this.disposeObj(this.deviceGroup)
    this.disposeObj(this.dotGroup)

    // @ts-ignore
    this.css2DRender = void 0
    this.deviceGroup = void 0
    this.dotGroup = void 0
    this.extend = {}
    super.dispose()
  }
}
