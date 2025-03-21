import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'

const TSL = THREE.TSL

const {
  normalWorld,
  time,
  mx_cell_noise_float,

  mx_fractal_noise_float,
  mx_fractal_noise_vec2,
  mx_fractal_noise_vec3,
  mx_fractal_noise_vec4,

  mx_noise_float,
  mx_noise_vec3,
  mx_noise_vec4,

  mx_worley_noise_float,
  mx_worley_noise_vec2,
  mx_worley_noise_vec3
} = TSL

export class Scene extends ThreeScene.Scene {
  group = new THREE.Group()
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.addObject(this.group)

    this.addModel()
  }

  render() {
    this.renderer.renderAsync(this.scene, this.camera)
  }
  createScene() {
    return new THREE.Scene()
  }

  createDirectionalLight(color: string | number, intensity: number) {
    return new THREE.DirectionalLight(color, intensity)
  }

  createAmbientLight(color: string | number, intensity: number) {
    return new THREE.AmbientLight(color, intensity)
  }

  createRender() {
    return new THREE.WebGPURenderer(this.options.render)
  }

  // 噪波效果
  addNoiseEffect(colorNode, pos: number[]) {
    const size = 10
    const height = size
    const geometry = new THREE.SphereGeometry(size, 64, 32)

    const material = new THREE.MeshPhysicalNodeMaterial()
    material.colorNode = colorNode

    const mesh = new THREE.Mesh(geometry, material)
    const [x, y, z] = pos
    mesh.position.set(x, y + height, z)
    this.group.add(mesh)
  }

  addModel() {
    const gap = 2 * 10 + 5
    const customUV = normalWorld.mul(10).add(time)

    this.addNoiseEffect(mx_cell_noise_float(customUV), [0, 0, 0])

    this.addNoiseEffect(mx_fractal_noise_float(customUV), [gap, 0, 0])

    this.addNoiseEffect(mx_fractal_noise_vec2(customUV), [gap, 0, -gap])

    this.addNoiseEffect(mx_fractal_noise_vec3(customUV.mul(0.2)), [0, 0, -gap])

    this.addNoiseEffect(mx_fractal_noise_vec4(customUV), [-gap, 0, -gap])

    this.addNoiseEffect(mx_noise_float(customUV), [-gap, 0, 0])

    this.addNoiseEffect(mx_noise_vec3(customUV), [-gap, 0, gap])

    this.addNoiseEffect(mx_noise_vec4(customUV), [0, 0, gap])

    this.addNoiseEffect(mx_worley_noise_float(customUV), [gap, 0, gap])

    this.addNoiseEffect(mx_worley_noise_vec2(customUV), [2 * gap, 0, gap])

    this.addNoiseEffect(mx_worley_noise_vec3(customUV), [2 * gap, 0, 0])
  }

  modelAnimate(): void {}
}
