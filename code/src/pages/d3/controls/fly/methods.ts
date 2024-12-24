import * as THREE from 'three'
import * as ThreeScene from 'three-scene/build/three-scene.module'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

import { useBackground } from '@/hooks/background'

const { backgroundLoad } = useBackground()

export class NewThreeScene extends ThreeScene.Scene {
  clock: InstanceType<typeof THREE.Clock>
  gui: InstanceType<typeof GUI>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.clock = new THREE.Clock()

    this.addControls()

    this.gui = new GUI()
    this.addGui()
  }

  addControls() {
    const camera = this.camera
    const controls = new FlyControls(camera, this.renderer.domElement)
    // controls.movementSpeed = 1000
    // controls.rollSpeed = Math.PI / 24
    // controls.autoForward = !false
    // controls.dragToLook = false
    // 监听相机变化
    controls.addEventListener('change', () => {
      // console.log('相机位置:', camera.position)
      // console.log('相机方向:', camera.getWorldDirection(new THREE.Vector3()))
    })
    this.controls = controls as any
  }

  addGui() {
    const gui = this.gui
    const ctr = this.controls as any
    console.log(ctr)
    gui.add(ctr, 'movementSpeed', 0.1, 1000).name('移动速度(方向按键、鼠标左右)')
    gui.add(ctr, 'autoForward').name('自动向前')
    gui.add(ctr, 'rollSpeed', 0.001, Math.PI).name('旋转速度')
    gui.add(ctr, 'dragToLook').name('拖拽控制视角')
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

    backgroundLoad(this.scene, '217')
  }

  modelAnimate() {
    const delta = this.clock.getDelta()

    this.controls?.update(delta)
  }
}
