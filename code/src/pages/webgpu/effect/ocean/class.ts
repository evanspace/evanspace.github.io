/**
 * @description:
 * @file: class.ts
 * @author: Evan
 * @date: 2025.06.26 16:03:43
 * @week: 周四
 * @version: V
 */

import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

import { WaterMesh } from 'three/examples/jsm/objects/WaterMesh'
import { SkyMesh } from 'three/examples/jsm/objects/SkyMesh'
import { useSky } from '@/hooks/sky'

const baseUrl = import.meta.env.VITE_GIT_OSS
const { backgroundLoad } = ThreeScene.Hooks.useBackground(baseUrl + '/sky/', useSky().skys)

const parameters = {
  elevation: 2,
  azimuth: 180
}

let pmremGenerator
const sceneEnv = new THREE.Scene()

const sun = new THREE.Vector3()
let renderTarget

export class Scene extends ThreeScene.Scene {
  water?: InstanceType<typeof WaterMesh>
  sky?: InstanceType<typeof SkyMesh>
  gui?: InstanceType<typeof GUI>
  box: InstanceType<typeof THREE.Mesh>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    // 水面
    this.addWater()
    // 天空
    this.addSky()

    const size = 30
    const geo = new THREE.BoxGeometry(size, size, size)
    const mat = new THREE.MeshStandardMaterial({ roughness: 0 /* 粗糙度 */ })

    const box = new THREE.Mesh(geo, mat)
    this.box = box
    this.addObject(box)

    this.gui = new GUI()
    this.addGui()

    backgroundLoad(this, '101')
  }

  addWater() {
    // 水面
    const size = 10000
    const waterGeometry = new THREE.PlaneGeometry(size, size)
    const loader = new THREE.TextureLoader().setPath(baseUrl)
    // 法线贴图
    const waterNormals = loader.load('/textures/waternormals.jpg')
    // 重复
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping

    this.water = new WaterMesh(waterGeometry, {
      // 法线
      waterNormals: waterNormals,
      // 太阳方向
      sunDirection: new THREE.Vector3(),
      // 太阳颜色
      sunColor: 0xffffff,
      // 水面颜色
      waterColor: 0x001e0f,
      // 扭曲大小
      distortionScale: 3
    })

    this.water.rotation.x = -Math.PI * 0.5

    this.addObject(this.water)
  }

  addSky() {
    const sky = new SkyMesh()
    sky.scale.setScalar(10000)
    this.sky = sky
    this.addObject(sky)

    // 浑浊度
    sky.turbidity.value = 10
    // 锐利
    sky.rayleigh.value = 2
    // 光照强度
    sky.mieCoefficient.value = 0.0005
    // 方向系数
    sky.mieDirectionalG.value = 0.8

    const renderer = this.renderer
    pmremGenerator = new THREE.PMREMGenerator(renderer)

    // 更新太阳
    renderer.init().then(() => this.updateSun())
  }
  updateSun() {
    const sky = this.sky

    if (!sky) return
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation)
    const theta = THREE.MathUtils.degToRad(parameters.azimuth)

    // 设置太阳坐标
    sun.setFromSphericalCoords(1, phi, theta)

    sky.sunPosition.value.copy(sun)
    this.water?.sunDirection.value.copy(sun).normalize()

    if (renderTarget !== undefined) renderTarget.dispose()

    sceneEnv.add(sky)
    renderTarget = pmremGenerator.fromScene(sceneEnv)
    this.addObject(sky)
    console.log(this)

    this.scene.environment = renderTarget.texture
  }

  addGui() {
    const gui = this.gui
    if (!gui) return

    const watergroup = gui.addFolder('水面')
    const water = this.water
    // @ts-ignore
    watergroup.addColor(water?.waterColor, 'value').name('水面颜色')
    // @ts-ignore
    watergroup.add(water?.distortionScale, 'value', 0, 10, 0.1).name('倒影扭曲强度')
    // @ts-ignore
    watergroup.add(water?.size, 'value', 0.1, 10, 0.1).name('水面大小')

    const skyGroup = gui.addFolder('天空')
    // skyGroup
    //   .add(parameters, 'elevation', 0, 90, 0.1)
    //   .name('太阳高度')
    //   .onChange(() => this.updateSun())
    skyGroup
      .add(parameters, 'azimuth', -180, 180, 0.1)
      .name('太阳角度')
      .onChange(() => this.updateSun())

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  modelAnimate(): void {
    const ts = performance.now() * 0.001

    this.box.position.y = Math.sin(ts) * 20 + 5
    this.box.rotation.x = ts * 0.5
    this.box.rotation.y = ts * 0.5
  }

  render() {
    this.renderer.renderAsync(this.scene, this.camera)
  }
  createScene() {
    return new THREE.Scene()
  }

  createDirectionalLight(color: string | number, intensity: number) {
    return new THREE.DirectionalLight(color, intensity)
  }

  createAmbientLight(color: string | number, intensity: number) {
    return new THREE.AmbientLight(color, intensity)
  }

  createRender() {
    return new THREE.WebGPURenderer(this.options.render)
  }
}
