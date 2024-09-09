import type { XYZ } from './index'

import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import CONFIG from './config'

/**
 * 校验url地址是否正确
 * @param { string } url 需要校验的 url 地址
 * @return { boolean } 校验结果
 * @example
 * checkUrl( 'https://www.baidu.com' )
 */
export const checkUrl = (url: string): boolean => {
  !url && (url = '')
  let regex = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/
  if (!regex.test(url)) return false
  return true
}

// 创建渲染器
export const createRender = (dom: HTMLElement) => {
  const width = dom.clientWidth,
    height = dom.clientHeight
  // 创建渲染对象
  const renderer = new THREE.WebGLRenderer({
    // 是否开启反锯齿，设置为true开启反锯齿
    antialias: true,
    // 透明度
    alpha: true
  })
  // 解决加载gltf格式模型纹理贴图和原图不一样问题
  renderer.outputEncoding = THREE.sRGBEncoding
  // 色调映射属性.toneMapping用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围(HDR)效果
  renderer.toneMapping = THREE.ReinhardToneMapping
  // 色调映射的曝光级别。默认是1,曝光度值越大，图像亮度越高
  // 可以尝试不同值去测试显示效果 比如0:看不到  0.1:很暗  200:过于亮，轮廓感不清楚
  renderer.toneMappingExposure = 2
  //是否乘以gamma输出，默认值false
  renderer.gammaOutput = true

  // renderer.setClearAlpha( 0 )

  // 设置渲染尺寸
  renderer.setSize(width, height)
  // 像素比例
  renderer.setPixelRatio(window.devicePixelRatio)
  // 画布插入容器
  dom.appendChild(renderer.domElement)
  return renderer
}

// 创建透视相机
export const createPerspectiveCamera = (dom: HTMLElement, near = 0.1, far = 10000) => {
  // 相机设定
  const width = dom.clientWidth,
    height = dom.clientHeight
  // 透视投影相机对象 参数（现场角度，窗口长宽比，开始渲染位置，结束渲染位置）
  const camera = new THREE.PerspectiveCamera(36, width / height, near, far)
  camera.position.set(-350, 510, 700) // 相机位置
  return camera
}

// 创建方向光
export const createDirectionalLight = (color = 0xffffff, intensity = 1, s = 800, size = 4096, near = 1, far = 2000) => {
  // 平行光
  const dirLight = new THREE.DirectionalLight(color, intensity)
  dirLight.position.set(500, 800, 800)
  dirLight.castShadow = true
  // 设置阴影贴图模糊度
  dirLight.shadow.camera.radius = 10
  dirLight.shadow.camera.near = near
  dirLight.shadow.camera.far = far
  dirLight.shadow.camera.top = s
  dirLight.shadow.camera.right = s
  dirLight.shadow.camera.left = -s
  dirLight.shadow.camera.bottom = -s

  dirLight.shadow.mapSize.set(size, size)
  return dirLight
}

// 创建控制器
export const createControl = (camera, renderer) => {
  // 创建控件
  const controls = new OrbitControls(camera, renderer.domElement)

  // 最大最小相机移动距离(景深相机)
  controls.minDistance = 1
  // controls.maxDistance = 40000

  // 最大仰视角
  controls.maxPolarAngle = Math.PI * 0.45

  // 聚焦坐标
  controls.target.set(0, 0, 0)
  return controls
}

// 创建网格
export const createLayoutGrid = () => {
  // 网格宽度、等分数、中心线颜色、网格颜色
  let grid = new THREE.GridHelper(800, 80, 0xa1a1a1, 0xa1a1a1)
  // grid.visible = false
  grid.material.opacity = 0.3
  grid.material.transparent = true
  return grid
}

