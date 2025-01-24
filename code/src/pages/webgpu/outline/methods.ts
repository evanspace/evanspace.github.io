import * as THREE from 'three/webgpu'
import { outline } from 'three/examples/jsm/tsl/display/OutlineNode'
import * as ThreeScene from 'three-scene'
import { GUI } from 'dat.gui'

const { pass, uniform, time, oscSine } = THREE.TSL

const { pointer, update, raycaster } = ThreeScene.Hooks.useRaycaster()

// 边缘强度
const edgeStrength = uniform(3.0)
// 边缘发光
const edgeGlow = uniform(0.0)
// 边缘厚度
const edgeThickness = uniform(1.0)
// 脉冲周期
const pulsePeriod = uniform(0)
// 可见边缘颜色
const visibleEdgeColor = uniform(new THREE.Color(0xffffff))
// 不可见边缘颜色
const hiddenEdgeColor = uniform(new THREE.Color(0x4e3636))

export class OutlineScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>
  group = new THREE.Group()

  select: any[] = []
  outlinePass: ReturnType<typeof outline>
  postProcessing: InstanceType<typeof THREE.PostProcessing>
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.addObject(this.group)

    const outlinePass = outline(this.scene, this.camera, {
      // 选中对象
      selectedObjects: this.select,
      // 边缘发光
      edgeGlow,
      // 边缘厚度
      edgeThickness
    })
    this.outlinePass = outlinePass

    const { visibleEdge, hiddenEdge } = outlinePass

    // 周期
    const period = time.div(pulsePeriod).mul(2)
    // 脉冲器
    const osc = oscSine(period).mul(0.5).add(0.5) // osc [ 0.5, 1.0 ]
    // 边缘颜色
    const outlineColor = visibleEdge
      .mul(visibleEdgeColor)
      .add(hiddenEdge.mul(hiddenEdgeColor))
      .mul(edgeStrength)
    // 脉冲
    const outlinePulse = pulsePeriod.greaterThan(0).select(outlineColor.mul(osc), outlineColor)

    const scenePass = pass(this.scene, this.camera)

    const postProcessing = new THREE.PostProcessing(this.renderer)
    postProcessing.outputNode = outlinePulse.add(scenePass)
    this.postProcessing = postProcessing

    this.gui = new GUI()
    this.addGui()

    this.bindEvent()
  }

  createRender() {
    return new THREE.WebGPURenderer()
  }

  addModel(model) {
    this.group.children.length = 0
    let scale = 1
    model.traverse(el => {
      if (el.isMesh) {
        // 居中几何体
        el.geometry.center()
        // 计算当前几何体边界球形，更新已有的 boundingSphere
        el.geometry.computeBoundingSphere()
        scale = 0.2 * el.geometry.boundingSphere.radius

        const phongMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          specular: 0x111111,
          shininess: 5
        })
        el.material = phongMaterial
        el.receiveShadow = true
        el.castShadow = true
      }
    })

    model.position.y = 1
    // 倍数除以 标量
    model.scale.divideScalar(scale)

    this.group.add(model)

    // 添加随机球
    const geometry = new THREE.SphereGeometry(3, 48, 24)
    for (let i = 0; i < 20; i++) {
      const material = new THREE.MeshLambertMaterial()
      material.color.setHSL(Math.random(), 1, 0.3)

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2)

      mesh.scale.multiplyScalar(Math.random() * 0.3 + 0.1)
      this.group.add(mesh)
    }

    // 地面
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshLambertMaterial({
        color: 0x315f86,
        side: THREE.DoubleSide
      })
    )
    floor.rotation.x -= Math.PI * 0.5
    floor.position.y -= 1.5
    floor.receiveShadow = true
    this.group.add(floor)
  }

  onPointerMove(e: PointerEvent) {
    if (!e.isPrimary) return

    update(e, this.container)

    raycaster.setFromCamera(pointer, this.camera)
    const intersects = raycaster.intersectObject(this.group, true)
    if (intersects.length > 0) {
      const object = intersects[0].object
      this.select = []
      this.select.push(object)

      this.outlinePass.selectedObjects = this.select
    }
  }

  addGui() {
    const gui = this.gui

    gui.add(edgeStrength, 'value', 0.01, 10).name('边缘强度')
    gui.add(edgeGlow, 'value', 0, 1).step(0.01).name('边缘发光')
    gui.add(edgeThickness, 'value', 0, 6).step(0.01).name('边缘厚度')
    gui.add(pulsePeriod, 'value', 0, 6).step(0.01).name('脉冲周期')
    gui
      .addColor({ color: visibleEdgeColor.value.getHex() }, 'color')
      .name('可见区域颜色')
      .onChange(v => {
        visibleEdgeColor.value.set(v)
      })
    gui
      .addColor({ color: hiddenEdgeColor.value.getHex() }, 'color')
      .name('不可见区域颜色')
      .onChange(v => {
        hiddenEdgeColor.value.set(v)
      })

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  setEnv(texture: InstanceType<typeof THREE.DataTexture>) {
    this.scene.environment = texture
    this.scene.background = texture
  }

  animate() {
    this.postProcessing.render()
  }
}
