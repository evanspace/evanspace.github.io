import * as ThreeScene from 'three-scene'

import * as THREE from 'three/webgpu'

import { GUI } from 'dat.gui'

const TSL = THREE.TSL

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const textureLoader = new THREE.TextureLoader()

// 速度
const speed = TSL.uniform(0.2)

export class SmokeScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>

  smokeInstancedSprite?: any
  fireInstancedSprite?: any

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    const ground = this.createGround()
    this.addObject(ground)

    this.addModel()

    this.gui = new GUI()
    this.addGui()
  }

  createRender() {
    return new THREE.WebGPURenderer(this.options.render) as any
  }

  addModel() {
    // 动画周期范围
    const lifeRange = TSL.range(0.1, 1)
    const offsetRange = TSL.range(new THREE.Vector3(-2, 3, -2), new THREE.Vector3(2, 5, 2))

    const scaledTime = TSL.time.add(5).mul(speed) // + 5 * speed

    const lifeTime = scaledTime.mul(lifeRange).mod(1)
    const scaleRange = TSL.range(0.3, 2)
    const roteRange = TSL.range(0.1, 4)

    const life = lifeTime.div(lifeRange)
    const fakeLightEffect = TSL.positionLocal.y.oneMinus().max(0.2)

    const textureNode = TSL.texture(
      textureLoader.load(`${base}/oss/textures/effect/smoke1.png`),
      TSL.rotateUV(TSL.uv(), scaledTime.mul(roteRange))
    )

    const opacityNode = textureNode.a.mul(life.oneMinus())

    // 混合/颜色
    const smokeColor = TSL.mix(
      TSL.color(0xffffff),
      TSL.color(0x222222),
      // TSL.color(0xf00f00),
      TSL.positionLocal.y.mul(0.5).clamp()
    )

    // 缩放倍数
    const s = 40

    // 烟
    const smokeNodeMaterial = new THREE.SpriteNodeMaterial()
    // 烟 混合颜色
    smokeNodeMaterial.colorNode = TSL.mix(
      TSL.color(0xf27d0c),
      smokeColor,
      life.mul(2.5).min(1)
    ).mul(fakeLightEffect)

    smokeNodeMaterial.opacityNode = opacityNode
    smokeNodeMaterial.positionNode = offsetRange.mul(lifeTime)
    smokeNodeMaterial.scaleNode = scaleRange.mul(lifeTime.max(0.3))
    smokeNodeMaterial.depthWrite = false
    smokeNodeMaterial.transparent = true

    // 烟 精灵材质
    const smokeInstancedSprite = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), smokeNodeMaterial)
    smokeInstancedSprite.scale.setScalar(s)
    // @ts-ignore
    smokeInstancedSprite.count = 2000
    smokeInstancedSprite.position.y = s / 4
    smokeInstancedSprite.castShadow = true
    this.smokeInstancedSprite = smokeInstancedSprite
    this.addObject(smokeInstancedSprite)

    // 烟中心（火焰）
    const fireGeometry = new THREE.PlaneGeometry(1, 1)
    const fireCount = 1000

    const fireNodeMaterial = new THREE.SpriteNodeMaterial()
    fireNodeMaterial.colorNode = TSL.mix(TSL.color(0xb72f17), TSL.color(0xb72f17), life)
    fireNodeMaterial.positionNode = TSL.range(
      new THREE.Vector3(-1, 1, -1),
      new THREE.Vector3(1, 2, 1)
    ).mul(lifeTime)
    fireNodeMaterial.scaleNode = smokeNodeMaterial.scaleNode
    fireNodeMaterial.opacityNode = opacityNode.mul(0.5)
    fireNodeMaterial.blending = THREE.AdditiveBlending
    fireNodeMaterial.transparent = true
    fireNodeMaterial.depthWrite = false

    const fireInstancedSprite = new THREE.Mesh(fireGeometry, fireNodeMaterial)
    fireInstancedSprite.scale.setScalar(s)
    // @ts-ignore
    fireInstancedSprite.count = fireCount
    fireInstancedSprite.position.y = s / 4
    // fireInstancedSprite.renderOrder = 1
    fireInstancedSprite.castShadow = true
    this.fireInstancedSprite = fireInstancedSprite
    this.addObject(fireInstancedSprite)
  }

  addGui() {
    const gui = this.gui

    gui.add(speed, 'value', 0.01, 1, 0.01).name('烟雾速度')

    gui
      .add(this.fireInstancedSprite, 'count', 200, 2000)
      .name('烟雾浓度')
      .onChange(v => {
        this.smokeInstancedSprite.count = v * 2
      })
    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }
}
