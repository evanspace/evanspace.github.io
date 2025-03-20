import * as MS from './methods'

const { Utils, THREE } = MS

export class Scene extends MS.Scene {
  group = new THREE.Group()

  // CSS3D 渲染器
  css3DRender?: ReturnType<typeof MS.createCSS3DRender>
  // 点位集合
  dot3EchartsGroup?: InstanceType<typeof THREE.Group>

  constructor(options: ConstructorParameters<typeof MS.Scene>[0], selector) {
    super(options, selector)

    // CSS3D 渲染器
    this.css3DRender = MS.createCSS3DRender(this.options, this.container)

    this.addObject(this.group)
    this.addDot3EchartsGroup()
  }

  // 渲染器
  createRender() {
    const render = new THREE.WebGPURenderer(this.options.render)
    return render
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

  // 渲染
  render() {
    this.renderer.renderAsync(this.scene, this.camera)
  }

  modelAnimate() {
    // css3D 渲染器
    this.css3DRender?.render(this.scene, this.camera)
  }

  addEchartPlane(canvas, data) {
    const obj = this.group.children.find(item => item.userData.data.key === data.key)
    if (obj) {
      this.group.remove(obj)
    }
    const { width, height } = data
    const plane = new THREE.PlaneGeometry(width, height)
    // 画布材质
    const material = new THREE.MeshPhongMaterial({
      map: new THREE.CanvasTexture(canvas),
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(plane, material)
    const { position: PT, rotation: RT } = Utils.get_P_S_R_param(mesh, data)
    mesh.position.set(PT[0], PT[1], PT[2])
    mesh.rotation.set(RT[0], RT[1], RT[2])
    mesh.scale.setScalar(0.08)
    mesh.userData.domElement = canvas
    mesh.userData.data = data
    this.group.add(mesh)
    console.log(this)
  }

  // 添加点位组
  addDot3EchartsGroup() {
    if (!this.css3DRender) return
    this.css3DRender.domElement.className = 'three-scene__dot-wrap'
    const group = new THREE.Group()
    group.name = '点位组3'
    this.dot3EchartsGroup = group
    this.scene.add(group)
  }
  // 添加图表点位
  addDot3Echarts(item: ObjectItem, clickBack?, isSprite?) {
    if (!this.dot3EchartsGroup) return new THREE.Mesh()
    const label = MS.createDotCSS3DEchartsDom(item, clickBack, isSprite)
    this.dot3EchartsGroup.add(label)
    return label
  }

  resize() {
    super.resize()
    const { width, height } = this.options
    this.css3DRender?.setSize(width, height)
  }

  dispose() {
    this.disposeObj(this.dot3EchartsGroup)
    this.dot3EchartsGroup = void 0
    this.css3DRender = void 0
    super.dispose()
  }
}
