import * as THREE from 'three'

import * as ThreeScene from 'three-scene'

import { DragControls } from 'three/examples/jsm/controls/DragControls'

const Hooks = ThreeScene.Hooks
const { insertEvent, destroyEvent } = Hooks.useKeyboardState()
const { pointer, update, raycaster } = Hooks.useRaycaster()

export class DragScene extends ThreeScene.Scene {
  enableSelection = false
  select = new THREE.Group()
  objects: any[] = []
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.addObject(this.select)
    this.addModel()
    this.container.addEventListener('click', this.onClick.bind(this))
  }

  addModel() {
    this.objects = []
    const geometry = new THREE.BoxGeometry()

    for (let i = 0; i < 200; i++) {
      const object = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
      )
      object.position.set(
        Math.random() * 300 - 150,
        Math.random() * 150 - 75,
        Math.random() * 200 - 100
      )
      object.rotation.set(
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI
      )

      object.scale.set(Math.random() * 20 + 10, Math.random() * 20 + 10, Math.random() * 20 + 10)
      object.castShadow = true
      object.receiveShadow = true

      this.objects.push(object)
      this.addObject(object)
    }

    if (!this.controls) return
    ;(this.controls as any).objects = [...this.objects]
  }

  createConstrols() {
    const ctrl = new DragControls([], this.camera, this.renderer.domElement)

    // 拖拽开始
    ctrl.addEventListener('dragstart', el => {
      // 设置发光色
      // @ts-ignore
      // el.object.material.emissive.set(0xaaaaaa)
    })
    // 拖拽结束
    ctrl.addEventListener('dragend', el => {
      // @ts-ignore
      // el.object.material.emissive.set(0x000000)
    })

    // 悬浮
    ctrl.addEventListener('hoveron', _el => {
      // console.log(_el)
    })
    // 悬浮离开
    ctrl.addEventListener('hoveroff', _el => {
      // console.log(_el)
    })

    insertEvent(
      e => {
        // shift 按键
        this.enableSelection = e.keyCode === 16

        // M 按键
        if (e.keyCode === 77) {
          if (!this.controls) return
          // 转换 拖拽或旋转
          this.controls.touches.ONE =
            this.controls?.touches.ONE === THREE.TOUCH.PAN ? THREE.TOUCH.ROTATE : THREE.TOUCH.PAN
        }
      },
      e => {
        this.enableSelection = false
      }
    )

    return ctrl as any
  }

  onClick(e) {
    if (this.enableSelection) {
      // 清空控制对象列表
      // if (this.controls) {
      //   // @ts-ignore
      //   this.controls.objects = []
      // }
      // @ts-ignore
      const draggableObjects = this.controls?.objects
      draggableObjects.length = 0

      update(e, this.container)
      raycaster.setFromCamera(pointer, this.camera)

      const objects = this.objects
      const intersections = raycaster.intersectObjects(objects, true)
      if (intersections.length > 0) {
        const object = intersections[0].object
        console.log(object)
        if (this.select.children.includes(object)) {
          // 发光色
          // @ts-ignore
          object.material.emissive.set(0x000000)
          // 此处不可用 add 会继承父对象的变换属性
          // attach 不受父对象变换影响
          this.scene.attach(object)
        } else {
          // @ts-ignore
          object.material.emissive.set(0xaaaaaa)
          this.select.attach(object)
        }

        console.log(this.select)

        // @ts-ignore
        this.controls.transformGroup = true
        // 添加控制对象
        draggableObjects.push(this.select)
      }

      if (this.select.children.length === 0) {
        // @ts-ignore
        this.controls.transformGroup = false
        draggableObjects.push(...objects)
      }
    }
  }

  dispose(): void {
    destroyEvent()
    super.dispose()
  }
}
