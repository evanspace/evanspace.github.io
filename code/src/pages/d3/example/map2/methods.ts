import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import ThreeScene from 'three-scene'

import { useCorrugatedPlate } from 'three-scene/hooks/corrugated-plate'
import { useOutline } from 'three-scene/hooks/out-line'
import { useCoord } from 'three-scene/hooks/coord'
import { useCountryLine } from 'three-scene/hooks/country-line'
import { useCSS3D, CSS3DRenderer } from 'three-scene/hooks/css3d'
import { useMarkLight } from 'three-scene/hooks/mark-light'
import { useRaycaster } from 'three-scene/hooks/raycaster'
import { useFlywire } from 'three-scene/hooks/flywire'
import { useMapBar } from 'three-scene/hooks/map-bar'
import { numConverter } from '@/common/utils/reckon'

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const OPTS = {
  // 地图深度
  depth: 1,
  // 地图缩放倍数
  scale: 40,
  // 右键间隔时间
  rightClickBackDiffTime: 100
}

// 全局颜色
const COLOR = {
  // 主色（地图面）
  main: 0x338ad7,
  mainHover: 0x92ffff,
  // 边(区域侧边)
  borderColor: 0x92ffff,
  borderHoverColor: 0x10467a,
  // 浅色
  light: 0x10467a,
  lightHover: 0x92ffff,
  // 波纹板
  plateColor: 0x338ad7,
  plateLight: 0x10467a,
  // 线条(地图区块上下线条)
  line: 0x91dbf3,
  line2: 0x61fbfd,
  // 网格线
  gridColor: 0x0a2036,
  // 网格交叉
  gridFork: 0x0e2843,
  // 轮廓线
  outline: 0xb4eafc,
  // mark 颜色(光柱)
  markColor1: 0xcaffff,
  markColor2: 0x69f8ff,
  // 飞线
  flyColor1: 0x91dbf3,
  flyColor2: 0x61fbfd,
  // 散点
  scatterColor1: 0x91dbf3,
  scatterColor2: 0x61fbfd
}

const { createCorrugatedPlate, update: corrugatUpdate } = useCorrugatedPlate({
  factor: OPTS.scale,
  color: COLOR.plateColor,
  light: COLOR.plateLight
})
const { createOutline, update: outlineUpdate } = useOutline({
  factor: OPTS.scale,
  color: COLOR.outline
})
const { getBoundingBox } = useCoord()
const { createCountryFlatLine, getPoints } = useCountryLine()
const { initCSS3DRender, createCSS3DDom } = useCSS3D()
const { createMarkLight } = useMarkLight({
  pointTextureUrl: `${base}/oss/textures/map/point.png`,
  circleTextureUrl: `${base}/oss/textures/map/circle.png`,
  lightTextureUrl: `${base}/oss/textures/map/light.png`,
  factor: OPTS.scale,
  color: COLOR.markColor1
})
const { raycaster, pointer, style, update: raycasterUpdate } = useRaycaster()
const { createFlywire, update: flywireUpdate } = useFlywire({
  depth: OPTS.depth,
  color: COLOR.line,
  flyColor: COLOR.flyColor2,
  pointColor: COLOR.flyColor1,
  factor: OPTS.scale
})
const { createBar } = useMapBar({
  height: 5,
  size: 0.2,
  factor: OPTS.scale,
  color1: COLOR.markColor1,
  color2: COLOR.markColor2
})

// 加载管理器
const manager = new THREE.LoadingManager()
manager.setURLModifier(url => {
  // 统一设置路径
  return base + '/oss/textures/map' + url
})

//贴图材质加载
const textureLoader = new THREE.TextureLoader(manager)

// 中心点
const centerPos = {
  x: 105.06,
  y: 0,
  z: 32.93
}

// 创建地图区块
const textureMap = textureLoader.load('/gz-map.jpg')
const normalTextureMap = textureLoader.load('/gz-map-fx.jpg')
const sideTextureMap = textureLoader.load('/border.png')

