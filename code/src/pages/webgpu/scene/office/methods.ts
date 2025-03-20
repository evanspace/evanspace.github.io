import * as THREE from 'three/webgpu'
import { Scene, Utils, Hooks } from 'three-scene'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

import DEFAULTCONFIG from './config'
import type { ObjectItem, ThreeModelItem } from 'three-scene/types/model'
import type { UpdateDotItem } from './index'

const { initCSS2DRender, createCSS2DDom } = Hooks.useCSS2D()
const { initCSS3DRender, createCSS3DDom } = Hooks.useCSS3D()
const { createFleeting, fleetingAnimate } = Hooks.useFleeting(THREE)
const { raycaster, pointer, update: raycasterUpdate, style } = Hooks.useRaycaster()
const { createParticleSmoke } = Hooks.useSmoke(THREE)

const { pass, mrt, output, emissive, float, uniform } = THREE.TSL

export { Hooks, Utils, Scene, THREE }

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
 * 更新点位隐现
 * @param scene 场景
 * @param target 目标对象
 * @param visible 是否展示
 */
export const updateDot3Visible = (object: ThreeModelItem, data: UpdateDotItem) => {
  const target = object.getObjectByProperty('isCSS3DObject', true) as ReturnType<
    typeof createCSS3DDom
  >
  // 限制刷新频率
  // const ts = Date.now()
  // if (ts - (object.userData._ts ?? 0) < DEFAULTCONFIG.envRefreshLimitTime) {
  //   return
  // }
  // object.userData._ts = ts
  if (!target) return
  const doms = target.element?.getElementsByClassName('env-item')
  for (let i = 0; i < doms.length; i++) {
    const env = doms[i]
    const tDom = env.getElementsByClassName('value')[0] as HTMLElement
    const { value, color } = getEnvOptions(i + 1, data)
    tDom.textContent = value + ''
    tDom.style.setProperty('--color', color)
  }
}

