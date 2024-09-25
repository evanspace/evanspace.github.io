import * as THREE from 'three'

import ThreeScene from '../../index'

export class MapThreeScene extends ThreeScene {
  // 波纹板
  corrugatedPlate?: InstanceType<typeof THREE.Mesh>
  // 时间
  clock: InstanceType<typeof THREE.Clock>
  // 地图组
  mapGroup?: InstanceType<typeof THREE.Group>
  // 散点组
  scatterGroup?: InstanceType<typeof THREE.Group>
  // 飞线组
  flywireGroup?: InstanceType<typeof THREE.Group>
  // CSS3D 渲染器
  // css3DRender: InstanceType<typeof CSS3DRenderer>
  // 地图轮廓
  // outline?: ReturnType<typeof createOutline>
  // hover 回调
  // #hoverBack?: (e, position: typeof style) => void
  // 外圈背景
  outRingMesh?: InstanceType<typeof THREE.Mesh>
  // 内圈背景
  innerRingMesh?: InstanceType<typeof THREE.Mesh>
  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)
    console.log(this.options)

    this.clock = new THREE.Clock()

    this.addModel()
  }

  addModel() {
    console.log('--')
  }
}