// 加载背景图
export const loadBackground = (scene, baseUrl: string, path: string = '', code: string): void => {
  let loader = new THREE.CubeTextureLoader()
  let env = loader.load([
    `${baseUrl}${path}/${code}/posX.jpeg`,
    `${baseUrl}${path}/${code}/negX.jpeg`,
    `${baseUrl}${path}/${code}/posY.jpeg`,
    `${baseUrl}${path}/${code}/negY.jpeg`,
    `${baseUrl}${path}/${code}/posZ.jpeg`,
    `${baseUrl}${path}/${code}/negZ.jpeg`
  ])
  // 设置背景
  scene.background = env
}

// 相机入场动画
export const cameraInSceneAnimate = (camera: any, to: XYZ, at: XYZ): Promise<any> => {
  camera.lookAt(at)
  return new Promise(resolve => {
    new TWEEN.Tween(camera.position)
      .to(to, 1000)
      .easing(TWEEN.Easing.Quadratic.In)
      .start()
      .onUpdate(() => {
        // 设置相机对焦位置
        camera.lookAt(at)
      })
      .onComplete(() => {
        resolve(camera)
      })
  })
}

// 获取位置、大小、缩放参数
export const get_P_S_R_param = (model, item, s: number = 1) => {
  // 模型本身
  const _position_ = model.position,
    _rotation_ = model.rotation,
    _scale_ = model.scale

  // 设备配置
  const position = item.position || { x: 0, y: 0, z: 0 },
    rotation = item.rotation || { x: 0, y: 0, z: 0 },
    scale = item.scale || { x: 1, y: 1, z: 1 }

  // 判断配置角度倍数系数（小于 2 相当于使用的 180 度的倍数）
  const PInsx = Math.abs(rotation.x) < 2 ? 1 : 180
  const PInsy = Math.abs(rotation.y) < 2 ? 1 : 180
  const PInsz = Math.abs(rotation.z) < 2 ? 1 : 180

  return {
    position: [_position_.x + position.x, _position_.y + position.y, _position_.z + position.z],
    rotation: [
      _rotation_.x + (Math.PI / PInsx) * rotation.x,
      _rotation_.y + (Math.PI / PInsy) * rotation.y,
      _rotation_.z + (Math.PI / PInsz) * rotation.z
    ],
    scale: [_scale_.x * s * scale.x, _scale_.y * s * scale.y, _scale_.z * s * scale.z]
  }
}

// 克隆材质
const cloneMaterial = list => {
  return list.map(el => {
    if (el.children && el.children.length > 0) {
      el.children = cloneMaterial(el.children)
    } else if (el.material) {
      if (el.material instanceof Array) {
        el.material = el.material.map(el => el.clone())
      } else {
        el.material = el.material.clone()
      }
    }
    return el
  })
}

// 深克隆 // 防止数据感染
export const deepClone = obj => {
  let model = obj.clone()
  model.children = cloneMaterial(model.children)
  return model
}

// 材质替换
export const replaceMaterial = (child: any, color = 0x676565, meshNames: string[], envMap?): void => {
  const { type, name } = child
  // 灯光
  if (type.indexOf('Light') > -1) {
  }
  if (CONFIG.mesh.receiveShadowName.some(it => name.indexOf(it) > -1)) {
    // 接收阴影
    child.traverse(el => {
      if (el.isMesh) {
        el.receiveShadow = true
      }
    })
  } else if (meshNames.some(it => name.indexOf(it) > -1)) {
    setMaterialColor(child, color)
  } else if (child.isMesh) {
    envMap && (child.material.envMap = envMap)
    child.castShadow = true
  }
}

// 获取颜色数组
export const getColorArr = (color: import('./index').Color) => {
  let arr: (number | string)[] = []
  if (Array.isArray(color)) {
    arr = color
  } else if (color != void 0) {
    arr = [color]
  }
  return arr
}

// 设置材质颜色
export const setMaterialColor = (e: any, color: number | string): void => {
  e.traverse(el => {
    if (el.isMesh) {
      if (Array.isArray(el.material)) {
        el.material.forEach(mt => {
          mt.color.set(color)
        })
      } else {
        el.material.color.set(color)
      }
    }
  })
}

