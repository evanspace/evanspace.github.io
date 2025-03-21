import * as THREE from 'three/webgpu'
import * as ThreeScene from 'three-scene'

export class Scene extends ThreeScene.Scene {
  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0], selector) {
    super(options, selector)
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

  addEchartPlane(canvas) {
    console.log(canvas)
    const width = canvas.width
    const height = canvas.height
    console.log(width, height)

    const plane = new THREE.PlaneGeometry(width, height)
    // 画布材质
    const material = new THREE.MeshPhongMaterial({
      map: new THREE.CanvasTexture(canvas),
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(plane, material)
    mesh.position.setY(height / 2)
    this.addObject(mesh)
  }
}
