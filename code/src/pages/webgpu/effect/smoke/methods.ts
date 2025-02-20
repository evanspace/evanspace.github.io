import * as ThreeScene from 'three-scene'

import * as THREE from 'three/webgpu'

import { GUI } from 'dat.gui'

const { createStripSmoke } = ThreeScene.Hooks.useSmoke()

const TSL = THREE.TSL
const {
  mix,
  mul,
  oneMinus,
  positionLocal,
  smoothstep,
  texture,
  time,
  rotateUV,
  Fn,
  uv,
  vec2,
  vec3,
  vec4,
  uniform
} = TSL

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const textureLoader = new THREE.TextureLoader()

// 速度
const speed = uniform(0.2)

export class SmokeScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>

  smokeInstancedSprite?: any
  fireInstancedSprite?: any

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    // const ground = this.createGround()
    // this.addObject(ground)

    this.addModel()

    this.gui = new GUI()
    this.addGui()
  }

  render() {
    this.renderer.renderAsync(this.scene, this.camera)
  }

  createScene() {
    return new THREE.Scene()
  }

  createRender() {
    return new THREE.WebGPURenderer() as any
  }

  createDirectionalLight(color: string | number, intensity: number) {
    return new THREE.DirectionalLight(color, intensity)
  }

  createAmbientLight(color: string | number, intensity: number) {
    return new THREE.AmbientLight(color, intensity)
  }

  createPerspectiveCamera(fov: number, aspect: number, near: number, far: number) {
    return new THREE.PerspectiveCamera(fov, aspect, near, far)
  }

  addModel() {
    this.addSmoke()
    this.addSmallSmoke()
  }

  addSmoke() {
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

  addSmallSmoke() {
    // 网格
    const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64)
    // 位置
    smokeGeometry.translate(0, 0.5, 0)
    smokeGeometry.scale(15, 60, 15)

    const noiseTexture = textureLoader.load(`${base}/oss/textures/gpu/128x128.png`)
    noiseTexture.wrapS = THREE.RepeatWrapping
    noiseTexture.wrapT = THREE.RepeatWrapping

    const smokeMaterial = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    })

    // 位置
    smokeMaterial.positionNode = Fn(() => {
      // 扭曲
      const twistNoiseUv = vec2(0.6, uv().y.mul(0.3).sub(time.mul(speed)).mod(1)) // 扭曲位置、速度
      const twist = texture(noiseTexture, twistNoiseUv).r.mul(5) // 扭曲数量
      positionLocal.xz.assign(rotateUV(positionLocal.xz, twist, vec2(1))) // 扭曲偏差位置

      // 气流
      const windOffset = vec2(
        texture(noiseTexture, vec2(0.25, time.mul(0.01)).mod(1)).r.sub(0.5), // 向右气流
        texture(noiseTexture, vec2(0.75, time.mul(0.01)).mod(1)).r.sub(0) // 上下气流
      ).mul(uv().y.pow(2).mul(80)) // 风力偏差
      positionLocal.addAssign(windOffset)
      return positionLocal
    })()

    // 颜色
    smokeMaterial.colorNode = Fn(() => {
      // 透明度
      const alphaNoiseUv = uv()
        .mul(vec2(0.8, 0.3))
        .add(vec2(0, time.mul(0.03).negate()))
      const alpha = mul(
        // 图案
        texture(noiseTexture, alphaNoiseUv).r.smoothstep(0.4, 1),

        // 边缘褪色
        smoothstep(0, 0.1, uv().x),
        smoothstep(0, 0.1, oneMinus(uv().x)),
        smoothstep(0, 0.1, uv().y),
        smoothstep(0, 0.1, oneMinus(uv().y))
      )

      const finalColor = mix(vec3(0.6, 0.3, 0.2), vec3(1, 1, 1), alpha.pow(3))
      return vec4(finalColor, alpha)
    })()

    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial)
    smoke.position.x = -80
    smoke.position.y = 30
    this.addObject(smoke)

    const sm = createStripSmoke({
      width: 50,
      height: 200
      // speed: uniform(0.2),
      // color: 0xf00f00,
      // twistNums: 4,
      // twistRange: 10
      // power: uniform(2)
    })
    sm.position.set(-100, 100, 200)
    this.addObject(sm)
    console.log(sm)
    // sm.geometry = new THREE.PlaneGeometry(200, 200, 64, 64)

    const ts = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 200),
      new THREE.MeshBasicMaterial({ color: 0xf00f00, wireframe: true })
    )
    ts.position.copy(sm.position)
    this.addObject(ts)
  }

  createSmoke(
    opts: {
      width?: number
      height?: number
      // 速度（风速、扭曲）
      speed?: number | ReturnType<typeof uniform>
      // 颜色
      color?: number | string
      // 颜色饱和
      alphaPow?: number
      // 扭曲次数
      twistNums?: number
      // 扭曲范围
      twistRange?: number
      // 左右风速
      RLSpeed?: number
      // 上下风速
      TDSpeed?: number
      // 锋利偏差
      offset?: number
      // 风力
      power?: number | ReturnType<typeof uniform>
    } = {}
  ) {
    const {
      width = 10,
      height = 10,
      speed = 0.5,
      color = 0xffffff,
      alphaPow = 3,
      twistNums = 5,
      twistRange = 5,
      RLSpeed = 0.1,
      TDSpeed = 0.1,
      offset = 50,
      power = 0.03
    } = opts
    const mp = 10
    const geometry = new THREE.PlaneGeometry(1, 1, width * mp, height * mp)
    geometry.scale(width, height, 1)
    geometry.rotateY(Math.PI * 0.6)
    geometry.translate(0, 0, width / 2)
    const material = new THREE.MeshBasicNodeMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    })

    const noiseTexture = textureLoader.load(`${base}/oss/textures/gpu/128x128.png`)
    noiseTexture.wrapS = THREE.RepeatWrapping
    noiseTexture.wrapT = THREE.RepeatWrapping

    // 位置
    material.positionNode = Fn(() => {
      // 扭曲
      const twistNoiseUv = vec2(0.8, uv().y.mul(0.3).sub(time.mul(speed))) // 扭曲位置、速度
      const twist = texture(noiseTexture, twistNoiseUv).r.mul(twistNums) // 扭曲数量
      positionLocal.xz.assign(rotateUV(positionLocal.xz, twist, vec2(twistRange))) // 扭曲偏差位置

      // 气流
      const windOffset = vec2(
        texture(noiseTexture, vec2(0.25, time.mul(RLSpeed)).mod(1)).r.sub(0.5), // 向右气流
        texture(noiseTexture, vec2(0.75, time.mul(TDSpeed)).mod(1)).r.sub(0) // 上下气流
      ).mul(uv().y.pow(1).mul(offset)) // 风力偏差
      positionLocal.addAssign(windOffset)
      return positionLocal
    })()

    // 颜色
    material.colorNode = Fn(() => {
      // 透明度
      const alphaNoiseUv = uv()
        // 范围
        .mul(vec2(0.8, 0.3))
        .add(vec2(0, time.mul(power).negate()))
      const alpha = mul(
        // 图案
        texture(noiseTexture, alphaNoiseUv).r.smoothstep(0.4, 1),

        // 边缘褪色
        smoothstep(0, 0.1, uv().x),
        smoothstep(0, 0.1, oneMinus(uv().x)),
        smoothstep(0, 0.1, uv().y),
        smoothstep(0, 0.1, oneMinus(uv().y))
      )

      const c = new THREE.Color(color)
      const finalColor = mix(vec3(c.r, c.g, c.b), vec3(1, 1, 1), alpha.pow(alphaPow))
      return vec4(finalColor, alpha)
    })()

    const mesh = new THREE.Mesh(geometry, material)
    return mesh
  }

  addGui() {
    const gui = this.gui

    gui.add(speed, 'value', 0.01, 1, 0.01).name('烟雾速度')

    if (this.fireInstancedSprite) {
      gui
        .add(this.fireInstancedSprite, 'count', 200, 2000)
        .name('烟雾浓度')
        .onChange(v => {
          this.smokeInstancedSprite.count = v * 2
        })
    }
    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }
}