// 获取环境对应配置
const getEnvOptions = (type, data: UpdateDotItem) => {
  let value = 0,
    color = '#fff'
  switch (type) {
    case 1:
      value = data.temperature
      color = value > 23 ? '#f00' : '#008000'
      break
    case 2:
      value = data.humidity
      color = value > 70 ? '#f00' : '#008000'
      break
    case 3:
      value = data.co2
      color = value > 420 ? '#f00' : '#008000'
      break
  }
  return {
    value,
    color
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
  label.name = item.name + '_2D_Dot'
  label.userData.data = item
  // 原始点位 备用
  label.userData.position = { x, y, z }
  return label
}

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
 * 创建点位
 * @param item 模型配置对象
 * @param clickBack 点击事件回调
 * @returns
 */
export const createDotCSS3DDom = (item: ObjectItem, clickBack) => {
  const pos = item.position
  const { size, color } = item.font || {}
  const { x = 0, y = 0, z = 0 } = pos || {}
  const label = createCSS3DDom({
    name: `

      <div class="env-wrap">
        <div class="title">${item.name || ''}</div>
        <div class="env-conten" style="${
          size != void 0 ? `--font-size: ${typeof size === 'string' ? size : size + 'px'};` : ''
        } ${color != void 0 ? `--color: ${color}` : ''}">
          <div class="env-item temp">
            <div class="name">温度</div>
            <span class="inner">
              <span class="value">0</span>
              <span class="unit">°C</span>
            </span>
          </div>

          <div class="env-item hum">
            <div class="name">湿度</div>
            <span class="inner">
              <span class="value">0</span>
              <span class="unit">%</span>
            </span>
          </div>

          <div class="env-item co2">
            <div class="name">CO₂</div>
            <span class="inner">
              <span class="value">0</span>
              <span class="unit">ppm</span>
            </span>
          </div>
        </div>
      </div>
    `,
    className: 'dot-env-box',
    sprite: true,
    onClick: clickBack
  })
  label.rotateY(Math.PI * 0.5)

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
  group.name = item.name + '_3D_Dot'
  group.userData.data = item
  // 原始点位 备用
  group.userData.position = { x, y, z }
  return group
}
export const getCSS3DObjectTargetMesh = target => {
  return target?.children[1]
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
 * 创建居民灯组
 * @param list 灯光列表
 * @param color 灯光颜色
 * @returns
 */
export const createResidentLightGroup = (list, color: number | string = 0xffffff) => {
  const group = new THREE.Group()
  const pointLight = new THREE.PointLight(color, 10, 100, 0.4)
  for (let i = 0; i < list.length; i++) {
    const light = pointLight.clone()
    const [x, y, z] = list[i]
    light.position.set(x, y, z)
    group.add(light)
  }
  group.name = '居民灯组'
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

  // 换行符分割
  let list: string[] = text.split(/[\r\n]/g)
  // 默认自动分割最大长度
  const max = 12
  if (list.length == 1 && text.length > max) {
    list = []
    let index = 0
    // 可分割行数
    const rows = Math.ceil(text.length / max),
      len = text.length
    // 均分长度
    const rlen = len > max ? Math.ceil(len / rows) : max
    while (index < len) {
      const end = index + rlen
      list.push(text.substring(index, end))
      index = end
    }
  }

  ctx.font = '100 40px 微软雅黑'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const tl = list.length

  list.forEach((tx, index) => {
    // 2n-1
    const i = (index + 1) * 2 - 1
    ctx.fillText(tx, w / 2, (h / tl / 2) * i)
  })
}

// 创建视频元素
export const createVideoDom = (src?: string) => {
  const dom = document.createElement('video')
  dom.src = src || DEFAULTCONFIG.screenVideo
  dom.loop = true
  return dom
}

// 视频封面
export const videoCoverTexture = new THREE.TextureLoader().load(DEFAULTCONFIG.videoCover)

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

/**
 * 获取前进坐标
 * @param model 模型对象
 * @param step 步（前进多少）
 * @returns
 */
export const getForwardPosition = (model, step) => {
  if (!model) return new THREE.Vector3()
  // 向量
  const dir = new THREE.Vector3()
  // 获取的视线方向
  model.getWorldDirection(dir)
  // dis向量表示相机沿着相机视线方向平移的位移量
  const dis = dir.clone().multiplyScalar(step)
  // 初始位置+偏移向量
  const pos = model.position.clone().add(dis) || new THREE.Vector3()
  return pos
}

/**
 * 电梯移动
 * @param liftName 电梯组名称
 * @param from 动画初始坐标
 * @param to 动画最终坐标
 * @returns
 */
export const liftMove = (liftName, from, to) => {
  const duration = 1000 * 5
  ElMessage.success({
    message: `【${liftName}】移动中，请稍候，${duration / 1000}秒后到达!`,
    duration: duration
  })

  return new TWEEN.Tween(from).to(to, duration).delay(0).start()
}

/**
 * 创建空调风组
 * @param scene 场景
 * @param _names
 * @returns
 */
export const createAirGroup = (scene: THREE.Scene, speed: ReturnType<typeof uniform>) => {
  // 空调风列表
  const data = DEFAULTCONFIG.airWinds
  const group = new THREE.Group()
  for (let i = 0; i < data.length; i++) {
    const { name, list } = data[i]
    // 查找训在的对象清理
    const obj = scene.getObjectByName(name)
    if (obj) {
      obj.clear()
    }

    const subGroup = new THREE.Group()
    subGroup.name = name
    for (let j = 0; j < list.length; j++) {
      const { position: pos, rotation } = list[j]
      const { x = 0, y = 0, z = 0 } = rotation
      const mesh = createParticleSmoke({
        speed,
        count: Math.floor(Math.random() * 100 + 50),
        mixColor: 0xffffff,
        offsetRangeMin: [-5, 2, 0],
        offsetRangeMax: [5, 3, 3],
        scaleMin: 0.1,
        scaleMax: 1.2,
        mixColorStart: 0.15,
        textureSrc: DEFAULTCONFIG.airParticleTexture
      })

      // 角度、位置
      const sp = Math.PI / 180
      mesh.rotation.set(sp * x + Math.PI * 0.5, sp * y, sp * z)
      mesh.position.set(pos.x, pos.y, pos.z)
      subGroup.add(mesh)
    }
    subGroup.visible = false
    group.add(subGroup)
  }

  return group
}

/**
 * 转换 hover 材质
 * @param model 模型
 * @returns
 */
export const convertHoverMaterial = model => {
  const selectObject = DEFAULTCONFIG.selectObject
  const material = new THREE.MeshBasicNodeMaterial({
    transparent: true,
    opacity: 0.15,
    color: selectObject.color
  })
  material.mrtNode = THREE.TSL.mrt({
    bloomIntensity: THREE.TSL.float(selectObject.bloomIntensity)
  })

  if (model.isMesh) {
    model.material = material
    model.visible = false
  }
  const list: any[] = []
  model.traverse(el => {
    if (el.isMesh) {
      el.material = material
      el.visible = false
      list.push(el)
    }
  })
  return list
}

/**
 * 悬浮 空组
 * @param interscts 交叉对象列表
 * @param callback 回调
 * @param container 容器
 * @param group 空组
 */
export const hoverEmptyGroup = (interscts, callback, container, group) => {
  if (interscts[0]) interscts[0].object._isEmptyMesh_ = true
  if (typeof callback === 'function') callback(interscts[0], style)

  if (interscts.length) {
    const intersct = interscts[0]
    const object = intersct.object
    container.style.cursor = 'pointer'

    group?.traverse(el => {
      if (el.isMesh) {
        el.visible = el.uuid === object.uuid
      }
    })
  } else {
    container.style.cursor = 'auto'
    group?.traverse(el => {
      if (el.isMesh) {
        el.visible = false
      }
    })
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
      DEFAULTCONFIG.personSightOffset.x,
      DEFAULTCONFIG.personSightOffset.y,
      DEFAULTCONFIG.personSightOffset.z
    )
    controls.target.copy(lookAt.clone().add(offect))
  }

  target.position.copy(position.clone().add(up))
  // // 求正切值
  const angle = Math.atan2(-lookAt.z + position.z, lookAt.x - position.x)
  target.rotation.y = Math.PI * 0.5 + angle
}
