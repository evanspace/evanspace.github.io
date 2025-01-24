import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'

import { ParticleEngine } from './particle-engine'
import { Examples } from './examples'

const TSL = THREE.TSL

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const textureLoader = new THREE.TextureLoader()

// 速度
const speed = TSL.uniform(0.2)

export class NewThreeScene extends ThreeScene.Scene {
  engine?: any
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)
    // this.createClock()
    this.addModel()
  }

  render() {
    ;(this.renderer as InstanceType<typeof THREE.WebGPURenderer>).renderAsync(
      this.scene,
      this.camera
    )
  }

  createRender() {
    return new THREE.WebGPURenderer(this.options.render) as any
  }

  addModel() {
    // 动画周期范围
    const lifeRange = TSL.range(0.1, 1)
    // const offsetRange = TSL.range(new THREE.Vector3(-10, 15, -10), new THREE.Vector3(10, 20, 10))
    const offsetRange = TSL.range(new THREE.Vector3(-4, 15, 4), new THREE.Vector3(4, 15, 8))

    const scaledTime = TSL.time.add(5).mul(speed) // + 5 * speed

    const lifeTime = scaledTime.mul(lifeRange).mod(1)
    const scaleRange = TSL.range(0.3, 2)
    const roteRange = TSL.range(0.1, 4)

    const life = lifeTime.div(lifeRange)
    const fakeLightEffect = TSL.positionLocal.y.oneMinus().max(0.9)

    const textureNode = TSL.texture(
      textureLoader.load(`${base}/oss/textures/effect/smokeparticle.png`),
      TSL.rotateUV(TSL.uv(), scaledTime.mul(roteRange))
    )

    const opacityNode = textureNode.a.mul(life.oneMinus())

    // 缩放倍数
    const s = 40

    // 烟
    const smokeNodeMaterial = new THREE.SpriteNodeMaterial()
    // 烟 混合颜色
    smokeNodeMaterial.colorNode = TSL.mix(
      TSL.color(0xffffff),
      TSL.color(0xf00f00),
      // TSL.color(0x0000ff),
      life.mul(0.5).min(0.5)
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
    smokeInstancedSprite.count = 600
    smokeInstancedSprite.position.y = s / 4
    this.addObject(smokeInstancedSprite)
  }

  addModel_() {
    const engine = new ParticleEngine()
    engine.setValues(Examples.rain)
    engine.initialize()
    this.engine = engine
    console.log(engine)
    this.addObject(engine.particleMesh)

    const box = new THREE.BoxGeometry(10, 10, 10)

    let colors = new Array(8)
      .fill(0)
      .map(() => [
        1.0,
        0.0,
        0.0, // 颜色1 (红色)

        0.0,
        1.0,
        0.0, // 颜色2 (绿色)

        0.0,
        0.0,
        1.0 // 颜色3 (蓝色)
      ])
      .flat()

    // 创建顶点颜色属性
    let cat = new THREE.BufferAttribute(new Float32Array(colors), 3)
    box.setAttribute('color', cat)
    const boxMesh = new THREE.Mesh(
      box,
      new THREE.MeshBasicMaterial({
        // color: 0xf00f00
        vertexColors: true,
        side: THREE.DoubleSide,
        wireframe: false
      })
    )
    boxMesh.position.x = 50
    this.addObject(boxMesh)
  }

  modelAnimate() {
    const dt = this.clock?.getDelta() as number

    if (this.engine) {
      this.engine.update(dt * 0.5)
    }
  }
}
