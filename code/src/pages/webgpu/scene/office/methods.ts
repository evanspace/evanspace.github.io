import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

import DEFAULTCONFIG from './config'
import { ObjectItem, ThreeModelItem } from 'three-scene/types/model'

const Hooks = ThreeScene.Hooks
const Utils = ThreeScene.Utils

const { initCSS2DRender, createCSS2DDom } = Hooks.useCSS2D()
const { createFleeting, fleetingAnimate } = Hooks.useFleeting()
const { raycaster, pointer, update: raycasterUpdate, style } = Hooks.useRaycaster()

const { pass, mrt, output, emissive, float } = THREE.TSL

export { Hooks, Utils }

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
      color,
      points,
      tubularSegments: 1000,
      radius: 0.6,
      repeat: {
        x: 2,
        y: 4
      },
      bloom: true,
      bloomIntensity
    })
    group.add(line)
  }
  group.name = '流光组'
  return group
}

/**
 * 流光组动画
 */
export const fleetingGroupAnimate = fleetingAnimate

/**
 * 创建路灯组
 * @param list 路灯坐标组
 * @param color 颜色
 * @returns
 */
export const createStreetLampGroup = (list, color: number | string = 0xffffff) => {
  const group = new THREE.Group()
  const spotLight = new THREE.SpotLight(color, 10, 100, Math.PI * 0.6, 0.6, 0.4)
  for (let i = 0; i < list.length; i++) {
    const light = spotLight.clone()
    const [x, y, z] = list[i]
    light.position.set(x, y, z)
    light.target.position.set(x, y - 1, z)
    light.add(spotLight.target)
    group.add(light)
    // 辅助不加，灯光不圆
    const helper = new THREE.SpotLightHelper(light)
    helper.visible = false
    group.add(helper)
  }
  group.name = '路灯组'
  group.visible = false
  return group
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
  deepCheck
) => {
  raycasterUpdate(e, container, scale)
  // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
  raycaster.setFromCamera(pointer, camera)
  let interscts = raycaster.intersectObjects(objects, deepCheck /* 是否检查所有后代 */)
  return interscts
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
export const findParentIsBuilding = object => {
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

/**
 * 绘制大屏画布
 * @param canvas 画布
 * @param text 文本
 * @returns
 */
export const drawBdCanvas = (canvas, text = '') => {
  const w = canvas.offsetWidth
  const h = canvas.offsetHeight
  canvas.width = w
  canvas.height = h

  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#f00'

  // 分割为两行
  const rows = 2,
    max = 12,
    len = text.length
  const rlen = len > max ? Math.ceil(len / rows) : max
  let list: string[] = [],
    index = 0
  while (index < len) {
    const end = index + rlen
    list.push(text.substring(index, end))
    index = end
  }

  ctx.font = '100 40px 微软雅黑'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const tl = list.length

  list.forEach((tx, index) => {
    const i = index * tl + 1
    ctx.fillText(tx, w / 2, (h / tl / 2) * i)
  })
}

// 创建视频元素
export const createVideoDom = (src?: string) => {
  const dom = document.createElement('video')
  dom.src = DEFAULTCONFIG.baseUrl + (src || '/oss/textures/park/sintel.mp4')
  dom.loop = true
  // videoDom.autoplay = true
  return dom
}

// 视频封面
export const videoCoverTexture = new THREE.TextureLoader().load(
  DEFAULTCONFIG.baseUrl + '/oss/textures/office/cover.jpg'
)
// 空调风纹理
export const windTexture = new THREE.TextureLoader().load(
  DEFAULTCONFIG.baseUrl + '/oss/textures/office/wind.png'
)

/**
 * 添加视频材质
 * @param dbObj 模型对象
 * @returns
 */
export const addVideoMaterial = dbObj => {
  const videoDom2 = createVideoDom()
  const videoTexture2 = new THREE.VideoTexture(videoDom2)
  dbObj.__video_texture__ = videoTexture2
  dbObj.__cover_texture__ = videoCoverTexture.clone()
  dbObj.material = new THREE.MeshPhongMaterial({
    map: videoCoverTexture
  })
  dbObj.__video__ = videoDom2
  return dbObj
}

/**
 * 视频操作播放
 * @param vobj 视频材质对象
 * @param isPlay 是否播放
 */
export const videoMaterilPlay = (vobj, isPlay?: boolean) => {
  if (vobj && vobj.__video__) {
    const __video__ = vobj.__video__
    if ((isPlay != void 0 && !isPlay) || __video__.paused) {
      vobj.material.map = vobj.__video_texture__
      __video__?.play()
    } else {
      __video__?.pause()
      vobj.material.map = vobj.__cover_texture__
    }
  }
}

/**
 * 清理视频
 * @param videos 视频列表
 */
export const clearVideo = videos => {
  for (let i = 0; i < videos.length; i++) {
    const obj = videos[i]
    const { __video__, __cover_texture__, __video_texture__ } = obj
    if (__video__) {
      __video__.pause()
      __video__.remove()
      __cover_texture__?.dispose()
      __video_texture__?.dispose()
    }
  }
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

export const liftMove = (liftName, from, to) => {
  const duration = 1000 * 5
  ElMessage.success({
    message: `【${liftName}】移动中，请稍候，${duration / 1000}秒后到达!`,
    duration: duration
  })

  return new TWEEN.Tween(from).to(to, duration).delay(0).start()
}
