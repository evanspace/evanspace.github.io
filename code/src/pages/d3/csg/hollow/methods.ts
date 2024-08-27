import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import {
  Brush,
  Evaluator,
  // @ts-ignore
  HOLLOW_SUBTRACTION,
  // @ts-ignore
  HOLLOW_INTERSECTION
} from 'three-bvh-csg'
import ThreeScene from '@/three-scene'

let csgEvaluator = new Evaluator()
csgEvaluator.attributes = ['position', 'normal', 'color']
csgEvaluator.useGroups = false

const params = {
  displayBrush: true,
  operation: HOLLOW_INTERSECTION
}

const createBufferGeometry = () => {
  // 三角形数量
  const triangles = 5000

  // 几何缓冲器
  let geometry = new THREE.BufferGeometry()

  // 位置
  const positions = new Float32Array(triangles * 3 * 3)
  // 顶点法线
  const normals = new Float32Array(triangles * 3 * 3)
  // 顶点颜色
  const colors = new Float32Array(triangles * 3 * 3)

  const color = new THREE.Color()

  // 立方体大小
  const n = 500,
    n2 = n / 2
  // 大小
  const d = 80,
    d2 = d / 2

  // 三维向量
  const pA = new THREE.Vector3()
  const pB = new THREE.Vector3()
  const pC = new THREE.Vector3()

  const cb = new THREE.Vector3()
  const ab = new THREE.Vector3()

  // 随机生成
  for (let i = 0; i < positions.length; i += 9) {
    // 位置
    // 单个三角形坐标位置
    const x = Math.random() * n - n2
    const y = Math.random() * n - n2
    const z = Math.random() * n - n2

    // 顶点坐标
    const ax = x + Math.random() * d - d2
    const ay = y + Math.random() * d - d2
    const az = z + Math.random() * d - d2

    const bx = x + Math.random() * n - n2
    const by = y + Math.random() * n - n2
    const bz = z + Math.random() * n - n2

    const cx = x + Math.random() * n - n2
    const cy = y + Math.random() * n - n2
    const cz = z + Math.random() * n - n2

    positions[i] = ax
    positions[i + 1] = ay
    positions[i + 2] = az

    positions[i + 3] = bx
    positions[i + 4] = by
    positions[i + 5] = bz

    positions[i + 6] = cx
    positions[i + 7] = cy
    positions[i + 8] = cz

    // 顶点法线
    pA.set(ax, ay, az)
    pB.set(bx, by, bz)
    pC.set(cx, cy, cz)

    // 子向量
    cb.subVectors(pC, pB)
    ab.subVectors(pA, pB)
    // 判断左右
    cb.cross(ab)

    // 向量方向归一化
    cb.normalize()

    const nx = cb.x
    const ny = cb.y
    const nz = cb.z

    normals[i] = nx
    normals[i + 1] = ny
    normals[i + 2] = nz

    normals[i + 3] = nx
    normals[i + 4] = ny
    normals[i + 5] = nz

    normals[i + 6] = nx
    normals[i + 6] = ny
    normals[i + 7] = nz

    // 颜色
    const vx = x / n + 0.5
    const vy = y / n + 0.5
    const vz = z / n + 0.5

    color.setRGB(vx, vy, vz)

    colors[i] = color.r
    colors[i + 1] = color.g
    colors[i + 2] = color.b

    colors[i + 3] = color.r
    colors[i + 4] = color.g
    colors[i + 5] = color.b

    colors[i + 6] = color.r
    colors[i + 7] = color.g
    colors[i + 8] = color.b
  }

  // 创建顶点属性
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const s = 0.002
  geometry.scale(s, s, s)
  return geometry
}

// 地面
const createGround = () => {
  // floor
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(5),
    new THREE.ShadowMaterial({
      color: 0xe0f7fa,
      opacity: 0.05,
      depthWrite: false,
      transparent: true
    })
  )
  ground.scale.setScalar(10)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  return ground
}

type NewBrush = InstanceType<typeof Brush> & InstanceType<typeof THREE.Mesh>
export class NewThreeScene extends ThreeScene {
  brush1: NewBrush | undefined
  brush2: NewBrush | undefined
  brushResult: InstanceType<typeof THREE.Mesh> | undefined
  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)

    this.addModel()
  }

  addModel() {
    let geo = createBufferGeometry()
    let mat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      roughness: 0.2
    })

    // @ts-ignore
    this.brush1 = new Brush(geo, mat)
    this.brush1.position.y = 1
    this.brush1.updateMatrixWorld(true)

    // 球体
    geo = new THREE.SphereGeometry()
    mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      depthWrite: false,
      opacity: 0.1,
      side: THREE.BackSide
    })
    // @ts-ignore
    this.brush2 = new Brush(geo, mat)
    this.addObject(this.brush2)

    this.brushResult = new THREE.Mesh()
    this.addObject(this.brushResult)

    // 地面
    const ground = createGround()
    this.addObject(ground)

    this.createGUI()
  }

  createGUI() {
    const gui = new GUI()
    gui.add(params, 'operation', { NONE: -1, HOLLOW_INTERSECTION, HOLLOW_SUBTRACTION }).name('布尔类型')
    gui.add(params, 'displayBrush').name('计算元素')

    gui.domElement.style = 'position: absolute; top: 10px; right: 10px'
    this.container?.appendChild(gui.domElement)
  }

  modelAnimate(): void {
    const { brush1, brush2, brushResult } = this
    if (brush2) {
      brush2.position.y = 1 * Math.sin(window.performance.now() * 0.0025 * 0.5) + 1
      brush2.position.x = 1 * Math.sin(window.performance.now() * 0.0035 * 0.5)
      brush2.position.z = 1 * Math.sin(window.performance.now() * 0.002 * 0.5)
      brush2.visible = params.displayBrush
      brush2.updateMatrixWorld(true)
    }
    if (params.operation === -1) {
      this.brushResult.geometry.dispose()
      this.brushResult.geometry.copy(this.brush1.geometry)
      this.brushResult.position.y = 1
    } else {
      this.brushResult = csgEvaluator.evaluate(brush1, brush2, params.operation, brushResult)
      this.brushResult.position.y = 0
      this.brushResult.castShadow = true
    }
  }
}
