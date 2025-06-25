/**
 * @description:
 * @file: class.ts
 * @author: Evan
 * @date: 2025.05.14 15:09:46
 * @week: 周三
 * @version: V
 */

import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'
import { useFence } from './fence'
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode'

const baseUrl = import.meta.env.VITE_GIT_OSS

const { createFence, fenceAnimate } = useFence({
  imgs: [baseUrl + '/textures/station/fance.png']
})

const { pass, mrt, output, float } = THREE.TSL

export class Scene extends ThreeScene.Scene {
  postProcessing: InstanceType<typeof THREE.PostProcessing>

  fence?: THREE.Object3D

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    // 场景合成
    const scenePass = pass(this.scene, this.camera)
    scenePass.setMRT(
      mrt({
        output,
        bloomIntensity: float(0)
      })
    )

    const outputPass = scenePass.getTextureNode()
    const bloomIntensityPass = scenePass.getTextureNode('bloomIntensity')

    const bloomPass = bloom(outputPass.mul(bloomIntensityPass))

    // 色调映射
    this.renderer.toneMapping = THREE.NeutralToneMapping
    const postProcessing = new THREE.PostProcessing(this.renderer)
    postProcessing.outputColorTransform = false
    postProcessing.outputNode = outputPass.add(bloomPass).renderOutput()
    this.postProcessing = postProcessing
  }

  sceneAddModel() {
    const box = new THREE.DodecahedronGeometry(1)
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0.5,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(box, material)
    mesh.position.set(0, 0, 0)
    const size = 10
    mesh.scale.set(size, size, size)
    mesh.position.set(0, size / 2, 0)
    this.addObject(mesh)

    // 围栏
    const fence = createFence(mesh, 0xf00f00, true, THREE, 0.05)
    this.fence = fence
    this.addObject(fence)
  }

  modelAnimate() {
    fenceAnimate(0.5)
  }

  createAmbientLight(color: string | number, intensity: number) {
    return new THREE.AmbientLight(color, intensity)
  }

  createDirectionalLight(color: string | number, intensity: number) {
    return new THREE.DirectionalLight(color, intensity)
  }

  createRender() {
    return new THREE.WebGPURenderer()
  }
  // 渲染
  render() {
    this.postProcessing?.renderAsync()
  }
}