// 查找指定名称的材质对象集合
export const findMaterial = (children, names: string[]) => {
  let list: any[] = []
  if (!children || !children.length) return []
  function find(data) {
    data.forEach(el => {
      const name = el.name
      if (typeof name == 'string' && names.some(t => name.indexOf(t) > -1)) {
        list.push(el)
      }
      if (el.children) {
        find(el.children)
      }
    })
  }
  find(children)
  return list
}

// 设备渐变动画
export const deviceGradientAnimate = (material): void => {
  if (!material) return
  material.transparent = true
  material.opacity = 0.1
  new TWEEN.Tween(material)
    .to({ opacity: 1 }, 1000 * 1.5)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start()
}

// 获取偏差值
const TYPE_KEYS = CONFIG.keys
export const getDeviationConfig = (item, cr = 0xffffff) => {
  const type = item.type
  let size = 10, // 模型、字体大小
    color = cr, // 字体颜色
    txPos = { x: 0, y: 0, z: 0 }, // 字体 xyz 坐标（相对模型的中心点）
    txRot = { x: 0, y: 0, z: 0 }, // 字体 xyz 旋转大小
    warnPos = { x: 0, y: 0, z: 0 }, // 警告 xyz 坐标（相对模型的中心点）
    statusPos = { x: 0, y: 0, z: 0 }, // 状态 xyz 坐标（相对模型的中心点）
    disabledPos = { x: 0, y: 0, z: 0 } // 禁用 xyz 坐标（相对模型的中心点）
  switch (type) {
    case TYPE_KEYS.TEXT: // 文字
      break

    case TYPE_KEYS.JSQ: // 集水器
      ;(txPos.y = 10), (txPos.z = 20)
      warnPos.y = 62
      break

    case TYPE_KEYS.LDB: // 冷冻泵
    case TYPE_KEYS.LQB: // 冷却泵
      ;(txPos.z = type === TYPE_KEYS.LDB ? 75 : 60), (warnPos.y = 45)
      txRot.y = type === TYPE_KEYS.LDB ? 90 : -90
      ;(statusPos.x = -0.4), (statusPos.y = 46.7), (statusPos.z = -15.7)
      ;(disabledPos.x = -0.4), (disabledPos.y = 34), (disabledPos.z = 12.5)
      break

    case TYPE_KEYS.XBC: // 蓄冰槽
    case TYPE_KEYS.LXJ: // 离心机
      ;(txPos.y = 16), (txPos.z = 40)
      warnPos.y = 78
      ;(statusPos.x = 36), (statusPos.y = 67), (statusPos.z = 42)
      ;(disabledPos.x = -25), (disabledPos.y = 85), (disabledPos.z = 20)
      break
    case TYPE_KEYS.LGJ: // 螺杆机
    case TYPE_KEYS.LGJ_2: // 双头螺杆机
    case TYPE_KEYS.LGJ_3: // 三机头螺杆机
    case TYPE_KEYS.LGJ_4: // 四机头螺杆机
      ;(txPos.y = 16), (txPos.z = 40)
      warnPos.y = 78
      ;(statusPos.x = -40), (statusPos.y = 64), (statusPos.z = 42)
      ;(disabledPos.x = 0), (disabledPos.y = 75), (disabledPos.z = 20)
      break

    case TYPE_KEYS.LQT: // 冷却塔
      ;(txPos.x = -60), (warnPos.y = 85)
      ;(statusPos.x = -27.6), (statusPos.y = 70), (statusPos.z = -25.2)
      ;(disabledPos.x = -27.6), (disabledPos.y = 70), (disabledPos.z = 25.2)
      break

    case TYPE_KEYS.GL: // 锅炉
      ;(txPos.x = 83), (txPos.y = 2)
      ;(warnPos.y = 125), (statusPos.y = 125)
      break

    case TYPE_KEYS.BSHRQ: // 板式换热器
      size = 12
      txPos.y = 8
      txPos.z = 33
      ;(warnPos.y = 105), (statusPos.y = 105)
      break

    case TYPE_KEYS.BSHLQ: // 板式换热器-制冷
      ;(txPos.y = 16), (txPos.z = 40)
      ;(warnPos.y = 88), (statusPos.x = -43), (statusPos.y = 90), (statusPos.z = -20)
      break

    case TYPE_KEYS.FLRB: // 风冷热泵
      ;(txPos.x = 50), (txPos.y = 2)
      ;(warnPos.y = 123), (statusPos.y = 123)
      break

    case TYPE_KEYS.FJY_X: // 风机-右
    case TYPE_KEYS.FJZ_X: // 风机-左
      ;(size = 6), (txPos.y = 80), (txPos.z = 30), (warnPos.y = 80), (statusPos.y = 80)
      break

    case TYPE_KEYS.FJY: // 风机-右
    case TYPE_KEYS.FJZ: // 风机-左
      ;(size = 6), (txPos.y = 103), (warnPos.y = 110), (statusPos.y = 110)
      break

    case TYPE_KEYS.FM: // 阀门
    case TYPE_KEYS.XFM: // 阀门
      break
  }

  // 字体配置
  let font = item.font || {}
  // 字体坐标
  let fontPOs = font.position || {}
  if (fontPOs) {
    Object.keys(fontPOs).forEach(key => {
      txPos[key] = fontPOs[key]
    })
  }
  // 字体角度
  let fontRot = font.rotation || {}
  if (fontRot) {
    Object.keys(fontRot).forEach(key => {
      txRot[key] = fontRot[key]
    })
    ;(txRot.x = (Math.PI / 180) * txRot.x), (txRot.y = (Math.PI / 180) * txRot.y), (txRot.z = (Math.PI / 180) * txRot.z)
  }

  font.size && (size = font.size)
  font.color && (color = font.color)

  return { size, color, txPos, txRot, warnPos, statusPos, disabledPos }
}

