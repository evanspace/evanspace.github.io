import * as THREE from 'three'
import * as ThreeScene from 'three-scene/build/three-scene.module'

import { ParticleEngine } from './particle-engine'
import { Examples } from './examples'

export class NewThreeScene extends ThreeScene.Scene {
  engine?: any
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)
    this.createClock()
    this.addModel()
  }

  addModel() {
    const engine = new ParticleEngine()
    engine.setValues(Examples.rain)
    engine.initialize()
    this.engine = engine
    console.log(engine)
    this.addObject(engine.particleMesh)

    const box = new THREE.BoxGeometry(10, 10, 10)
    const boxMesh = new THREE.Mesh(
      box,
      new THREE.MeshBasicMaterial({
        color: 0xf00f00
      })
    )
    boxMesh.position.x = 50
    this.addObject(boxMesh)
  }

  modelAnimate() {
    const dt = this.clock?.getDelta() as number

    if (this.engine) {
      this.engine.update(dt * 0.5)
    }
  }
}
