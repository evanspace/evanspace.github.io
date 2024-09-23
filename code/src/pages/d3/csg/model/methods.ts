import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import {
  ADDITION,
  SUBTRACTION,
  REVERSE_SUBTRACTION,
  INTERSECTION,
  DIFFERENCE,
  // @ts-ignore
  HOLLOW_SUBTRACTION,
  // @ts-ignore
  HOLLOW_INTERSECTION,
  Brush,
  Evaluator
} from 'three-bvh-csg'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'
import ThreeScene from 'three-scene'

const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const params = {
  glb: `${base}/oss/model/csg/bunny.glb`,

  operation: SUBTRACTION,
  wireframe: false,
  displayBrushes: false,
  shadows: true,
  useGroups: true,
  consolidateGroups: true
}

const materialMap = new Map()
const material = new THREE.MeshStandardMaterial({
  opacity: 0.15,
  transparent: true,
  // 深度写入（半透明部分出现穿透问题）
  depthWrite: false,
  // 多边形偏移
  polygonOffset: true,
  // 偏移系数
  polygonOffsetFactor: 0.1,
  // 偏移单位
  polygonOffsetUnits: 0.1,
  side: THREE.DoubleSide,
  // 是否预乘alpha值。默认为true
  premultipliedAlpha: true,
  // 金属粗糙度
  roughness: 0.25,
  color: 0x4dd0e1
})

// 缩放倍数
const SCALE_SIZE = 50

let csgEvaluator = new Evaluator()
csgEvaluator.attributes = ['position', 'normal']
csgEvaluator.useGroups = false

const loadBunnyBrush = async () => {
  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(params.glb)

  const obj = gltf.scene.children[0]
  // 将该向量的x、y和z值同时设置为等于传入的scalar
  // obj.scale.setScalar(SCALE_SIZE)

  obj.updateMatrixWorld()

  // 获取geometry的副本，以免修改原始geometry
  const geometry = obj.geometry.clone()
  // 矩阵
  const matrix = new THREE.Matrix4()
  const pos = new THREE.Vector3(0, 0, 0)
  // 四元数
  const quaternion = new THREE.Quaternion()
  // 欧拉对象
  const rotation = new THREE.Euler()
  // 缩放
  const scale = new THREE.Vector3(SCALE_SIZE, SCALE_SIZE, SCALE_SIZE)

  quaternion.setFromEuler(rotation)
  matrix.compose(pos, quaternion, scale)
  // 应用缩放矩阵到geometry的每个顶点
  geometry.applyMatrix4(matrix)

  // 计算法向量及自定义normal属性
  geometry.computeVertexNormals()

  // @ts-ignore
  const mesh = new Brush(geometry, new THREE.MeshStandardMaterial()) as InstanceType<typeof THREE.Mesh>
  // mesh.position.y = 1
  mesh.updateMatrixWorld()
  //对象是否被渲染到阴影贴图中。默认值为false。
  mesh.castShadow = true

  mesh.name = '兔子'
  mesh.material.opacity = 0.15
  mesh.material.transparent = true
  mesh.material.depthWrite = false
  mesh.material.polygonOffset = true
  mesh.material.polygonOffsetFactor = 0.1
  mesh.material.polygonOffsetUnits = 0.1
  mesh.material.side = THREE.DoubleSide
  mesh.material.premultipliedAlpha = true
  mesh.material.color.set(0xe0f7fa)
  return mesh
}

const createBrushes = scene => {
  let brushes: InstanceType<typeof THREE.Mesh>[] = []

  for (let i = 0; i < 50; i++) {
    // @ts-ignore
    const b = new Brush(new THREE.SphereGeometry(1 * SCALE_SIZE, 15, 15), material) as InstanceType<typeof THREE.Mesh>
    b.receiveShadow = true
    scene.add(b)
    brushes.push(b)
  }
  return { brushes, material }
}

