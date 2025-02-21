import * as THREE from 'three/webgpu'

import * as ThreeScene from 'three-scene'

import { GUI } from 'dat.gui'

const { color, positionView, float, positionWorld, uniform, triNoise3D, fog, normalWorld } =
  THREE.TSL

// 雾化高度
const height = uniform(40)

export class FogScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    // 颜色
    const skyColor = color(0xf0f5f5)
    const groundColor = color(0xdee3e6)

    // 噪波距离
    const fogNoiseDistance = positionView.z.negate().smoothstep(0, this.camera.far) // smoothstep 平滑阶梯

    const distance = fogNoiseDistance.mul(20).max(height) // 乘、最大
    const alpha = 0.98
    const groundFogArea = float(distance)
      .sub(positionWorld.y)
      .div(distance)
      .pow(3)
      .saturate()
      .mul(alpha) // 浮动、替补、分区、次方、渗透、乘

    // 时间节点
    const timer = uniform(0).onFrameUpdate(frame => frame.time) // 统一、边框更新

    // 大小 调整 mul 参数
    const fogNoiseA = triNoise3D(positionWorld.mul(0.0005), 1, timer)
    const fogNoiseB = triNoise3D(positionWorld.mul(0.001), 1, timer.mul(0.5))

    const fogNoise = fogNoiseA.add(fogNoiseB).mul(groundColor)

    // 雾化、背景
    this.scene.fogNode = fog(fogNoiseDistance.oneMinus().mix(groundColor, fogNoise), groundFogArea) // 一减、混合
    this.scene.backgroundNode = normalWorld.y.max(0).mix(groundColor, skyColor)

    // 半球环境光
    // this.addObject(new THREE.HemisphereLight(skyColor.value, groundColor.value, 0.5))

    const buildColor = positionWorld.y
      .mul(5)
      .floor()
      .mod(50)
      .sign()
      .mix(color(0x000066).add(fogNoiseDistance), color(0xffffff))

    const buildGeometry = new THREE.BoxGeometry(1, 1, 1)
    const buildmaterial = new THREE.MeshPhongNodeMaterial({
      colorNode: buildColor
    })

    // 实例化网格
    const buildMesh = new THREE.InstancedMesh(buildGeometry, buildmaterial, 1000)
    this.addObject(buildMesh)

    const dummy = new THREE.Object3D()
    const center = new THREE.Vector3()

    for (let i = 0; i < buildMesh.count; i++) {
      const scaleY = Math.random() * 7 + 5
      dummy.position.x = Math.random() * 2000 - 1000
      dummy.position.z = Math.random() * 2000 - 1000

      const distance = Math.max(dummy.position.distanceTo(center) * 0.012, 5)
      dummy.position.y = 0.5 * scaleY * distance

      dummy.scale.x = dummy.scale.z = Math.random() * 30 + 10
      dummy.scale.y = scaleY * distance

      // 更新局部变换。
      dummy.updateMatrix()

      // 设置给定的本地变换矩阵到已定义的实例
      buildMesh.setMatrixAt(i, dummy.matrix)
    }

    this.gui = new GUI()
    this.addGui()

    console.log(this)
  }

  createAmbientLight(color: string | number, intensity: number) {
    return new THREE.AmbientLight(color, intensity)
  }

  createDirectionalLight(color: string | number, intensity: number) {
    return new THREE.DirectionalLight(color, intensity)
  }

  render() {
    this.renderer.renderAsync(this.scene, this.camera)
  }

  createRender() {
    return new THREE.WebGPURenderer(this.options.render)
  }

  initModel(): void {
    const planeGeometry = new THREE.PlaneGeometry(200, 200)
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0x999999
    })

    const ground = new THREE.Mesh(planeGeometry, planeMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.scale.setScalar(20)
    ground.castShadow = true
    ground.receiveShadow = true
    this.addObject(ground)
  }

  addGui() {
    const gui = this.gui

    gui.add(height, 'value', 20, 300).name('雾化高度')

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }
}
