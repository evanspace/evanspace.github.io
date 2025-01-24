import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water'

import * as ThreeScene from 'three-scene'

// const Hooks = ThreeScene.Hooks

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const textureload = new THREE.TextureLoader()
const texture = textureload.load(`${base}/oss/textures/effect/sky.jpg`, tx => {
  const repeat = [1, 1]
  tx.wrapT = THREE.RepeatWrapping
  tx.wrapS = THREE.RepeatWrapping
  tx.repeat.x = repeat[0]
  tx.repeat.y = repeat[1]
})

const createWater = () => {
  // 创建水面
  const waterGeometry = new THREE.CircleGeometry(500, 128)
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      base + '/oss/textures/waternormals.jpg',
      texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xf00f00,
    waterColor: 0x01688b,
    distortionScale: 3.5
  })
  water.rotation.x = -Math.PI / 2
  water.rotation.z = Math.PI * 0.05
  water.material.uniforms.size.value = 0.5
  return water
}

export class SkyScene extends ThreeScene.Scene {
  // 水面
  water?: InstanceType<typeof Water>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.addModel()
  }

  addModel() {
    this.water = createWater()
    this.addObject(this.water)

    const spare = new THREE.Mesh(
      new THREE.SphereGeometry(5000, 168, 168, 0, Math.PI * 2, 0, Math.PI * 1),
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
        // transparent: true
        // blending: THREE.AdditiveBlending
        // color: 0x67a8e8
      })
    )

    this.addObject(spare)
  }

  modelAnimate(): void {
    if (texture) {
      texture.offset.x += 0.0002
    }

    // 水面波动
    if (this.water) {
      this.water.material.uniforms['time'].value += 1 / 60
    }
  }
}
