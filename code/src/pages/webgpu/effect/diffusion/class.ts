import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode'

const baseUrl = import.meta.env.VITE_BEFORE_STATIC_PATH
const textureLoader = new THREE.TextureLoader()

const { pass, mrt, output, emissive, float } = THREE.TSL

export class Scene extends ThreeScene.Scene {
  group = new THREE.Group()
  // 场景合成渲染器
  postProcessing: InstanceType<typeof THREE.PostProcessing>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    // 场景合成
    this.postProcessing = this.createPostProcessing(this.scene, this.camera, this.renderer)

    this.addObject(this.group)

    this.addModel()

    console.log(this)
  }

  render() {
    this.postProcessing?.renderAsync()
  }

  createRender() {
    return new THREE.WebGPURenderer(this.options.render)
  }

  createPostProcessing = (scene, camera, renderer, isEnv?: boolean) => {
    // 场景合成
    const scenePass = pass(scene, camera)
    if (isEnv) {
      scenePass.setMRT(
        mrt({
          output,
          emissive
        })
      )
    } else {
      scenePass.setMRT(
        mrt({
          output,
          bloomIntensity: float(0.01)
        })
      )
    }

    const outputPass = scenePass.getTextureNode()

    let bloomPass
    if (isEnv) {
      const emissivePass = scenePass.getTextureNode('emissive')
      bloomPass = bloom(emissivePass, 2.5, 0.5)
    } else {
      const bloomIntensityPass = scenePass.getTextureNode('bloomIntensity')
      bloomPass = bloom(outputPass.mul(bloomIntensityPass))
    }

    // 色调映射
    renderer.toneMapping = THREE.NeutralToneMapping
    const postProcessing = new THREE.PostProcessing(renderer)

    if (isEnv) {
      postProcessing.outputNode = outputPass.add(bloomPass)
    } else {
      postProcessing.outputColorTransform = false
      postProcessing.outputNode = outputPass.add(bloomPass).renderOutput()
    }
    return postProcessing
  }

  addModel() {
    const mesh = this.createDiffusion(1, 0x61b9ea)
    mesh.rotation.x = -Math.PI * 0.5
    this.addObject(mesh)
  }

  // 创建扩散波
  createDiffusion(size: number = 1, color?: number | string) {
    const plane = new THREE.PlaneGeometry(size, size)
    // const material = new THREE.MeshPhongMaterial({
    const material = new THREE.MeshBasicNodeMaterial({
      color,
      opacity: 0.8,
      map: textureLoader.load(baseUrl + '/oss/textures/diffusion/101.png'),
      transparent: true,
      depthTest: !false,
      side: THREE.DoubleSide
    })

    material.mrtNode = THREE.TSL.mrt({
      bloomIntensity: THREE.TSL.uniform(1)
    })
    const mesh = new THREE.Mesh(plane, material)

    // 缩放
    const scale = 0.1
    const time = 500
    mesh.scale.setScalar(scale)

    // @ts-ignore
    mesh.tween1 = new TWEEN.Tween({ scale: scale, opacity: 0 })
      .to({ scale: scale + 1.5, opacity: 1 }, time)
      .delay(0)
      .onUpdate(params => {
        let { scale, opacity } = params
        mesh.scale.setScalar(scale)
        mesh.material.opacity = opacity
      })

    // @ts-ignore
    mesh.tween2 = new TWEEN.Tween({ scale: scale + 1.5, opacity: 1 })
      .to({ scale: scale + 2, opacity: 0 }, time)
      .onUpdate(params => {
        let { scale, opacity } = params
        mesh.scale.setScalar(scale)
        mesh.material.opacity = opacity
      })

    // 第一段动画完成后接第二段
    // @ts-ignore
    mesh.tween1.chain(mesh.tween2)
    // 第二段动画完成后接第一段
    // @ts-ignore
    mesh.tween2.chain(mesh.tween1)
    // @ts-ignore
    mesh.tween1.start()
    return mesh
  }

  modelAnimate() {}
}
