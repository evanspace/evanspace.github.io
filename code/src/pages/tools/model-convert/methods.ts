import * as THREE from 'three'
import { Hooks, Utils, Scene } from 'three-scene'
import { Water } from 'three/examples/jsm/objects/Water'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js'
import { Font } from 'three/examples/jsm/loaders/FontLoader.js'
import type { GroupTreeItem } from '.'

export { Hooks, Utils, Scene, THREE }

export const base = import.meta.env.VITE_GIT_OSS

const _ElMessage = opts => {
  return ElMessage(opts)
}

// 消息提示框
export const Message = new Proxy(
  {
    warning: msg => {
      return _ElMessage({
        message: msg,
        type: 'warning',
        grouping: true
      })
    },
    error: msg => {
      return _ElMessage({
        message: msg,
        type: 'error',
        grouping: true
      })
    },
    success: msg => {
      return _ElMessage({
        message: msg,
        type: 'success',
        grouping: true
      })
    }
  },
  {
    get(target, property, _receiver) {
      return target[property]
    }
  }
)

// 创建水面
export const createWater = (model?) => {
  const waterGeometry = model ? model.geometry : new THREE.PlaneGeometry(200, 200)
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(base + '/textures/waternormals.jpg', texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    }),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xf00f00,
    waterColor: 0x01688b,
    distortionScale: 3.7
  })
  water.material.uniforms.size.value = 0.5
  return water
}

// 创建点位球
export const createPointSphere = () => {
  const sphere = new THREE.SphereGeometry(1.75, 10, 10)
  const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, wireframe: true })
  const mesh = new THREE.Mesh(sphere, material)
  mesh.name = '点位'
  mesh.position.set(0, 140, 0)
  return mesh
}

// 模型转换为书结构数据
export const modelConvertTree = (group: THREE.Group) => {
  const list: GroupTreeItem[] = []

  const deep = (children: THREE.Object3D[], data: GroupTreeItem) => {
    for (let i = 0; i < children.length; i++) {
      const el = children[i]
      const obj: GroupTreeItem = {
        label: el.name,
        uuid: el.uuid,
        children: []
      }
      deep(el.children, obj)
      data.children?.push(obj)
    }
  }

  group.children.forEach(el => {
    const obj: GroupTreeItem = {
      label: el.name,
      uuid: el.uuid,
      children: []
    }
    deep(el.children, obj)
    list.push(obj)
  })
  return list
}

// 加载 ttf 字体
export const loadTTFFont = (url: string) => {
  const loader = new TTFLoader()
  return new Promise(resolve => {
    loader.load(url, json => {
      resolve(new Font(json))
    })
  })
}

// 创建文字
export const createText = (
  fontParser: any,
  text = '',
  opts: {
    size?: number
    color?: string | number
    // 深度
    depth?: number
    // 曲线分段
    curveSegments?: number
    // 斜面厚度
    bevelThickness?: number
    // 斜角大小
    bevelSize?: number
    // 斜角
    bevelEnabled?: boolean
  } = {},
  offset?: any
) => {
  const obj = {
    rotation: offset?.rotation || { x: 0, y: 0, z: 0 },
    position: offset?.position || { x: 0, y: 0, z: 0 }
  }
  // 文字
  let textGeo = new TextGeometry(text || '', {
    font: fontParser,
    size: opts?.size || 10,
    depth: opts?.depth,
    curveSegments: opts?.curveSegments, // 曲线分段
    bevelThickness: opts?.bevelThickness, // 斜面厚度
    bevelSize: opts?.bevelSize, // 斜角大小
    bevelEnabled: opts?.bevelEnabled // 斜角
  })
  const rot = obj.rotation
  textGeo.rotateX(rot.x)
  textGeo.rotateY(rot.y)
  textGeo.rotateZ(rot.z)

  const pos = obj.position
  // 计算边界
  textGeo.computeBoundingBox()
  // 计算垂直算法
  textGeo.computeVertexNormals()
  // @ts-ignore
  let offsetX = 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
  // @ts-ignore
  let offsetZ = 0.5 * (textGeo.boundingBox.max.z - textGeo.boundingBox.min.z)
  let material = new THREE.MeshPhongMaterial({
    color: opts?.color || 0xffffff,
    flatShading: !true
  })
  let mesh = new THREE.Mesh(textGeo, material)
  mesh.castShadow = true
  mesh.position.set((pos.x || 0) - offsetX, pos.y || 0, (pos.z || 0) - offsetZ)
  mesh.name = 'text'
  // @ts-ignore
  mesh._isText_ = true
  return mesh
}
