import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import ThreeScene from '@/three-scene'

import { useCorrugatedPlate } from './corrugated-plate'
import { useOutline } from './out-line'
import { useCoord } from '@/three-scene/hooks/coord'
import { useCountryLine } from '@/three-scene/hooks/map/country-line'
import { useCSS3D, CSS3DRenderer } from '@/three-scene/hooks/css3d'

const { createCorrugatedPlate, update: corrugatUpdate } = useCorrugatedPlate()
const { createOutline, update: outlineUpdate } = useOutline()
const { getBoundingBox } = useCoord()
const { createCountryFlatLine, getPoints } = useCountryLine()
const { initCSS3DRender, createCSS3DDom } = useCSS3D()

const base = import.meta.env.VITE_BEFORE_STATIC_PATH

// 加载管理器
const manager = new THREE.LoadingManager()
manager.setURLModifier(url => {
  // 统一设置路径
  return base + '/oss/textures/map' + url
})
// 材质加载
const texture = new THREE.TextureLoader(manager)
const textureMap = texture.load('/gz-map.jpg')

// 材质属性设置
textureMap.wrapS = THREE.RepeatWrapping
textureMap.wrapT = THREE.RepeatWrapping
textureMap.flipY = false
// degToRad 将度数转换为弧度
textureMap.rotation = THREE.MathUtils.degToRad(45)
const scale = 0.0128
textureMap.repeat.set(scale, scale)

// 全局颜色
const COLOR = {
  main: 0x00b8a9,
  light: 0x123024,
  line: 0xffffff,
  line2: 0x61fbfd
}

// 地图深度
const MAP_DEPTH = 0.5
// 地图缩放倍数
const MAP_SCALE = 20

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
  const [lon, lat] = properties.centroid || properties.center
  const label = createCSS3DDom({
    name: `
      <img src="${base}/oss/img/map/label.png" />
      <div class="name">${properties.name}</div>
    `,
    className: 'map-3D-label',
    position: [lon * MAP_SCALE, MAP_DEPTH * MAP_SCALE, -(lat * MAP_SCALE)]
    // onClick: e => {console.log(e)}
  })
  scene.add(label)
  label.name = properties.name
}

// 创建上下边框
const createBorderLine = (mapJson, mapGroup) => {
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
  //  添加边线
  lineTop.scale.setScalar(MAP_SCALE)
  lineBottom.scale.setScalar(MAP_SCALE)
  mapGroup.add(lineTop)
  mapGroup.add(lineBottom)
}

export class NewThreeScene extends ThreeScene {
  corrugatedPlate: InstanceType<typeof THREE.Mesh> | undefined
  clock: InstanceType<typeof THREE.Clock>
  mapGroup: InstanceType<typeof THREE.Group> | undefined
  css3DRender: InstanceType<typeof CSS3DRenderer>
  outline: InstanceType<createOutline> | undefined
  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)

    this.clock = new THREE.Clock()
    this.css3DRender = initCSS3DRender(this.options, this.container)
    this.addModel()
  }

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

  initGrid() {
    let gd = new THREE.GridHelper(200 * MAP_SCALE, 31, COLOR.light, COLOR.light)
    this.grid = gd
    this.addObject(gd)
  }

  initMap(mapJson) {
    console.log(mapJson, this.mapGroup)
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
      const province = new THREE.Object3D()
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
          province.add(mesh)
        })
      }

      // 创建 label
      createCSS3Dlabel(properties, this.scene)

      // 翻转角度
      province.rotateX(-Math.PI / 2)
      province.name = properties.name
      mapGroup.add(province)
    }

    // 创建上下边线
    createBorderLine(mapJson, mapGroup)

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
    console.log(mapJson)
    const points = getPoints(mapJson, MAP_DEPTH)
    const outline = createOutline(points)
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
      outlineUpdate(this.outline, dalte)
    }
    // css 3D 渲染器
    if (this.css3DRender) {
      this.css3DRender.render(this.scene, this.camera)
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
