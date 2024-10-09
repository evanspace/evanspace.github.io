import * as THREE from 'three'

import ThreeScene from 'three-scene'
import { useRaycaster } from '../../hooks/raycaster'
import { useCSS2D, CSS2DRenderer } from '../../hooks/css2d'

import type { XYZ, ObjectItem } from '../../types/model'
import type { Config, ExtendOptions } from '.'

import DEFAULTCONFIG from '../../config'

const { raycaster, pointer, update: raycasterUpdate } = useRaycaster()
const { initCSS2DRender, createCSS2DDom } = useCSS2D()
export class DeviceThreeScene extends ThreeScene {
  // 设备集合
  deviceGroup: InstanceType<typeof THREE.Group>
  // 点位集合
  dotGroup: InstanceType<typeof THREE.Group>
  // CSS2D 渲染器
  css2DRender: InstanceType<typeof CSS2DRenderer>
  // 扩展参数
  extend: Partial<ExtendOptions>
  // 时间
  clock: InstanceType<typeof THREE.Clock>
  constructor(options: ConstructorParameters<typeof ThreeScene>[0], extend: Partial<ExtendOptions>) {
    super(options)

    this.extend = extend
    this.css2DRender = initCSS2DRender(this.options, this.container)
    this.css2DRender.domElement.className = 'three-scene__dot-wrap'

    this.clock = new THREE.Clock()

    this.addDeviceGroup()
    this.addDotGroup()
  }

  // 添加设备组
  addDeviceGroup() {
    this.deviceGroup = new THREE.Group()
    this.deviceGroup.renderOrder = 100
    this.addObject(this.deviceGroup)
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
  addDevice(...obj) {
    if (this.deviceGroup) {
      this.deviceGroup.add(...obj)
    }
  }

  // 添加点位组
  addDotGroup() {
    const group = new THREE.Group()
    this.scene.add(group)
    this.dotGroup = group
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
    this.dotGroup.add(label)
    return label
  }

  modelAnimate() {
    // css2D 渲染器
    this.css2DRender.render(this.scene, this.camera)

    if (typeof this.extend.animateCall === 'function') this.extend.animateCall()

    if (this.deviceGroup.children.length) {
      let delta = this.clock.getDelta()
      this.deviceGroup.children.forEach(el => {
        let data = el.data
        if (!data) return
        let extra = el.extra
        // 运行状态等于设定值则更新
        if (extra && (data?.status ?? 0) > 0) {
          extra.mixer.update(delta)
        }

        // 故障状态等于设定值则更新
        const warning = el[DEFAULTCONFIG.meshKey.warning]
        if (warning && (data?.error || 0) > 0) {
          warning.mixer.update(delta)
        }
      })
    }
  }

  // 获取场景坐标
  getPosition() {
    console.log('视角', this.camera.position)
    console.log('目标位置', this.controls.target)
  }

  // 获取动画目标点
  getAnimTargetPos(config: Partial<Config>, _to?: XYZ, _target?: XYZ) {
    const to = _to || config.to || { x: -104, y: 7, z: 58 }
    const target = _target || config.target || { x: 0, y: 0, z: 0 }
    // 中心点位
    this.controls.target.set(target.x, target.y, target.z)
    return to
  }

  // 获取所有对象
  getAll() {
    return this.deviceGroup.children.concat(this.dotGroup.children)
  }

  resize() {
    super.resize()
    const { width, height } = this.options
    this.css2DRender.setSize(width, height)
  }
}
