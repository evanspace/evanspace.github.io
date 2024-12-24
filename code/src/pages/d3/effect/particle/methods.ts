// import * as THREE from 'three'
import * as ThreeScene from 'three-scene/build/three-scene.module'
console.log(ThreeScene)

// import { ParticleEngine } from 'three-scene/plugin/particle-engine'
// import { Examples } from './examples'

export class NewThreeScene extends ThreeScene.Scene {
  engine?: any
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)
    // this.createClock()
    // this.addModel()
  }

  addModel() {
    // const engine = new ParticleEngine()
    // engine.setValues(Examples.fountain)
    // engine.initialize()
    // this.engine = engine
    // this.addObject(engine)
  }

  modelAnimate() {
    // const dt = this.clock?.getDelta()

    if (this.engine) {
      // this.engine.update(dt * 0.5)
    }
  }
}
