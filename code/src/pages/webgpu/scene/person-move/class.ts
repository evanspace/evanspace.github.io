// import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'

export class Scene extends ThreeScene.Scene {
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)
  }
}
