import * as THREE from 'three'
import * as ThreeScene from 'three-scene/build/three-scene.module'
import { GUI } from 'dat.gui'

export class NewThreeScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>

  material?: InstanceType<typeof THREE.MeshPhongMaterial>
  outLineMaterial?: InstanceType<typeof THREE.MeshPhongMaterial>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)
    this.addModel()

    this.gui = new GUI()
    this.addGui()
  }

  addModel() {
    const ground = this.createGround()
    this.addObject(ground)

    const gap = 20
    // 球形几何体
    const shpere = new THREE.SphereGeometry(10, 32, 32)
    const mat = new THREE.MeshPhongMaterial({
      color: 0x137b02,
      shininess: 2, // 高亮
      specular: 0x30e3ca,
      side: THREE.BackSide
    })
    const shpereMesh = new THREE.Mesh(shpere, mat)
    shpereMesh.position.y = gap
    shpereMesh.position.x = -gap
    shpereMesh.castShadow = true

    // 圆环缓冲扭结几何体
    const torus = new THREE.TorusKnotGeometry(10, 3, 100, 16)
    const torusMesh = new THREE.Mesh(torus, mat)
    torusMesh.position.x = gap
    torusMesh.position.y = gap
    torusMesh.castShadow = true

    const outMat = new THREE.MeshPhongMaterial({
      color: 0xffde7d,
      side: THREE.BackSide
    })
    this.outLineMaterial = outMat
    const outline = new THREE.Mesh(torus, outMat)
    outline.scale.setScalar(1.05)
    outline.position.copy(torusMesh.position)

    // 平面
    const size = 20
    const plane = new THREE.PlaneGeometry(size, size)
    const planeMesh = new THREE.Mesh(plane, mat)
    planeMesh.position.x = -2 * gap - size
    planeMesh.position.y = gap
    planeMesh.castShadow = true

    this.addObject(shpereMesh, torusMesh, outline, planeMesh)

    this.material = mat
  }

  addGui() {
    const gui = this.gui

    // THREE.FrontSide	背面
    // THREE.BackSide	前面
    // THREE.DoubleSide 双面
    gui
      .add(this.material, 'side', {
        FrontSide: THREE.FrontSide,
        BackSide: THREE.BackSide,
        DoubleSide: THREE.DoubleSide
      })
      .onChange(e => {
        if (!this.material) return
        this.material.side = Number(e) as any
      })

    if (!this.outLineMaterial) return
    const option = {
      color: this.outLineMaterial.color.getHex()
    }
    gui
      .addColor(option, 'color')
      .name('轮廓颜色')
      .onChange(e => {
        if (!this.outLineMaterial) return
        this.outLineMaterial.color.set(e)
      })

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }
}
