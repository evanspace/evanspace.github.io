import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import * as ThreeScene from 'three-scene/build/three-scene.module'

const params = {
  wireframe: true,
  helper: true,
  intensity: 1,
  skyColor: 0xffffff,
  groundColor: 0x61c0bf
}

const createGUI = container => {
  const gui = new GUI()
  gui.add(params, 'intensity', 0.1, 10).name('光照强度')
  gui.add(params, 'helper').name('辅助器')
  gui.addColor(params, 'skyColor').name('天空光颜色')
  gui.addColor(params, 'groundColor').name('地面光颜色')

  // @ts-ignore
  gui.domElement.style = 'position: absolute; top: 10px; right: 10px'
  container?.appendChild(gui.domElement)
}

export class NewThreeScene extends ThreeScene.Scene {
  hemisphereLight?: InstanceType<typeof THREE.HemisphereLight>
  hemisphereLightHelper?: InstanceType<typeof THREE.HemisphereLightHelper>
  wireframe?: InstanceType<typeof THREE.Mesh>
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.addModel()
  }

  addModel(): void {
    // 天空颜色，地面颜色，光照强度
    const light = new THREE.HemisphereLight(params.skyColor, params.groundColor, params.intensity)
    light.position.set(0, 50, 0)
    this.addObject(light)
    this.hemisphereLight = light

    const helper = new THREE.HemisphereLightHelper(light, 5)
    helper.visible = params.helper
    this.addObject(helper)
    this.hemisphereLightHelper = helper

    // 创建 20面几何体 (半径、增加顶点)
    const icosahedronGeo = new THREE.IcosahedronGeometry(10, 10)
    const icosahedron = new THREE.Mesh(icosahedronGeo, new THREE.MeshStandardMaterial())
    icosahedron.position.set(0, 25, 0)
    icosahedron.castShadow = true
    this.addObject(icosahedron)

    const groundGeo = new THREE.PlaneGeometry(500, 500)
    const ground = new THREE.Mesh(
      groundGeo,
      // 光泽表面的材质，没有镜面高光
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    )
    ground.rotation.x = -Math.PI * 0.5
    ground.receiveShadow = true
    this.addObject(ground)

    createGUI(this.container)
  }

  modelAnimate(): void {
    if (this.hemisphereLight) {
      this.hemisphereLight.intensity = params.intensity
      this.hemisphereLight.color.set(params.skyColor)
      this.hemisphereLight.groundColor.set(params.groundColor)
    }
    if (this.hemisphereLightHelper) {
      this.hemisphereLightHelper.visible = params.helper
      this.hemisphereLightHelper.update()
    }
  }
}
