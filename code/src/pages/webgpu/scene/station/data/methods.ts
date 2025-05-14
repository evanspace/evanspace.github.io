/* *
 * @description:
 * @file: methods.ts
 * @author: Evan
 * @date: 2025.05.13 17:32:37
 * @week: 周二
 * @version: V
 * */
import * as THREE from 'three/webgpu'
import { Scene, Utils, Hooks } from 'three-scene'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import type { ObjectItem, ThreeModelItem } from 'three-scene/types/model'
import __CONFIG__ from './config'

export { Hooks, Utils, Scene, THREE }

const { initCSS2DRender, createCSS2DDom } = Hooks.useCSS2D()
const { raycaster, pointer, update: raycasterUpdate, style } = Hooks.useRaycaster()

const { pass, mrt, output, emissive, float } = THREE.TSL

/**
 * 场景合成器
 * @param scene 场景
 * @param camera 相机
 * @param renderer 渲染器
 * @param isEnv 是否环境发光
 * @returns 合成渲染器
 */
export const createPostProcessing = (scene, camera, renderer, isEnv?: boolean) => {
  // 场景合成
  const scenePass = pass(scene, camera)
  if (isEnv) {
    scenePass.setMRT(
      mrt({
        output,
        emissive
      })
    )
  } else {
    scenePass.setMRT(
      mrt({
        output,
        bloomIntensity: float(0.01)
      })
    )
  }

  const outputPass = scenePass.getTextureNode()

  let bloomPass
  if (isEnv) {
    const emissivePass = scenePass.getTextureNode('emissive')
    bloomPass = bloom(emissivePass, 2.5, 0.5)
  } else {
    const bloomIntensityPass = scenePass.getTextureNode('bloomIntensity')
    bloomPass = bloom(outputPass.mul(bloomIntensityPass))
  }

  // 色调映射
  renderer.toneMapping = THREE.NeutralToneMapping
  const postProcessing = new THREE.PostProcessing(renderer)

  if (isEnv) {
    postProcessing.outputNode = outputPass.add(bloomPass)
  } else {
    postProcessing.outputColorTransform = false
    postProcessing.outputNode = outputPass.add(bloomPass).renderOutput()
  }
  return postProcessing
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
  label.name = item.name + '_2D_Dot'
  label.userData.data = item
  // 原始点位 备用
  label.userData.position = { x, y, z }
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
  obj.visible = !true
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
 * 点位更新回调
 * @param obj 模型对象
 * @param _group 场景模型组
 * @returns
 */
export const dotUpdateObjectCall = (obj: ObjectItem, _group) => {
  const val = Math.random() * 2 - 4 + 26
  if (val !== void 0) {
    obj.value = val
  }

  obj.show = Math.random() > 0.5
  obj.value = Number(Number(obj.value || 0).toFixed(2))
  return {
    value: obj.value,
    show: obj.show,
    font: {
      ...(obj.font || {})
      // color: '#' + (0xffffff + val * 1000000).toString(16).substring(0, 6)
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
  const item = (target.data || target.userData.data) as ObjectItem
  const res = dotUpdateObjectCall(item, scene.dotGroup)
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
 * 悬浮锚点（类似 css 鼠标悬浮效果）
 * @param interscts 交叉对象列表
 * @param callback 回调
 * @param container 容器
 * @param group 锚点组
 * @returns
 */
export const hoverAnchor = (interscts, callback, container, anchorGroup) => {
  if (typeof callback === 'function') callback(interscts[0], style)

  if (interscts.length) {
    const intersct = interscts[0]
    const object = intersct.object
    container.style.cursor = object._isAnchor_ ? 'pointer' : 'auto'
    if (!object._isAnchor_) {
      anchorGroup?.children.forEach((el: any) => {
        el.__change_color__ = false
      })
      return
    }

    const mat = object.material
    if (object.__mat_color__ === void 0) {
      object.__mat_color__ = mat.color
    }
    mat.color = new THREE.Color(0xff0ff0)
    anchorGroup?.children.forEach((el: any) => {
      el.__change_color__ = el.uuid === object.uuid
    })
  } else {
    container.style.cursor = 'auto'
    anchorGroup?.children.forEach((el: any) => {
      el.__change_color__ = false
    })
  }
}

/**
 * 恢复锚点材质
 * @param anchorGroup 锚点组
 */
export const restoreAnchorMaterial = anchorGroup => {
  anchorGroup?.children.forEach((el: any) => {
    if (!el.__change_color__ && el.__mat_color__) {
      el.material.color = el.__mat_color__
    }
  })
}

/**
 * 查找父级为建筑
 * @param object 场景对象
 * @returns
 */
export const findParentIsBuilding = (object, filterNames: string[] = []) => {
  const _find = obj => {
    if (obj._isBuilding_ || filterNames.includes(obj.name)) return obj
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

/**
 * 获取模型动作
 * @param model 模型
 * @returns
 */
export const getModelAction = model => {
  // 动画
  const animations = model.animations
  const mixer = new THREE.AnimationMixer(model)
  const actions = {}

  for (let i = 0; i < animations.length; i++) {
    const clip = animations[i]
    const action = mixer.clipAction(clip)
    actions[clip.name] = action
  }
  return {
    mixer,
    actions
  }
}

/**
 * 巡航目标移动
 * @param target 需要移动的目标
 * @param options 巡航过渡回参
 */
export const cruiseTargetMove = (target, options, controls) => {
  let { position, lookAt, curve, progress } = options
  // 前置视角前 0.02
  progress = progress + 0.02
  if (progress > 1) progress = progress - 1
  const up = new THREE.Vector3(0, 0.1, 0)
  // 当前曲线进度坐标
  const cPos = curve.getPointAt(progress)
  position = cPos.clone().add(up)
  const oft = 0.001
  let ts = progress + oft
  if (ts > 1) ts = ts - 1
  lookAt = curve.getPointAt(ts)
  if (controls?.target) {
    const offect = new THREE.Vector3(
      __CONFIG__.personSightOffset.x,
      __CONFIG__.personSightOffset.y,
      __CONFIG__.personSightOffset.z
    )
    controls.target.copy(lookAt.clone().add(offect))
  }

  target.position.copy(position.clone().add(up))
  // // 求正切值
  const angle = Math.atan2(-lookAt.z + position.z, lookAt.x - position.x)
  target.rotation.y = Math.PI * 0.5 + angle
}

/**
 * 获取相交对象
 * @param e 鼠标事件
 * @param container 容器
 * @param scale 缩放
 * @param camera 相机
 * @param objects 模型对接列表
 * @param deepCheck 深度检查
 * @returns
 */
export const getIntersectObjects = (
  e: PointerEvent,
  container,
  scale,
  camera,
  objects,
  deepCheck?: boolean
) => {
  raycasterUpdate(e, container, scale)
  // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
  raycaster.setFromCamera(pointer, camera)
  let interscts = raycaster.intersectObjects(objects, deepCheck /* 是否检查所有后代 */)
  return interscts
}
