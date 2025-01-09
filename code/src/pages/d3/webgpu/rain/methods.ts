import * as THREE from 'three/build/three.webgpu'
import { TSL } from 'three/build/three.webgpu'

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils'

import * as ThreeScene from 'three-scene/build/three-scene.module'

import { GUI } from 'dat.gui'

const randUint = () => TSL.uint(Math.random() * 0xffffff)

export class RainThreeScene extends ThreeScene.Scene {
  maxCount = 50000
  count = 5000

  collisionCamera: InstanceType<typeof THREE.OrthographicCamera>
  // 渲染对象
  renderTarget: InstanceType<typeof THREE.RenderTarget> | any
  material: InstanceType<typeof THREE.MeshBasicNodeMaterial>

  positionBuffer
  velocityBuffer
  ripplePositionBuffer
  rippleTimeBuffer

  computeParticles: any
  rainParticles: any
  rippleParticles: any
  collisionBox?: InstanceType<typeof THREE.Mesh>

  gui: InstanceType<typeof GUI>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    // 碰撞相机、渲染目标
    this.collisionCamera = this.createCollisionCamera()
    this.renderTarget = this.createRenderTarget()

    const material = new THREE.MeshBasicNodeMaterial()
    material.colorNode = TSL.positionWorld
    this.material = material

    // 缓冲器
    this.positionBuffer = this.createBuffer()
    this.velocityBuffer = this.createBuffer()
    this.ripplePositionBuffer = this.createBuffer()
    this.rippleTimeBuffer = this.createBuffer()

    const computeInit = this.initCompute()
    const computeUpdate = this.computeUpdate() as any
    this.computeParticles = computeUpdate().compute(this.maxCount)
    this.addModel()
    // @ts-ignore
    this.renderer.computeAsync(computeInit)

