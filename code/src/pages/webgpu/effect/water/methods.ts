import * as THREE from 'three/webgpu'
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
  triplanarTexture,
  texture,
  objectPosition,
  screenUV,
  viewportLinearDepth,
  viewportDepthTexture,
  viewportSharedTexture,
  mx_worley_noise_float,
  positionWorld,
  time
} = TSL

const base = import.meta.env.VITE_GIT_OSS
const textureLoader = new THREE.TextureLoader()
const iceDiffuse = textureLoader.load(`${base}/textures/gpu/water.jpg`)
iceDiffuse.wrapS = THREE.RepeatWrapping
iceDiffuse.wrapT = THREE.RepeatWrapping
iceDiffuse.colorSpace = THREE.NoColorSpace

const iceColorNode = triplanarTexture(texture(iceDiffuse)).add(color(0x0066ff)).mul(0.8)

const material = new THREE.MeshStandardNodeMaterial({ colorNode: iceColorNode })

export class WaterScene extends ThreeScene.Scene {
  postProcessing?: any
  group?: InstanceType<typeof THREE.Group>
  cylinder?: InstanceType<typeof THREE.Mesh>
  gui: InstanceType<typeof GUI>

  floorPosition = new THREE.Vector3(0, 0.2, 0)

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.createClock()

    // 背景
    this.scene.backgroundNode = normalWorld.y.mix(color(0x0487e2), color(0x0066ff))

    this.camera.lookAt(0, 1, 0)

    this.addLight()

    this.group = new THREE.Group()
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

  addLight() {
    const waterAmbientLight = new THREE.HemisphereLight(0x333366, 0x74ccf4, 5)
    const skyAmbientLight = new THREE.HemisphereLight(0x74ccf4, 0, 1)

    this.addObject(skyAmbientLight)
    this.addObject(waterAmbientLight)
  }

  addModel() {
    const count = 100
    const scale = 3.5
    const column = 10

    const group = new THREE.Group()
    const geometry = new THREE.IcosahedronGeometry(1, 3)

    for (let i = 0; i < count; i++) {
      const x = i % column
      const y = i / column

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(x * scale, 0, y * scale)
      mesh.rotation.set(Math.random(), Math.random(), Math.random())
      group.add(mesh)
    }

    group.position.set((column - 1) * scale * -0.5, -1, (count / column) * scale * -0.5)
    this.addObject(group)
    this.group = group
  }

  addWater() {
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
    this.addObject(water)

    // 柱子
    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.1, 10),
      new THREE.MeshStandardNodeMaterial({ colorNode: iceColorNode })
    )
    cylinder.position.set(0, -5, 0)
    this.addObject(cylinder)

    // 水面反光效果
    const waterPosY = positionWorld.y.sub(water.position.y)
    let transition: any = waterPosY.add(0.1).saturate().oneMinus()
    transition = waterPosY.lessThan(0).select(transition, normalWorld.y.mix(transition, 0)).toVar()
    // @ts-ignore
    const colorNode = transition.mix(material.colorNode, material.colorNode?.add(waterLayer0))
    cylinder.material.colorNode = colorNode
    this.cylinder = cylinder
  }

  // 后期处理
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

    gui.add(this.floorPosition, 'y', -1, 1, 0.001).name('移动柱子')

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  animate(): void {
    if (this.postProcessing) {
      this.postProcessing.renderAsync()
    }

    if (this.cylinder) {
      this.cylinder.position.y = this.floorPosition.y - 5
    }

    const delta = this.clock?.getDelta() as number
    // this.controls?.update()

    for (const object of this.group?.children || []) {
      object.position.y = Math.sin((this.clock?.elapsedTime ?? 0) + object.id) * 0.3
      object.rotation.y += delta * 0.3
    }
  }

  dispose() {
    this.disposeObj(this.group)
    this.group = void 0
    super.dispose()
  }
}
