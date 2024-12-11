import * as THREE from 'three'
import ThreeScene from 'three-scene'

export class NewThreeScene extends ThreeScene {
  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)
  }
}
