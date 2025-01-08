import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import * as ThreeScene from 'three-scene/build/three-scene.module'

const material = new THREE.MeshPhongMaterial({
  color: 0xf1f1f1,
  specular: 0xffffff,
  flatShading: true
  // vertexColors: true
})

let fontParser

// 创建文字
export const createText = (name: string) => {
  // 文字
  let textGeo = new TextGeometry(name || '', {
    font: fontParser,
    size: 5,
    depth: 0,
    curveSegments: 12, // 曲线分段
    bevelThickness: 0.5, // 斜面厚度
    bevelSize: 0.1, // 斜角大小
    bevelEnabled: true // 斜角
  })

  // 计算边界
  textGeo.computeBoundingBox()
  // 计算垂直算法
  textGeo.computeVertexNormals()
  // @ts-ignore
  let offsetX = 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
  // @ts-ignore
  let offsetZ = 0.5 * (textGeo.boundingBox.max.z - textGeo.boundingBox.min.z)

  let mesh = new THREE.Mesh(textGeo, material)
  mesh.castShadow = true
  mesh.position.set(-offsetX, 30, -offsetZ)
  mesh.name = 'text'
  // @ts-ignore
  mesh._isText_ = true
  return mesh
}

const createGroup = (name, geometry, position = { x: 0, y: 0, z: 0 }, Mesh: any = THREE.Mesh) => {
  const group = new THREE.Group()
  group.add(new Mesh(geometry, material))
  const text = createText(name)
  group.add(text)
  const { x, y, z } = position
  group.position.set(x, y, z)
  return group
}

export class NewScene extends ThreeScene.Scene {
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)
  }

  addModel(font) {
    fontParser = font
    const size = 50

    // 间距
    const gap = size * 2.5

    const position = {
      x: 0,
      y: size / 2,
      z: 0
    }

    let group = createGroup(
      '立方缓冲几何体(BoxBufferGeometry)',
      new THREE.BoxGeometry(size, size, size),
      position
    )
    this.addObject(group)

    position.x += gap
    group = createGroup('圆形几何体(CircleGeometry)', new THREE.CircleGeometry(size / 2), position)
    this.addObject(group)

    position.z -= gap
    group = createGroup('圆锥几何体(ConeGeometry)', new THREE.ConeGeometry(size, size), position)
    this.addObject(group)

    position.x -= gap
    group = createGroup(
      '圆柱几何体（(CylinderGeometry)',
      new THREE.CylinderGeometry(size / 2, size / 2, size),
      position
    )
    this.addObject(group)

    position.x -= gap
    group = createGroup(
      '十二面几何体(DodecahedronGeometry)',
      new THREE.DodecahedronGeometry(size / 2),
      position
    )
    this.addObject(group)

    position.z += gap
    group = createGroup(
      '边缘几何体(EdgesGeometry)',
      new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size)),
      position,
      THREE.LineSegments
    )
    this.addObject(group)

    {
      position.z += gap
      const width = size / 2
      const shape = new THREE.Shape()
      shape.moveTo(-width, -width)
      shape.lineTo(-width, width)
      shape.lineTo(width, width)
      shape.lineTo(width, -width)
      shape.lineTo(-width, -width)

      group = createGroup(
        '挤压几何体(ExtrudeGeometry)',
        new THREE.ExtrudeGeometry(shape, {
          steps: 2,
          depth: 16,
          bevelEnabled: true,
          bevelThickness: 1,
          bevelSize: 1,
          bevelSegments: 1
        }),
        position
      )
    }
    this.addObject(group)

    return

    // 圆环几何体
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0, 5, 32),
      new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
    )
    this.addObject(ring)

    const points: any[] = []
    for (let i = 0; i < 10; i++) {
      points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2))
    }
    // 车削几何体
    geometry = new THREE.LatheGeometry(points)
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
    const lathe = new THREE.Mesh(geometry, material)
    this.addObject(lathe)
  }
}
