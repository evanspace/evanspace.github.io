import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import ThreeScene from '@/three-scene'

import { useCorrugatedPlate } from '@/three-scene/hooks/corrugated-plate'
import { useOutline } from '@/three-scene/hooks/out-line'
import { useCoord } from '@/three-scene/hooks/coord'
import { useCountryLine } from '@/three-scene/hooks/country-line'
import { useCSS3D, CSS3DRenderer } from '@/three-scene/hooks/css3d'
import { useMarkLight } from '@/three-scene/hooks/mark-light'

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
// 地图深度
const MAP_DEPTH = 0.5
// 地图缩放倍数
const MAP_SCALE = 20

const { createCorrugatedPlate, update: corrugatUpdate } = useCorrugatedPlate()
const { createOutline, update: outlineUpdate } = useOutline()
const { getBoundingBox } = useCoord()
const { createCountryFlatLine, getPoints } = useCountryLine()
const { initCSS3DRender, createCSS3DDom } = useCSS3D()
const { createMarkLight } = useMarkLight({
  pointTextureUrl: `${base}/oss/textures/map/point.png`,
  circleTextureUrl: `${base}/oss/textures/map/circle.png`,
  lightTextureUrl: `${base}/oss/textures/map/light.png`,
  scaleFactor: MAP_SCALE
})

// 加载管理器
const manager = new THREE.LoadingManager()
manager.setURLModifier(url => {
  // 统一设置路径
  return base + '/oss/textures/map' + url
})

//贴图材质加载
const texture = new THREE.TextureLoader(manager)
const textureMap = texture.load('/gz-map.jpg')
const normalTextureMap = texture.load('/gz-map-fx.jpg')
const sideTextureMap = texture.load('/border.png')

// 材质属性设置
textureMap.wrapS = normalTextureMap.wrapS = sideTextureMap.wrapS = THREE.RepeatWrapping
textureMap.wrapT = normalTextureMap.wrapT = sideTextureMap.wrapT = THREE.RepeatWrapping
textureMap.flipY = false
// degToRad 将度数转换为弧度
// textureMap.rotation = THREE.MathUtils.degToRad(45)
const scale = 0.0128
textureMap.repeat.set(scale, scale)
normalTextureMap.repeat.set(scale, scale)

// 全局颜色
const COLOR = {
  // 主色
  main: 0x10ddc2,
  mainHover: 0x92ffff,
  // 浅色
  light: 0x757882,
  lightHover: 0x92ffff,
  // 线条
  line: 0xf5f5f5,
  line2: 0x61fbfd,
  // 轮廓线
  outline: 0x92ffff
}

// 中心点
const centerPos = {
  x: 105.06,
  y: 0,
  z: 32.93
}

// 创建地图区块
const createMapBlock = points => {
  // 绘制二维平面
  const shape = new THREE.Shape(points)
  const opts = {
    // 挤出深度
    depth: MAP_DEPTH,
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
    map: textureMap,
    color: COLOR.main,
    normalMap: normalTextureMap,
    // 颜色与贴图结合方式
    // MeshLambertMaterial 和 MeshPhongMaterial 当中。
    // MultiplyOperation 是默认值，它将环境贴图和物体表面颜色进行相乘。
    // MixOperation 使用反射率来混和两种颜色。uses reflectivity to blend between the two colors.
    // AddOperation 用于对两种颜色进行相加。
    combine: THREE.MultiplyOperation,
    transparent: true,
    opacity: 1
  })
  // 边框材质
  const sideMaterial = new THREE.MeshLambertMaterial({
    color: COLOR.light,
    map: sideTextureMap,
    transparent: true,
    opacity: 0.9
  })
  const mesh = new THREE.Mesh(geometry, [material, sideMaterial])
  mesh.scale.setScalar(MAP_SCALE)
  return mesh
}

// 创建 css3d 省份名称
const createCSS3Dlabel = (properties, scene) => {
  // 判断省份数据中心点
  if (!properties.centroid && !properties.center) {
    return false
  }
  const [lon, lat] = properties.center || properties.centroid
  const label = createCSS3DDom({
    name: `
      <img src="${base}/oss/img/map/label.png" />
      <div class="name">${properties.name}</div>
    `,
    className: 'map-3D-label',
    position: [lon * MAP_SCALE, lat * MAP_SCALE, MAP_DEPTH * MAP_SCALE]
    // onClick: e => {console.log(e)}
  })
  label.rotateX(Math.PI * 0.5)
  label.name = properties.name
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
  const light = createMarkLight(lon * MAP_SCALE, lat * MAP_SCALE, height * MAP_SCALE)
  light.position.z = MAP_DEPTH * MAP_SCALE * 1.01
  light.rotateX(-Math.PI / 2)
  screen.add(light)
}

// 创建上下边框
const createBorderLine = (mapJson, scene) => {
  let lineTop = createCountryFlatLine(
    mapJson,
    {
      color: COLOR.line,
      linewidth: 1,
      transparent: true,
      depthTest: false
    },
    'Line2'
  )
  lineTop.name = '地图上边框'
  lineTop.position.y += 0.5 * MAP_SCALE
  let lineBottom = createCountryFlatLine(
    mapJson,
    {
      color: COLOR.line2,
      linewidth: 1,
      depthTest: false
    },
    'Line2'
  )
  // lineBottom.position.y -= 0.15 * MAP_SCALE
  lineBottom.name = '地图下边框'
  lineTop.scale.setScalar(MAP_SCALE)
  lineBottom.scale.setScalar(MAP_SCALE)
  scene.add(lineTop)
  scene.add(lineBottom)
}

