import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'

import { IESLoader } from 'three/examples/jsm/loaders/IESLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const iesLoader = new IESLoader().setPath(base)

export class SpotScene extends ThreeScene.Scene {
  lightGroup = new THREE.Group()
  gui = new GUI()
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.addLight()

    console.log(this)
  }

  createRender() {
    return new THREE.WebGPURenderer(this.options.render)
  }

  render() {
    this.renderer.renderAsync(this.scene, this.camera)
  }

  modelAnimate(): void {
    const time = Date.now() / 1000
    this.lightGroup.children.forEach((el: any, i) => {
      const t = (Math.sin((time + i) * (Math.PI / 2)) + 1) / 2
      const position = el.position
      const x = THREE.MathUtils.lerp(position.x, 0, t)
      const z = THREE.MathUtils.lerp(position.z, 0, t)
      el.target.position.x = x
      el.target.position.z = z
      el.userData.helper.update()
    })
  }

  initModel(): void {
    // 地面
    const ground = this.createGround(500, 500, 0x808080)
    this.addObject(ground)

    // 立方体
    const size = 30
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshPhongMaterial({ color: 0x999999 })
    )
    box.position.y = size / 2
    box.castShadow = true
    this.addObject(box)
  }

  async addLight() {
    const group = this.lightGroup
    const [iesTexture1, iesTexture2, iesTexture3, iesTexture4] = await Promise.all([
      iesLoader.loadAsync('/oss/ies/101.ies'),
      iesLoader.loadAsync('/oss/ies/102.ies'),
      iesLoader.loadAsync('/oss/ies/103.ies'),
      iesLoader.loadAsync('/oss/ies/104.ies')
    ])
    console.log(iesTexture1, iesTexture2, iesTexture3, iesTexture4)
    this.addObject(group)

    // 红
    const spotLight = this.createIESSpotLight([65, 30, 65], 0xff0000, iesTexture1)
    group.add(spotLight)

    // 绿
    const spotLight2 = this.createIESSpotLight([-65, 30, 65], 0x00ff00, iesTexture2)
    group.add(spotLight2)

    // 蓝
    const spotLight3 = this.createIESSpotLight([-65, 30, -65], 0x0000ff, iesTexture3)
    group.add(spotLight3)

    // 白
    const spotLight4 = this.createIESSpotLight([65, 30, -65], 0xffffff, iesTexture4)
    group.add(spotLight4)

    this.addGui()
  }

  createIESSpotLight(position: number[], color: number, texture) {
    const spotLight = new THREE.IESSpotLight(color, 30, 200, Math.PI / 8, 0.7, 0)
    spotLight.iesMap = texture
    spotLight.castShadow = true
    const [x, y, z] = position
    spotLight.position.set(x, y, z)
    const helper = new THREE.SpotLightHelper(spotLight)
    // 目标辅助添加致场景
    this.addObject(spotLight.target, helper)
    spotLight.userData.helper = helper
    return spotLight
  }

  addGui() {
    const gui = this.gui

    const params = {
      helper: true
    }

    const lights: THREE.SpotLight[] = this.lightGroup.children as any

    gui.add(params, 'helper').onChange(e => {
      lights.forEach(el => {
        el.userData.helper.visible = e
      })
    })

    lights.forEach((el, index) => {
      gui
        .addColor(el, 'color')
        .name('灯光' + (index + 1))
        .onChange(() => {
          el.userData.helper.update()
        })
    })

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }
}
