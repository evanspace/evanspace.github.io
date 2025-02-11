import * as THREE from 'three'
import * as ThreeScene from 'three-scene'

import { GUI } from 'dat.gui'

export class ShadowScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>
  directionalLight = new THREE.DirectionalLight()

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    const ground = this.createGround(1000, 1000, 0xffffff)
    this.addObject(ground)

    this.addModel()

    this.gui = new GUI()
    this.addGui()
  }

  createDirectionalLight(color: string | number, intensity: number) {
    const light = new THREE.DirectionalLight(color, intensity)
    this.directionalLight = light
    return light
  }

  addModel() {
    const geometries = [
      new THREE.BoxGeometry(4, 4, 4),
      new THREE.IcosahedronGeometry(3),
      new THREE.TorusKnotGeometry(4, 0.5, 256, 24, 1, 3)
    ]

    const material = new THREE.MeshNormalMaterial()

    for (let i = 0, l = geometries.length; i < l; i++) {
      const angle = (i / l) * Math.PI * 2

      const geometry = geometries[i]
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.y = 60
      mesh.position.x = (Math.cos(angle) / 2.0) * 100
      mesh.position.z = (Math.sin(angle) / 2.0) * 100
      mesh.castShadow = true
      mesh.scale.setScalar(10)
      this.addObject(mesh)
    }
    this.renderer.shadowMap.type = THREE.VSMShadowMap
  }

  addGui() {
    const gui = this.gui

    gui
      .add(this.renderer.shadowMap, 'enabled')
      .name('开启阴影')
      .onChange(v => {
        this.renderer.shadowMap.enabled = v
        this.scene.traverse(el => {
          if (el.name === 'ground') {
            el.receiveShadow = v
          }
        })
      })
    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }
}