// 添加设备并定位
export const addDeviceBindPosition = (model, item, warnGroup?, _size?, _position?, _rotation?) => {
  const { position: POS, scale: SCA, rotation: ROT } = get_P_S_R_param(model, item)
  // 缩放
  model.scale.set(...SCA)

  // 组合模型
  let group = new THREE.Group()
  group.add(model)
  // let font = {
  //   size: _size,
  //   color: 0x949899
  // }
  // let text = this.createText( item.name, font, _position, _rotation )
  // group.add( text )
  group.name = item.name
  group.data = item

  // 转换方位 组合一起转换方位，防止文字或警告标记方向不对
  group.rotation.set(...ROT)

  // 警告标识
  if (!!warnGroup) {
    group.add(warnGroup)
  }

  // 摆放位置 y坐标下降30像素为了动画效果
  POS[1] -= 30
  group.position.set(...POS)
  return group
}

// 创建文字
export const createText = (item, fontParser, color?) => {
  if (!fontParser) return
  const obj = getDeviationConfig(item, color)
  // 文字
  let textGeo = new TextGeometry(item.name || '', {
    font: fontParser,
    size: obj.size || 5,
    depth: 0,
    curveSegments: 12, // 曲线分段
    bevelThickness: 1, // 斜面厚度
    bevelSize: 0.1, // 斜角大小
    bevelEnabled: true // 斜角
  })
  const rotation = obj.txRot
  textGeo.rotateX(rotation.x)
  textGeo.rotateY(rotation.y)
  textGeo.rotateZ(rotation.z)

  const position = obj.txPos
  // 计算边界
  textGeo.computeBoundingBox()
  // 计算垂直算法
  textGeo.computeVertexNormals()
  let offsetX = 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
  let offsetZ = 0.5 * (textGeo.boundingBox.max.z - textGeo.boundingBox.min.z)
  let material = new THREE.MeshPhongMaterial({ color: obj.color != void 0 ? obj.color : 0xffffff, flatShading: !true })
  let mesh = new THREE.Mesh(textGeo, material)
  mesh.castShadow = true
  mesh.position.set((position.x || 0) - offsetX, position.y || 0, (position.z || 0) - offsetZ)
  return mesh
}

