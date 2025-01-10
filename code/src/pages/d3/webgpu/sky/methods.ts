import * as THREE from 'three/webgpu'
// import { RGBMLoader } from 'three/examples/jsm/loaders/RGBMLoader'
import * as ThreeScene from 'three-scene'
import { gaussianBlur } from 'three/examples/jsm/tsl/display/GaussianBlurNode'

import { GUI } from 'dat.gui'

const TSL = THREE.TSL

const {
  color,
  vec2,
  pass,
  linearDepth,
  // normalWorld,
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

const createWater = () => {
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
  return water
}

const blurNode = TSL.uniform(0)

const adjustments = {
  mix: 0,
  procedural: 0,
  intensity: 1,
  hue: 0,
  saturation: 1
}

const mixNode = TSL.reference('mix', 'float', adjustments)
const proceduralNode = TSL.reference('procedural', 'float', adjustments)
const intensityNode = TSL.reference('intensity', 'float', adjustments)
const hueNode = TSL.reference('hue', 'float', adjustments)
const saturationNode = TSL.reference('saturation', 'float', adjustments)

const rotateY1Matrix = new THREE.Matrix4()
const rotateY2Matrix = new THREE.Matrix4()

const params = {
  offsetCube1: 0,
  offsetCube2: 0
}

let postProcessing

export class SkyScene extends ThreeScene.Scene {
  // 水面
  water?: any

  cube1Texture: any
  cube2Texture: any

  gui: InstanceType<typeof GUI>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.addModel()

    this.gui = new GUI()
    this.addGui()
  }

  createRender() {
    return new THREE.WebGPURenderer(this.options.render) as any
  }

  getEnvironmentNode = (reflectNode, positionNode) => {
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

  addModel() {
    this.water = createWater()
    this.addObject(this.water)

    // new RGBMLoader().setMaxRange(16).loadCubemap(getBgGroup('228', 'png'), texture => {
    new THREE.CubeTextureLoader().load(getBgGroup('225', 'jpeg'), texture => {
      texture.generateMipmaps = true
      texture.minFilter = THREE.LinearMipmapLinearFilter
      this.cube1Texture = texture

      new THREE.CubeTextureLoader().load(getBgGroup('221', 'jpeg'), texture => {
        texture.generateMipmaps = true
        texture.minFilter = THREE.LinearMipmapLinearFilter
        this.cube2Texture = texture

        // 环境纹理
        this.scene.environmentNode = this.getEnvironmentNode(TSL.reflectVector, TSL.positionWorld)

        // 背景
        this.scene.backgroundNode = this.getEnvironmentNode(
          TSL.positionWorldDirection,
          TSL.positionLocal
        ).context({
          getTextureLevel: () => blurNode
        })
      })
    })

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 64, 32),
      new THREE.MeshStandardMaterial({
        metalness: 1, // 金属度
        roughness: 0 // 粗糙度
      })
    )
    this.addObject(sphere)

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

    postProcessing = new THREE.PostProcessing(renderer)
    postProcessing.outputNode = waterMask.select(
      scenePassColorBlurred,
      scenePassColorBlurred.mul(color(0x74ccf4)).mul(vignette)
    )
  }

  addGui() {
    const gui = this.gui

    gui
      .add({ blurBackground: blurNode.value }, 'blurBackground', 0, 1, 0.01)
      .name('背景模糊')
      .onChange(value => {
        blurNode.value = value
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
    postProcessing.render()
  }

  modelAnimate(): void {
    if (!this.cube2Texture) return
    params.offsetCube1 += 0.001
    params.offsetCube2 += 0.0005
    rotateY1Matrix.makeRotationY(params.offsetCube1)
    rotateY2Matrix.makeRotationY(params.offsetCube2)
  }
}
