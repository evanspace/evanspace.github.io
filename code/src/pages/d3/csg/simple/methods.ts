import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { SUBTRACTION, INTERSECTION, ADDITION, Brush, Evaluator } from 'three-bvh-csg'
import ThreeScene from 'three-scene'

const params = {
  operation: SUBTRACTION,
  useGroups: true,
  wireframe: false
}

let brushResult

const createBaseBrush = () => {
  // 20 边形
  const geo = new THREE.IcosahedronGeometry(20, 3)
  const mat = new THREE.MeshStandardMaterial({
    // 平面着色
    flatShading: true,

    // 多边形偏移
    polygonOffset: true,
    // 偏移单位
    polygonOffsetUnits: 1,
    // 偏移系数
    polygonOffsetFactor: 1
  })
  // @ts-ignore
  return new Brush(geo, mat)
}

const createBrush = () => {
  // 圆柱体(顶部半径、底部半径、高度、侧面周围分段，侧面高度分段)
  const geo = new THREE.CylinderGeometry(10, 10, 50, 45, 1)
  const mat = new THREE.MeshStandardMaterial({
    // 平面着色
    flatShading: true,
    color: 0xff9800,
    // 自发光
    emissive: 0xff9800,
    // 发光强度
    emissiveIntensity: 0.35,

    // 多边形偏移
    polygonOffset: true,
    // 偏移单位
    polygonOffsetUnits: 10,
    // 偏移系数
    polygonOffsetFactor: 10
  })
  // @ts-ignore
  return new Brush(geo, mat)
}

const createGUI = container => {
  const gui = new GUI()
  gui.add(params, 'operation', { SUBTRACTION, INTERSECTION, ADDITION }).name('布尔类型')
  gui.add(params, 'wireframe').name('线框材质')
  gui.add(params, 'useGroups').name('使用组合')

  gui.domElement.style = 'position: absolute; top: 10px; right: 10px'
  container?.appendChild(gui.domElement)
}

export class NewThreeScene extends ThreeScene {
  evaluator: InstanceType<typeof Evaluator>
  baseBrush: InstanceType<typeof Brush>
  brush: InstanceType<typeof Brush>
  wireframe: InstanceType<typeof THREE.Mesh>
  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)
    this.evaluator = new Evaluator()

    // 主体
    this.baseBrush = createBaseBrush()
    //布尔运算物体
    this.brush = createBrush()

    this.wireframe = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x009688, wireframe: true })
    )
    this.addModel()
  }

  initModel(): void {
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
    plane.receiveShadow = true
    this.addObject(plane)

    createGUI(this.container)
  }

  addModel() {
    const wireframe = this.wireframe
    wireframe.position.set(0, 50, 0)
    this.addObject(wireframe)
  }

  updateCSG() {
    this.evaluator.useGroups = params.useGroups
    brushResult = this.evaluator.evaluate(this.baseBrush, this.brush, params.operation, brushResult)
    brushResult.castShadow = true
    brushResult.position.set(0, 50, 0)
    brushResult.receiveShadow = true
    this.addObject(brushResult)
  }

  modelAnimate(): void {
    // 测量web应用性能
    const t = window.performance.now() + 9000

    const brush: InstanceType<typeof THREE.Mesh> = this.brush
    brush.rotation.x = t * -0.0002
    brush.rotation.y = t * -0.0005
    brush.rotation.z = t * -0.001

    const s = 0.5 + 0.5 * (1 + Math.sin(t * 0.001))
    brush.scale.set(s, 1, s)
    brush.updateMatrixWorld()

    this.updateCSG()

    this.wireframe.geometry = brushResult.geometry
    this.wireframe.visible = params.wireframe
  }
}
