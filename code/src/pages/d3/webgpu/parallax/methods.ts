import * as THREE from 'three/webgpu'

import * as ThreeScene from 'three-scene'

const { uniform, texture, parallaxUV, uv, blendOverlay } = THREE.TSL

const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const textureLoader = new THREE.TextureLoader().setPath(`${base}/oss/textures/gpu/`)

const parallaScale = uniform(0.3)

const { backgroundLoad } = ThreeScene.Hooks.useBackground()

export class ParallaxScene extends ThreeScene.Scene {
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)
  }

  async initModel() {
    // 顶部贴图
    const topTexture = await textureLoader.loadAsync('Ice002_1K-JPG_Color.jpg')
    topTexture.colorSpace = THREE.SRGBColorSpace

    // 粗糙度贴图
    const roughnessTexture = await textureLoader.loadAsync('Ice002_1K-JPG_Roughness.jpg')
    roughnessTexture.colorSpace = THREE.NoColorSpace

    // 法线
    const normalTexture = await textureLoader.loadAsync('Ice002_1K-JPG_NormalGL.jpg')
    normalTexture.colorSpace = THREE.NoColorSpace

    // 置换
    const displaceTexture = await textureLoader.loadAsync('Ice002_1K-JPG_Displacement.jpg')
    displaceTexture.colorSpace = THREE.NoColorSpace

    // 底部贴图
    const bottomTexture = await textureLoader.loadAsync('Ice003_1K-JPG_Color.jpg')
    bottomTexture.colorSpace = THREE.SRGBColorSpace
    bottomTexture.wrapS = THREE.RepeatWrapping
    bottomTexture.wrapT = THREE.RepeatWrapping

    // 视差效果
    // 偏差贴图
    const offsetUv = texture(displaceTexture).mul(parallaScale)
    // 视差贴图偏差
    const parallaxUVOffset = parallaxUV(uv(), offsetUv)
    const parallaxResult = texture(bottomTexture, parallaxUVOffset)

    const iceNode = blendOverlay(texture(topTexture), parallaxResult)

    const material = new THREE.MeshStandardNodeMaterial({
      colorNode: iceNode.mul(5), // 颜色强度增加到
      roughnessNode: texture(roughnessTexture),
      normalMap: normalTexture,
      metalness: 0
    })

    const geometry = new THREE.BoxGeometry(10, 10, 10)
    const ground = new THREE.Mesh(geometry, material)
    ground.rotateX(-Math.PI / 2)
    ground.scale.setScalar(40)
    this.addObject(ground)

    backgroundLoad(this.scene, '226')
    // @ts-ignore
    this.scene.environment = this.scene.background
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
}
