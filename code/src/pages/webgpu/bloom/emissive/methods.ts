import * as THREE from 'three/webgpu'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode'
import * as ThreeScene from 'three-scene'
import { GUI } from 'dat.gui'

const { pass, mrt, output, emissive } = THREE.TSL

export class EmissiveScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>

  postProcessing: InstanceType<typeof THREE.PostProcessing>
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    // 场景合成
    const scenePass = pass(this.scene, this.camera)
    scenePass.setMRT(
      mrt({
        output,
        emissive
      })
    )

    const outputPass = scenePass.getTextureNode()
    const emissivePass = scenePass.getTextureNode('emissive')

    const bloomPass = bloom(emissivePass, 2.5, 0.5)

    // 色调映射
    this.renderer.toneMapping = THREE.NeutralToneMapping
    const postProcessing = new THREE.PostProcessing(this.renderer)
    postProcessing.outputNode = outputPass.add(bloomPass)

    this.postProcessing = postProcessing

    this.gui = new GUI()
    this.addGui(bloomPass)
  }

  setEnv(texture: InstanceType<typeof THREE.DataTexture>) {
    this.scene.environment = texture
    this.scene.background = texture
  }

  createRender() {
    return new THREE.WebGPURenderer() as any
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
    this.postProcessing.render()
  }
}