    this.gui = new GUI()
    this.addGui()
  }

  initRenderer() {
    const { width, height, bgColor, bgUrl, env } = this.options
    const renderer = new THREE.WebGPURenderer(this.options.render) as any

    // 环境
    if (env) {
      this.setEnvironment(env)
    }

    // 背景
    if (bgUrl) {
      this.setBgTexture(bgUrl)
    } else {
      this.setBgColor(bgColor)
    }

    if (this.options.fog.visible) {
      const { color, near, far } = this.options.fog
      this.scene.fog = new THREE.Fog(color ?? this.scene.background, near, far)
    }

    // 设置渲染尺寸
    renderer.setSize(width, height)
    // 设置canvas的分辨率
    renderer.setPixelRatio(window.devicePixelRatio)
    // 画布插入容器
    this.container.appendChild(renderer.domElement)
    return renderer
  }

  // 碰撞相机
  createCollisionCamera() {
    const camera = new THREE.OrthographicCamera(-50, 50, 50, -50, 0.1, 50)
    camera.position.y = 50
    camera.lookAt(0, 0, 0)
    camera.layers.disableAll()
    camera.layers.enable(1)
    return camera
  }

  // 渲染目标
  createRenderTarget() {
    const renderTarget = new THREE.RenderTarget(1024, 1024)
    const texture = renderTarget.texture
    texture.type = THREE.HalfFloatType // 浮点数据类型
    // 采样方式
    texture.magFilter = THREE.NearestFilter // 最近点采样
    texture.minFilter = THREE.NearestFilter
    // 启用生成mipmaps
    texture.generateMipmaps = false
    return renderTarget
  }

  createBuffer(type = 'vec3') {
    const count = this.maxCount
    // 单个缓冲区存储多个属性
    return TSL.storage(new THREE.StorageInstancedBufferAttribute(count, 3), type, count)
  }

  // 初始化计算
  initCompute() {
    // @ts-ignore
    return TSL.Fn(() => {
      const position = this.positionBuffer.element(TSL.instanceIndex)
      const velocity = this.velocityBuffer.element(TSL.instanceIndex)
      const rippleTime = this.rippleTimeBuffer.element(TSL.instanceIndex)

      const randX = TSL.hash(TSL.instanceIndex)
      const randY = TSL.hash(TSL.instanceIndex.add(randUint()))
      const randZ = TSL.hash(TSL.instanceIndex.add(randUint()))

      position.x = randX.mul(100).add(-50)
      position.y = randY.mul(25)
      position.z = randZ.mul(100).add(-50)

      velocity.y = randX.mul(-0.04).add(-0.2)

      rippleTime.x = 1000
      // @ts-ignore
    })().compute(this.maxCount)
  }

  // 计算更新
  computeUpdate() {
    // @ts-ignore
    return TSL.Fn(() => {
      const getCoord = pos => pos.add(50).div(100)

      const position = this.positionBuffer.element(TSL.instanceIndex)
      const velocity = this.velocityBuffer.element(TSL.instanceIndex)
      const ripplePosition = this.ripplePositionBuffer.element(TSL.instanceIndex)
      const rippleTime = this.rippleTimeBuffer.element(TSL.instanceIndex)
      position.addAssign(velocity)

      rippleTime.x = rippleTime.x.add(TSL.deltaTime.mul(4))

      // 碰撞区域
      const collisionArea = TSL.texture(this.renderTarget.texture, getCoord(position.xz))

      const surfaceOffset = 0.05

      const floorPosition = collisionArea.y.add(surfaceOffset)
      // 地面
      const ripplePivotOffsetY = -0.9

      TSL.If(position.y.add(ripplePivotOffsetY).lessThan(floorPosition), () => {
        position.y = 25

        ripplePosition.xz = position.xz
        ripplePosition.y = floorPosition

        rippleTime.x = 1

        // 下一滴不会落在同一个地方
        position.x = TSL.hash(TSL.instanceIndex.add(TSL.time)).mul(100).add(-50)
        position.z = TSL.hash(TSL.instanceIndex.add(TSL.time.add(randUint())))
          .mul(100)
          .add(-50)
      })

      const rippleOnSurface = TSL.texture(this.renderTarget.texture, getCoord(ripplePosition.xz))
      const rippleFloorArea = rippleOnSurface.y.add(surfaceOffset)

      TSL.If(ripplePosition.y.greaterThan(rippleFloorArea), () => {
        rippleTime.x = 1000
      })
    })
  }

  addModel() {
    this.createRainDrop()
    this.createRainRipple()
    this.createCollisionGround()
    this.createCollisionModel()
  }

  // 雨滴（下落）
  createRainDrop() {
    const rainMaterial = new THREE.MeshBasicNodeMaterial()
    rainMaterial.colorNode = TSL.uv().distance(TSL.vec2(0.5, 0)).oneMinus().mul(3).exp().mul(0.1)
    rainMaterial.vertexNode = TSL.billboarding({ position: this.positionBuffer.toAttribute() })
    rainMaterial.opacity = 0.2
    rainMaterial.side = THREE.DoubleSide
    rainMaterial.forceSinglePass = true
    rainMaterial.depthWrite = false
    rainMaterial.depthTest = true
    rainMaterial.transparent = true

    const rainParticles = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 2), rainMaterial)
    // @ts-ignore
    rainParticles.count = this.count
    this.rainParticles = rainParticles
    this.addObject(rainParticles)
  }

  // 雨滴（地面涟漪效果）
  createRainRipple() {
    const rippleTime = this.rippleTimeBuffer.element(TSL.instanceIndex).x
    // 水滴涟漪效果
    const rippleEffect = TSL.Fn(() => {
      const center = TSL.uv().add(TSL.vec2(-0.5)).length().mul(7)
      const distance = rippleTime.sub(center)
      return distance.min(1).sub(distance.max(1).sub(1))
    })

    // 涟漪材质
    const rippleMaterial = new THREE.MeshBasicNodeMaterial()
    rippleMaterial.colorNode = rippleEffect()
    rippleMaterial.positionNode = TSL.positionGeometry.add(this.ripplePositionBuffer.toAttribute())
    rippleMaterial.opacityNode = rippleTime.mul(0.3).oneMinus().max(0).mul(0.5)
    rippleMaterial.side = THREE.DoubleSide
    rippleMaterial.forceSinglePass = true
    rippleMaterial.depthWrite = false
    rippleMaterial.depthTest = true
    rippleMaterial.transparent = true

    // 水滴形状
    // 水面网格
    const surface = new THREE.PlaneGeometry(2.5, 2.5)
    surface.rotateX(-Math.PI / 2)

    // x 面 网格
    const xRippleGeometry = new THREE.PlaneGeometry(1, 2)
    xRippleGeometry.rotateY(-Math.PI / 2)

    // z 面网格
    const zRippleGeometry = new THREE.PlaneGeometry(1, 2)

    // 合成水滴形状
    const rippleGeometry = BufferGeometryUtils.mergeGeometries([
      surface,
      xRippleGeometry,
      zRippleGeometry
    ])

    const rippleParticles = new THREE.Mesh(rippleGeometry, rippleMaterial)
    // @ts-ignore
    rippleParticles.count = this.count
    this.rippleParticles = rippleParticles
    this.addObject(rippleParticles)
  }

  // 碰撞地面
  createCollisionGround() {
    const floorGeometry = new THREE.PlaneGeometry(1000, 1000)
    floorGeometry.rotateX(-Math.PI / 2)

    const plane = new THREE.Mesh(floorGeometry, new THREE.MeshBasicMaterial({ color: 0x050505 }))
    this.addObject(plane)
  }

  // 碰撞模型
  createCollisionModel() {
    const collisionBox = new THREE.Mesh(
      new THREE.BoxGeometry(30, 1, 15),
      new THREE.MeshStandardMaterial({
        color: 0x333333
      })
    )
    collisionBox.position.y = 12
    collisionBox.scale.x = 3.5

    // 增减图层对象与参数指定的图层对应关系
    collisionBox.layers.enable(1)
    collisionBox.castShadow = true
    this.collisionBox = collisionBox
    this.addObject(collisionBox)

    const torusKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(5, 1, 128, 100),
      new THREE.MeshStandardMaterial({
        color: 0x333333
      })
    )
    torusKnot.position.set(0, 12, 15)
    // 增减图层对象与参数指定的图层对应关系
    torusKnot.layers.enable(1)

    this.addObject(torusKnot)
  }

  addGui() {
    const gui = this.gui

    gui.add(this.collisionBox?.position, 'z', -50, 50)
    gui.add(this.collisionBox?.scale, 'x', 0.1, 4)

    gui
      .add(this.rainParticles, 'count', 200, this.maxCount)
      .name('数量')
      .onChange(e => {
        this.rippleParticles.count = e
      })
    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  animate(): void {
    const renderer = this.renderer as any
    if (!renderer) return

    this.scene.overrideMaterial = this.material
    renderer.setRenderTarget(this.renderTarget)
    renderer.render(this.scene, this.collisionCamera)

    // 计算
    renderer.compute(this.computeParticles)

    // 结果
    this.scene.overrideMaterial = null
    renderer.setRenderTarget(null)
    renderer.render(this.scene, this.camera)
  }
}
