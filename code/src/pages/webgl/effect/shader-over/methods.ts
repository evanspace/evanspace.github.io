import * as THREE from 'three'
import { gsap } from 'gsap'
import * as ThreeScene from 'three-scene'

const base = import.meta.env.VITE_BEFORE_STATIC_PATH

const textureLoader = new THREE.TextureLoader()

const imgs = ['01.jpeg', '02.jpeg', '03.jpg'].map(it => `${base}/oss/textures/effect/${it}`)

const loadImg = (): Promise<any[]> => {
  return new Promise(resolve => {
    const len = imgs.length
    const textures = new Array(len)
    imgs.forEach((src, index) => {
      textureLoader.load(src, texture => {
        textures[index] = texture
        if (textures.filter(Boolean).length === len) {
          resolve(textures)
        }
      })
    })
  })
}

export class NewThreeScene extends ThreeScene.Scene {
  textures: InstanceType<typeof THREE.TextureLoader>[] = []
  material?: InstanceType<typeof THREE.ShaderMaterial>

  isPlaying: boolean = false
  time: number = 0
  move: number = 0
  activeIndex: number = 0

  progress: number = 0
  isComplete: boolean = true

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    return this
  }

  async initModel() {
    this.textures = await loadImg()

    this.addMesh()

    this.play()
    this.change()
  }

  addMesh() {
    const geo = new THREE.PlaneGeometry(1920, 1280)
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

    const mesh = new THREE.Mesh(geo, mat)
    // mesh.rotation.x = -Math.PI * 0.5
    this.material = mat
    this.addObject(mesh)

    this.setTextureSize()
  }

  setTextureSize() {
    if (!this.material) return
    const imageAspect = 1280 / 1920
    const { width, height } = this.options
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
  }
  stop() {
    this.isPlaying = false
  }

  modelAnimate() {
    if (!this.isPlaying) return
    this.time += 0.01
    if (this.material) {
      this.material.uniforms.time.value = this.time
      this.material.uniforms.progress.value = this.progress
    }
  }
}

// 顶点颜色
const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;

  uniform float time;

  void main(){
    gl_FragColor=vec4(vUv,0.,1.);
  }
`

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`
console.log(fragmentShader, vertexShader)
