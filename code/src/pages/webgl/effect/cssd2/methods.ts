import * as THREE from 'three'
import * as ThreeScene from 'three-scene'
import { GUI } from 'dat.gui'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { useSky } from '@/hooks/sky'

const base = import.meta.env.VITE_BEFORE_STATIC_PATH
const { skys } = useSky()
const textureLoader = new THREE.TextureLoader()

const Hooks = ThreeScene.Hooks
const { backgroundLoad } = Hooks.useBackground(base + '/oss/sky/', skys)
const { initCSS2DRender, createCSS2DDom } = Hooks.useCSS2D()

// 创建地球
const EARTH_RADIUS = 50
const createEarth = () => {
  const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 160, 160)
  const earthMaterial = new THREE.MeshPhongMaterial({
    specular: 0x333333,
    shininess: 5,
    map: textureLoader.load(`${base}/oss/textures/planets/earth_atmos_2048.jpg`),
    specularMap: textureLoader.load(`${base}/oss/textures/planets/earth_specular_2048.jpg`),
    normalMap: textureLoader.load(`${base}/oss/textures/planets/earth_normal_2048.jpg`),
    normalScale: new THREE.Vector2(0.85, 0.85)
  })
  const earth = new THREE.Mesh(earthGeometry, earthMaterial)
  earth.name = 'earth'

  const label = createCSS2DDom({
    name: `
      <div class="bg"></div>
      <span class="inner">Earth</span>
    `,
    className: 'dot-2D-label',
    position: [0, EARTH_RADIUS, 0],
    onClick: e => {
      // 注意event的坐标，因为css2dobject是绝对定位 + transform
      console.log('click', e)
      ElMessage.success('click Earth ！')
    }
  })

  earth.add(label)

  return earth
}

// 月球
const MOON_RADIUS = 40
const createMoon = () => {
  const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 160, 160)
  const moonMaterial = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: textureLoader.load(`${base}/oss/textures/planets/moon_1024.jpg`)
  })
  const moon = new THREE.Mesh(moonGeometry, moonMaterial)
  moon.position.set(0, 100, 0)

  const moonDiv = document.createElement('div')
  moonDiv.className = 'dot'
  moonDiv.innerHTML = `
    <div class="bg"></div>
    <span class="inner">Moon</span>
  `
  // 重点,因为css2d渲染器我们设置了pointerEvents = none
  moonDiv.style.pointerEvents = 'auto'
  moonDiv.addEventListener('click', e => {
    // 注意event的坐标，因为css2dobject是绝对定位 + transform
    console.log('click', e)
    ElMessage.success('click Moon ！')
  })

  const moonLabel = new CSS2DObject(moonDiv)
  moonLabel.position.set(0, MOON_RADIUS, 0)
  moon.add(moonLabel)

  return moon
}

export class Css2dScene extends ThreeScene.Scene {
  gui: InstanceType<typeof GUI>

  css2DRender?: InstanceType<typeof Hooks.CSS2DRenderer>
  moon: InstanceType<typeof THREE.Mesh>

  constructor(options: ConstructorParameters<typeof ThreeScene.Scene>[0]) {
    super(options)

    this.createClock()
    backgroundLoad(this, '201')

    this.css2DRender = initCSS2DRender(this.options, this.container)
    this.css2DRender.domElement.className = 'three-scene__dot-wrap'

    const earth = createEarth()
    this.addObject(earth)

    const moon = createMoon()
    this.moon = moon
    this.addObject(moon)

    this.gui = new GUI()
    this.addGui()
  }

  addGui() {
    const gui = this.gui

    const params = {
      display: () => {
        this.scene.children.forEach((obj: any) => {
          if (obj.isMesh) {
            const ele = obj.children.find(it => it.isCSS2DObject)
            ele.visible = !ele.visible
          }
        })
      },
      earth: () => {
        const earth = this.scene.children.find(it => it.name == 'earth')
        if (earth) {
          earth.clear()
          this.scene.remove(earth)
        } else {
          const earth = createEarth()
          this.addObject(earth)
        }
      }
    }

    gui.add(params, 'display').name('隐藏/展示')
    gui.add(params, 'earth').name('删除/添加地球')

    gui.domElement.className += ' gui-wrap'
    this.container.parentNode?.appendChild(gui.domElement)
  }

  resize(): void {
    super.resize()
    const { height, width } = this.options
    this.css2DRender?.setSize(height, width)
  }

  modelAnimate(): void {
    this.css2DRender?.render(this.scene, this.camera)

    // 流失时间
    const elapsed = this.clock?.getElapsedTime() || 0
    this.moon.position.set(Math.sin(elapsed) * 200, 0, Math.cos(elapsed) * 200)
  }

  dispose(): void {
    super.dispose()

    this.css2DRender = void 0
  }
}