// 材质属性设置
textureMap.wrapS = normalTextureMap.wrapS = sideTextureMap.wrapS = THREE.RepeatWrapping
textureMap.wrapT = normalTextureMap.wrapT = sideTextureMap.wrapT = THREE.RepeatWrapping
textureMap.flipY = false
// degToRad 将度数转换为弧度
// textureMap.rotation = THREE.MathUtils.degToRad(45)
const scale = 0.0128
textureMap.repeat.set(scale, scale)
normalTextureMap.repeat.set(scale, scale)
const createMapBlock = points => {
  // 绘制二维平面
  const shape = new THREE.Shape(points)
  const opts = {
    // 挤出深度
    depth: OPTS.depth,
    // 对挤出的形状应用是否斜角
    bevelEnabled: true,
    // 斜角的分段层数
    bevelSegments: 1,
    // 设置原始形状上斜角的厚度
    bevelThickness: 0,
    // 挤出样条的深度细分的点的数量
    steps: 0,
    // 斜角与原始形状轮廓之间的延伸距离
    bevelSize: 0
  }

  // 挤压几何体
  const geometry = new THREE.ExtrudeGeometry(shape, opts)

  // 表面材质
  const material = new THREE.MeshPhongMaterial({
    color: COLOR.main,
    map: textureMap,
    normalMap: normalTextureMap,
    // 颜色与贴图结合方式
    // MeshLambertMaterial 和 MeshPhongMaterial 当中。
    // MultiplyOperation 是默认值，它将环境贴图和物体表面颜色进行相乘。
    // MixOperation 使用反射率来混和两种颜色。uses reflectivity to blend between the two colors.
    // AddOperation 用于对两种颜色进行相加。
    combine: THREE.MultiplyOperation,
    transparent: true,
    opacity: 0.8
  })
  // 边框材质
  const sideMaterial = new THREE.MeshLambertMaterial({
    color: COLOR.borderColor,
    map: sideTextureMap,
    transparent: true,
    opacity: 0.9
  })
  const mesh = new THREE.Mesh(geometry, [material, sideMaterial])
  mesh.scale.setScalar(OPTS.scale)
  mesh.name = '地图拼块'
  return mesh
}

// 创建 css3d 省份名称
const createCSS3Dlabel = (properties, scene) => {
  // 判断省份数据中心点
  if (!properties.centroid && !properties.center) {
    return false
  }
  const [lon, lat] = properties.centroid || properties.center
  const label = createCSS3DDom({
    name: `
      <img src="${base}/oss/img/map/label.png" />
      <div class="name">${properties.name}</div>
    `,
    className: 'map-3D-label',
    position: [lon * OPTS.scale, lat * OPTS.scale * 0.995, OPTS.depth * OPTS.scale]
    // onClick: e => {console.log(e)}
  })
  label.rotateX(Math.PI * 0.5)
  label.name = properties.name + '_CSS3D_label'
  label.isLabel = true
  scene.add(label)
}

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
// 创建省份光柱
const createMarkLightPoint = (properties, screen) => {
  if (!properties.centroid && !properties.center) {
    return false
  }
  // 创建光柱
  const height = 1 + random(5, 10) / 4
  const [lon, lat] = properties.centroid || properties.center
  const light = createMarkLight(
    [lon, lat, OPTS.depth * 1.01].map(t => t * OPTS.scale),
    height * OPTS.scale
  )
  light.rotateX(-Math.PI / 2)
  screen.add(light)
}

// 创建上下边框
const createBorderLine = (mapJson, scene) => {
  let lineTop = createCountryFlatLine(
    mapJson,
    {
      color: COLOR.line,
      transparent: true
    },
    'Line2'
  )
  lineTop.name = '地图上边框'
  lineTop.position.y += OPTS.depth * OPTS.scale
  let lineBottom = createCountryFlatLine(
    mapJson,
    {
      color: COLOR.line2
    },
    'Line2'
  )
  lineBottom.name = '地图下边框'
  lineTop.scale.setScalar(OPTS.scale)
  lineBottom.scale.setScalar(OPTS.scale)
  scene.add(lineTop)
  scene.add(lineBottom)
}

// 创建散点
const createScatter = (longitude: number, latitude: number) => {
  const group = new THREE.Group()
  const size = 0.2 * OPTS.scale
  // 圆盘
  const circle = new THREE.CircleGeometry(size, 32)
  const circleMat = new THREE.MeshBasicMaterial({ color: COLOR.scatterColor1, transparent: true, opacity: 1 })
  const circleMesh = new THREE.Mesh(circle, circleMat)

  // 半球
  const sphere = new THREE.SphereGeometry(size * 0.8, 32, 32, 0, Math.PI)
  const sphereMat = new THREE.MeshBasicMaterial({ color: COLOR.scatterColor2, transparent: true, opacity: 1 })
  const sphereMesh = new THREE.Mesh(sphere, sphereMat)
  group.add(circleMesh, sphereMesh)
  group.position.set(longitude * OPTS.scale, latitude * OPTS.scale, OPTS.depth * OPTS.scale * 1.005)
  return group
}

