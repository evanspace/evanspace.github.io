import * as THREE from 'three/webgpu'
import { Scene, Utils, Hooks } from 'three-scene'
import type { ObjectItem } from 'three-scene/types/model'

export { Hooks, Utils, Scene, THREE }

const { initCSS3DRender, createCSS3DDom } = Hooks.useCSS3D()

/**
 * 创建 css2d 渲染器
 * @param options 配置
 * @param container 容器
 * @returns
 */
export const createCSS3DRender = (options, container) => {
  return initCSS3DRender(options, container)
}

/**
 * 创建3D图表点位
 * @param item 模型配置对象
 * @param clickBack 点击事件回调
 * @param isSprite 是否精灵模式
 * @returns
 */
export const createDotCSS3DEchartsDom = (item: ObjectItem, clickBack, isSprite) => {
  const pos = item.position
  const { x = 0, y = 0, z = 0 } = pos || {}
  const label = createCSS3DDom({
    name: `<div class="echarts-wrap"></div>`,
    className: 'dot-echarts-box',
    sprite: isSprite,
    onClick: clickBack
  })

  const group = new THREE.Group()
  group.position.set(x, y, z)
  group.add(label)
  const geo = new THREE.SphereGeometry(1)
  const sphere = new THREE.Mesh(
    geo,
    new THREE.MeshBasicMaterial({ color: 0x14ffec, transparent: true, opacity: 0.2 })
  )
  group.add(sphere)
  group.scale.setScalar(0.02)

  const { rotation } = Utils.get_P_S_R_param(group, item)
  const [rx, ry, rz] = rotation
  group.rotation.set(rx, ry, rz)
  group.name = item.name + '_Echarts_Dot'
  group.userData.data = item
  // 原始点位 备用
  group.userData.position = { x, y, z }
  const dom = label.element.getElementsByClassName('echarts-wrap')[0]
  group.userData.echartElement = dom
  return group
}
