import * as THREE from 'three'
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'
// import TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { LoaderUtils } from 'three/src/loaders/LoaderUtils'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// import { TGALoader } from 'three/examples/jsm/loaders/TGALoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'

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

// 创建方向光
export const createDirectionalLight = (color = 0xffffff, intensity = 1, s = 800, size = 2048, near = 1, far = 2000) => {
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

// 加载背景图
export const loadBackground = (scene, baseUrl) => {
  let loader = new THREE.CubeTextureLoader()
  let env = loader.load([
    `${baseUrl}/posX.jpeg`,
    `${baseUrl}/negX.jpeg`,
    `${baseUrl}/posY.jpeg`,
    `${baseUrl}/negY.jpeg`,
    `${baseUrl}/posZ.jpeg`,
    `${baseUrl}/negZ.jpeg`
  ])
  // 设置背景
  scene.background = env
}

interface ToVx {
  x: number
  y: number
  z: number
}
// 相机入场动画
export const cameraInSceneAnimate = (camera: any, to: ToVx, at: ToVx) => {
  camera.lookAt(at)
  return new Promise(resolve => {
    new TWEEN.Tween(camera.position)
      .to(to, 1000)
      .easing(TWEEN.Easing.Quadratic.In)
      .start()
      .onUpdate(() => {
        // 设置相机对焦位置
        camera.lookAt(at)
      })
      .onComplete(() => {
        resolve(camera)
      })
  })
}

// 材质优化 材质、是否反光、是否粗糙
export const materialOptimize = (mat: any, glisten?: boolean, side?: boolean) => {
  if (mat instanceof Array) {
    let material = mat.map(mt => {
      return materialOptimize(mt, glisten, side)
    })
    mat = material
  } else {
    if (!glisten) {
      // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
      // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
      mat.metalness = 0.5
      // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
      mat.roughness = 0.9
    } else {
      // mat.side = THREE.DoubleSide
      mat.metalness = 0.5
      mat.roughness = 0
    }
    // child.material.emissiveMap = child.material.map
    mat = new THREE.MeshStandardMaterial({
      color: mat.color, // 颜色
      map: mat.map, // 贴图
      emissive: mat.emissive || mat.color, // 发光
      emissiveIntensity: mat.emissiveIntensity,
      emissiveMap: mat.emissiveMap,
      bumpMap: mat.bumpMap, // 凹凸
      normalMap: mat.normalMap, // 法线
      displacementMap: mat.displacementMap, // 移动
      opacity: mat.opacity, // 透明度
      transparent: mat.transparent, // 透明
      metalness: mat.metalness, // 金属度
      roughness: mat.roughness, // 粗糙度
      side: side ? THREE.DoubleSide : THREE.FrontSide // 材质渲染面
    })
  }
  return mat
}

interface ReplaceOpts {
  // 转换材质
  transformMaterial: boolean
  // 材质反光
  glisten: boolean
  // 地面反光
  groundReflection: boolean
  // 双面
  side: boolean
  // 透明外壳
  opacitySkin: boolean
  // 透明度
  opacity: number
}

export const changeTransparent = (mode, opacity = 0.5) => {
  // 改变透明度
  const change = mesh => {
    mesh.material.transparent = true
    mesh.material.opacity = opacity
  }
  if (mode.isMesh) {
    change(mode)
  } else {
    mode.traverse(mode => {
      if (mode.isMesh) {
        change(mode)
      }
    })
  }
}

// 材质替换  动画部分材质颜色
export const materialReplace = (opts: ReplaceOpts, child, color = 0x127e12) => {
  const meshNames = [
    '螺杆A',
    '螺杆B',
    '螺杆A001',
    '螺杆B001',
    '螺杆A002',
    '螺杆B002',
    '叶轮A',
    '叶轮B',
    '叶轮C',
    '阀门'
  ]
  const { type, name } = child
  // 灯光
  if (type.indexOf('Light') > -1) {
  }
  if (opts.opacitySkin && /[透明外壳]/.test(name)) {
    changeTransparent(child, opts.opacity)
  }
  if (!opts.transformMaterial) return

  const base = ['楼板', '地面', '底座', '基础', '基础底座', '冷却塔基础']
  if (base.find(it => name.indexOf(it) > -1)) {
    // 接收阴影
    child.receiveShadow = true
    const glisten = name == '地面' ? opts.groundReflection : false
    child.material = materialOptimize(child.material, glisten, opts.side)
  } else if (meshNames.find(it => name.indexOf(it) > -1)) {
    // 动画材质
    let material = new THREE.MeshStandardMaterial({
      color: color,
      // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
      // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
      metalness: 0.6,
      // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
      roughness: 0.6
    })
    child.material = material
  } else if (child.isMesh) {
    child.castShadow = true
    // let nameArr = [ '墙体', '外墙' ]
    // if ( nameArr.includes( child.name ) ) return

    child.material = materialOptimize(child.material, opts.glisten, opts.side)
  }
}

// 导出坐标
export const exportPoints = (list: Array<any>) => {
  let text = <Array<string>>[]
  let points = list.map((el: any) => {
    let p = <any>el.position
    // text.push( `${ el.name }： ${ p.x.toFixed(1) * 1 }, ${ p.y.toFixed(1) * 1 }, ${ p.z.toFixed(1) * 1 }` )
    text.push(`${el.name}：{ "x": ${p.x.toFixed(1) * 1}, "y": ${p.y.toFixed(1) * 1}, "z": ${p.z.toFixed(1) * 1} },`)

    return `new THREE.Vector3( ${p.x}, ${p.y}, ${p.z} )`
  })
  console.log(points)

  const ptx = '\n' + text.join('\n')
  console.log(ptx)
}

// 上传文件
const env = import.meta.env
const beforePath = env.VITE_BEFORE_STATIC_PATH
export const uploadFile = (files: any, onSuccess: Function, onProgress?: Function) => {
  const file = files[0]
  console.log(file)
  const filename = file.name
  const type = filename.split('.').pop().toLowerCase()

  const reader = new FileReader()
  reader.addEventListener('progress', event => {
    const size = '(' + Math.floor(event.total / 1000) + ' KB)'
    const progress = Math.floor((event.loaded / event.total) * 100) + '%'
    console.log('Loading', filename, size, progress)
    if (onProgress) onProgress({ progress })
  })

  reader.addEventListener('load', async (event: any) => {
    const contents = event.target.result
    if (['glb', 'gltf'].includes(type)) {
      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()

      dracoLoader.setDecoderPath(`${beforePath}/three/draco/gltf/`)
      loader.setDRACOLoader(dracoLoader)
      loader.parse(contents, '', result => {
        console.log(result)
        const object = result.scene.children[result.scene.children.length - 1]
        object.name = filename
        object.animations.push(...result.animations)
        console.log(type, ' 模型', object)
        onSuccess(object)
      })
    } else if (type == 'fbx') {
      const loader = new FBXLoader()
      const object = loader.parse(contents)
      console.log(type, ' 模型', object)
      onSuccess(object)
    }
  })
  reader.readAsArrayBuffer(file)
}

// 建筑居中
export const centerBuilding = (building: any, hex = 0xff0000) => {
  var boxHelper = new THREE.BoxHelper(building, hex) // 创建 BoxHelper
  boxHelper.update() //更新
  const box = new THREE.Box3().setFromObject(building) // 获取模型的包围盒
  const center = box.getCenter(new THREE.Vector3())
  return {
    helper: boxHelper,
    center
  }
}

const saveFile = (blob, filename) => {
  const link = document.createElement('a')
  link.style.display = 'none'
  document.body.appendChild(link) // Firefox workaround, see #6594

  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  link.remove()
}

const saveString = (text, filename) => {
  saveFile(new Blob([text], { type: 'text/plain' }), filename)
}

const saveArrayBuffer = (buffer, filename) => {
  saveFile(new Blob([buffer], { type: 'application/octet-stream' }), filename)
}

// 导出 glb、gltf 文件
export const exportGlb = (model, animations, name, isGlb: boolean = true) => {
  if (!model) return
  const gltfExporter = new GLTFExporter()
  const options = {
    trs: false,
    onlyVisible: true,
    truncateDrawRange: true,
    binary: isGlb,
    // maxTextureSize: 1024 || 4096 || Infinity, // To prevent NaN value,
    animations: animations // 动画
  }
  gltfExporter.parse(
    model,
    result => {
      if (result instanceof ArrayBuffer) {
        console.log(result)
        saveArrayBuffer(result, name + '.glb')
      } else {
        const output = JSON.stringify(result, null, 2)
        console.log({ output })
        saveString(output, name + '.gltf')
      }
    },
    error => {
      console.log('An error happened during parsing', error)
    },
    options
  )
}
