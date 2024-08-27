import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'

import ThreeScene from '@/three-scene'

import { createCorrugatedPlate } from './corrugated-plate'
import { useCoord } from '@/three-scene/hooks/coord'
import { useCountryLine } from '@/three-scene/hooks/map/country-line'

const { getBoundingBox } = useCoord()
const { createCountryFlatLine } = useCountryLine()

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
    depth: 0.5,
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
    color: 0xb4eeea,
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
    color: 0x123024,
    transparent: true,
    opacity: 0.9
  })
  const mesh = new THREE.Mesh(geometry, [material, sideMaterial])
  return mesh
}

// 创建上下边框
const createBorderLine = (mapJson, mapGroup) => {
  let lineTop = createCountryFlatLine(
    mapJson,
    {
      color: 0xffffff,
      linewidth: 1,
      transparent: true,
      depthTest: false
    },
    'Line2'
  )
  lineTop.position.y += 0.5
  let lineBottom = createCountryFlatLine(
    mapJson,
    {
      color: 0x61fbfd,
      linewidth: 1,
      depthTest: false
    },
    'Line2'
  )
  // lineBottom.position.y -= 0.15
  //  添加边线
  mapGroup.add(lineTop)
  mapGroup.add(lineBottom)
}

export class NewThreeScene extends ThreeScene {
  corrugatedPlate: InstanceType<typeof THREE.Mesh> | undefined
  clock: InstanceType<typeof THREE.Clock>
  mapGroup: InstanceType<typeof THREE.Group> | undefined
  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)

    this.clock = new THREE.Clock()
    this.addModel()
  }

  addModel() {
    // 波纹板
    const cpMh = createCorrugatedPlate(100, 0.5, 0.2)
    this.corrugatedPlate = cpMh
    this.addObject(cpMh)
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

      // 翻转角度
      province.rotateX(-Math.PI / 2)
      province.name = properties.name
      mapGroup.add(province)
    }

    // 创建上下边线
    createBorderLine(mapJson, mapGroup)

    // 计算包围盒
    const box = getBoundingBox(mapGroup)
    console.log(box)
    let {
      // size,
      center: { x, y, z }
    } = box
    this.mapGroup = mapGroup
    centerPos.x = x
    centerPos.y = y
    centerPos.z = z
    this.corrugatedPlate.position.set(x, y - 0.2, z)
    // 移动控制可相机位置
    this.moveControlAndCamera()
    // 款滴
    // const width = size.x < size.y ? size.y + 1 : size.x + 1

    this.addObject(mapGroup)
  }

  moveControlAndCamera() {
    const { x, y, z } = centerPos
    // 设置相机对焦位置
    this.camera.lookAt(x, y, z)
    new TWEEN.Tween(this.camera.position)
      .to(
        {
          x: centerPos.x,
          y: 80,
          z: z + 1
        },
        1000
      )
      .easing(TWEEN.Easing.Quadratic.In)
      .start()
      .onUpdate(() => {})
    this.controls.target = new THREE.Vector3(x, y, z)
  }

  modelAnimate() {
    if (this.corrugatedPlate) {
      let dalte = this.clock.getDelta()
      const mat = this.corrugatedPlate.material
      // 扩散波半径
      const range = mat.uniforms.range.value
      const length = mat.uniforms.length.value
      mat.uniforms.radius.value += dalte * (range / 2)
      if (mat.uniforms.radius.value >= range + length) {
        mat.uniforms.radius.value = 0
      }
    }
  }
}
