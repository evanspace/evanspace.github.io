import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'
import { HDRCubeTextureLoader } from 'three/examples/jsm/loaders/HDRCubeTextureLoader.js'
import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture.js'

const base = import.meta.env.VITE_GIT_OSS

const textureLoader = new THREE.TextureLoader().setPath(base + '/textures')

export class ClearcoatScene extends ThreeScene.Scene {
  group = new THREE.Group()
  light = new THREE.Mesh()
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer)
    // 预编译着色器
    // @ts-ignore
    this.pmremGenerator.compileEquirectangularShader()

    new HDRCubeTextureLoader()
      .setPath(base + '/textures/cube/hdr/601/')
      .load(['px.hdr', 'nx.hdr', 'py.hdr', 'ny.hdr', 'pz.hdr', 'nz.hdr'], texture => {
        this.scene.background = texture
        this.scene.environment = this.convertPmremTexture(texture)
        this.addModel()
      })
  }
  createRender() {
    return new THREE.WebGPURenderer(this.options.render)
  }

  render() {
    this.renderer.renderAsync(this.scene, this.camera)
  }

  addModel() {
    const group = this.group
    const geometry = new THREE.SphereGeometry(0.8, 64, 32)

    const diffuse = textureLoader.load('/carbon/Carbon.png')
    diffuse.colorSpace = THREE.SRGBColorSpace
    diffuse.wrapS = THREE.RepeatWrapping
    diffuse.wrapT = THREE.RepeatWrapping
    diffuse.repeat.x = 10
    diffuse.repeat.y = 10

    const normalMap = textureLoader.load('/carbon/Carbon_Normal.png')
    normalMap.wrapS = THREE.RepeatWrapping
    normalMap.wrapT = THREE.RepeatWrapping
    normalMap.repeat.x = 10
    normalMap.repeat.y = 10

    const normalMap2 = textureLoader.load('/water/Water_1_M_Normal.jpg')

    const normalMap3 = new THREE.CanvasTexture(new FlakesTexture())
    normalMap3.wrapS = THREE.RepeatWrapping
    normalMap3.wrapT = THREE.RepeatWrapping
    normalMap3.repeat.x = 10
    normalMap3.repeat.y = 6
    normalMap3.anisotropy = 16

    const normalMap4 = textureLoader.load('/golfball.jpg')

    const clearcoatNormalMap = textureLoader.load(
      '/pbr/Scratched_gold/Scratched_gold_01_1K_Normal.png'
    )

    // 汽车漆
    let material = new THREE.MeshPhysicalMaterial({
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.9,
      roughness: 0.5,
      color: 0x0000ff,
      normalMap: normalMap3,
      normalScale: new THREE.Vector2(0.15, 0.15)
    })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = -1
    mesh.position.y = 1
    group.add(mesh)

    // 纤维
    material = new THREE.MeshPhysicalMaterial({
      roughness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      map: diffuse,
      normalMap: normalMap
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = 1
    mesh.position.y = 1
    group.add(mesh)

    // 高尔夫球
    material = new THREE.MeshPhysicalMaterial({
      metalness: 0.0,
      roughness: 0.1,
      clearcoat: 1.0,
      normalMap: normalMap4,
      clearcoatNormalMap: clearcoatNormalMap,

      //比例被否定以补偿正常的贴图
      clearcoatNormalScale: new THREE.Vector2(2.0, -2.0)
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = -1
    mesh.position.y = -1
    group.add(mesh)

    // 透明图层+法线贴图
    material = new THREE.MeshPhysicalMaterial({
      clearcoat: 1.0,
      metalness: 1.0,
      color: 0xff0000,
      normalMap: normalMap2,
      normalScale: new THREE.Vector2(0.15, 0.15),
      clearcoatNormalMap: clearcoatNormalMap,

      // y scale is negated to compensate for normal map handedness.
      clearcoatNormalScale: new THREE.Vector2(2.0, -2.0)
    })
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = 1
    mesh.position.y = -1
    group.add(mesh)

    this.addObject(group)

    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    this.addObject(light)

    light.add(new THREE.PointLight(0xffffff, 30))

    this.light = light
  }

  modelAnimate(): void {
    const timer = Date.now() * 0.00025

    this.light.position.x = Math.sin(timer * 7) * 3
    this.light.position.y = Math.cos(timer * 5) * 4
    this.light.position.z = Math.cos(timer * 3) * 3

    for (let i = 0; i < this.group.children.length; i++) {
      const child = this.group.children[i]
      child.rotation.y += 0.005
    }
  }
}
