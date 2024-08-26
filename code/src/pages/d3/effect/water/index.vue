<template>
  <div class="page h-100">
    
    <div ref="containerRef" class="container h-100" style="position: relative;"></div>

  </div>
</template>

<script lang="ts" setup>
import * as THREE from 'three'
import * as UTILS from '@/mixins/common'

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

import { Water } from 'three/examples/jsm/objects/Water'
import { Sky } from 'three/examples/jsm/objects/Sky'

import { useAssetsStore } from '@/stores'
const assetsStore = useAssetsStore()

const isDev = import.meta.env.VITE_MODE == 'dev'

const containerRef = ref<HTMLElement>()
// 场景
const scene = new THREE.Scene()
const backgroundColor = '#fff'
// 设置背景色
scene.background = new THREE.Color( backgroundColor )
// 相机
let camera: any
// 渲染器
let renderer: any
// 控件
let controls: any
// 网格
let grid: any

// 创建光源
let ambientLight: any, dirLight: any
const createLight = () => {
  const intensity = 1.5
  // 环境光
  ambientLight = new THREE.AmbientLight( 0xffffff, intensity )
  scene.add( ambientLight )

  // 平行光
  dirLight = UTILS.createDirectionalLight( 0xffffff, intensity )
  // scene.add( dirLight )

  if ( isDev ) {
    const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 1 )
    scene.add( dirLightHelper )
  }
}

// 窗口事件
const windowResize = () => {
  const container = <HTMLElement>containerRef.value
  if ( !camera ) return
  const width = container.clientWidth, height = container.clientHeight
  const k = width / height
  camera.aspect = k
  camera.updateProjectionMatrix()
  renderer.setSize( width, height )
}

let __request_animation_frame_id__
const animate = () => {
  __request_animation_frame_id__ = requestAnimationFrame( animate )

  // 模型动画
  modelAnimate()

  renderer.render( scene, camera )
}

// 模型动画
const modelAnimate = () => {
  // performance-获取当前页面信息api
  // 返回从性能测量开始到现在的毫秒数
  let time = performance.now() * .001

  // 上下浮动效果
  geometryMesh.position.y = Math.sin( time ) * 20 + 5
  // 旋转效果
  geometryMesh.rotation.x = time * .5
  geometryMesh.rotation.z = time * .51

  // 水面波动
  water.material.uniforms[ 'time' ].value += 1 / 60
}



// 系数控制参数
const effectController = reactive<any>( {
  turbidity: 10,   // 浑浊
  rayleigh: 2,     // 视觉效果就是傍晚晚霞的红光的深度
  mieCoefficient: .005,  // 粒子的米氏散射系数
  mieDirectionalG: .2,   // 方向
  elevation: 2,          // 太阳高度
  azimuth: 180,          // 太阳角度
  exposure: null,           // 光晕强度
} )
let pmremGenerator: any
const initModel = () => {

  createWater()
  createSky()

  // 色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMappingExposure = 1

  effectController.exposure = renderer.toneMappingExposure
  // 环境映射
  pmremGenerator = new THREE.PMREMGenerator( renderer )
  sun = new THREE.Vector3()
  updateSkyAndSun()

  addGeometry()
}


// 创建水面
let water: any
const createWater = () => {
  // 创建水面
  const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 )
  water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load( `${ assetsStore.oss }/textures/waternormals.jpg`, texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      } ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    }
  )
  water.rotation.x = - Math.PI / 2
  scene.add( water )
}

// 创建天空
let sky: any
const createSky = () => {
  // 创建天空
  sky = new Sky()
  sky.scale.setScalar( 10000 )
  scene.add( sky )
}

