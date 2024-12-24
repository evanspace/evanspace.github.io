import * as THREE from 'three'
import * as ThreeScene from 'three-scene/build/three-scene.module'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'

import { useModelLoader } from 'three-scene/src/hooks/model-loader'

const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const { loadModel } = useModelLoader({
  baseUrl: base,
  indexDB: {
    cache: false,
    dbName: 'THREE__BLOOM__DB',
    tbName: 'TB',
    version: 1
  }
})

const params = {
  glb: `${base}/oss/model/gltf/PrimaryIonDrive.glb`,
  // glb: `${base}/oss/model/station/楼宇.glb`,
  threshold: 0,
  strength: 1,
  radius: 0,
  exposure: 1
}

export class NewThreeScene extends ThreeScene.Scene {
  bloomPass: InstanceType<typeof UnrealBloomPass> | undefined
  composer: InstanceType<typeof EffectComposer> | undefined
  mixer: InstanceType<typeof THREE.AnimationMixer> | undefined
  clock: InstanceType<typeof THREE.Clock>
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    // 通道：它只会渲染场景，但不会把结果输出到场景
    const renderScene = new RenderPass(this.scene, this.camera)
    const { width, height } = this.options
    // 发光效果(覆盖场景大小 Vector2类型向量，泛光强度，散发半径， 限制物体开始发光的亮度值)
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85)
    // 限制物体开始发光的亮度值
    bloomPass.threshold = params.threshold
    // 泛光强度
    bloomPass.strength = params.strength
    // 散发半径
    bloomPass.radius = params.radius
    this.bloomPass = bloomPass

    // 输出通道
    const outputPass = new OutputPass()

    this.clock = new THREE.Clock()

    // 物体的发光效果
    const composer = new EffectComposer(this.renderer)
    composer.addPass(renderScene)
    composer.addPass(bloomPass)
    composer.addPass(outputPass)
    this.composer = composer

    // 色调映射 (THREE.ReinhardToneMapping 曝光值)
    this.renderer.toneMapping = THREE.ReinhardToneMapping
    this.createGUI()
  }

  initModel() {
    loadModel({
      url: params.glb,
      key: '',
      name: ''
    }).then(model => {
      model.scale.setScalar(50)
      this.addObject(model)

      // 动画
      const mixer = new THREE.AnimationMixer(model)
      const clip = model.animations[0]
      // 优化,播放
      mixer.clipAction(clip.optimize()).play()
      this.mixer = mixer
    })
  }

  createGUI() {
    const gui = new GUI()
    const bloomFolder = gui.addFolder('泛光')
    bloomFolder
      .add(params, 'threshold', 0, 1)
      .name('限制发光值')
      .onChange(v => {
        if (!this.bloomPass) return
        this.bloomPass.threshold = Number(v)
      })
    bloomFolder
      .add(params, 'strength', 0, 3)
      .name('强度')
      .onChange(v => {
        if (!this.bloomPass) return
        this.bloomPass.strength = Number(v)
      })
    bloomFolder
      .add(params, 'radius', 0, 1)
      .step(0.01)
      .name('半径')
      .onChange(v => {
        if (!this.bloomPass) return
        this.bloomPass.radius = Number(v)
      })

    const toneMappingFolder = gui.addFolder('渲染器')
    toneMappingFolder
      .add(params, 'exposure', 0.1, 2)
      .name('亮度')
      .onChange(v => {
        // Math.pow 指数幂
        this.renderer.toneMappingExposure = Math.pow(v, 4)
      })

    // @ts-ignore
    gui.domElement.style = 'position: absolute; top: 10px; right: 10px'
    this.container?.appendChild(gui.domElement)
  }

  animate() {
    if (this.composer) {
      this.composer.render()
    }
    if (this.mixer) {
      const delta = this.clock.getDelta()
      this.mixer.update(delta)
    }
  }
}
