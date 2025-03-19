import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 创建方向光
export const createDirectionalLight = (
  color = 0xffffff,
  intensity = 1,
  s = 800,
  size = 2048,
  near = 1,
  far = 2000
) => {
  // 平行光
  const dirLight = new THREE.DirectionalLight(color, intensity)
  dirLight.position.set(500, 800, 500)
  dirLight.castShadow = true
  dirLight.shadow.camera.near = near
  dirLight.shadow.camera.far = far
  dirLight.shadow.camera.right = s
  dirLight.shadow.camera.left = -s
  dirLight.shadow.camera.top = s
  dirLight.shadow.camera.bottom = -s

  dirLight.shadow.mapSize.set(size, size)
  return dirLight
}

// 创建渲染器
export const createRender = (dom: HTMLElement) => {
  const width = dom.clientWidth,
    height = dom.clientHeight
  // 创建渲染对象
  const renderer = new THREE.WebGLRenderer({
    // 是否开启反锯齿，设置为true开启反锯齿
    antialias: true
    // 透明度
    // alpha: true,
  })
  // renderer.setClearAlpha( 0 )

  // 设置渲染尺寸
  renderer.setSize(width, height)
  // 像素比例
  renderer.setPixelRatio(window.devicePixelRatio)
  // 画布插入容器
  dom.appendChild(renderer.domElement)
  return renderer
}

// 创建透视相机
export const createPerspectiveCamera = (dom: HTMLElement, near = 0.1, far = 10000) => {
  // 相机设定
  const width = dom.clientWidth,
    height = dom.clientHeight
  // 透视投影相机对象 参数（现场角度，窗口长宽比，开始渲染位置，结束渲染位置）
  const camera = new THREE.PerspectiveCamera(36, width / height, near, far)
  camera.position.set(-350, 510, 700) // 相机位置
  return camera
}

// 创建控制器
export const createControl = (camera, renderer) => {
  // 创建控件
  const controls = new OrbitControls(camera, renderer.domElement)

  // 最大最小相机移动距离(景深相机)
  controls.minDistance = 0.1
  // controls.maxDistance = 3000

  // 最大仰视角
  controls.maxPolarAngle = Math.PI * 0.495 * 1.1

  // 聚焦坐标
  controls.target.set(0, 20, 0)
  return controls
}

// 创建网格
export const createLayoutGrid = () => {
  // 网格宽度、等分数、中心线颜色、网格颜色
  let grid = new THREE.GridHelper(800, 80, 0xa1a1a1, 0xa1a1a1)
  // grid.visible = false
  grid.material.opacity = 0.3
  grid.material.transparent = true
  return grid
}
