import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'

const { Utils } = ThreeScene

export class Scene extends ThreeScene.Scene {
  group = new THREE.Group()
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0], selector) {
    super(options, selector)

    this.addObject(this.group)
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
    mesh.userData.domElement = canvas
    mesh.userData.data = data
    this.group.add(mesh)
    console.log(this)
  }
}
