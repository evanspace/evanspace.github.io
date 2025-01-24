import * as THREE from 'three'
import * as ThreeScene from 'three-scene'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

export class NewThreeScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.gui = new GUI()
    this.addGui()
  }

  addGui() {
    const gui = this.gui
    const ctr = this.controls as any
    console.log(ctr)
    if (!ctr) return

    gui.add(ctr, 'autoRotate').name('自动旋转')
    gui.add(ctr, 'autoRotateSpeed', 0.1, 30).name('自动旋转速度')
    gui.add(ctr, 'enableDamping').name('阻尼（惯性）')
    gui.add(ctr, 'dampingFactor', 0, 1).name('阻尼系数')
    gui.add(ctr, 'enablePan').name('相机平移')
    gui.add(ctr, 'enableRotate').name('旋转')
    gui.add(ctr, 'enableZoom').name('缩放')
    gui.add(ctr, 'keyPanSpeed', 1, 100).name('按键平移速度')

    gui.add(ctr, 'maxAzimuthAngle', -Math.PI, Math.PI).name('旋转角度上限')
    gui.add(ctr, 'minAzimuthAngle', -Math.PI, Math.PI).name('旋转角度下限')

    gui.add(ctr, 'minDistance', 1, 1000).name('相机最近距离')
    gui.add(ctr, 'maxDistance', 1, 10000).name('相机最远距离')
    gui.add(ctr, 'minPolarAngle', 0, Math.PI).name('垂直角度下限')
    gui.add(ctr, 'maxPolarAngle', 0, Math.PI).name('垂直角度上限')
    gui.add(ctr, 'maxTargetRadius', 0, 1000).name('目标移动半径')

    // 正交相机
    // gui.add(ctr, 'maxZoom', 0, 20).name('相机缩小限制')
    // gui.add(ctr, 'minZoom', 0, 40).name('相机放大限制')

    gui.add(ctr, 'rotateSpeed', 0, 10).name('旋转速度')
    gui.add(ctr, 'screenSpacePanning').name('空间内平移/垂直平面平移')
    gui.domElement.style.position = 'absolute'
    gui.domElement.style.top = 'opx'
    gui.domElement.style.right = 'opx'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  initModel() {
    const geo = new THREE.PlaneGeometry(300, 300)
    const mat = new THREE.MeshStandardMaterial({
      color: 0xb2dbdb
      // shininess: 10
    })
    const ground = new THREE.Mesh(geo, mat)
    ground.name = 'ground'
    ground.rotation.x = Math.PI * 1.5
    // 接收阴影
    ground.receiveShadow = true
    this.addObject(ground)

    const size = 50
    const box = new THREE.BoxGeometry(size, size, size)
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x137b02
      // shininess: 10
    })
    const boxMesh = new THREE.Mesh(box, boxMat)
    boxMesh.position.y = size / 2
    boxMesh.castShadow = true
    this.addObject(boxMesh)
  }
}