type NewBrush = InstanceType<typeof Brush> & InstanceType<typeof THREE.Mesh>
export class NewThreeScene extends ThreeScene {
  bunnyBrush: NewBrush | undefined
  brushResult: NewBrush | undefined
  wireframeResult: InstanceType<typeof THREE.Mesh> | undefined
  brushes: NewBrush[]
  surfaceSampler: InstanceType<typeof MeshSurfaceSampler> | undefined
  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)

    this.brushes = []
    this.addModel()
  }

  initModel() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      // 阴影材质
      new THREE.ShadowMaterial({
        color: 0xfae3d9,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      })
    )
    plane.rotation.x = -Math.PI / 2
    plane.scale.setScalar(10)
    //材质是否接收阴影。默认值为false。
    plane.receiveShadow = true
    this.addObject(plane)
  }

  async addModel() {
    const bunnyBrush = await loadBunnyBrush()
    this.bunnyBrush = bunnyBrush
    this.addObject(bunnyBrush)

    // 网格采样器
    const surfaceSampler = new MeshSurfaceSampler(bunnyBrush)
    surfaceSampler.build()
    this.surfaceSampler = surfaceSampler

    const { brushes, material } = createBrushes(this.scene)
    this.brushes = brushes

    // 缓存材质
    let mat
    mat = bunnyBrush.material.clone()
    mat.opacity = 1
    mat.transparent = false
    mat.depthWrite = true
    materialMap.set(bunnyBrush.material, mat)

    mat = material.clone()
    mat.opacity = 1
    mat.transparent = false
    mat.depthWrite = true
    materialMap.set(material, mat)

    // 添加计算结果
    const brushResult = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshStandardMaterial({
        // 金属粗糙度
        roughness: 0.1,
        // 平面着色
        flatShading: false,
        // 多边形偏移
        polygonOffset: true,
        polygonOffsetUnits: SCALE_SIZE,
        polygonOffsetFactor: SCALE_SIZE
      })
    )
    brushResult.castShadow = true
    brushResult.receiveShadow = true
    this.brushResult = brushResult
    this.addObject(brushResult)

    // 线框材质
    const wireframeResult = new THREE.Mesh(
      brushResult.geometry,
      new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 0,
        opacity: 0.15,
        transparent: true
      })
    )
    wireframeResult.material.color.set(0x001516)
    this.wireframeResult = wireframeResult
    this.addObject(wireframeResult)

    this.randomizeBrushes()
    this.updateCSG()
    this.createGUI()
  }

  randomizeBrushes() {
    const surfaceSampler = this.surfaceSampler
    if (!surfaceSampler) return
    const brushes = this.brushes
    const bunnyBrush = this.bunnyBrush

    for (let i = 0; i < brushes.length; i++) {
      const b = brushes[i]
      surfaceSampler.sample(b.position)
      // const { x, y, z } = b.position
      // b.position.set(x * SCALE_SIZE, y * SCALE_SIZE, z * SCALE_SIZE)
      // 定点坐标进行矩阵变换（ 世界矩阵 ）
      b.position.applyMatrix4(bunnyBrush.matrixWorld)
      // THREE.MathUtils.lerp - 返回给定区间线性插值
      b.scale.setScalar(THREE.MathUtils.lerp(0.05, 0.15, Math.random()))
      b.updateMatrixWorld()
    }
  }

  updateCSG() {
    const { brushes, bunnyBrush, brushResult } = this
    let finalBrush = brushes[0]
    csgEvaluator.useGroups = params.useGroups

    // 合并组
    // @ts-ignore
    csgEvaluator.consolidateGroups = params.consolidateGroups
    for (let i = 1, l = brushes.length; i < l; i++) {
      const b = brushes[i]
      // 计算
      finalBrush = csgEvaluator.evaluate(finalBrush, b, ADDITION)
      finalBrush.material = material
    }

    csgEvaluator.evaluate(bunnyBrush, finalBrush, params.operation, brushResult)

    if (params.useGroups) {
      brushResult.material = brushResult.material.map(m => materialMap.get(m))
    } else {
      brushResult.material = materialMap.get(bunnyBrush.material)
    }
  }

  createGUI() {
    const gui = new GUI()
    gui
      .add(params, 'operation', {
        ADDITION,
        SUBTRACTION,
        REVERSE_SUBTRACTION,
        INTERSECTION,
        DIFFERENCE,
        HOLLOW_SUBTRACTION,
        HOLLOW_INTERSECTION
      })
      .name('布尔类型')
      .onChange(() => {
        this.updateCSG()
      })
    gui.add(params, 'wireframe').name('线框材质')
    gui.add(params, 'displayBrushes').name('计算元素')
    gui
      .add(params, 'useGroups')
      .name('使用组合')
      .onChange(() => {
        this.updateCSG()
      })
    gui
      .add(params, 'consolidateGroups')
      .name('合并组')
      .onChange(() => {
        this.updateCSG()
      })
    gui
      .add(
        {
          randomize: () => {
            this.randomizeBrushes()
            this.updateCSG()
          }
        },
        'randomize'
      )
      .name('随机更新')

    gui.domElement.style = 'position: absolute; top: 10px; right: 10px'
    this.container?.appendChild(gui.domElement)
  }

  modelAnimate(): void {
    // wireframeResult.visible = params.wireframe;
    if (this.bunnyBrush) {
      this.bunnyBrush.visible = params.displayBrushes
    }
    if (this.brushes.length) {
      this.brushes.forEach(b => (b.visible = params.displayBrushes))
    }
    if (this.wireframeResult) {
      this.wireframeResult.visible = params.wireframe
    }
  }
}
