import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import * as ThreeScene from 'three-scene'
import { GUI } from 'dat.gui'
import { useSky } from '@/hooks/sky'

import { getData } from './data'

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const { skys } = useSky()
const textureLoader = new THREE.TextureLoader()

const Hooks = ThreeScene.Hooks
const { backgroundLoad } = Hooks.useBackground(base + '/oss/sky/', skys)
const { initCSS3DRender, createCSS3DDom } = Hooks.useCSS3D()

// 创建地球
const EARTH_RADIUS = 50
const createEarth = () => {
  const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 160, 160)
  const earthMaterial = new THREE.MeshPhongMaterial({
    specular: 0x333333,
    shininess: 5,
    map: textureLoader.load(`${base}/oss/textures/planets/earth_atmos_2048.jpg`),
    specularMap: textureLoader.load(`${base}/oss/textures/planets/earth_specular_2048.jpg`),
    normalMap: textureLoader.load(`${base}/oss/textures/planets/earth_normal_2048.jpg`),
    normalScale: new THREE.Vector2(0.85, 0.85)
  })
  const earth = new THREE.Mesh(earthGeometry, earthMaterial)
  earth.name = 'earth'
  return earth
}

const table = getData()
const objects: any[] = []
const targets: any = { table: [], sphere: [], helix: [], grid: [] }
const initElements = scene => {
  objects.length = 0
  Object.keys(targets).forEach(key => {
    targets[key] = []
  })
  // table
  for (let i = 0; i < table.length; i += 5) {
    const objectCSS = createCSS3DDom({
      name: `
        <span class="number">${String(i / 5 + 1)}</span>
        <span class="symbol">${String(table[i])}</span>
        <span class="details">${table[i + 1]}<br>${table[i + 2]}</span>
      `,
      className: 'element',
      position: [
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000,
        Math.random() * 4000 - 2000
      ],
      onClick: true
    })
    objectCSS.element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')'
    scene.add(objectCSS)

    objects.push(objectCSS)

    //
    const object = new THREE.Object3D()
    object.position.x = Number(table[i + 3]) * 140 - 1330
    object.position.y = -(Number(table[i + 4]) * 180) + 990
    targets.table.push(object)
  }

  // sphere
  const vector = new THREE.Vector3()
  for (let i = 0, l = objects.length; i < l; i++) {
    const phi = Math.acos(-1 + (2 * i) / l)
    const theta = Math.sqrt(l * Math.PI) * phi
    const object = new THREE.Object3D()
    object.position.setFromSphericalCoords(800, phi, theta)
    vector.copy(object.position).multiplyScalar(2)
    object.lookAt(vector)
    targets.sphere.push(object)
  }

  // helix
  for (let i = 0, l = objects.length; i < l; i++) {
    const theta = i * 0.175 + Math.PI
    const y = -(i * 8) + 450
    const object = new THREE.Object3D()
    object.position.setFromCylindricalCoords(900, theta, y)
    vector.x = object.position.x * 2
    vector.y = object.position.y
    vector.z = object.position.z * 2
    object.lookAt(vector)
    targets.helix.push(object)
  }

  // grid
  for (let i = 0; i < objects.length; i++) {
    const object = new THREE.Object3D()
    object.position.x = (i % 5) * 400 - 800
    object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800
    object.position.z = Math.floor(i / 25) * 1000 - 2000
    targets.grid.push(object)
  }
}

export class Css3dScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>

  css3DRender?: InstanceType<typeof Hooks.CSS3DRenderer>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    backgroundLoad(this.scene, '201')

    this.css3DRender = initCSS3DRender(this.options, this.container)
    this.css3DRender.domElement.className = 'three-scene__dot-wrap'

    const earth = createEarth()
    this.addObject(earth)

    initElements(this.scene)
    this.transform(targets.table, 2000)

    this.gui = new GUI()
    this.addGui()
  }

  transform(targets, duration) {
    TWEEN.removeAll()
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i]
      const target = targets[i]

      new TWEEN.Tween(object.position)
        .to(
          { x: target.position.x, y: target.position.y, z: target.position.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()

      new TWEEN.Tween(object.rotation)
        .to(
          { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
          Math.random() * duration + duration
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()
    }
    new TWEEN.Tween(window)
      .to({}, duration * 2)
      .onUpdate(() => {
        this.css3DRender?.render(this.scene, this.camera)
      })
      .start()
  }

  addGui() {
    const gui = this.gui

    const params = {
      model: 'table',
      display: () => {
        this.scene.children.forEach((obj: any) => {
          if (obj.isCSS3DObject) {
            obj.visible = !obj.visible
          }
        })
      },
      delete: () => {
        const list = this.scene.children.filter((it: any) => it.isCSS3DObject)
        const len = list.length
        if (len == 0) {
          initElements(this.scene)
          this.transform(targets[params.model], 2000)
          return
        }
        const index = Math.floor(Math.random() * len)
        const obj = list[index]
        obj.clear()
        this.scene.remove(obj)
      }
    }

    gui
      .add(params, 'model')
      .options(['table', 'sphere', 'helix', 'grid'])
      .name('模式')
      .onChange(e => {
        this.transform(targets[e as any], 2000)
      })
    gui.add(params, 'display').name('隐藏/展示')
    gui.add(params, 'delete').name('随机删除')

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  resize(): void {
    super.resize()
    const { height, width } = this.options
    this.css3DRender?.setSize(height, width)
  }

  modelAnimate(): void {
    this.css3DRender?.render(this.scene, this.camera)
  }

  dispose(): void {
    super.dispose()

    this.css3DRender = void 0
  }
}