// 外圈背景
const outCircleTexture = textureLoader.load('/out-circle2.png')
const createOutRing = (scene, width) => {
  let plane = new THREE.PlaneGeometry(width, width)
  let material = new THREE.MeshBasicMaterial({
    map: outCircleTexture,
    transparent: true,
    opacity: 1,
    depthTest: true
  })
  let mesh = new THREE.Mesh(plane, material)
  const { x, z } = centerPos
  mesh.position.set(x, -1, z)
  mesh.scale.setScalar(1.2)
  mesh.rotateX(-Math.PI * 0.5)
  scene.add(mesh)
  return mesh
}

// 内圈背景
const innerRingTexture = textureLoader.load('/inner-circle2.png')
const createInnerRing = (scene, width) => {
  let plane = new THREE.PlaneGeometry(width, width)
  let material = new THREE.MeshBasicMaterial({
    map: innerRingTexture,
    transparent: true,
    opacity: 1,
    depthTest: true
  })
  let mesh = new THREE.Mesh(plane, material)
  const { x, z } = centerPos
  mesh.position.set(x, -2, z)
  mesh.scale.setScalar(1.2)
  mesh.rotateX(-Math.PI * 0.5)
  scene.add(mesh)
  return mesh
}

export class NewThreeScene extends ThreeScene {
  // 波纹板
  corrugatedPlate?: InstanceType<typeof THREE.Mesh>
  // 时间
  clock: InstanceType<typeof THREE.Clock>
  // 地图组
  mapGroup?: InstanceType<typeof THREE.Group>
  // 散点组
  scatterGroup?: InstanceType<typeof THREE.Group>
  // 飞线组
  flywireGroup?: InstanceType<typeof THREE.Group>
  // CSS3D 渲染器
  css3DRender: InstanceType<typeof CSS3DRenderer>
  // 地图轮廓
  outline?: ReturnType<typeof createOutline>
  // hover 回调
  #hoverBack?: (e, position: typeof style) => void
  // 外圈背景
  outRingMesh?: InstanceType<typeof THREE.Mesh>
  // 内圈背景
  innerRingMesh?: InstanceType<typeof THREE.Mesh>
  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)

    this.clock = new THREE.Clock()
    this.css3DRender = initCSS3DRender(this.options, this.container)
    this.addModel()
    this.bindEvent()
  }

  // 添加模型
  addModel() {
    // 波纹板
    const cpMh = createCorrugatedPlate()
    cpMh.renderOrder = 0
    this.corrugatedPlate = cpMh
    this.addObject(cpMh)
  }

  // 双击
  onDblclick(e: MouseEvent) {
    console.log(e)
  }

  // 按下
  onPointerDown(e: PointerEvent) {
    this.pointer.isClick = true
    this.pointer.tsp = e.timeStamp
  }

  // 鼠标移动
  onPointerMove(e) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e, dom, scale)

    if (this.mapGroup) {
      // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
      raycaster.setFromCamera(pointer, this.camera)
      // 检查射线和物体之间的交叉点（包含或不包含后代）
      const objects = [this.mapGroup]
      if (this.scatterGroup) objects.push(this.scatterGroup)
      const interscts = raycaster.intersectObjects(objects)
      this.container.style.cursor = interscts.length ? 'pointer' : 'auto'
      if (interscts.length > 0) {
        const object = interscts[0].object
        let puuid
        const pObj = this.findParentGroupGroupUuid(object)
        if (pObj) {
          puuid = pObj.uuid
          this.#hoverProvince(pObj)
        }
        this.setMapBlockColor(puuid)
      } else {
        this.#hoverProvince()
        this.setMapBlockColor()
      }
    }
  }

  // 弹起
  onPointerUp(e: PointerEvent): void {
    this.pointer.isClick = false
    let s = e.timeStamp - this.pointer.tsp
    // 判断是否未点击
    const isClick = s < OPTS.rightClickBackDiffTime
    if (e.button == 2) {
      console.log('你点了右键')
    } else if (e.button == 0) {
      console.log('你点了左键', isClick)
      isClick && this.clickObject(e)
    } else if (e.button == 1) {
      console.log('你点了滚轮')
    }
  }

  // 点击元素
  clickObject(e) {
    const dom = this.container
    const scale = this.options.scale
    raycasterUpdate(e, dom, scale)

    if (this.scatterGroup) {
      // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
      raycaster.setFromCamera(pointer, this.camera)
      // 检查射线和物体之间的交叉点（包含或不包含后代）
      const objects = [this.scatterGroup]
      const interscts = raycaster.intersectObjects(objects)
      this.container.style.cursor = interscts.length ? 'pointer' : 'auto'
      if (interscts.length) {
        const obj = interscts[0].object
        const pObj = this.findParentGroupGroupUuid(obj)
        const data = pObj.data || {}
        ElMessage.info({
          message: data.name,
          grouping: true
        })
      }
    }
  }

  // 查找父级组合
  findParentGroupGroupUuid(object) {
    const _find = obj => {
      let parent = obj.parent
      if (!parent) {
        return
      }
      if ((parent && parent.isProvinceGroup) || parent.isScatter) {
        return parent
      }
      return _find(parent)
    }
    return _find(object)
  }

  // 地图省份 hover
  #hoverProvince(pObj?) {
    if (typeof this.#hoverBack === 'function') this.#hoverBack(pObj, style)
  }

  // 设置地图面颜色
  setMapBlockColor(puuid?) {
    this.mapGroup.traverse(el => {
      if (el.isProvinceBlock) {
        el.material[0].color.set(el.parent.uuid === puuid ? COLOR.mainHover : COLOR.main)
        el.material[1].color.set(el.parent.uuid === puuid ? COLOR.borderHoverColor : COLOR.borderColor)
      } else if (el.isLabel) {
        const isTarget = el.parent.uuid === puuid
        el.element.className = `map-3D-label${isTarget ? ' is-active' : ''}`
      }
    })
  }

  // 网格辅助线
  initGrid() {
    const width = 200 * OPTS.scale,
      segmentation = 20,
      size = 1.4 * OPTS.scale,
      step = width / segmentation,
      start = -width / 2
    let gd = new THREE.GridHelper(width, segmentation, COLOR.gridColor, COLOR.gridColor)
    this.grid = gd
    const group = new THREE.Group()
    for (let i = 0; i <= segmentation; i++) {
      for (let j = 0; j <= segmentation; j++) {
        const x = start + i * step
        const z = start + j * step
        const geo = new THREE.PlaneGeometry(size, size / 5)
        // 边框材质
        const mat = new THREE.MeshLambertMaterial({
          color: COLOR.gridFork,
          transparent: true,
          opacity: 0.9
        })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.rotateX(-Math.PI * 0.5)
        mesh.position.set(x, 0.1, z)
        const mesh2 = mesh.clone()
        mesh2.rotateZ(Math.PI * 0.5)
        group.add(mesh, mesh2)
      }
    }
    group.name = '辅助交点'
    this.addObject(gd, group)
  }

  // 地图
  initMap(mapJson) {
    const name = '地图'
    // 存在则销毁
    if (this.mapGroup) {
      this.disposeObj(this.mapGroup)
      this.mapGroup = null
    }

    const mapGroup = new THREE.Group()
    mapGroup.name = name

    const data = mapJson.features,
      len = data.length
    for (let i = 0; i < len; i++) {
      const item = data[i]
      // 定一个省份对象
      const provinceObj = new THREE.Object3D()
      // 坐标
      const coordinates = item.geometry.coordinates
      // city 属性
      const properties = item.properties
      for (let j = 0; j < coordinates.length; j++) {
        coordinates[j].forEach(polygon => {
          // 点位集合
          const points = polygon.map(el => new THREE.Vector2(el[0], el[1]))
          // 创建地图区块
          const mesh = createMapBlock(points)
          // 省份区块标记
          mesh.isProvinceBlock = true
          provinceObj.add(mesh)
        })
      }

      // 创建 label
      createCSS3Dlabel(properties, provinceObj)
      // 创建光柱
      createMarkLightPoint(properties, provinceObj)

      // 翻转角度
      provinceObj.rotateX(-Math.PI / 2)
      // 省份组合标记
      provinceObj.isProvinceGroup = true
      provinceObj.name = properties.name
      provinceObj.data = properties
      mapGroup.add(provinceObj)
    }

    // 创建上下边线
    createBorderLine(mapJson, this.scene)

    // 计算包围盒
    const box = getBoundingBox(mapGroup)

    let {
      size,
      center: { x, y, z }
    } = box
    this.mapGroup = mapGroup
    centerPos.x = x
    centerPos.y = y
    centerPos.z = z
    this.corrugatedPlate.position.set(x, 0 - 0.1 * OPTS.scale, z)
    // 重置场景元素
    this.resetSceneEle()
    // 宽度
    const width = size.x < size.y ? size.y + 1 : size.x + 1
    // 添加背景，修饰元素
    this.outRingMesh = createOutRing(this.scene, width)
    this.innerRingMesh = createInnerRing(this.scene, width * 0.9)

    this.addObject(mapGroup)
  }

  // 柱状
  initMapBar(citys) {
    // 清除柱状
    if (!this.mapGroup) return
    this.clearMapBar()
    // 找对大
    const max = Math.max(...citys.map(it => it.use))
    for (let i = 0; i < citys.length; i++) {
      const { name, use } = citys[i]
      const el = this.mapGroup.getObjectByName(name)
      if (!el) {
        console.log(name, el)
      } else {
        const heightRatio = use / max
        const { centroid, center, name } = el.data
        const pos = centroid || center
        const bar = createBar({
          position: [pos[0] * OPTS.scale, pos[1] * OPTS.scale, OPTS.depth * OPTS.scale],
          heightRatio,
          label: {
            name: `
              <div class="label-wrap">
                <div class="name">${name}</div>
                <div class="text">
                  <span class="value">${numConverter(use)}</span>
                  <span class="unit">kWh</span>
                </div>
              </div>
            `,
            className: 'map-bar-label'
            // onClick: e => {console.log(e)}
          }
        })
        bar.isBar = true
        el.add(bar)
      }
    }
  }

  clearMapBar() {
    this.mapGroup.traverse(el => {
      if (el.isBar) {
        this.disposeObj(el)
      }
    })
  }

  // 轮廓
  initMapOutLine(mapJson) {
    // 存在则销毁
    if (this.outline) {
      this.disposeObj(this.outline)
      this.outline = null
    }
    const points = getPoints(mapJson, OPTS.depth, !true)
    const outline = createOutline(points)
    outline.renderOrder = 10
    this.outline = outline
    this.addObject(outline)
  }

  // 散点
  initScatter(points: import('./index').MapPoint[], hoverBack?: (e, position: typeof style) => void) {
    const name = '散点集合'
    // 存在则销毁
    if (this.scatterGroup) {
      this.disposeObj(this.scatterGroup)
      this.scatterGroup = null
    }
    const scatterGroup = new THREE.Group()
    scatterGroup.name = name

    for (let i = 0; i < points.length; i++) {
      const item = points[i]
      const [longitude = 0, latitude = 0] = item.coord || []
      const mesh = createScatter(longitude, latitude)
      mesh.name = item.name
      mesh.data = item
      mesh.isScatter = true
      scatterGroup.add(mesh)
    }
    scatterGroup.rotateX(-Math.PI * 0.5)
    this.scatterGroup = scatterGroup
    this.addObject(scatterGroup)
    this.#hoverBack = hoverBack
  }

  // 飞线
  initFlywire(points) {
    const name = '飞线集合'
    // 存在则销毁
    if (this.flywireGroup) {
      this.disposeObj(this.flywireGroup)
      this.flywireGroup = null
    }

    const flywireGroup = new THREE.Group()
    for (let i = 0; i < points.length; i++) {
      const { coords, path } = points[i]
      const mesh = createFlywire(
        coords.map(it => {
          return it.map(t => t * OPTS.scale)
        })
      )
      mesh.name = path
      flywireGroup.add(mesh)
    }
    flywireGroup.name = name
    flywireGroup.renderOrder = 20
    this.flywireGroup = flywireGroup
    this.addObject(flywireGroup)
  }

  // 重置场景元素
  resetSceneEle() {
    const { x, y, z } = centerPos
    // 设置相机对焦位置
    this.camera.lookAt(x, y, z)
    new TWEEN.Tween(this.camera.position)
      .to(
        {
          x: x,
          y: 40 * OPTS.scale,
          z: z + 40 * OPTS.scale
        },
        1000
      )
      .easing(TWEEN.Easing.Quadratic.In)
      .start()
      .onUpdate(() => {})

    // 控制器
    this.controls.target = new THREE.Vector3(x, y, z)

    // 网格
    if (this.grid) {
      this.grid.position.set(x, 0, z)
      const group = this.scene.getObjectByName('辅助交点')
      group.position.set(x, 0, z)
    }
  }

  modelAnimate() {
    let dalte = this.clock.getDelta()
    // 波纹板
    if (this.corrugatedPlate) {
      corrugatUpdate(this.corrugatedPlate, dalte)
    }
    if (this.outline) {
      outlineUpdate(this.outline)
    }
    // css 3D 渲染器
    if (this.css3DRender) {
      this.css3DRender.render(this.scene, this.camera)
    }
    sideTextureMap.offset.y += 0.005

    // 旋转光圈
    if (this.outRingMesh) {
      this.outRingMesh.rotation.z += 0.0005
    }
    // 旋转光圈
    if (this.innerRingMesh) {
      this.innerRingMesh.rotation.z -= 0.0005
    }

    // 飞线
    if (this.flywireGroup) {
      flywireUpdate()
    }
  }

  resize() {
    super.resize()
    if (this.css3DRender) {
      const { width, height } = this.options
      this.css3DRender.setSize(width, height)
    }
  }
}