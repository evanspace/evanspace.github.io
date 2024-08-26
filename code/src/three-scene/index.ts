import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { deepMerge, isDOM } from './utils'
import defOptions from './options'

export default class ThreeScene {
  // 配置
  options: import('./types').Options
  // 容器
  container: HTMLElement
  // 场景
  scene: InstanceType<typeof THREE.Scene>
  // 相机
  camera: InstanceType<typeof THREE.PerspectiveCamera>
  // 渲染器
  renderer: InstanceType<typeof THREE.WebGLRenderer>
  // 控制器
  controls: InstanceType<typeof OrbitControls>
  // 动画 id
  animationId: number | undefined

  constructor(options: import('./types').Params = {}) {
    // 默认配置
    const defaultOpts = defOptions
    // 配置
    this.options = deepMerge(defaultOpts, options)

    // 容器
    if (isDOM(this.options.container)) {
      this.container = this.options.container as HTMLElement
    } else {
      this.container = document.querySelector(this.options.container as string) as HTMLElement
    }

    this.options.width = this.container.offsetWidth
    this.options.height = this.container.offsetHeight
    this.scene = new THREE.Scene()

    this.init()
  }

  init() {
    this.initRenderer()
    this.initLight()
    this.initGrid()
    this.initAxes()
    this.initModel()
    this.initCamera()
    this.initControls()
  }

  // 运行
  run() {
    this.loop()
  }

  // 循环
  loop() {
    this.animationId = window.requestAnimationFrame(() => {
      this.loop()
    })
    this.animate()
    this.modelAnimate()
  }

  animate() {
    if (this.renderer) {
      this.renderer.render(this.scene, this.camera)
    }
    // 控制相机旋转缩放的更新
    if (this.options.controls.visible) this.controls.update()

    TWEEN.update()
  }

  initModel() {
    // 业务代码
  }
  modelAnimate() {}

  // 渲染器
  initRenderer() {
    const { width, height, bgColor } = this.options
    // 创建渲染对象
    const renderer = new THREE.WebGLRenderer({
      // 是否开启反锯齿，设置为true开启反锯齿
      antialias: true
      // 透明度
      // alpha: true,
    })
    // renderer.setClearAlpha( 0 )

    // 背景色
    this.setBgColor(bgColor)

    if (this.options.fog.visible) {
      const { color, near, far } = this.options.fog
      this.scene.fog = new THREE.Fog(color ?? this.scene.background, near, far)
    }

    // 渲染开启阴影 ！！！！
    renderer.shadowMap.enabled = true
    // 更加柔和的阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // 设置渲染尺寸
    renderer.setSize(width, height)
    // 设置canvas的分辨率
    renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer = renderer
    // 画布插入容器
    this.container.appendChild(renderer.domElement)
  }

  // 灯光
  initLight() {
    const { ambientLight, directionalLight, lightHelperVisible } = this.options
    // 环境光
    if (ambientLight.visible) {
      const ambLight = new THREE.AmbientLight(ambientLight.color, ambientLight.intensity)
      this.addObject(ambLight)
    }
    // 平行光
    if (directionalLight.visible) {
      const direLight = this.createDirectionalLight()
      this.addObject(direLight)
      if (lightHelperVisible) {
        const dirLightHelper = new THREE.DirectionalLightHelper(direLight, 1)
        this.addObject(dirLightHelper)
      }

      if (directionalLight.light2) {
        const dirLight2 = this.createDirectionalLight()
        dirLight2.position.set(-500, 800, -800)
        this.addObject(dirLight2)
        if (lightHelperVisible) {
          const dirLigh2tHelper = new THREE.DirectionalLightHelper(dirLight2, 1)
          this.addObject(dirLigh2tHelper)
        }
      }
    }
  }

  // 创建平行光
  createDirectionalLight(s = 800, size = 4096, near = 1, far = 2000) {
    const { color, intensity } = this.options.directionalLight
    // 平行光
    const dirLight = new THREE.DirectionalLight(color, intensity)
    dirLight.position.set(500, 800, 800)
    dirLight.castShadow = true
    // 设置阴影贴图模糊度
    dirLight.shadow.camera.radius = 10
    dirLight.shadow.camera.near = near
    dirLight.shadow.camera.far = far
    dirLight.shadow.camera.top = s
    dirLight.shadow.camera.right = s
    dirLight.shadow.camera.left = -s
    dirLight.shadow.camera.bottom = -s
    dirLight.shadow.mapSize.set(size, size)
    return dirLight
  }

  // 相机
  initCamera() {
    const { width, height, camera } = this.options
    // 透视投影相机对象 参数（现场角度，窗口长宽比，开始渲染位置，结束渲染位置）
    const cam = new THREE.PerspectiveCamera(36, width / height, camera.near, camera.far)
    // 相机位置
    cam.position.set(...camera.position)
    this.camera = cam
    this.addObject(cam)
  }

  // 控制器
  initControls() {
    const controls = this.options.controls
    if (!controls.visible) return
    // 创建控件
    const ctrl = new OrbitControls(this.camera, this.renderer.domElement)
    Object.keys(controls).forEach(key => {
      ctrl[key] = controls[key]
    })
    // 聚焦坐标
    ctrl.target.set(0, 0, 0)
    this.controls = ctrl
  }

  // 网格
  initGrid() {
    const grid = this.options.grid
    if (!grid.visible) return
    // 网格宽度、等分数、中心线颜色、网格颜色
    let gd = new THREE.GridHelper(800, 80, 0xa1a1a1, 0xa1a1a1)
    // grid.visible = false
    gd.material.opacity = grid.opacity
    gd.material.transparent = grid.transparent
    this.addObject(gd)
  }

  // 坐标辅助器
  initAxes() {
    if (!this.options.axes.visible) return
    // 辅助坐标器
    let axesHelper = new THREE.AxesHelper(this.options.axes.size)
    this.addObject(axesHelper)
  }

  // 设置背景
  setBgColor(color: number | string) {
    this.scene.background = color ? new THREE.Color(color) : null
  }

  // 添加对象到场景
  addObject(object: object | object[]) {
    if (Array.isArray(object)) {
      this.scene.add(...object)
    } else {
      this.scene.add(object)
    }
  }

  // 重置画布大小
  resize() {
    if (!this.camera) return
    // 重新设置宽高
    this.options.width = this.container.offsetWidth || window.innerWidth
    this.options.height = this.container.offsetHeight || window.innerHeight

    const { width, height } = this.options
    const k = width / height
    this.camera.aspect = k
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  // 停止动画
  stopAnimate() {
    window.cancelAnimationFrame(this.animationId as number)
  }

  // 清除对象
  clear = obj => {
    if (!obj || !obj.traverse) return
    obj.traverse(el => {
      if (el.material) el.material.dispose()
      if (el.geometry) el.geometry.dispose()
      el?.clear()
    })
    obj?.clear()
  }

  // 销毁
  dispose() {
    try {
      this.scene.clear()
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      this.renderer.content = null
      let gl = this.renderer.domElement.getContext('webgl')
      gl && gl.getExtension('WEBGL_lose_context').loseContext()
    } catch (e) {
      console.log(e)
    }
  }
}
