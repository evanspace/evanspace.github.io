<template>
  <div class="page h-100">
    <div ref="containerRef" :class="$style.container"></div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

import { getData } from './data'

import {
  createRender,
  createPerspectiveCamera,
  createDirectionalLight,
  createControl,
  createLayoutGrid,
  loadBackground
} from '@/mixins/common'

import { useAppStore, useAssetsStore } from '@/stores'

const appStore = useAppStore()
const assetsStore = useAssetsStore()

let timer: any
watch(
  () => appStore.sidebar.opened,
  () => {
    clearTimeout(timer)
    timer = setTimeout(windowResize, 300)
  }
)

const containerRef = ref<HTMLElement>()

// 场景
const scene = new THREE.Scene()
const backgroundColor = '#fff'
// 设置背景色
scene.background = new THREE.Color(backgroundColor)
// 相机
let camera: any
// 渲染器
let renderer: any
// 控件
let controls: any
// 网格
let grid: any

// 创建光源
let ambientLight: any, dirLight: any, dirLight2: any
const createLight = () => {
  const intensity = 1.5
  // 环境光
  ambientLight = new THREE.AmbientLight(0xffffff, intensity)
  scene.add(ambientLight)

  // 平行光
  dirLight = createDirectionalLight(0xffffff, intensity)
  scene.add(dirLight)

  dirLight2 = new THREE.DirectionalLight(0xffffff, intensity)
  dirLight2.position.set(-500, 800, -500)
  scene.add(dirLight2)
  // 跟随镜头
  // camera.add( dirLight2 )
  // scene.add( camera )
}

// 窗口事件
const windowResize = () => {
  const container = containerRef.value
  if (!camera) return
  const width = container?.clientWidth ?? 0,
    height = container?.clientHeight ?? 0
  const k = width / height
  camera.aspect = k
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  labelRenderer && labelRenderer.setSize(width, height)
}

let __request_animation_frame_id__
const animate = () => {
  __request_animation_frame_id__ = requestAnimationFrame(animate)

  // 模型动画
  modelAnimate()

  renderer.render(scene, camera)
  labelRenderer.render(scene, camera)
}

const modelAnimate = () => {
  // 动画更新
  TWEEN.update()
  controls.update()
}

const bgCode = ref('217')
let labelRenderer
const table = getData()
const initModel = () => {
  // 背景图
  loadBackground(scene, `${assetsStore.oss}/img/sky/${bgCode.value}`)

  // 渲染开启阴影 ！！！！
  renderer.shadowMap.enabled = true
  // 更加柔和的阴影
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const dom = containerRef.value
  // css 3d 渲染器
  labelRenderer = new CSS3DRenderer()
  // 事件穿透
  labelRenderer.domElement.style.pointerEvents = 'none'
  const width = dom?.clientWidth ?? 0,
    height = dom?.clientHeight ?? 0
  labelRenderer.setSize(width, height)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0px'

  const container = containerRef.value
  container?.appendChild(labelRenderer.domElement)

  // controls = new TrackballControls( camera, labelRenderer.domElement )
  // controls.addEventListener( 'change', () => {
  //   labelRenderer.render( scene, camera )
  // } )
  initElements()
  createEarth()
}

const objects: any[] = []
const targets: any = { table: [], sphere: [], helix: [], grid: [] }
const initElements = () => {
  objects.length = 0
  Object.keys(targets).forEach(key => {
    targets[key] = []
  })
  // table
  for (let i = 0; i < table.length; i += 5) {
    const element = document.createElement('div')
    element.className = 'element'
    element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')'

    const number = document.createElement('div')
    number.className = 'number'
    number.textContent = String(i / 5 + 1)
    element.appendChild(number)

    const symbol = document.createElement('div')
    symbol.className = 'symbol'
    symbol.textContent = String(table[i])
    element.appendChild(symbol)

    const details = document.createElement('div')
    details.className = 'details'
    details.innerHTML = table[i + 1] + '<br>' + table[i + 2]
    element.appendChild(details)

    const objectCSS = new CSS3DObject(element)
    objectCSS.position.x = Math.random() * 4000 - 2000
    objectCSS.position.y = Math.random() * 4000 - 2000
    objectCSS.position.z = Math.random() * 4000 - 2000
    scene.add(objectCSS)

    objects.push(objectCSS)

    //
    const object = new THREE.Object3D()
    object.position.x = Number(table[i + 3]) * 140 - 1330
    object.position.y = -(Number(table[i + 4]) * 180) + 990
    targets.table.push(object)

    // element.style.pointerEvents = 'auto'
    // element.addEventListener( 'click', e => {
    //   console.log( 'click', e )
    //   ElMessage.success( `${ table[ i ] } (${ table[ i + 1 ] })` )
    // } )
  }

  // sphere
  const vector = new THREE.Vector3()
  for (let i = 0, l = objects.length; i < l; i++) {
    const phi = Math.acos(-1 + (2 * i) / l)
    const theta = Math.sqrt(l * Math.PI) * phi
    const object = new THREE.Object3D()
    object.position.setFromSphericalCoords(800, phi, theta)
    vector.copy(object.position).multiplyScalar(2)
    object.lookAt(vector)
    targets.sphere.push(object)
  }

  // helix
  for (let i = 0, l = objects.length; i < l; i++) {
    const theta = i * 0.175 + Math.PI
    const y = -(i * 8) + 450
    const object = new THREE.Object3D()
    object.position.setFromCylindricalCoords(900, theta, y)
    vector.x = object.position.x * 2
    vector.y = object.position.y
    vector.z = object.position.z * 2
    object.lookAt(vector)
    targets.helix.push(object)
  }

  // grid
  for (let i = 0; i < objects.length; i++) {
    const object = new THREE.Object3D()
    object.position.x = (i % 5) * 400 - 800
    object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800
    object.position.z = Math.floor(i / 25) * 1000 - 2000
    targets.grid.push(object)
  }

  transform(targets.table, 2000)
}