// 更新天空和太阳
let sun: any
const updateSkyAndSun = () => {
  const skyUniforms = sky.material.uniforms

  skyUniforms[ 'turbidity' ].value = effectController.turbidity
  skyUniforms[ 'rayleigh' ].value = effectController.rayleigh
  skyUniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient
  skyUniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG

  const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation )
  const theta = THREE.MathUtils.degToRad( effectController.azimuth )

  // 设置球坐标系
  sun.setFromSphericalCoords( 1, phi, theta )
  // 太阳方位
  sky.material.uniforms[ 'sunPosition' ].value.copy( sun )

  // 太阳方向
  water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize()

  // 场景环境
  scene.environment = pmremGenerator.fromScene( sky ).texture

  // 场景光晕强度
  renderer.toneMappingExposure = effectController.exposure
}

// 添加几何体
let geometryMesh: any
const addGeometry = () => {
  let geometry = new THREE.BoxGeometry( 30, 30, 30 )
  let material: any = new THREE.MeshStandardMaterial( { roughness: 0, color: 0x000555 } ) //  roughness-粗糙度
  geometryMesh = new THREE.Mesh( geometry, material )
  scene.add( geometryMesh )
}

// 添加 GUI
const addGui = ( dom: HTMLElement ) => {
  const gui = <any>new GUI()
  const folderSky = gui.addFolder( 'Sky' )
  folderSky.add( effectController, 'turbidity', 0, 100, .1 ).name( '浑浊' ).onChange( updateSkyAndSun )
  folderSky.add( effectController, 'rayleigh', 0, 4, .001 ).name( '锐利' ).onChange( updateSkyAndSun )
  folderSky.add( effectController, 'mieCoefficient', 0, .1, .001 ).name( '散射系数' ).onChange( updateSkyAndSun )
  folderSky.add( effectController, 'mieDirectionalG', 0, 1, .001 ).name( '方向' ).onChange( updateSkyAndSun )
  folderSky.add( effectController, 'elevation', 0, 90, .1 ).name( '高度' ).onChange( updateSkyAndSun )
  folderSky.add( effectController, 'azimuth', - 180, 180, .1 ).name( '方位' ).onChange( updateSkyAndSun )
  folderSky.add( effectController, 'exposure', 0, 1, .0001 ).name( '光晕强度' ).onChange( updateSkyAndSun )

  const folderWater = gui.addFolder( 'Water' )
  const waterUniforms = water.material.uniforms
  folderWater.add( waterUniforms.distortionScale, 'value', 0, 100, .1 ).name( '变形尺度' )
  folderWater.add( waterUniforms.size, 'value', .1, 10, .1 ).name( '大小' )

  gui.domElement.style = 'position: absolute; top: 10px; right: 10px'
  dom.appendChild( gui.domElement )
}

// 渲染
const render = () => {
  const dom = <HTMLElement>containerRef.value
  // 渲染器
  renderer = UTILS.createRender( dom )
  // 相机
  camera = UTILS.createPerspectiveCamera( dom, 1, 1000000 )
  // 灯光
  createLight()
  // 控制器
  controls = UTILS.createControl( camera, renderer )
  // 右键拖拽
  // controls.enablePan = false
  controls.maxPolarAngle = Math.PI * .45
  // 垂直平移
  controls.screenSpacePanning = false

  // 网格
  if ( isDev ) {
    grid = UTILS.createLayoutGrid()
    scene.add( grid )
  }

  if ( isDev ) {
    // 辅助坐标器
    let axesHelper = new THREE.AxesHelper( 50 )
    scene.add( axesHelper )
  }

  initModel()
  addGui( dom )
}

onMounted( () => {
  render()
  animate()
  window.addEventListener( 'resize', windowResize, false )
} )

onBeforeUnmount( () => {
  // 解绑事件
  window.addEventListener( 'resize', windowResize, false )
  // 停止动画
  cancelAnimationFrame( __request_animation_frame_id__ )
  // 清除场景（不清除会一直占用缓存）
  try {
    scene.clear()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.content = null
    let gl = renderer.domElement.getContext( 'webgl' )
    gl && gl.getExtension( 'WEBGL_lose_context' ).loseContext()
  } catch ( e ) {
    console.log(e)
  }
} )

</script>
  
<style>
</style>