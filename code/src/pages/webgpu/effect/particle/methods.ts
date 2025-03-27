import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'

import { ParticleEngine } from './particle-engine'
import { Examples } from './examples'

const TSL = THREE.TSL

const base = import.meta.env.VITE_GIT_OSS
const textureLoader = new THREE.TextureLoader()

const { createParticleSmoke } = ThreeScene.Hooks.useSmoke(THREE)

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
    this.renderer.renderAsync(this.scene, this.camera)
  }

  createRender() {
    return new THREE.WebGPURenderer(this.options.render)
  }

  addModel() {
    // 动画周期范围
    const lifeRange = TSL.range(0.1, 1)
    // const offsetRange = TSL.range(new THREE.Vector3(-10, 15, -10), new THREE.Vector3(10, 20, 10))
    const offsetRange = TSL.range(new THREE.Vector3(-4, 15, 0), new THREE.Vector3(4, 15, 0))

    const scaledTime = TSL.time.add(5).mul(speed) // + 5 * speed

    const lifeTime = scaledTime.mul(lifeRange).mod(1)
    const scaleRange = TSL.range(0.3, 2)
    const roteRange = TSL.range(0.1, 4)

    const life = lifeTime.div(lifeRange)
    const fakeLightEffect = TSL.positionLocal.y.oneMinus().max(0.9)

    const textureNode = TSL.texture(
      textureLoader.load(`${base}/textures/effect/smokeparticle.png`),
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
    smokeInstancedSprite.count = 600
    smokeInstancedSprite.position.y = s / 4
    this.addObject(smokeInstancedSprite)

    const g1 = this.createParticleSmoke({
      size: 40,
      count: 1000,
      speed: TSL.uniform(0.2),
      offsetRangeMin: [-5, 15, 0],
      offsetRangeMax: [5, 15, 0],
      scaleMin: 0.1,
      scaleMax: 1.5,
      rotateMax: Math.PI * 2,
      mixColor: [0xf00f00, 0xffffff],
      mixColorStart: 0.1,
      mixColorMinOpacity: 0.1,
      textureSrc: `${base}/textures/effect/snowflake.png`
    })
    g1.position.set(-100, 0, 100)

    const g2 = createParticleSmoke({
      size: 50
      // count: 1000,
      // speed: TSL.uniform(0.3),
      // mixColor: [0x1fab89, 0xffffff],
      // textureSrc: `${base}/textures/effect/spikey.png`
    })
    g2.position.set(100, 0, 100)
    this.addObject(g1, g2)
  }

  // 粒子烟雾
  createParticleSmoke(
    opts: Partial<{
      /**
       * 大小
       */
      size: number
      /**
       * 粒子个数
       */
      count: number
      /**
       * 速度
       */
      speed: number | ReturnType<typeof TSL.uniform>
      /**
       * 周期最小值
       */
      lifeRangeMin: number
      /**
       * 周期最大值-可无限大，越大越快
       */
      lifeRangeMax: number
      /**
       * 粒子偏差最小值（粒子将在最小值与最大值内活动）
       */
      offsetRangeMin: number[] | THREE.Vector3
      /**
       * 粒子偏差最大值（粒子将在最小值与最大值内活动）
       */
      offsetRangeMax: number[] | THREE.Vector3
      /**
       * 缩放最小倍数
       */
      scaleMin: number
      /**
       * 缩放最大倍数
       */
      scaleMax: number
      /**
       * 旋转最小角度
       */
      rotateMin: number
      /**
       * 旋转最大角度
       */
      rotateMax: number
      /**
       * 混合颜色
       */
      mixColor: number | string | (number | string)[]
      /**
       * 混合颜色开始位置
       */
      mixColorStart: number
      /**
       * 汇合颜色最低透明度
       */
      mixColorMinOpacity: number
      /**
       * 贴图地址
       */
      textureSrc: string
      /**
       * 初始缩放倍数(动画起点的缩放倍数)
       */
      startScale: number
    }> = {}
  ) {
    let {
      size = 1,
      count = 500,
      speed = 0.2,
      lifeRangeMin = 0,
      lifeRangeMax = 1,
      offsetRangeMin = new THREE.Vector3(-10, 15, -10),
      offsetRangeMax = new THREE.Vector3(10, 20, 10),
      scaleMin = 0.3,
      scaleMax = 2,
      rotateMin = 0.1,
      rotateMax = 4,
      mixColor = [0xffffff, 0xffffff],
      mixColorStart = 0.5,
      mixColorMinOpacity = 0.1,
      textureSrc,
      startScale = 0.3
    } = opts
    if (offsetRangeMin instanceof THREE.Vector3) {
      const { x, y, z } = offsetRangeMin
      offsetRangeMin = [x, y, z]
    }
    if (offsetRangeMax instanceof THREE.Vector3) {
      const { x, y, z } = offsetRangeMax
      offsetRangeMax = [x, y, z]
    }
    if (!Array.isArray(mixColor)) {
      mixColor = [mixColor]
    }

    // 动画周期范围
    const lifeRange = TSL.range(lifeRangeMin, lifeRangeMax)
    const offsetRange = TSL.range(
      new THREE.Vector3(...offsetRangeMin),
      new THREE.Vector3(...offsetRangeMax)
    )

    // 速度 add(大于等于 5 合适)
    const scaledTime = TSL.time.add(5).mul(speed)
    // mod(周期进度 1 最合适)
    const lifeTime = scaledTime.mul(lifeRange).mod(1)
    const scaleRange = TSL.range(scaleMin, scaleMax)
    const roteRange = TSL.range(rotateMin, rotateMax)

    const life = lifeTime.div(lifeRange)
    const fakeLightEffect = TSL.positionLocal.y.oneMinus().max(0.9)

    const texture = textureLoader.load(textureSrc || `${base}/textures/effect/snowflake.png`)
    const textureNode = TSL.texture(texture, TSL.rotateUV(TSL.uv(), scaledTime.mul(roteRange)))

    const opacityNode = textureNode.a.mul(life.oneMinus())

    // 烟
    const smokeNodeMaterial = new THREE.SpriteNodeMaterial()
    // 烟 混合颜色
    smokeNodeMaterial.colorNode = TSL.mix(
      TSL.color(mixColor[0]),
      TSL.color(mixColor[1] || mixColor[0]),
      life.mul(mixColorStart).min(mixColorMinOpacity)
    ).mul(fakeLightEffect)

    smokeNodeMaterial.opacityNode = opacityNode
    smokeNodeMaterial.positionNode = offsetRange.mul(lifeTime)
    smokeNodeMaterial.scaleNode = scaleRange.mul(lifeTime.max(startScale))
    smokeNodeMaterial.depthWrite = false
    smokeNodeMaterial.transparent = true

    // 烟 精灵材质
    const smokeInstancedSprite = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), smokeNodeMaterial)
    smokeInstancedSprite.scale.setScalar(size)
    smokeInstancedSprite.count = count
    smokeInstancedSprite.position.y = size / 4
    return smokeInstancedSprite
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
