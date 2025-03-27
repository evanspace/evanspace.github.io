import * as THREE from 'three'
import { gsap } from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const base = import.meta.env.VITE_GIT_OSS

const imgs = ['01.jpeg', '02.jpeg', '03.jpg'].map(it => `${base}/textures/effect/${it}`)

export class Sketch {
  width: number
  height: number
  aspect: number

  scene: any
  renderer: any
  camera: any
  controls: any

  textures?: any
  material?: any

  isPlaying: boolean = false
  time: number = 0
  move: number = 0
  activeIndex: number = 0

  progress: number = 0
  isComplete: boolean = true
  constructor({ el = document.body }) {
    this.width = el.offsetWidth
    this.height = el.offsetHeight
    this.aspect = this.width / this.height
    console.log(this.aspect)

    this.scene = new THREE.Scene()
    this.renderer = this.createRender()
    this.camera = this.createCamera()
    this.controls = this.createControls()

    // 网格
    const grid = this.createLayoutGrid()
    this.scene.add(grid)

    el.appendChild(this.renderer.domElement)

    const axesHelper = new THREE.AxesHelper(500)
    this.scene.add(axesHelper)
    console.log(this)

    this.init()
    return this
  }

  createRender() {
    const renderer = new THREE.WebGLRenderer({
      // 是否开启反锯齿，设置为true开启反锯齿
      antialias: true,
      // 透明度
      // alpha: true,
      // 设置对数深度缓存
      // 解决 模型相接处或某些区域出现频闪问题或内容被相邻近元素覆盖掉的情况
      logarithmicDepthBuffer: true,
      // 截图设置, true 时性能会下降
      preserveDrawingBuffer: false
    })
    // 渲染顺序
    // 开启后模型可以设置 renderOrder 值，依次渲染
    renderer.sortObjects = true

    // 渲染开启阴影 ！！！！
    renderer.shadowMap.enabled = true
    // THREE.BasicShadowMap 性能很好，但质量很差
    // THREE.PCFShadowMap 性能较差，但边缘更光滑
    // THREE.PCFSoftShadowMap 性能较差，但边缘更柔软
    // THREE.VSMShadowMap 更低的性能，更多的约束，可能会产生意想不到的结果
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    renderer.setSize(this.width, this.height)
    // renderer.setClearColor(background, 1.0)
    this.scene.background = null

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // renderer.setClearColor(background, 1.0)
    return renderer
  }

  createCamera() {
    // let k = this.aspect, s = 700
    // 创建相机对象 参数（左边界，右边界，上边界，下边界，开始渲染位置，结束渲染位置）
    // const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 10000)

    // 透视投影相机对象 参数（现场角度，窗口长宽比，开始渲染位置，结束渲染位置）
    const camera = new THREE.PerspectiveCamera(36, this.aspect, 1, 10000)
    // camera.position.set(-350, 510, 700) // 相机位置
    camera.position.set(0, 0, 2000)
    return camera
  }

  createControls() {
    const ctrs = new OrbitControls(this.camera, this.renderer.domElement)
    const controls = {
      // 是否开启
      visible: true,
      // 阻尼
      enableDamping: false,
      // 阻尼系数，鼠标灵敏度
      dampingFactor: 0.25,
      // 自动旋转
      autoRotate: false,
      // 相机垂直旋转角度的上限
      // maxPolarAngle: Math.PI * 0.46,

      // 缩放
      enableZoom: true,
      // 右键拖拽
      enablePan: true,
      // 垂直平移
      screenSpacePanning: true,
      // 相机距离原点最近距离
      minDistance: 1,
      // 相机距离原点最远距离
      maxDistance: 10000
    }
    Object.keys(controls).forEach(key => {
      ctrs[key] = controls[key]
    })
    // 聚焦坐标
    ctrs.target.set(0, 0, 0)
    return ctrs
  }

  createLayoutGrid = () => {
    // 网格宽度、等分数、中心线颜色、网格颜色
    let grid = new THREE.GridHelper(800, 16, 0xa1a1a1, 0xa1a1a1)
    // grid.visible = false
    grid.material.opacity = 0.3
    grid.material.transparent = true
    return grid
  }

  loader(imgs) {
    return new Promise(resolve => {
      let textureloader = new THREE.TextureLoader()
      let len = imgs.length
      let textures = new Array(len)
      imgs.forEach((img, index) => {
        textureloader.load(img, texture => {
          textures[index] = texture
          if (textures.filter(t => t).length === len) {
            resolve(textures)
          }
        })
      })
    })
  }
  async init() {
    this.textures = await this.loader(imgs)
    this.addMesh()
    this.play()
    this.change()
  }
  addMesh() {
    const geometry = new THREE.PlaneGeometry(1980, 1280)

    const mat = new THREE.ShaderMaterial({
      fragmentShader: `
        varying vec2 vUv;
        varying vec2 vPosition;

        uniform float time;
        uniform float progress;
        uniform vec4 resolution;
        uniform sampler2D t1;
        uniform sampler2D t2;

        void main(){
          vec2 newUV=vec2(vUv-vec2(0.5))*resolution.zw+vec2(.5);
          vec4 tt1=texture2D(t1,newUV);
          vec4 tt2=texture2D(t2,newUV);
          float dist=distance(tt1,tt2)*.5;
          // dist = newUV.x / 2. + .03 * sin(newUV.y*10. + time* 10.) + 0.2;
          float pr=step(dist,progress);
          vec4 final=mix(mix(tt1,tt2,pr),tt2,pr);
          gl_FragColor=final;
        }
      `,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      uniforms: {
        progress: {
          value: 0
        },
        time: {
          value: 0
        },
        resolution: {
          value: new THREE.Vector4()
        },
        t1: {
          value: this.textures[0]
        },
        t2: {
          value: this.textures[1]
        }
      },
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      wireframe: false
    })
    this.material = mat

    this.setTextureSize()

    const mesh = new THREE.Mesh(geometry, mat)
    this.scene.add(mesh)
  }
  setTextureSize() {
    if (!this.material) return
    const imageAspect = 1280 / 1920
    const { width, height } = this
    let a1, a2
    if (height / width > imageAspect) {
      a1 = (width / height) * imageAspect
      a2 = 1
    } else {
      a1 = 1
      a2 = height / width / imageAspect
    }

    this.material.uniforms.resolution.value.x = width
    this.material.uniforms.resolution.value.y = height
    this.material.uniforms.resolution.value.z = a1
    this.material.uniforms.resolution.value.w = a2
  }

  change() {
    if (!this.material) return
    if (!this.isComplete) return
    this.isComplete = false

    this.material.uniforms.t1.value = this.textures[this.activeIndex++]
    this.activeIndex %= this.textures.length

    this.material.uniforms.t2.value = this.textures[this.activeIndex]

    gsap.fromTo(
      this,
      {
        progress: 0
      },
      {
        duration: 2.1,
        delay: 1.2,
        progress: 1,
        onComplete: () => {
          this.isComplete = true
          this.change()
        }
      }
    )
  }

  play() {
    if (this.isPlaying) return
    this.isPlaying = true
    this.render()
  }
  stop() {
    this.isPlaying = false
  }
  render() {
    if (!this.isPlaying) return
    window.requestAnimationFrame(() => {
      this.update()
      this.render()
    })
  }
  update() {
    const { scene, camera } = this
    this.time += 0.01
    if (this.material) {
      this.material.uniforms.time.value = this.time
      this.material.uniforms.progress.value = this.progress
    }
    this.renderer.render(scene, camera)

    if (this.controls) {
      this.controls.update()
    }
  }
}