// 创建警告标识 key、数据、模型、光源半径、缩放
export const createWarning = (key, item, model, radius = 100, s: number = 1) => {
  if (!model) return
  const obj = getDeviationConfig(item).warnPos
  let group = new THREE.Group()
  // 深克隆
  let warningSigns = deepClone(model)
  warningSigns.scale.set(s, s, s)
  warningSigns.position.set(obj.x, obj.y, obj.z)
  group.add(warningSigns)

  // 创建光源
  // 点光源 (颜色、强度、距离、衰减) 衰减！！！不要默认值
  let light = new THREE.PointLight(0xc20c00, 8, radius, 0)
  // const sphere = new THREE.SphereGeometry( 1, 16, 8 )
  // light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) )

  light.name = '灯光'
  light.position.y = obj.y + 30
  group.add(light)
  group.name = key

  // 警告标识动画
  let mixer = new THREE.AnimationMixer(group)

  // 创建颜色关键帧对象
  // 0 时刻对应颜色 1，0，0   .25时刻对应颜色 1，1，1 .75...
  let colorKF = new THREE.KeyframeTrack('红色.material.color', [0, 0.25, 0.75], [1, 0, 0, 1, 1, 0, 1, 0, 0])
  let lightKF = new THREE.KeyframeTrack('灯光.color', [0, 0.25, 0.75], [1, 0, 0, 1, 1, 0, 1, 0, 0])
  // 创建名为Sphere对象的关键帧数据  从0~20时间段，尺寸scale缩放3倍
  let scaleTrack = new THREE.KeyframeTrack('警告标识.scale', [0, 0.5, 1], [1, 1, 1, 1.2, 1.2, 2, 1, 1, 1])
  // 多个帧动画作为元素创建一个剪辑 clip 对象，命名‘warning_’，持续时间1
  let clip = new THREE.AnimationClip(`warning_`, 1, [colorKF, lightKF, scaleTrack])
  let action = mixer.clipAction(clip)
  // 暂停
  action.paused = true
  // 播放
  action.play()

  // 隐藏
  group.visible = false
  return {
    group,
    action,
    mixer
  }
}

// 创建状态标识
export const createStatusMark = (item, model, isDisabled?: boolean) => {
  if (!model) return
  const obj = getDeviationConfig(item)[isDisabled ? 'disabledPos' : 'statusPos']
  // 深克隆
  let status = deepClone(model)
  status.position.set(obj.x, obj.y, obj.z)
  status.visible = false
  return status
}

// 设备动画
export const deviceAnimate = (group, position) => {
  new TWEEN.Tween(group.position).to(position, 1000).easing(TWEEN.Easing.Quadratic.In).start()
}

// 查找父级数据
export const findParentData = (object, callback) => {
  if (!!object.data && object.data.type) {
    callback(object)
  } else {
    if (object.isScene) {
      callback(null)
    } else {
      findParentData(object.parent, callback)
    }
  }
}

// 获取 3 维平面位置
export const getPlanePosition = (dom, object, camera): import('./index').StylePosition => {
  let halfw = dom.clientWidth / 2
  let halfh = dom.clientHeight / 2
  let position = object.position.clone()
  const scale = object.scale
  position.y += scale.x / 2
  // 平面坐标
  let vector = position.project(camera)
  // 二维坐标 (没有加偏移量因为 css 父级又相对定位)
  let pos = {
    left: vector.x * halfw + halfw,
    top: -vector.y * halfh + halfh
  }
  return pos
}

// 清除缓存
export const dispose = obj => {
  if (!obj || !obj.traverse) return
  obj.traverse(el => {
    if (el.material) el.material.dispose()
    if (el.geometry) el.geometry.dispose()
    el?.clear()
  })
  obj?.clear()
}
