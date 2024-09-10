import * as THREE from 'three'

import ThreeScene from '../../index'
import { useRaycaster } from '@/three-scene/hooks/raycaster'

import type { XYZ } from '../../types/model'
import type { Config, ExtendOptions } from '.'

import DEFAULTCONFIG from '../../config'

const { raycaster, pointer, update: raycasterUpdate } = useRaycaster()

export class NewThreeScene extends ThreeScene {
  // 设备集合
  deviceGroup: InstanceType<typeof THREE.Group>
  extend: Partial<ExtendOptions>
  constructor(options: ConstructorParameters<typeof ThreeScene>[0], extend: Partial<ExtendOptions>) {
    super(options)

    this.extend = extend
    this.deviceGroup = new THREE.Group()
    this.bindEvent()
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
    const objects = this.deviceGroup.children.filter(it => it.visible && it._isAnchor_)

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
    }
  }

  // 查找父级组合
  findParentGroupGroup(object) {
    const _find = obj => {
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

  // 清除场景设备
  clearDevice() {
    if (!this.deviceGroup) return
    this.disposeObj(this.deviceGroup)
    this.deviceGroup = new THREE.Group()
    this.addObject(this.deviceGroup)
  }

  // 添加设备
  addDevice(...obj) {
    if (this.deviceGroup) {
      this.deviceGroup.add(...obj)
    }
  }

  // 获取楼层集合
  getFloor() {
    return this.deviceGroup.children.filter(it => it._isFloor_)
  }

  // 隐藏除楼层之外的对象
  hideOmitFloor(visible: boolean) {
    this.deviceGroup.children.forEach(el => {
      el.visible = el._isFloor_ || visible
    })
  }

  // 获取跟随目标集合
  getFlowMark(mark) {
    return this.deviceGroup.children.filter(el => el.data?.followMark === mark)
  }

  // 获取动画目标点
  getAnimTargetPos(config: Config, _to?: XYZ, _target?: XYZ) {
    const to = _to || config.to || { x: -104, y: 7, z: 58 }
    const target = _target || config.target || { x: 0, y: 0, z: 0 }
    // 中心点位
    this.controls.target.set(target.x, target.y, target.z)
    return to
  }

  // 获取场景坐标
  getPosition() {
    console.log('视角', this.camera.position)
    console.log('目标位置', this.controls.target)
  }
}