export class NewThreeScene extends ThreeScene {
  // 波纹板
  corrugatedPlate: InstanceType<typeof THREE.Mesh> | undefined
  // 时间
  clock: InstanceType<typeof THREE.Clock>
  // 地图组
  mapGroup: InstanceType<typeof THREE.Group> | undefined
  // CSS3D 渲染器
  css3DRender: InstanceType<typeof CSS3DRenderer>
  // 地图轮廓
  outline: InstanceType<createOutline> | undefined
  // 射线拾取
  raycaster: InstanceType<typeof THREE.Raycaster>
  // 坐标（二维向量）
  pointer: InstanceType<typeof THREE.Vector2>
  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)

    this.clock = new THREE.Clock()
    this.css3DRender = initCSS3DRender(this.options, this.container)
    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()
    this.addModel()
    this.bindEvent()
  }

  // 添加模型
  addModel() {
    // 波纹板
    const cpMh = createCorrugatedPlate({
      range: 100 * MAP_SCALE,
      interval: 0.8 * MAP_SCALE,
      size: 0.2 * MAP_SCALE,
      color: COLOR.main,
      light: COLOR.light
    })
    this.corrugatedPlate = cpMh
    this.addObject(cpMh)
  }

  // 绑定事件
  bindEvent() {
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove.bind(this))
  }

  // 鼠标移动
  onPointerMove(e) {
    const dom = this.container
    // 获取元素偏移量
    const rect = dom.getBoundingClientRect() || { left: 0, top: 0 }
    // 渲染元素作为子组件可能有缩放处理，元素大小需要计算处理
    const scale = this.options.scale

    // 设置二维向量坐标 （-1， 1 范围）
    this.pointer.x = ((e.clientX - rect.left) / (dom.clientWidth * scale)) * 2 - 1
    this.pointer.y = -((e.clientY - rect.top) / (dom.clientHeight * scale)) * 2 + 1

    if (this.mapGroup) {
      // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
      this.raycaster.setFromCamera(this.pointer, this.camera)
      // 检查射线和物体之间的交叉点（包含或不包含后代）
      const interscts = this.raycaster.intersectObject(this.mapGroup)
      this.container.style.cursor = interscts.length ? 'pointer' : 'auto'
      if (interscts.length > 0) {
        const object = interscts[0].object
        // 网格
        if (object.isMesh && object.material) {
          this.setMapBlockColor(object.uuid)
        }
      } else {
        this.setMapBlockColor()
      }
    }
  }

  // 设置地图面颜色
  setMapBlockColor(uuid?) {
    this.mapGroup.traverse(el => {
      if (el.isProvince) {
        el.material[0].color.set(el.uuid === uuid ? COLOR.mainHover : COLOR.main)
        el.material[1].color.set(el.uuid === uuid ? COLOR.lightHover : COLOR.light)
      } else if (el.isLabel) {
        const isTarget = el.parent.children.findIndex(e => e.uuid == uuid) > -1
        el.element.className = `map-3D-label${isTarget ? ' is-active' : ''}`
      }
    })
  }

  // 网格辅助线
  initGrid() {
    let gd = new THREE.GridHelper(200 * MAP_SCALE, 31, COLOR.light, COLOR.light)
    this.grid = gd
    this.addObject(gd)
  }

  // 地图
  initMap(mapJson) {
    console.log(mapJson)
    const name = '地图'
    // 存在则销毁
    if (this.mapGroup) {
      this.disposeObj(this.mapGroup)
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
          mesh.isProvince = true
          provinceObj.add(mesh)
        })
      }

      // 创建 label
      createCSS3Dlabel(properties, provinceObj)
      // 创建光柱
      createMarkLightPoint(properties, provinceObj)

      // 翻转角度
      provinceObj.rotateX(-Math.PI / 2)
      provinceObj.name = properties.name
      mapGroup.add(provinceObj)
    }

    // 创建上下边线
    createBorderLine(mapJson, this.scene)

    // 计算包围盒
    const box = getBoundingBox(mapGroup)

    let {
      // size,
      center: { x, y, z }
    } = box
    this.mapGroup = mapGroup
    centerPos.x = x
    centerPos.y = y
    centerPos.z = z
    this.corrugatedPlate.position.set(x, 0 - 0.1 * MAP_SCALE, z)
    // 重置场景元素
    this.resetSceneEle()
    // 宽度
    // const width = size.x < size.y ? size.y + 1 : size.x + 1

    this.addObject(mapGroup)
  }

  // 轮廓
  initMapOutLine(mapJson) {
    const points = getPoints(mapJson, MAP_DEPTH, !true)
    const outline = createOutline(points, COLOR.outline)
    outline.scale.setScalar(MAP_SCALE)
    this.outline = outline
    this.addObject(outline)
  }

  resetSceneEle() {
    const { x, y, z } = centerPos
    // 设置相机对焦位置
    this.camera.lookAt(x, y, z)
    new TWEEN.Tween(this.camera.position)
      .to(
        {
          x: centerPos.x,
          y: 40 * MAP_SCALE,
          z: z + 40 * MAP_SCALE
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
  }

  resize() {
    super.resize()
    if (this.css3DRender) {
      const { width, height } = this.options
      this.css3DRender.setSize(width, height)
    }
  }
}
