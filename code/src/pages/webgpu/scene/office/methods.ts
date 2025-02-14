import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

import DEFAULTCONFIG from './config'
import { ObjectItem, ThreeModelItem } from 'three-scene/types/model'

const Hooks = ThreeScene.Hooks
const Utils = ThreeScene.Utils

const { initCSS2DRender, createCSS2DDom } = Hooks.useCSS2D()
const { createFleeting, fleetingAnimate } = Hooks.useFleeting()

const { pass, mrt, output, float, uniform } = THREE.TSL

export { Hooks, Utils }

/**
 * 场景合成器
 * @param scenePass 场景合成 pass
 * @param renderer 渲染器
 * @returns 合成渲染器
 */
export const createPostProcessing = (scenePass, renderer) => {
  scenePass.setMRT(
    mrt({
      output,
      bloomIntensity: float(0)
    })
  )

  const outputPass = scenePass.getTextureNode()
  const bloomIntensityPass = scenePass.getTextureNode('bloomIntensity')

  const bloomPass = bloom(outputPass.mul(bloomIntensityPass))
  // 色调映射
  renderer.toneMapping = THREE.NeutralToneMapping
  const postProcessing = new THREE.PostProcessing(renderer)
  postProcessing.outputColorTransform = false
  postProcessing.outputNode = outputPass.add(bloomPass).renderOutput()
  return postProcessing
}

/**
 * 点位更新回调
 * @param obj 模型对象
 * @param _group 场景模型组
 * @returns
 */
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

/**
 * 更新点位隐现
 * @param scene 场景
 * @param target 目标对象
 * @param dotShowStrict 是否严格模式
 */
export const updateDotVisible = (scene, target: ThreeModelItem, dotShowStrict?) => {
  const item = target.data as ObjectItem
  const res = dotUpdateObjectCall(item, scene.buildingGroup)
  if (typeof res === 'object') {
    Object.keys(res).forEach(key => {
      item[key] = res[key]
    })
  }

  target.visible = item.show || !dotShowStrict
  const dom = target.element?.getElementsByClassName('inner')[0] as HTMLElement
  if (dom) {
    const { size, color } = item.font || {}
    if (size != void 0) {
      dom.style.fontSize = typeof size === 'string' ? size : size + 'px'
    }
    if (color != void 0) {
      dom.style.color = color
    }
    dom.textContent = `${item.value || 0}${item.unit ?? ''}`
  }
}

/**
 * 创建 css2d 渲染器
 * @param options 配置
 * @param container 容器
 * @returns
 */
export const createCSS2DRender = (options, container) => {
  return initCSS2DRender(options, container)
}

/**
 * 创建点位
 * @param item 模型配置对象
 * @param clickBack 点击事件回调
 * @returns
 */
export const createDotCSS2DDom = (item: ObjectItem, clickBack) => {
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
  return label
}

/**
 * 创建灯光组
 * @param item 模型配置对象
 * @param obj 场景对象
 * @param hasHelper 是否舒服辅助
 */
export const createLightGroup = (item: ObjectItem, obj, hasHelper?: boolean) => {
  const group = new THREE.Group()
  obj.name = item.name
  const pos = item.position || { x: 0, y: 0, z: 0 }
  const { to = { x: pos.x, y: pos.y - 2, z: pos.z } } = item
  if (!obj.isRectAreaLight) {
    obj.target.position.set(to.x, to.y, to.z)
    group.add(obj.target)
  }
  // 开灯
  obj.visible = true
  group.add(obj)
  if (hasHelper) {
    if (obj.isRectAreaLight) {
      const rectLightHelper = new RectAreaLightHelper(obj)
      group.add(rectLightHelper)
    } else {
      const helper = new THREE.SpotLightHelper(obj, obj.color)
      group.add(helper)
    }
  }
  return group
}

/**
 * 创建流光组
 * @param pointList 点位列表-3维数组
 * @param color 颜色
 * @param bloomIntensity 发光强度
 * @returns
 */
export const createFleetingGroup = (pointList: number[][][] = [], color, bloomIntensity) => {
  const group = new THREE.Group()
  for (let i = 0; i < pointList.length; i++) {
    const points = pointList[i]
    const line = createFleeting({
      points,
      tubularSegments: 1000,
      radius: 0.6,
      repeat: {
        x: 2,
        y: 4
      }
    })
    const mesh = new THREE.Mesh(
      line.geometry,
      new THREE.MeshBasicNodeMaterial({
        color,
        // @ts-ignore
        map: line.material.map,
        transparent: true,
        mrtNode: mrt({
          bloomIntensity
        })
      })
    )
    group.add(mesh)
  }
  group.name = '流光组'
  return group
}

/**
 * 流光组动画
 */
export const fleetingGroupAnimate = fleetingAnimate

/**
 * 创建模型动画
 * @param model 模型
 * @param animations 模型动画
 * @param play 播放
 * @param timeScale 加速
 * @returns
 */
export const createModelAnimate = (
  model,
  animations = [],
  play: boolean = true,
  timeScale: number = 1
) => {
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
}

/**
 * 切换窗帘动画
 * @param model 场景模型
 * @param isClose 是否关闭
 */
export const toggleCurtainAnimate = (model, isClose?: boolean) => {
  model.__close__ = isClose ?? !model.__close__
  const { __action__, __mixer__ } = model
  Object.keys(__action__).forEach(key => {
    if (model.__close__) {
      __action__[key].loop = THREE.LoopOnce
      __action__[key].clampWhenFinished = true
      __action__[key].play()
    }
  })
  if (!model.__close__) {
    __mixer__.stopAllAction()
  }
}
