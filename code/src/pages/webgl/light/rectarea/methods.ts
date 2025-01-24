import * as THREE from 'three'
import * as ThreeScene from 'three-scene'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib'

import { GUI } from 'dat.gui'

export class RectareaScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>
  meshKnot: InstanceType<typeof THREE.Mesh>
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    const gui = new GUI()
    this.gui = gui

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)

    RectAreaLightUniformsLib.init()

    // 面光 (颜色、强度、宽度、高度)
    const rectLight1 = new THREE.RectAreaLight(0xff0000, 5, 4, 10)
    rectLight1.position.set(-5, 5, 5)
    this.addObject(rectLight1)

    const rectLight2 = new THREE.RectAreaLight(0x00ff00, 5, 4, 10)
    rectLight2.position.set(0, 5, 5)
    this.addObject(rectLight2)

    const rectLight3 = new THREE.RectAreaLight(0x0000ff, 5, 4, 10)
    rectLight3.position.set(5, 5, 5)
    this.addObject(rectLight3)

    const rectLightHelper1 = new RectAreaLightHelper(rectLight1)
    const rectLightHelper2 = new RectAreaLightHelper(rectLight2)
    const rectLightHelper3 = new RectAreaLightHelper(rectLight3)
    this.addObject(rectLightHelper1, rectLightHelper2, rectLightHelper3)

    this.addGui(rectLight1, '面光 1')
    this.addGui(rectLight2, '面光 2')
    this.addGui(rectLight3, '面光 3')

    // 地面
    const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000)
    const matStdFloor = new THREE.MeshStandardMaterial({
      color: 0xbcbcbc,
      roughness: 0.1,
      metalness: 0
    })
    const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor)
    this.addObject(mshStdFloor)

    // 环形扭曲
    const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16)
    const matKnot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 })
    const meshKnot = new THREE.Mesh(geoKnot, matKnot)
    meshKnot.position.set(0, 5, 0)
    this.meshKnot = meshKnot
    this.addObject(meshKnot)
  }

  addGui(light, name) {
    const gui = this.gui

    gui
      .addColor({ color: light.color.getHex() }, 'color')
      .name(name)
      .onChange(v => {
        light.color.set(v)
      })
  }

  modelAnimate(): void {
    this.meshKnot.rotation.y = Date.now() / 1000
  }
}
