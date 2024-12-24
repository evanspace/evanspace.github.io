<template>
  <div class="page h-100">
    <div ref="containerRef" :class="$style.container"></div>
  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

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
}

const clock = new THREE.Clock()
let moon
const modelAnimate = () => {
  // 动画更新
  TWEEN.update()

  labelRenderer.render(scene, camera)

  const elapsed = clock.getElapsedTime()
  moon && moon.position.set(Math.sin(elapsed) * 200, 0, Math.cos(elapsed) * 200)
}

const bgCode = ref('217')
let labelRenderer

const textureLoader = new THREE.TextureLoader()
const initModel = () => {
  // 背景图
  loadBackground(scene, `${assetsStore.oss}/img/sky/${bgCode.value}`)

  // 渲染开启阴影 ！！！！
  renderer.shadowMap.enabled = true
  // 更加柔和的阴影
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const dom = containerRef.value
  // css 2d 渲染器
  labelRenderer = new CSS2DRenderer()
  // 事件穿透
  labelRenderer.domElement.style.pointerEvents = 'none'
  const width = dom?.clientWidth ?? 0,
    height = dom?.clientHeight ?? 0
  labelRenderer.setSize(width, height)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0px'
  const container = containerRef.value
  container?.appendChild(labelRenderer.domElement)

  createEarth()
  createMoon()
}

// 创建地球
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
  earth.name = 'earth'
  scene.add(earth)

  const earthDiv = document.createElement('div')
  earthDiv.className = 'dot'
  earthDiv.innerHTML = `
    <div class="bg"></div>
    <span class="inner">Earth</span>
  `
  // 重点,因为css2d渲染器我们设置了pointerEvents = none
  earthDiv.style.pointerEvents = 'auto'
  earthDiv.addEventListener('click', e => {
    // 注意event的坐标，因为css2dobject是绝对定位 + transform
    console.log('click', e)
    ElMessage.success('click Earth ！')
  })

  const earthLabel = new CSS2DObject(earthDiv)
  earthLabel.position.set(0, EARTH_RADIUS, 0)
  earth.add(earthLabel)
}

// 月球
const MOON_RADIUS = 40
const createMoon = () => {
  const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 160, 160)
  const moonMaterial = new THREE.MeshPhongMaterial({
    shininess: 5,
    map: textureLoader.load(`${assetsStore.oss}/textures/planets/moon_1024.jpg`)
  })
  moon = new THREE.Mesh(moonGeometry, moonMaterial)
  moon.position.set(0, 100, 0)
  scene.add(moon)

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
}

const addGui = (dom: HTMLElement) => {
  const gui = new GUI()
  const params = {
    background: '217',
    display: () => {
      scene.children.forEach((obj: any) => {
        if (obj.isMesh) {
          const ele = obj.children.find(it => it.isCSS2DObject)
          ele.visible = !ele.visible
        }
      })
    },
    earth: () => {
      console.log(scene)
      const earth = scene.children.find(it => it.name == 'earth')
      if (earth) {
        earth.clear()
        scene.remove(earth)
      } else {
        createEarth()
      }
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

  gui.add(params, 'display').name('隐藏/展示')
  gui.add(params, 'earth').name('删除/添加地球')

  // @ts-ignore
  gui.domElement.style = 'position: absolute; top: 10px; right: 10px'
  dom.appendChild(gui.domElement)
}

const render = () => {
  const dom = <HTMLElement>containerRef.value
  // 渲染器
  renderer = createRender(dom)
  // 相机
  camera = createPerspectiveCamera(dom, 1, 1000000)
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
  --dot-bg-color: #174b6e;
  height: 100%;
  position: relative;
}

$dotColor: #174b6e;
:global {
  :local(.container) {
    .dot {
      color: #fff;
      width: 3px;
      height: 3px;
      cursor: pointer;
      font-size: 1em;
      border-radius: 50%;
      background-color: var(--dot-bg-color);
      .bg {
        left: 1px;
        width: 1px;
        height: 30px;
        bottom: 1px;
        position: absolute;
        background-color: var(--dot-bg-color);
      }
      .inner {
        left: 1px;
        bottom: 30px;
        border: 1px solid var(--dot-bg-color);
        padding: 0.5em;
        position: absolute;
        font-size: 0.86em;
        transform: translateX(-50%);
        white-space: nowrap;
        border-radius: 0.5em;
        background-color: rgba($color: $dotColor, $alpha: 0.45);
      }
    }
  }
}
</style>
