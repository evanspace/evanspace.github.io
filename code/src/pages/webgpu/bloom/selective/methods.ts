import * as THREE from 'three/webgpu'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode'
import * as ThreeScene from 'three-scene'
import { GUI } from 'dat.gui'

const { pass, mrt, output, float, uniform } = THREE.TSL

const { pointer, update, raycaster } = ThreeScene.Hooks.useRaycaster()

export class SelectiveScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>

  postProcessing: InstanceType<typeof THREE.PostProcessing>
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.addModel()

    // 场景合成
    const scenePass = pass(this.scene, this.camera)
    scenePass.setMRT(
      mrt({
        output,
        bloomIntensity: float(0)
      })
    )

    const outputPass = scenePass.getTextureNode()
    const bloomIntensityPass = scenePass.getTextureNode('bloomIntensity')

    const bloomPass = bloom(outputPass.mul(bloomIntensityPass))

    // 色调映射
    this.renderer.toneMapping = THREE.NeutralToneMapping
    const postProcessing = new THREE.PostProcessing(this.renderer)
    postProcessing.outputColorTransform = false
    postProcessing.outputNode = outputPass.add(bloomPass).renderOutput()
    this.postProcessing = postProcessing

    this.gui = new GUI()
    this.addGui(bloomPass)

    this.bindEvent()
  }

  createRender() {
    return new THREE.WebGPURenderer()
  }

  addModel() {
    // 20 面几何体
    const geometry = new THREE.IcosahedronGeometry(1, 15)

    for (let i = 0; i < 50; i++) {
      // 随机颜色
      const color = new THREE.Color()
      color.setHSL(Math.random(), 0.7, Math.random() * 0.2 + 0.05)

      // 发光强度
      const bloomIntensity = Math.random() > 0.5 ? 1 : 0

      const material = new THREE.MeshBasicNodeMaterial({
        color: color
      })
      material.mrtNode = mrt({
        bloomIntensity: uniform(bloomIntensity)
      })

      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5)

      // normalize 转换为单位向量
      sphere.position.normalize().multiplyScalar(Math.random() * 20 + 10)
      sphere.scale.setScalar(Math.random() * 4 + 3)
      this.addObject(sphere)
    }
  }

  onPointerDown(e) {
    update(e, this.container)
    raycaster.setFromCamera(pointer, this.camera)

    const intersects = raycaster.intersectObjects(this.scene.children, false)
    if (intersects.length > 0) {
      // @ts-ignore
      const material = intersects[0].object.material
      // 发光强度
      const bloomIntensity = material.mrtNode.get('bloomIntensity')
      bloomIntensity.value = bloomIntensity.value === 0 ? 1 : 0
    }
  }

  addGui(bloomPass) {
    const gui = this.gui

    const bloomFolder = gui.addFolder('发光')
    bloomFolder.add(bloomPass.threshold, 'value', 0, 1).step(0.01).name('阈值/起点')
    bloomFolder.add(bloomPass.strength, 'value', 0, 3).step(0.01).name('强度')
    bloomFolder.add(bloomPass.radius, 'value', 0, 1).step(0.01).name('半径')
    bloomFolder.open()

    const toneMappingFolder = gui.addFolder('色调映射')
    toneMappingFolder.add(this.renderer, 'toneMappingExposure', 0.1, 3).name('曝光')
    toneMappingFolder.open()

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  animate(): void {
    this.postProcessing.renderAsync()
  }
}
