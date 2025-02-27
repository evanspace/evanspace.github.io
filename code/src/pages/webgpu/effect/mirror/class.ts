import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

import { reflector, uv, texture, color, uniform } from 'three/tsl'

const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const textureLoader = new THREE.TextureLoader().setPath(base)

// 背面贴图
const backNormal = textureLoader.load('/oss/textures/gpu/FloorsCheckerboard_S_Normal.jpg')
backNormal.wrapS = THREE.RepeatWrapping
backNormal.wrapT = THREE.RepeatWrapping

const groundDiffuse = textureLoader.load('/oss/textures/gpu/decal-diffuse.png')
groundDiffuse.colorSpace = THREE.SRGBColorSpace

const groundNormal = textureLoader.load('/oss/textures/gpu/decal-normal.jpg')

// 法线比例
const groundNormalScale = uniform(-0.08)
const backlNormalScale = uniform(0.1)

export class MirrorScene extends ThreeScene.Scene {
  sphereGroup = new THREE.Group()
  wallGroup = new THREE.Group()
  gui: InstanceType<typeof GUI>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.addModel()
    this.gui = new GUI()
    this.addGui()

    console.log(this)
  }

  createAmbientLight(color: string | number, intensity: number) {
    return new THREE.AmbientLight(color, intensity)
  }

  createDirectionalLight(color: string | number, intensity: number) {
    return new THREE.DirectionalLight(color, intensity)
  }

  render() {
    this.renderer.renderAsync(this.scene, this.camera)
  }

  createRender() {
    return new THREE.WebGPURenderer(this.options.render)
  }

  run() {
    this.renderer.setAnimationLoop(() => {
      this.animate()
      this.modelAnimate()
    })
    return this
  }

  modelAnimate(): void {
    const timer = Date.now() * 0.01
    this.sphereGroup.children.forEach((el, index) => {
      if (index == 0) {
        el.rotation.y -= 0.002
      } else {
        el.position.set(
          // 余弦值
          Math.cos(timer * 0.1) * 30,
          Math.abs(Math.cos(timer * 0.2)) * 20 + 5,
          // 余弦值
          Math.sin(timer * 0.1) * 30
        )
        el.rotateY(0.01)
        el.rotateZ(0.04)
      }
    })
  }

  addModel(): void {
    // 移动对象
    this.addMoveObject()
    // 墙面
    this.addWall()
    // 灯光
    this.addLight()
  }

  addMoveObject() {
    const sphereGroup = this.sphereGroup
    this.addObject(sphereGroup)

    // 圆柱体（顶部半径、底部半径、高度、侧面分段、高度分段）
    let geometry: any = new THREE.CylinderGeometry(
      0.1,
      15 * Math.cos((Math.PI / 180) * 30),
      0.1,
      24,
      1
    )
    let material: any = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x8d8d8d })
    const sphereCap = new THREE.Mesh(geometry, material)
    sphereCap.position.y = -15 * Math.sin((Math.PI / 180) * 30) - 0.05
    sphereCap.rotateX(-Math.PI)

    // 球形（半径、水平分段、垂直分段水平起始角度、水平角度大小、垂直起始角度、垂直角度大小）
    geometry = new THREE.SphereGeometry(
      15,
      24,
      24,
      Math.PI / 2,
      Math.PI * 2,
      0,
      (Math.PI / 180) * 120
    )
    const halfSphere = new THREE.Mesh(geometry, material)
    halfSphere.add(sphereCap)
    halfSphere.rotateX((-Math.PI / 180) * 135)
    halfSphere.rotateZ((-Math.PI / 180) * 20)
    halfSphere.position.y = 7.5 + 15 * Math.sin((Math.PI / 180) * 30)

    sphereGroup.add(halfSphere)

    // 20面几何体（半径、增加顶点）
    geometry = new THREE.IcosahedronGeometry(5, 0)
    material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x7b7b7b,
      flatShading: true
    })
    const smallSphere = new THREE.Mesh(geometry, material)
    sphereGroup.add(smallSphere)
  }

  addWall() {
    if (this.wallGroup) {
      this.disposeObj(this.wallGroup)
    }
    const group = new THREE.Group()
    this.wallGroup = group
    this.addObject(group)

    const planeGeo = new THREE.PlaneGeometry(100.1, 100.1)

    // 反射器
    const groundReflector = reflector()
    const groundUVOffset = texture(groundNormal).xy.mul(2).sub(1).mul(groundNormalScale)
    const groundNode = texture(groundDiffuse).a.mix(color(0xffffff), groundReflector)
    // @ts-ignore
    groundReflector.uvNode = groundReflector.uvNode.add(groundUVOffset)
    // 下
    const planeBottom = new THREE.Mesh(
      planeGeo,
      new THREE.MeshPhongNodeMaterial({
        colorNode: groundNode
      })
    )
    planeBottom.rotateX(-Math.PI / 2)
    planeBottom.add(groundReflector.target)
    group.add(planeBottom)

    // 反射器
    let backlReflector = reflector()
    // 后
    const backlUVOffset = texture(backNormal, uv().mul(5)).xy.mul(2).sub(1).mul(backlNormalScale)
    const backlNode = color(0x0000ff).mul(0.1).add(backlReflector)
    // @ts-ignore
    backlReflector.uvNode = backlReflector.uvNode.add(backlUVOffset)

    const planeBack = new THREE.Mesh(
      planeGeo,
      new THREE.MeshPhongNodeMaterial({
        colorNode: backlNode
      })
    )
    planeBack.position.z = -50
    planeBack.position.y = 50
    planeBack.add(backlReflector.target)
    group.add(planeBack)

    // 上
    const planeTop = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0xffffff }))
    planeTop.position.y = 100
    planeTop.rotateX(Math.PI / 2)
    group.add(planeTop)

    // 前
    const planeFront = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0x7f7fff }))
    planeFront.position.z = 50
    planeFront.position.y = 50
    planeFront.rotateY(Math.PI)
    group.add(planeFront)

    // 右
    const planeRight = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0x00ff00 }))
    planeRight.position.x = 50
    planeRight.position.y = 50
    planeRight.rotateY(-Math.PI / 2)
    group.add(planeRight)

    // 左
    const planeLeft = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0xff0000 }))
    planeLeft.position.x = -50
    planeLeft.position.y = 50
    planeLeft.rotateY(Math.PI / 2)
    group.add(planeLeft)
  }

  addLight() {
    const mainLight = new THREE.PointLight(0xe7e7e7, 2.5, 250, 0)
    mainLight.position.y = 60
    const helper = new THREE.PointLightHelper(mainLight)
    this.addObject(mainLight, helper)
  }

  addGui() {
    const gui = this.gui

    gui.add(groundNormalScale, 'value', -1, 0).step(0.001).name('地面法线比例')
    gui.add(backlNormalScale, 'value', 0, 1).step(0.001).name('背面法线比例')

    const light = this.scene.getObjectByProperty('type', 'PointLight') as THREE.PointLight
    if (light) {
      gui
        .addColor(light, 'color')
        .name('灯光颜色')
        .onChange(() => {
          const helper = this.scene.getObjectByProperty(
            'type',
            'PointLightHelper'
          ) as THREE.PointLightHelper
          helper.update()
        })
    }

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }
}
