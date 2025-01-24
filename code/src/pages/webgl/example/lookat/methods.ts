import * as THREE from 'three'

import * as ThreeScene from 'three-scene'

export class LookatScene extends ThreeScene.Scene {
  target: InstanceType<typeof THREE.Mesh>
  group: InstanceType<typeof THREE.Group>
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.target = new THREE.Mesh(
      new THREE.SphereGeometry(100, 20, 20),
      new THREE.MeshNormalMaterial()
    )
    this.addObject(this.target)

    const group = new THREE.Group()
    this.group = group
    this.addObject(group)

    this.addModel()
  }

  addModel() {
    const geometry = new THREE.CylinderGeometry(0, 10, 100, 12)
    geometry.rotateX(Math.PI * 0.5)

    // 法线网格材质
    const material = new THREE.MeshNormalMaterial()

    for (let i = 0; i < 1000; i++) {
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = Math.random() * 4000 - 2000
      mesh.position.y = Math.random() * 4000 - 2000
      mesh.position.z = Math.random() * 4000 - 2000
      mesh.scale.setScalar(Math.random() * 2 + 1)
      this.group.add(mesh)
    }
  }

  modelAnimate(): void {
    const time = Date.now() * 0.0005

    const target = this.target
    target.position.set(
      Math.sin(time * 0.7) * 1000,
      Math.cos(time * 0.5) * 1000,
      Math.cos(time * 0) * 1000
    )

    this.group.children.forEach(el => {
      const pos = new THREE.Vector3().copy(target.position)
      // pos.setY(el.position.y)
      el.lookAt(pos)
    })
  }
}
