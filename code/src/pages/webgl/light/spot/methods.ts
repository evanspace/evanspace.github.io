import * as THREE from 'three'

import * as ThreeScene from 'three-scene'

import { GUI } from 'dat.gui'

const base = import.meta.env.VITE_GIT_OSS

const textureLoader = new THREE.TextureLoader().setPath(`${base}/textures/`)
const texture = textureLoader.load('disturb.jpg')

export class LightScene extends ThreeScene.Scene {
  spotLight: InstanceType<typeof THREE.SpotLight>
  lightHelper: InstanceType<typeof THREE.SpotLightHelper>
  gui: InstanceType<typeof GUI>
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    // 灯光
    const spotLight = this.createSpolight()
    this.spotLight = spotLight
    this.addObject(this.spotLight)
    const lightHelper = new THREE.SpotLightHelper(spotLight)
    this.lightHelper = lightHelper
    this.addObject(lightHelper)

    const ground = this.createGround(0xffffff)
    this.addObject(ground)

    this.addModel()

    this.createClock()

    this.gui = new GUI()
    this.addGui()
  }

  createSpolight() {
    const spotLight = new THREE.SpotLight(0xffffff, 1)
    spotLight.position.set(200, 500, 200)
    spotLight.angle = Math.PI / 6
    spotLight.penumbra = 1 // 聚光锥的半影衰减百分比
    spotLight.decay = 0 // 衰减
    spotLight.distance = 1500 // 距离
    spotLight.map = texture

    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.near = 1 // 大于 1 否则闪屏
    spotLight.shadow.camera.far = 10
    spotLight.shadow.focus = 1
    spotLight.shadow.bias = -0.003

    return spotLight
  }

  addModel() {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(100, 100, 100),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    )
    box.position.set(-60, 50, 0)

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(50, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    )
    sphere.position.set(60, 50, 0)
    this.addObject(box, sphere)
  }

  addGui() {
    const gui = this.gui
    const spotLight = this.spotLight
    gui.add(spotLight, 'intensity', 0, 10).name('光照强度')
    gui
      .addColor(
        {
          color: spotLight.color.getHex()
        },
        'color'
      )
      .name('光照颜色')
      .onChange(x => {
        spotLight.color.set(x)
      })
    gui.add(spotLight, 'angle', 0, Math.PI / 3).name('角度')
    gui.add(spotLight, 'penumbra', 0, 1).name('半影')
    gui.add(spotLight, 'decay', 0, 2).name('衰减')
    gui.add(spotLight, 'distance', 0, 2000).name('距离')

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  modelAnimate(): void {
    const time = performance.now() / 3000
    const spotLight = this.spotLight

    spotLight.position.x = Math.cos(time) * 300
    spotLight.position.z = Math.sin(time) * 300

    this.lightHelper.update()
  }
}
