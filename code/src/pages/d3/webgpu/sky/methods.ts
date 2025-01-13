import * as THREE from 'three/webgpu'
import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader'
import * as ThreeScene from 'three-scene'
import { gaussianBlur } from 'three/examples/jsm/tsl/display/GaussianBlurNode'

import { GUI } from 'dat.gui'

const TSL = THREE.TSL

const {
  color,
  vec2,
  pass,
  linearDepth,
  normalWorld,
  // triplanarTexture,
  // texture,
  objectPosition,
  screenUV,
  viewportLinearDepth,
  viewportDepthTexture,
  viewportSharedTexture,
  mx_worley_noise_float,
  positionWorld,
  time
} = TSL
const Hooks = ThreeScene.Hooks

const { getBgGroup } = Hooks.useBackground()

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const textureLoader = new THREE.TextureLoader()
const iceDiffuse = textureLoader.load(`${base}/oss/textures/gpu/water.jpg`)
iceDiffuse.wrapS = THREE.RepeatWrapping
iceDiffuse.wrapT = THREE.RepeatWrapping
iceDiffuse.colorSpace = THREE.NoColorSpace

const adjustments = {
  mix: 0,
  procedural: 0,
  intensity: 1,
  hue: 0,
  saturation: 1
}

const params = {
  offsetCube1: 0,
  offsetCube2: 0
}

export class SkyScene extends ThreeScene.Scene {
  // 水面
  water?: any

  blurNode: any

  mixNode: any
  proceduralNode: any
  intensityNode: any
  hueNode: any
  saturationNode: any

  rotateY1Matrix: any
  rotateY2Matrix: any

  cube1Texture: any
  cube2Texture: any

  postProcessing: any

  gui: InstanceType<typeof GUI>

  floor: any

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.postProcessing = null
    this.blurNode = TSL.uniform(0)

    this.mixNode = TSL.reference('mix', 'float', adjustments)
    this.proceduralNode = TSL.reference('procedural', 'float', adjustments)
    this.intensityNode = TSL.reference('intensity', 'float', adjustments)
    this.hueNode = TSL.reference('hue', 'float', adjustments)
    this.saturationNode = TSL.reference('saturation', 'float', adjustments)

    this.rotateY1Matrix = new THREE.Matrix4()
    this.rotateY2Matrix = new THREE.Matrix4()

    const waterAmbientLight = new THREE.HemisphereLight(0x333366, 0x74ccf4, 5)
    const skyAmbientLight = new THREE.HemisphereLight(0x74ccf4, 0, 1)

    this.addObject(skyAmbientLight)
    this.addObject(waterAmbientLight)

    this.addModel()
    this.addWater()
    this.addProcessing()

