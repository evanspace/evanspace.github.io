import * as ThreeScene from 'three-scene'

import * as THREE from 'three/webgpu'

import { GUI } from 'dat.gui'

const { uniform, color, atan, PI2, Fn, If, positionLocal, output, frontFacing, vec4 } = THREE.TSL

// 默认材质，分割材质
const defaultMaterial = new THREE.MeshPhysicalNodeMaterial({
  metalness: 0.5,
  roughness: 0.25,
  envMapIntensity: 0.5,
  color: '#858080'
})

const slicedMaterial = new THREE.MeshPhysicalNodeMaterial({
  metalness: 0.5,
  roughness: 0.25,
  envMapIntensity: 0.5,
  color: '#858080',
  side: THREE.DoubleSide
})

const sliceStart = uniform(1.75)
const sliceArc = uniform(1.25)
const sliceColor = uniform(color('#b62f58'))

// 获取角度部分
const inAngle = Fn(([position, angleStart, angleArc]) => {
  const angle = atan(position.y, position.x).sub(angleStart).mod(PI2).toVar()
  return angle.greaterThan(0).and(angle.lessThan(angleArc))
})

// 输出部分
slicedMaterial.outputNode = Fn(() => {
  // 丢弃部分
  inAngle(positionLocal.xy, sliceStart, sliceArc).discard()

  // 切片面 颜色
  const finalOutput = output
  If(frontFacing.not(), () => {
    finalOutput.assign(vec4(sliceColor, 1))
  })

  return finalOutput
})()

// 阴影部分
slicedMaterial.castShadowNode = Fn(() => {
  // 丢弃部分
  inAngle(positionLocal.xy, sliceStart, sliceArc).discard()
  return vec4(0, 0, 0, 1)
})()

export class SlicingScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    const ground = this.createGround(1000, 1000, 0xaaaaaa)
    this.addObject(ground)

    this.gui = new GUI()
    this.addGui()
  }

  render() {
    this.renderer.renderAsync(this.scene, this.camera)
  }

  createRender() {
    return new THREE.WebGPURenderer()
  }

  // 设置环境
  setEnv(texture: InstanceType<typeof THREE.DataTexture>) {
    texture.mapping = THREE.EquirectangularReflectionMapping
    this.scene.environment = texture
    this.scene.background = this.scene.environment
  }

  addModel(model) {
    model.traverse(el => {
      if (el.isMesh) {
        if (el.name === 'outerHull') {
          el.material = slicedMaterial
        } else {
          el.material = defaultMaterial
        }

        el.castShadow = true
        el.receiveShadow = true
      }
    })
    console.log(model)

    this.addObject(model)
  }

  addGui() {
    const gui = this.gui

    gui.add(sliceStart, 'value', -Math.PI, Math.PI, 0.001).name('开始位置')
    gui.add(sliceArc, 'value', 0, Math.PI * 2, 0.001).name('角度')

    gui
      // @ts-ignore
      .addColor({ color: sliceColor.value.getHex() }, 'color')
      // @ts-ignore
      .onChange(value => sliceColor.value.set(value))

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }
}