// 创建地球
const textureLoader = new THREE.TextureLoader()
const EARTH_RADIUS = 50
const createEarth = () => {
  const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 160, 160)
  const earthMaterial = new THREE.MeshPhongMaterial({
    specular: 0x333333,
    shininess: 5,
    map: textureLoader.load(`${assetsStore.oss}/textures/planets/earth_atmos_2048.jpg`),
    specularMap: textureLoader.load(`${assetsStore.oss}/textures/planets/earth_specular_2048.jpg`),
    normalMap: textureLoader.load(`${assetsStore.oss}/textures/planets/earth_normal_2048.jpg`),
    normalScale: new THREE.Vector2(0.85, 0.85)
  })
  const earth = new THREE.Mesh(earthGeometry, earthMaterial)
  scene.add(earth)
}

const transform = (targets, duration) => {
  TWEEN.removeAll()
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i]
    const target = targets[i]

    new TWEEN.Tween(object.position)
      .to(
        { x: target.position.x, y: target.position.y, z: target.position.z },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()

    new TWEEN.Tween(object.rotation)
      .to(
        { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z },
        Math.random() * duration + duration
      )
      .easing(TWEEN.Easing.Exponential.InOut)
      .start()
  }
  new TWEEN.Tween(window)
    .to({}, duration * 2)
    .onUpdate(() => {
      labelRenderer.render(scene, camera)
    })
    .start()
}

const addGui = (dom: HTMLElement) => {
  const gui = new GUI()
  const params = {
    background: '217',
    display: () => {
      scene.children.forEach((obj: any) => {
        if (obj.isCSS3DObject) {
          obj.visible = !obj.visible
        }
      })
    },
    model: 'table',
    delete: () => {
      const list = scene.children.filter((it: any) => it.isCSS3DObject)
      const len = list.length
      if (len == 0) {
        initElements()
        return
      }
      const index = Math.floor(Math.random() * len)
      const obj = list[index]
      obj.clear()
      scene.remove(obj)
    }
  }

  gui
    .add(params, 'background')
    .options(['216', '217', '218', '219', '220', '221', '222', '223', '224', '225'])
    .name('切换背景')
    .onChange((e: any) => {
      bgCode.value = e
      // 背景图
      loadBackground(scene, `${assetsStore.oss}/img/sky/${bgCode.value}`)
    })

  gui
    .add(params, 'model')
    .options(['table', 'sphere', 'helix', 'grid'])
    .name('模式')
    .onChange(e => {
      transform(targets[e as any], 2000)
    })

  gui.add(params, 'display').name('隐藏/展示')
  gui.add(params, 'delete').name('随机删除')

  // @ts-ignore
  gui.domElement.style = 'position: absolute; top: 10px; right: 10px'
  dom.appendChild(gui.domElement)
}

// oss 存储地址
const render = () => {
  const dom = <HTMLElement>containerRef.value
  // 渲染器
  renderer = createRender(dom)
  // 相机
  camera = createPerspectiveCamera(dom, 1, 1000000)
  camera.position.set(0, 500, 3000) // 相机位置
  // 灯光
  createLight()
  // 控制器
  controls = createControl(camera, renderer)
  // 右键拖拽
  // controls.enablePan = false
  controls.maxPolarAngle = Math.PI * 0.45
  // 垂直平移
  controls.screenSpacePanning = false

  // 网格
  grid = createLayoutGrid()
  scene.add(grid)

  // 辅助坐标器
  let axesHelper = new THREE.AxesHelper(50)
  scene.add(axesHelper)

  initModel()

  addGui(dom)
}

onMounted(() => {
  render()
  animate()
  window.addEventListener('resize', windowResize, false)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  window.addEventListener('resize', windowResize, false)
  cancelAnimationFrame(__request_animation_frame_id__) // 停止动画
  try {
    scene.clear()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.content = null
    let gl = renderer.domElement.getContext('webgl')
    gl && gl.getExtension('WEBGL_lose_context').loseContext()
  } catch (e) {
    console.log(e)
  }
})
</script>

<style lang="scss" module>
.container {
  height: 100%;
  position: relative;
}

:global {
  :local(.container) {
    .element {
      width: 120px;
      height: 160px;
      border: 1px solid rgba(127, 255, 255, 0.25);
      cursor: default;
      text-align: center;
      box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.5);
      font-family: Helvetica, sans-serif;
      line-height: normal;

      &:hover {
        border: 1px solid rgba(127, 255, 255, 0.75);
        box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.75);
      }

      .number {
        top: 20px;
        color: rgba(127, 255, 255, 0.75);
        right: 20px;
        font-size: 12px;
        position: absolute;
      }

      .symbol {
        top: 40px;
        left: 0px;
        color: rgba(255, 255, 255, 0.75);
        right: 0px;
        position: absolute;
        font-size: 60px;
        font-weight: bold;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.95);
      }

      .details {
        left: 0px;
        color: rgba(127, 255, 255, 0.75);
        right: 0px;
        bottom: 15px;
        font-size: 12px;
        position: absolute;
      }
    }
  }
}
</style>