    this.gui = new GUI()
    this.addGui()
  }

  createRender() {
    return new THREE.WebGPURenderer() as any
  }

  createDirectionalLight(color: string | number, intensity: number) {
    return new THREE.DirectionalLight(color, intensity)
  }

  getEnvironmentNode = (reflectNode, positionNode) => {
    const {
      rotateY1Matrix,
      rotateY2Matrix,
      mixNode,
      proceduralNode,
      intensityNode,
      hueNode,
      saturationNode
    } = this
    const custom1UV = reflectNode.xyz.mul(TSL.uniform(rotateY1Matrix))
    const custom2UV = reflectNode.xyz.mul(TSL.uniform(rotateY2Matrix))
    const mixCubeMaps = TSL.mix(
      TSL.pmremTexture(this.cube1Texture, custom1UV),
      TSL.pmremTexture(this.cube2Texture, custom2UV),
      positionNode.y.add(mixNode).clamp()
    )

    const proceduralEnv = TSL.mix(mixCubeMaps, TSL.normalWorld, proceduralNode)

    const intensityFilter = proceduralEnv.mul(intensityNode)
    const hueFilter = TSL.hue(intensityFilter, hueNode)
    return TSL.saturation(hueFilter, saturationNode)
  }

  async addModel() {
    let cube1Texture = await new RGBMLoader()
      .setMaxRange(16)
      // .setPath('/oss/img/sky/228/')
      // .loadCubemapAsync(['posX.png', 'posY.png', 'posZ.png', 'negX.png', 'negY.png', 'negZ.png'])
      .loadCubemap(getBgGroup('228', 'png'))
    cube1Texture = await new THREE.CubeTextureLoader().loadAsync(getBgGroup('225', 'jpeg'))
    cube1Texture.generateMipmaps = true
    cube1Texture.minFilter = THREE.LinearMipmapLinearFilter
    this.cube1Texture = cube1Texture

    // .setPath('/oss/img/sky/221/')
    // .loadAsync(['posX.jpeg', 'posY.jpeg', 'posZ.jpeg', 'negX.jpeg', 'negY.jpeg', 'negZ.jpeg'])
    const cube2Texture = await new THREE.CubeTextureLoader().loadAsync(getBgGroup('221', 'jpeg'))
    cube2Texture.generateMipmaps = true
    cube2Texture.minFilter = THREE.LinearMipmapLinearFilter
    this.cube2Texture = cube2Texture

    // 环境纹理
    this.scene.environmentNode = this.getEnvironmentNode(TSL.reflectVector, TSL.positionWorld)

    // 背景
    this.scene.backgroundNode = this.getEnvironmentNode(
      TSL.positionWorldDirection,
      TSL.positionLocal
    ).context({
      getTextureLevel: () => this.blurNode
    })

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 32),
      new THREE.MeshStandardMaterial({
        metalness: 1, // 金属度
        roughness: 0 // 粗糙度
      })
    )
    this.addObject(sphere)
  }

  addWater() {
    this.scene.backgroundNode = normalWorld.y.mix(color(0x0487e2), color(0x0066ff))

    const timer = time.mul(0.8)
    const floorUV = positionWorld.xzy

    const waterLayer0 = mx_worley_noise_float(floorUV.mul(4).add(timer))
    const waterLayer1 = mx_worley_noise_float(floorUV.mul(2).add(timer))

    const waterIntensity = waterLayer0.mul(waterLayer1)
    const waterColor = waterIntensity.mul(1.4).mix(color(0x0487e2), color(0x74ccf4))

    // linearDepth() returns the linear depth of the mesh
    const depth = linearDepth()
    const depthWater = viewportLinearDepth.sub(depth)
    const depthEffect = depthWater.remapClamp(-0.002, 0.04)

    const refractionUV = screenUV.add(vec2(0, waterIntensity.mul(0.1)))

    // linearDepth( viewportDepthTexture( uv ) ) return the linear depth of the scene
    const depthTestForRefraction = linearDepth(viewportDepthTexture(refractionUV)).sub(depth)

    const depthRefraction = depthTestForRefraction.remapClamp(0, 0.1)

    const finalUV = depthTestForRefraction.lessThan(0).select(screenUV, refractionUV)

    const viewportTexture = viewportSharedTexture(finalUV)

    const waterMaterial = new THREE.MeshBasicNodeMaterial()
    waterMaterial.colorNode = waterColor
    waterMaterial.backdropNode = depthEffect.mix(
      viewportSharedTexture(),
      viewportTexture.mul(depthRefraction.mix(1, waterColor))
    )
    waterMaterial.backdropAlphaNode = depthRefraction.oneMinus()
    waterMaterial.transparent = true

    const water = new THREE.Mesh(new THREE.BoxGeometry(50, 0.001, 50), waterMaterial)
    water.position.set(0, 0, 0)

    this.water = water
    this.addObject(this.water)
  }

  addProcessing() {
    this.controls?.target.set(0, 0.2, 0)

    // 后期处理
    const { camera, scene, renderer } = this
    const scenePass = pass(scene, camera)
    const scenePassColor = scenePass.getTextureNode()
    const scenePassDepth = scenePass.getLinearDepthNode().remapClamp(0.3, 0.5)

    const waterMask = objectPosition(camera).y.greaterThan(screenUV.y.sub(0.5).mul(camera.near))

    const scenePassColorBlurred = gaussianBlur(scenePassColor)
    scenePassColorBlurred.directionNode = waterMask.select(
      scenePassDepth,
      scenePass.getLinearDepthNode().mul(5)
    )

    const vignette = screenUV.distance(0.5).mul(1.35).clamp().oneMinus()

    const postProcessing = new THREE.PostProcessing(renderer)
    postProcessing.needsUpdate = true

    postProcessing.outputNode = waterMask.select(
      scenePassColorBlurred,
      scenePassColorBlurred.mul(color(0x74ccf4)).mul(vignette)
    )
    this.postProcessing = postProcessing
  }

  addGui() {
    const gui = this.gui

    gui
      .add({ blurBackground: this.blurNode.value }, 'blurBackground', 0, 1, 0.01)
      .name('背景模糊')
      .onChange(value => {
        this.blurNode.value = value
      })

    gui.add(adjustments, 'mix', -1, 2, 0.01).name('混合')
    // gui.add(adjustments, 'procedural', 0, 1, 0.01)
    gui.add(adjustments, 'intensity', 0, 5, 0.01).name('曝光')
    // gui.add(adjustments, 'hue', 0, Math.PI * 2, 0.01).name('色调)
    gui.add(adjustments, 'saturation', 0, 2, 0.01).name('饱和度')

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  animate(): void {
    if (!this.postProcessing) return
    this.postProcessing.renderAsync()

    if (!this.cube2Texture) return
    params.offsetCube1 += 0.001
    params.offsetCube2 += 0.0005
    this.rotateY1Matrix.makeRotationY(params.offsetCube1)
    this.rotateY2Matrix.makeRotationY(params.offsetCube2)
  }

  dispose(): void {
    // this.postProcessing.renderer.dispose()
    this.postProcessing = null
    this.blurNode = null
    this.mixNode = null
    this.proceduralNode = null
    this.intensityNode = null
    this.hueNode = null
    this.saturationNode = null
    this.rotateY1Matrix = null
    this.rotateY2Matrix = null

    this.cube1Texture?.dispose()
    this.cube2Texture?.dispose()
    this.gui = null
    super.dispose()
  }
}
