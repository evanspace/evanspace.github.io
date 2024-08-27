import * as THREE from 'three'

import ThreeScene from '@/three-scene'

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

  const material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
    // 镜面反射光
    specular: 0xffffff,
    // 光泽度
    shininess: 250,
    side: THREE.DoubleSide,
    // 顶点颜色
    vertexColors: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = '缓冲几何图形'
  return mesh
}

const createLine = () => {
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(4 * 3), 3))
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true
  })
  return new THREE.Line(geometry, material)
}

export class NewThreeScene extends ThreeScene {
  mesh: InstanceType<typeof THREE.Mesh>
  // 射线拾取
  raycaster: InstanceType<typeof THREE.Raycaster>
  // 坐标（二维向量）
  pointer: InstanceType<typeof THREE.Vector2>
  // 线网格
  line: InstanceType<typeof THREE.Line>
  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)

    this.mesh = createBufferGeometry()
    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()
    this.line = createLine()
    this.bindEvent()
  }

  bindEvent() {
    this.addObject(this.mesh)
    this.addObject(this.line)

    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove.bind(this))
  }

  onPointerMove(e) {
    const dom = this.container
    // 获取元素偏移量
    const rect = dom.getBoundingClientRect() || { left: 0, top: 0 }
    // 渲染元素作为子组件可能有缩放处理，元素大小需要计算处理
    const scale = this.options.scale

    // 设置二维向量坐标 （-1， 1 范围）
    this.pointer.x = ((e.clientX - rect.left) / (dom.clientWidth * scale)) * 2 - 1
    this.pointer.y = -((e.clientY - rect.top) / (dom.clientHeight * scale)) * 2 + 1
  }

  modelAnimate() {
    const ts = Date.now() * 0.001

    this.mesh.rotation.x = ts * 0.15
    this.mesh.rotation.y = ts * 0.25

    // 设置新的原点和方向向量更新射线, 用照相机的原点和点击的点构成一条直线
    this.raycaster.setFromCamera(this.pointer, this.camera)
    // 检查射线和物体之间的交叉点（包含或不包含后代）
    const interscts = this.raycaster.intersectObject(this.mesh)

    if (interscts.length > 0) {
      const intersect = interscts[0]
      // 面
      const face = intersect.face

      const linePosition = this.line.geometry.attributes.position
      const meshPosition = this.mesh.geometry.attributes.position

      // 复制 (索引， 属性，索引 )
      linePosition.copyAt(0, meshPosition, face.a)
      linePosition.copyAt(1, meshPosition, face.b)
      linePosition.copyAt(2, meshPosition, face.c)
      linePosition.copyAt(3, meshPosition, face.a)

      // 更新矩阵
      this.mesh.updateMatrix()

      // 顶点坐标进行矩阵变换
      this.line.geometry.applyMatrix4(this.mesh.matrix)

      this.line.visible = true
    } else {
      this.line.visible = false
    }
  }
}
