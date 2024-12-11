import * as THREE from 'three'
import ThreeScene from 'three-scene'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

export class NewThreeScene extends ThreeScene {
  clock: InstanceType<typeof THREE.Clock>
  gui: InstanceType<typeof GUI>
  transformControls?: InstanceType<typeof TransformControls>

  constructor(options: ConstructorParameters<typeof ThreeScene>[0]) {
    super(options)

    this.clock = new THREE.Clock()

    this.addControls()
    this.initModel()

    this.gui = new GUI()
    this.addGui()
  }

  init() {
    this.initLight()
    this.initGrid()
    this.initAxes()
  }

  addControls() {
    const camera = this.camera
    const controls = new TransformControls(camera, this.renderer.domElement)

    // 监听相机变化
    controls.addEventListener('dragging-changed', e => {
      this.controls.enabled = !e.value
    })

    this.transformControls = controls
    this.addObject(controls)
  }

  addGui() {
    const gui = this.gui
    const control = this.transformControls
    const params = {
      w: () => {
        control.setMode('translate')
      },
      e: () => {
        control.setMode('rotate')
      },
      r: () => {
        control.setMode('scale')
      },

      x: false,
      y: false,
      z: false,

      add: () => {
        control.setSize(control.size + 0.1)
      },
      sub: () => {
        control.setSize(Math.max(control.size - 0.1, 0.1))
      },
      space: false
    }
    const group = gui.addFolder('键盘快捷键')

    group.add(params, 'w').name('“W”切换坐标辅助)')
    group.add(params, 'e').name('“E”切换旋转辅助)')
    group.add(params, 'r').name('“R”切换缩放辅助)')

    group.add(control, 'showX').name('“X”坐标系 x 轴隐显)')
    group.add(control, 'showY').name('“Y”坐标系 y 轴隐显)')
    group.add(control, 'showZ').name('“Z”坐标系 z 轴隐显)')

    group.add(params, 'add').name('“+”,"="坐标系放大)')
    group.add(params, 'sub').name('“-”,"_"坐标系缩小)')
    group.add(control, 'enabled').name('“空格”坐标系禁/启用)')

    gui.domElement.style = 'position: absolute; top: 0px; right: 0px'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  initModel() {
    const geo = new THREE.PlaneGeometry(300, 300)
    const mat = new THREE.MeshStandardMaterial({
      color: 0xb2dbdb,
      shininess: 10
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
      color: 0x137b02,
      shininess: 10
    })
    const boxMesh = new THREE.Mesh(box, boxMat)
    boxMesh.position.y = size / 2
    boxMesh.castShadow = true
    this.addObject(boxMesh)

    // 添加需要变换的网格
    this.transformControls.attach(boxMesh)

    window.addEventListener('keydown', this.onKeydown.bind(this))
    window.addEventListener('keyup', this.onKeyup.bind(this))

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', this.onKeydown.bind(this))
      window.removeEventListener('keyup', this.onKeyup.bind(this))
    })
  }

  modelAnimate() {}

  onKeydown(e) {
    console.log(e, this)
    const control = this.transformControls
    switch (e.key) {
      case 'w':
        control.setMode('translate')
        break

      case 'e':
        control.setMode('rotate')
        break

      case 'r':
        control.setMode('scale')
        break

      case '+':
      case '=':
        control.setSize(control.size + 0.1)
        break

      case '-':
      case '_':
        control.setSize(Math.max(control.size - 0.1, 0.1))
        break

      case 'x':
        control.showX = !control.showX
        break

      case 'y':
        control.showY = !control.showY
        break

      case 'z':
        control.showZ = !control.showZ
        break

      case ' ':
        control.enabled = !control.enabled
        break

      case 'Escape':
        control.reset()
        break
    }
  }

  onKeyup(e) {
    console.log(e)
  }
}
